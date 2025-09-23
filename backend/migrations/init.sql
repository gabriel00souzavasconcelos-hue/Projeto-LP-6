CREATE TABLE IF NOT EXISTS pacientes (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(40) NOT NULL,
  datan DATE NOT NULL,
  fone VARCHAR(20) NOT NULL,
  ende VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS clinicas (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(60) NOT NULL,
  endereco VARCHAR(120) NOT NULL,
  fone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(200) NOT NULL,
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
