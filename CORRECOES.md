# 🔧 Correção de Erros - Guia Completo

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **Erro ao Cadastrar Pacientes/Clínicas**
**Causa:** O schema do banco exige campos como `datan`, `fone`, `ende`, `endereco` como obrigatórios (NOT NULL), mas o código permite que sejam opcionais.

### 2. **Erro ao Enviar Documentos**
**Causa:** 
- Pasta `uploads/` pode não existir no backend
- Configuração de multer estava usando caminho relativo incorreto

### 3. **Erro ao Agendar Consultas**
**Causa:** Problemas de validação de dados e inconsistências no schema

---

## 🛠️ CORREÇÕES APLICADAS NO CÓDIGO

### ✅ Arquivos Modificados:

1. **`backend/src/index.ts`**
   - ✅ Criação automática da pasta `uploads/` 
   - ✅ Correção de caminhos absolutos para uploads
   - ✅ IP atualizado para `192.168.100.36`

2. **`mobile/src/api/client.ts`**
   - ✅ IP atualizado para `192.168.100.36`

3. **`backend/migrations/init.sql`**
   - ✅ Campos opcionais agora permitem NULL

4. **`backend/migrations/fix_schema.sql`** (NOVO)
   - ✅ Script SQL para corrigir banco existente

---

## 🗄️ CORREÇÃO DO BANCO DE DADOS (OBRIGATÓRIO)

### Opção 1: Banco Novo (Recriar do Zero)

Se você ainda não tem dados importantes, delete e recrie as tabelas:

1. Acesse o **Supabase SQL Editor**
2. Execute o script atualizado `backend/migrations/init.sql`

### Opção 2: Banco Existente (Migração)

Se você já tem dados cadastrados:

1. Acesse o **Supabase SQL Editor**
2. Execute o script `backend/migrations/fix_schema.sql`

```sql
-- Copie e cole este comando no SQL Editor do Supabase:

-- Alterar campos opcionais da tabela pacientes
ALTER TABLE pacientes 
  ALTER COLUMN datan DROP NOT NULL,
  ALTER COLUMN fone DROP NOT NULL,
  ALTER COLUMN ende DROP NOT NULL;

-- Alterar campos opcionais da tabela clinicas
ALTER TABLE clinicas 
  ALTER COLUMN endereco DROP NOT NULL,
  ALTER COLUMN fone DROP NOT NULL,
  ALTER COLUMN senha DROP NOT NULL;
```

3. Clique em **RUN** para executar

---

## 🚀 COMO TESTAR

### 1. Reiniciar o Backend

```bash
cd backend
npm start
```

Você deve ver:
```
📁 Pasta uploads criada
Server running on port 4000
```

### 2. Reiniciar o Mobile

```bash
cd mobile
npm start
```

### 3. Testar Funcionalidades

#### ✅ Cadastro de Paciente
- Tente cadastrar um paciente SEM preencher data de nascimento, telefone ou endereço
- Deve funcionar normalmente

#### ✅ Cadastro de Clínica
- Tente cadastrar uma clínica SEM preencher endereço ou telefone
- Deve funcionar normalmente

#### ✅ Upload de Documentos
- Entre como paciente
- Vá em "Documentos"
- Tente enviar um documento
- Deve funcionar e retornar uma URL válida

#### ✅ Agendamento de Consultas
- Entre como paciente
- Busque uma clínica
- Selecione especialização, data e horário
- Agende a consulta
- Deve aparecer em "Minhas Consultas"

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Script SQL executado no Supabase
- [ ] Backend reiniciado (deve criar pasta uploads)
- [ ] Mobile com IP correto (`192.168.100.36`)
- [ ] Testar cadastro de paciente
- [ ] Testar cadastro de clínica
- [ ] Testar upload de documento
- [ ] Testar agendamento de consulta

---

## 🐛 SE AINDA HOUVER ERROS

### Erro: "Cannot read property 'codigo' of undefined"
**Solução:** Faça logout e login novamente

### Erro: "Network Error" ou "timeout"
**Solução:** 
1. Verifique se o backend está rodando
2. Confirme o IP no arquivo `mobile/src/api/client.ts`
3. Use `ifconfig` (Mac/Linux) ou `ipconfig` (Windows) para confirmar seu IP

### Erro: "No file uploaded"
**Solução:**
1. Verifique se a pasta `backend/uploads` foi criada
2. Reinicie o backend

### Erro ao cadastrar: "column violates not null constraint"
**Solução:** 
- Você NÃO executou o script SQL de correção
- Execute `backend/migrations/fix_schema.sql` no Supabase

---

## 📞 RESUMO DAS MUDANÇAS

| Problema | Solução | Status |
|----------|---------|--------|
| Cadastro falhando | Schema SQL corrigido | ✅ |
| Upload de documentos | Pasta uploads auto-criada | ✅ |
| Agendamento não funciona | Campos padronizados | ✅ |
| IPs inconsistentes | Padronizado para .36 | ✅ |

---

## ⚡ COMANDOS RÁPIDOS

```bash
# Backend
cd backend
npm start

# Mobile (novo terminal)
cd mobile
npm start
```

**IMPORTANTE:** Execute o script SQL ANTES de iniciar o backend!
