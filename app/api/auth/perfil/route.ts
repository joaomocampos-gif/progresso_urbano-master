import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Busca os dados do usuário logado por ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
  }

  try {
    const user: any = await query({
      query: `SELECT id, full_name, username, email, phone, cpf, cep, address, address_number, city, state, role, foto, created_at FROM users WHERE id = ?`,
      values: [id],
    });

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (e) {
    console.error("Erro ao buscar perfil:", e);
    return NextResponse.json({ error: "Erro ao buscar perfil." }, { status: 500 });
  }
}

// Atualiza os dados de perfil e credenciais
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      email,
      full_name,
      username,
      phone,
      cep,
      address,
      address_number,
      city,
      state,
      foto,
      senhaAtual,
      novaSenha,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Usuário não informado." }, { status: 400 });
    }

    // 1. Busca no banco as credenciais atuais do usuário
    const users: any = await query({
      query: "SELECT password, email FROM users WHERE id = ?",
      values: [id],
    });

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const usuarioAtual = users[0];

    // Normaliza e-mail e username para evitar espaços
    const emailLimpo = email ? email.trim().toLowerCase() : null;
    const usernameLimpo = username ? username.trim() : null;

    const alterandoEmail = emailLimpo && emailLimpo !== usuarioAtual.email?.toLowerCase();
    const alterandoSenha = Boolean(novaSenha);

    // 2. Exige a senha atual caso o usuário tente alterar e-mail ou senha
    if (alterandoEmail || alterandoSenha) {
      if (!senhaAtual) {
        return NextResponse.json(
          { error: "Informe sua senha atual para alterar o e-mail ou a senha." },
          { status: 400 }
        );
      }

      const senhaValida = await bcrypt.compare(senhaAtual, usuarioAtual.password);
      if (!senhaValida) {
        return NextResponse.json({ error: "Senha atual incorreta." }, { status: 401 });
      }
    }

    // 3. Valida se o e-mail já pertence a outro usuário
    if (alterandoEmail) {
      const checkEmail: any = await query({
        query: "SELECT id FROM users WHERE email = ? AND id != ?",
        values: [emailLimpo, id],
      });
      if (checkEmail.length > 0) {
        return NextResponse.json({ error: "Este e-mail já está em uso por outra conta." }, { status: 409 });
      }
    }

    // 4. Valida se o username já está em uso por outro usuário
    if (usernameLimpo) {
      const checkUser: any = await query({
        query: "SELECT id FROM users WHERE username = ? AND id != ?",
        values: [usernameLimpo, id],
      });
      if (checkUser.length > 0) {
        return NextResponse.json({ error: "Este nome de usuário já está em uso." }, { status: 409 });
      }
    }

    // 5. Trata a atualização de senha (se aplicável)
    let senhaFinalHash = usuarioAtual.password;
    if (alterandoSenha) {
      if (novaSenha.length < 8) {
        return NextResponse.json({ error: "A nova senha deve ter no mínimo 8 caracteres." }, { status: 400 });
      }
      senhaFinalHash = await bcrypt.hash(novaSenha, 10);
    }

    // 6. Atualização final no banco de dados
    await query({
      query: `
        UPDATE users SET 
          email = ?,
          password = ?,
          full_name = ?,
          username = ?,
          phone = ?,
          cep = ?,
          address = ?,
          address_number = ?,
          city = ?,
          state = ?,
          foto = ?
        WHERE id = ?
      `,
      values: [
        emailLimpo || usuarioAtual.email,
        senhaFinalHash,
        full_name?.trim() || null,
        usernameLimpo || null,
        phone ? String(phone).replace(/\D/g, "") : null,
        cep ? String(cep).replace(/\D/g, "") : null,
        address?.trim() || null,
        address_number?.trim() || null,
        city?.trim() || null,
        state?.trim().toUpperCase() || null,
        foto || null,
        id,
      ],
    });

    return NextResponse.json({ message: "Perfil atualizado com sucesso!" }, { status: 200 });
  } catch (e: any) {
    console.error("Erro ao atualizar perfil:", e);
    if (e.message?.includes("Duplicate entry")) {
      return NextResponse.json({ error: "E-mail ou nome de usuário já cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno do servidor ao atualizar." }, { status: 500 });
  }
}