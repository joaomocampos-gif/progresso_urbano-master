const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "progresso_urbano",
    multipleStatements: true,
  });

  // Adiciona as colunas de foto e username na tabela users (se ainda não existirem)
  try {
    await conn.query("ALTER TABLE users ADD COLUMN username VARCHAR(255) NULL");
    console.log("Coluna 'username' adicionada.");
  } catch (e) {
    if (e.code === "ER_DUP_FIELDNAME") console.log("Coluna 'username' já existe.");
    else throw e;
  }

try {
    await conn.query("ALTER TABLE users ADD COLUMN foto VARCHAR(500) NULL");
    console.log("Coluna 'foto' adicionada.");
  } catch (e) {
    if (e.code === "ER_DUP_FIELDNAME") console.log("Coluna 'foto' já existe.");
    else throw e;
  }

  // A foto é armazenada como base64 (pode exceder 500 caracteres).
  // Converte a coluna para LONGTEXT para suportar imagens grandes.
  try {
    await conn.query("ALTER TABLE users MODIFY COLUMN foto LONGTEXT NULL");
    console.log("Coluna 'foto' convertida para LONGTEXT.");
  } catch (e) {
    console.log("AVISO: não foi possível converter 'foto' para LONGTEXT:", e.message);
  }

  const [cols] = await conn.query("SHOW COLUMNS FROM users");
  console.log("COLUNAS DE users:");
  console.log(cols.map((c) => c.Field).join(", "));

  await conn.end();
  console.log("OK: migração de perfil concluída!");
})().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
