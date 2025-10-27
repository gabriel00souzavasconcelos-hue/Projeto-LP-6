-- Script para corrigir o schema do banco de dados
-- Execute este script no Supabase SQL Editor

-- 1. Alterar campos opcionais da tabela pacientes
ALTER TABLE pacientes 
  ALTER COLUMN datan DROP NOT NULL,
  ALTER COLUMN fone DROP NOT NULL,
  ALTER COLUMN ende DROP NOT NULL;

-- 2. Alterar campos opcionais da tabela clinicas
ALTER TABLE clinicas 
  ALTER COLUMN endereco DROP NOT NULL,
  ALTER COLUMN fone DROP NOT NULL;

-- 3. Garantir que a senha da clínica pode ser NULL (já está como opcional no código)
ALTER TABLE clinicas 
  ALTER COLUMN senha DROP NOT NULL;

-- Opcional: Adicionar valores padrão vazios para campos existentes que são NULL
UPDATE pacientes SET datan = NULL WHERE datan = '';
UPDATE pacientes SET fone = NULL WHERE fone = '';
UPDATE pacientes SET ende = NULL WHERE ende = '';
UPDATE clinicas SET endereco = NULL WHERE endereco = '';
UPDATE clinicas SET fone = NULL WHERE fone = '';
