#!/bin/bash

echo "🔍 Verificando configuração do projeto..."
echo ""

# Verificar se está na pasta correta
if [ ! -d "backend" ] || [ ! -d "mobile" ]; then
    echo "❌ Execute este script na raiz do projeto (onde estão as pastas backend e mobile)"
    exit 1
fi

echo "✅ Estrutura de pastas OK"
echo ""

# Verificar backend
echo "📦 Verificando Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não encontrado no backend"
    echo "   Execute: cd backend && npm install"
else
    echo "✅ Dependências do backend OK"
fi

if [ ! -d "uploads" ]; then
    echo "📁 Criando pasta uploads..."
    mkdir -p uploads
    echo "✅ Pasta uploads criada"
else
    echo "✅ Pasta uploads existe"
fi

cd ..

# Verificar mobile
echo ""
echo "📱 Verificando Mobile..."
cd mobile

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não encontrado no mobile"
    echo "   Execute: cd mobile && npm install"
else
    echo "✅ Dependências do mobile OK"
fi

cd ..

# Verificar IP
echo ""
echo "🌐 Verificando configuração de IP..."
BACKEND_IP=$(grep -o "192\.168\.[0-9]*\.[0-9]*" backend/src/index.ts | head -1)
MOBILE_IP=$(grep -o "192\.168\.[0-9]*\.[0-9]*" mobile/src/api/client.ts | head -1)

echo "   Backend IP: $BACKEND_IP"
echo "   Mobile IP: $MOBILE_IP"

if [ "$BACKEND_IP" = "$MOBILE_IP" ]; then
    echo "✅ IPs estão sincronizados"
else
    echo "⚠️  IPs diferentes! Atualize para usar o mesmo IP"
fi

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. ⚠️  IMPORTANTE: Execute o script SQL no Supabase"
echo "   Arquivo: backend/migrations/fix_schema.sql"
echo ""
echo "2. 🚀 Inicie o backend:"
echo "   cd backend && npm start"
echo ""
echo "3. 📱 Inicie o mobile (em outro terminal):"
echo "   cd mobile && npm start"
echo ""
echo "4. ✅ Teste as funcionalidades:"
echo "   - Cadastro de paciente"
echo "   - Cadastro de clínica"
echo "   - Upload de documentos"
echo "   - Agendamento de consultas"
echo ""
