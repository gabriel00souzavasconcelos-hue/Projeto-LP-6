#!/bin/bash

echo "🔍 Testando conexão com o backend..."
echo ""

# Teste 1: Backend está respondendo?
echo "1️⃣ Testando se o backend está vivo..."
response=$(curl -s -w "%{http_code}" http://localhost:4000/)
http_code="${response: -3}"
body="${response:0:-3}"

if [ "$http_code" = "200" ]; then
    echo "✅ Backend está RODANDO!"
    echo "   Resposta: $body"
else
    echo "❌ Backend NÃO está respondendo"
    echo "   Código HTTP: $http_code"
    exit 1
fi

echo ""

# Teste 2: Cadastro funciona?
echo "2️⃣ Testando CADASTRO de paciente..."
response=$(curl -s -w "%{http_code}" -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "role": "paciente",
    "payload": {
      "nome": "Teste Auto",
      "email": "teste_'$(date +%s)'@test.com",
      "senha": "123456"
    }
  }')

http_code="${response: -3}"
body="${response:0:-3}"

echo "   Código HTTP: $http_code"
echo "   Resposta: $body"

if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo "✅ CADASTRO FUNCIONANDO!"
else
    echo "❌ ERRO no cadastro"
    echo ""
    echo "⚠️  POSSÍVEIS CAUSAS:"
    echo "   1. Você NÃO executou o script SQL no Supabase"
    echo "   2. Email já existe no banco"
    echo "   3. Problema de conexão com Supabase"
fi

echo ""

# Teste 3: Login funciona?
echo "3️⃣ Testando LOGIN..."
response=$(curl -s -w "%{http_code}" -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste_'$(date +%s)'@test.com",
    "senha": "123456",
    "role": "paciente"
  }')

http_code="${response: -3}"
body="${response:0:-3}"

echo "   Código HTTP: $http_code"
echo "   Resposta: $body"

if [ "$http_code" = "200" ]; then
    echo "✅ LOGIN FUNCIONANDO!"
else
    echo "⚠️  Login falhou (normal se o cadastro falhou antes)"
fi

echo ""
echo "========================================="
echo ""

if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
    echo "🔴 PROBLEMA DETECTADO!"
    echo ""
    echo "Execute o script SQL no Supabase:"
    echo ""
    echo "ALTER TABLE pacientes"
    echo "  ALTER COLUMN datan DROP NOT NULL,"
    echo "  ALTER COLUMN fone DROP NOT NULL,"
    echo "  ALTER COLUMN ende DROP NOT NULL;"
    echo ""
    echo "Depois reinicie o backend e teste novamente."
else
    echo "🟢 TUDO FUNCIONANDO!"
    echo ""
    echo "Agora você pode:"
    echo "  ✅ Cadastrar pacientes/clínicas"
    echo "  ✅ Fazer login"
    echo "  ✅ Usar o app normalmente"
fi

echo ""
