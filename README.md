# Sistema de Clínicas - Projeto TCC

Este é um protótipo simples de um sistema de clínicas desenvolvido para um projeto de faculdade.

## 🏗️ Estrutura do Projeto

- **backend/**: API REST em Node.js + TypeScript + Supabase
- **mobile/**: Aplicativo mobile em React Native + Expo

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- O arquivo `.env` já está configurado com as credenciais do Supabase
- **Porta:** O backend roda na porta **4000**

4. Execute o backend:
```bash
# Modo desenvolvimento
npm run dev

# Ou compilar e executar
npm run build
npm start
```

O backend estará disponível em: `http://localhost:4000`

### Mobile

1. Entre na pasta do mobile:
```bash
cd mobile
```

2. Instale as dependências:
```bash
npm install
```

3. **IMPORTANTE**: Ajuste o IP do backend no arquivo `src/api/client.ts`:
```typescript
export const BASE_URL = "http://SEU_IP_LOCAL:4000";
```
Substitua `SEU_IP_LOCAL` pelo IP da sua máquina na rede local.

4. Execute o app:
```bash
# Iniciar o Expo
npm start

# Ou diretamente no Android
npm run android

# Ou diretamente no iOS
npm run ios
```

## 📱 Funcionalidades

### Backend (API)
- ✅ Autenticação simples (sem JWT - apenas para protótipo)
- ✅ CRUD de Pacientes
- ✅ CRUD de Clínicas
- ✅ CRUD de Especializações
- ✅ Sistema de login para pacientes e clínicas

### Mobile (App)
- ✅ Tela de login
- ✅ Cadastro de pacientes
- ✅ Cadastro de clínicas
- ✅ Listagem de clínicas
- ✅ Navegação entre telas

## 🗄️ Banco de Dados

O projeto usa **Supabase** (PostgreSQL na nuvem) com as seguintes tabelas:

- `pacientes`: dados dos pacientes
- `clinicas`: dados das clínicas
- `especializacoes`: tipos de especialidades médicas
- `clinicas_especializacoes`: relação entre clínicas e especialidades

## 🔧 Configurações

### Backend
- **Porta**: 4000
- **Supabase URL**: Já configurado no `.env`
- **TypeScript**: Configurado para compilar para `dist/`

### Mobile
- **Expo SDK**: ~50.0.0
- **React Native**: 0.73.6
- **Navegação**: React Navigation 6
- **HTTP Client**: Axios

## ⚠️ Limitações (Protótipo)

- Senhas armazenadas em texto plano (não usar em produção!)
- Autenticação simples sem JWT
- Validações básicas
- Interface simples
- Sem testes automatizados

## 🛠️ Resolução de Problemas

### Backend não conecta com Supabase
- Verifique se as credenciais no `.env` estão corretas
- Teste a conexão com internet

### Mobile não conecta com backend
- Verifique se o IP no `src/api/client.ts` está correto
- Confirme se o backend está rodando na porta 4000
- Use o IP da rede local, não localhost

### Erros de dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Endpoints da API

- `GET /` - Status da API
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /patients` - Listar pacientes
- `POST /patients` - Criar paciente
- `GET /clinics` - Listar clínicas
- `POST /clinics` - Criar clínica
- `GET /specializations` - Listar especializações

---

**Projeto desenvolvido para fins acadêmicos - Não usar em produção**