import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// --- CONFIGURAÇÃO DE CRIPTOGRAFIA DO CPF (AES-256) ---
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.CPF_SECRET_KEY || "12345678901234567890123456789012"; 
const IV_LENGTH = 16;

function criptografarCPF(cpf: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(cpf, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// --- GERADOR E FORMATADOR DE TELEFONE ---
// Caso o telefone venha sem DDD ou vazio, pode-se usar para gerar um válido de teste
export function gerarTelefoneValido(): string {
  const ddds = [11, 19, 21, 31, 41, 51, 61, 71, 81, 85, 98];
  const dddAleatorio = ddds[Math.floor(Math.random() * ddds.length)];
  let corpoNumero = "9";
  for (let i = 0; i < 8; i++) {
    corpoNumero += Math.floor(Math.random() * 10).toString();
  }
  return `${dddAleatorio}${corpoNumero}`;
}

// Formata para exibição padrão (11) 99999-9999
export function formatarTelefone(valor: string): string {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
  if (apenasNumeros.length > 10) {
    return apenasNumeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (apenasNumeros.length > 6) {
    return apenasNumeros.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  }
  return apenasNumeros;
}

// --- VALIDADOR DE NOME COMPLETO ---
function validarNomeCompleto(nome: string): boolean {
  const nomeFormatado = nome.trim().replace(/\s+/g, " ");
  const partes = nomeFormatado.split(" ");

  if (partes.length < 2) return false; // Obriga nome e sobrenome
  if (!partes.every((parte) => parte.length >= 2)) return false; // Mínimo 2 letras por palavra

  const regexApenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/;
  return regexApenasLetras.test(nomeFormatado);
}

// --- VALIDADOR MATEMÁTICO REAL DE CPF ---
function validarCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// --- VALIDADOR DE E-MAIL ---
function validarEmail(email: string): boolean {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email) && email.length <= 254;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, cpf, telefone, cep, endereco, cidade, estado, numero } = body;

    // 1. Sanitização e remoção de espaços/símbolos
    const nomeLimpo = nome?.trim().replace(/\s+/g, " ");
    const emailLimpo = email?.trim().toLowerCase();
    const enderecoLimpo = endereco?.trim();
    const cidadeLimpo = cidade?.trim();
    const estadoLimpo = estado?.trim().toUpperCase();
    const numeroLimpo = numero?.toString().trim();

    const cpfDigitos = cpf ? String(cpf).replace(/\D/g, "") : "";
    const cepDigitos = cep ? String(cep).replace(/\D/g, "") : "";

    // Tratamento do Telefone: Limpa e, caso não enviado, gera um válido
    let telefoneDigitos = telefone ? String(telefone).replace(/\D/g, "") : "";
    if (!telefoneDigitos) {
      telefoneDigitos = gerarTelefoneValido();
    }

    // 2. Validação de Presença Obrigatória
    if (
      !nomeLimpo || 
      !emailLimpo || 
      !senha || 
      !cpfDigitos || 
      !cepDigitos || 
      !enderecoLimpo || 
      !cidadeLimpo || 
      !estadoLimpo || 
      !numeroLimpo
    ) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    // 3. Validação de Nome Completo
    if (!validarNomeCompleto(nomeLimpo)) {
      return NextResponse.json(
        { error: "Informe o nome completo (nome e sobrenome, sem números ou caracteres especiais)." }, 
        { status: 400 }
      );
    }

    // 4. Validação de E-mail
    if (!validarEmail(emailLimpo)) {
      return NextResponse.json({ error: "E-mail em formato inválido." }, { status: 400 });
    }

    // 5. Validação Matemática de CPF
    if (!validarCPF(cpfDigitos)) {
      return NextResponse.json({ error: "O CPF informado é inválido." }, { status: 400 });
    }

    // 6. Limite e formato dos demais campos
    if (!/^\d{8}$/.test(cepDigitos)) {
      return NextResponse.json({ error: "O CEP deve conter exatamente 8 dígitos numéricos." }, { status: 400 });
    }

    if (!/^\d{10,11}$/.test(telefoneDigitos)) {
      return NextResponse.json({ error: "O telefone deve conter de 10 a 11 dígitos numéricos com DDD." }, { status: 400 });
    }

    if (senha.length < 8) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 8 caracteres." }, { status: 400 });
    }

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(cidadeLimpo)) {
      return NextResponse.json({ error: "Cidade inválida." }, { status: 400 });
    }

    if (!/^[A-Z]{2}$/.test(estadoLimpo)) {
      return NextResponse.json({ error: "Estado deve conter exatamente 2 letras maiúsculas (Ex: SP)." }, { status: 400 });
    }

    // 7. Criptografia dos dados
    const id = uuidv4();
    const senhaHash = await bcrypt.hash(senha, 10);
    const cpfCriptografado = criptografarCPF(cpfDigitos);

    // 8. Inserção no Banco de Dados
    await query({
      query: `
        INSERT INTO users (
          id, email, cpf, password, full_name, phone, 
          cep, address, city, state, address_number, role
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'citizen')
      `,
      values: [
        id, 
        emailLimpo, 
        cpfCriptografado, 
        senhaHash, 
        nomeLimpo, 
        telefoneDigitos, 
        cepDigitos, 
        enderecoLimpo, 
        cidadeLimpo, 
        estadoLimpo, 
        numeroLimpo
      ],
    });

    return NextResponse.json({ message: "Cadastro realizado com sucesso!" }, { status: 201 });

  } catch (error: any) {
    console.error("ERRO NO BANCO:", error);
    if (error.message?.includes("Duplicate entry")) {
      return NextResponse.json({ error: "Este E-mail já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno no servidor de dados." }, { status: 500 });
  }
}