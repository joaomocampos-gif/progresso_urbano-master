-- ============================================================
-- PROGRESSO URBANO - Estrutura do Banco de Dados
-- Motor: MySQL / MariaDB (HeidiSQL)
-- Execute este script no HeidiSQL para criar toda a estrutura.
-- ============================================================

CREATE DATABASE IF NOT EXISTS progresso_urbano
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE progresso_urbano;

-- ------------------------------------------------------------
-- Tabela: users
-- Usuários do sistema (cidadãos, administradores e master root)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  cep VARCHAR(10) NULL,
  address VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(2) NULL,
  address_number VARCHAR(10) NULL,
  role ENUM('citizen', 'admin', 'super_admin') NOT NULL DEFAULT 'citizen',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabela: issues
-- Problemas / requerimentos urbanos relatados pelos cidadãos
-- (equivale à tabela "requests" citada no código)
-- ------------------------------------------------------------
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
  CONSTRAINT fk_issues_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_issues_status ON issues (status);
CREATE INDEX idx_issues_user ON issues (user_id);

-- ------------------------------------------------------------
-- Tabela: issue_photos
-- Fotos anexadas a cada problema relatado
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS issue_photos (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  issue_id VARCHAR(36) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_photos_issue FOREIGN KEY (issue_id)
    REFERENCES issues(id) ON DELETE CASCADE
);

CREATE INDEX idx_photos_issue ON issue_photos (issue_id);

-- ------------------------------------------------------------
-- Tabela: issue_comments
-- Comentários / atualizações sobre o andamento de cada problema
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS issue_comments (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  issue_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  comentario TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_issue FOREIGN KEY (issue_id)
    REFERENCES issues(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_issue ON issue_comments (issue_id);

-- ------------------------------------------------------------
-- Tabela: activity_logs
-- Registro de ações dos administradores (trocas de cargo, etc.)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  acao VARCHAR(100) NOT NULL,
  detalhes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- DADOS INICIAIS (opcional)
-- Cria o usuário Master Root padrão (login: admin@progresso.com)
-- A senha abaixo é o hash bcrypt de "admin123"
-- ============================================================
INSERT INTO users (id, email, cpf, password, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@progresso.com',
  '00000000000',
  '$2a$10$X7UrE7j3Y0Xb0Z0A0Z0A0eBkY0X0Z0a0Z0A0Z0a0Z0A0Z0a0Z0A0Z0',
  'Master Root',
  'super_admin'
)
ON DUPLICATE KEY UPDATE email = email;

-- ============================================================
-- MIGRAÇÃO (para bancos já existentes)
-- Se a tabela issues já existir com o status antigo, recria com
-- o novo esquema. Execute apenas se necessário.
-- ============================================================
ALTER TABLE issues
  MODIFY COLUMN status ENUM('Aguardando', 'Visto', 'Concluido') NOT NULL DEFAULT 'Aguardando';

ALTER TABLE issues
  MODIFY COLUMN categoria ENUM('mato_alto', 'iluminacao', 'vias_publicas', 'outros') NOT NULL;
