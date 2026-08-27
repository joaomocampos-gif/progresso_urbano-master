// Script utilitário standalone (executado com `node scripts/criar_tabelas.js`).
// Usa CommonJS de propósito, já que é um script de infraestrutura fora do app.
const mysql = require("mysql2/promise");

(async () => {
  // Conecta sem informar o database para poder criá-lo, se necessário
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
  });

  // 1. Cria o banco de dados
  await conn.query(
    "CREATE DATABASE IF NOT EXISTS progresso_urbano CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
  );
  console.log("✅ Banco de dados 'progresso_urbano' garantido.");

  await conn.query("USE progresso_urbano");

  // 2. Tabela: users
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      cpf VARCHAR(14) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
full_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NULL,
      foto LONGTEXT NULL,
      phone VARCHAR(20) NULL,
      cep VARCHAR(10) NULL,
      address VARCHAR(255) NULL,
      city VARCHAR(100) NULL,
      state VARCHAR(2) NULL,
      address_number VARCHAR(10) NULL,
      role ENUM('citizen', 'admin', 'super_admin') NOT NULL DEFAULT 'citizen',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Tabela 'users' garantida.");

  // 3. Tabela: issues
  await conn.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      categoria ENUM('mato_alto', 'iluminacao', 'vias_publicas', 'outros') NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT NULL,
      endereco VARCHAR(255) NULL,
      bairro VARCHAR(100) NULL,
      cidade VARCHAR(100) NULL,
      estado VARCHAR(2) NULL,
      latitude DECIMAL(10, 8) NULL,
      longitude DECIMAL(11, 8) NULL,
      status ENUM('Aguardando', 'Visto', 'Concluido') NOT NULL DEFAULT 'Aguardando',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_issues_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Tabela 'issues' garantida.");

  // 4. Tabela: issue_photos
  await conn.query(`
    CREATE TABLE IF NOT EXISTS issue_photos (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      issue_id VARCHAR(36) NOT NULL,
      url VARCHAR(500) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_photos_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Tabela 'issue_photos' garantida.");

  // 5. Tabela: issue_comments
  await conn.query(`
    CREATE TABLE IF NOT EXISTS issue_comments (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      issue_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      comentario TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comments_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Tabela 'issue_comments' garantida.");

  // 6. Tabela: activity_logs
  await conn.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NULL,
      acao VARCHAR(100) NOT NULL,
      detalhes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log("✅ Tabela 'activity_logs' garantida.");

  // 7. Tabela: gastos
  await conn.query(`
    CREATE TABLE IF NOT EXISTS gastos (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT NULL,
      valor DECIMAL(12, 2) NOT NULL,
      categoria ENUM('obras', 'infraestrutura', 'saude', 'educacao', 'seguranca', 'outros') NOT NULL DEFAULT 'outros',
      data_gasto DATE NOT NULL,
      registrado_por VARCHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_gastos_user FOREIGN KEY (registrado_por) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log("✅ Tabela 'gastos' garantida.");

  // 8. Tabela: noticias
  await conn.query(`
    CREATE TABLE IF NOT EXISTS noticias (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      conteudo TEXT NOT NULL,
      categoria VARCHAR(50) NOT NULL DEFAULT 'geral',
      autor_id VARCHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_noticias_user FOREIGN KEY (autor_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log("✅ Tabela 'noticias' garantida.");

  // 9. Usuário Master Root padrão (login: admin@progresso.com / senha: admin123)
  const bcrypt = require("bcryptjs");
  const senhaHash = await bcrypt.hash("admin123", 10);
  await conn.query(
    `INSERT IGNORE INTO users (id, email, cpf, password, full_name, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "11111111-1111-1111-1111-111111111111",
      "admin@progresso.com",
      "00000000000",
      senhaHash,
      "Master Root",
      "super_admin",
    ]
  );
  console.log("✅ Usuário Master Root padrão garantido (admin@progresso.com / admin123).");

  await conn.end();
  console.log("\n🎉 OK: Estrutura do banco criada/atualizada com sucesso!");
})().catch((e) => {
  console.error("\n❌ ERRO:", e.message);
  process.exit(1);
});
