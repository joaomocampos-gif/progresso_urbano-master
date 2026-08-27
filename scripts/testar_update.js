// Script de teste: verifica se o UPDATE de perfil funciona no banco
const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "progresso_urbano",
  });

  // 1. Lista os usuários existentes
  const [users] = await conn.query(
    "SELECT id, full_name, username, email FROM users LIMIT 5"
  );
  console.log("Usuários existentes:", users.length);
  console.log(users.map((u) => ({ id: u.id, nome: u.full_name, email: u.email })));

  if (users.length === 0) {
    console.log("Nenhum usuário encontrado. Nada para testar.");
    await conn.end();
    return;
  }

  const usuario = users[0];

  // 2. Testa o UPDATE com os mesmos campos que a API usa
  try {
    const [result] = await conn.execute(
      `UPDATE users SET 
        full_name = ?, username = ?, phone = ?, cep = ?, 
        address = ?, address_number = ?, city = ?, state = ?, foto = ?
        WHERE id = ?`,
      [
        usuario.full_name,
        "teste_username_" + Date.now(),
        "11999999999",
        "01000-000",
        "Rua Teste",
        "123",
        "São Paulo",
        "SP",
        null,
        usuario.id,
      ]
    );
    console.log("✅ UPDATE executado com sucesso!");
    console.log("affectedRows:", result.affectedRows);
  } catch (e) {
    console.error("❌ ERRO no UPDATE:", e.message);
  }

  // 3. Testa o UPDATE com uma foto base64 grande (simulando upload)
  try {
    const fakeBase64 = "data:image/png;base64," + "A".repeat(100000);
    const [result] = await conn.execute(
      "UPDATE users SET foto = ? WHERE id = ?",
      [fakeBase64, usuario.id]
    );
    console.log("✅ UPDATE com foto grande (100k chars) OK. affectedRows:", result.affectedRows);
  } catch (e) {
    console.error("❌ ERRO no UPDATE com foto grande:", e.message);
  }

  await conn.end();
  console.log("\nTeste concluído.");
})().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
