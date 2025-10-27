CREATE TABLE IF NOT EXISTS pacientes (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(40) NOT NULL,
  datan DATE,
  fone VARCHAR(20),
  ende VARCHAR(120),
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS clinicas (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(60) NOT NULL,
  endereco VARCHAR(120),
  fone VARCHAR(20),
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(200),
  imagem TEXT
);

CREATE TABLE IF NOT EXISTS especializacoes (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clinicas_especializacoes (
  codigo_clinica INTEGER REFERENCES clinicas(codigo) ON DELETE CASCADE,
  codigo_especializacao INTEGER REFERENCES especializacoes(codigo) ON DELETE CASCADE,
  PRIMARY KEY (codigo_clinica, codigo_especializacao)
);

CREATE TABLE IF NOT EXISTS consultas (
  codigo SERIAL PRIMARY KEY,
  codigo_paciente INTEGER NOT NULL REFERENCES pacientes(codigo) ON DELETE CASCADE,
  codigo_clinica INTEGER NOT NULL REFERENCES clinicas(codigo) ON DELETE CASCADE,
  codigo_especializacao INTEGER NOT NULL REFERENCES especializacoes(codigo) ON DELETE CASCADE,
  data_hora TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'cancelada', 'concluida')),
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documentos (
  codigo SERIAL PRIMARY KEY,
  codigo_paciente INTEGER NOT NULL REFERENCES pacientes(codigo) ON DELETE CASCADE,
  codigo_clinica INTEGER REFERENCES clinicas(codigo) ON DELETE SET NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  url_arquivo TEXT NOT NULL,
  tipo_documento VARCHAR(50) NOT NULL CHECK (tipo_documento IN ('exame', 'receita', 'laudo', 'atestado', 'pedido_exame', 'resultado_exame', 'outro')),
  descricao TEXT,
  tamanho_arquivo INTEGER,
  enviado_por VARCHAR(20) NOT NULL CHECK (enviado_por IN ('paciente', 'clinica')),
  criado_em TIMESTAMP DEFAULT NOW()
);
