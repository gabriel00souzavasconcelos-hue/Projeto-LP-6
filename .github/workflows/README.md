# GitHub Actions CI/CD

Este projeto usa GitHub Actions para automação de testes e builds.

## 📋 Workflows Disponíveis

### 1. **Backend CI/CD** (`.github/workflows/backend-ci.yml`)
Executa quando há mudanças na pasta `backend/`:
- ✅ Testa com Node.js 18.x e 20.x
- ✅ Verifica tipos TypeScript
- ✅ Faz build do projeto
- ✅ Salva artefatos de build (apenas main)

### 2. **Mobile CI** (`.github/workflows/mobile-ci.yml`)
Executa quando há mudanças na pasta `mobile/`:
- ✅ Testa com Node.js 18.x e 20.x
- ✅ Verifica tipos TypeScript
- ✅ Valida configuração do Expo
- 🚀 Build com EAS (requer token)

### 3. **Full Project CI** (`.github/workflows/ci.yml`)
Pipeline completo que executa backend + mobile e gera relatório.

## 🔧 Configuração

### Secrets Necessários (Opcional)

Para habilitar builds do Expo, adicione no GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

- `EXPO_TOKEN`: Token do Expo (para builds automáticos)
  - Obter em: https://expo.dev/accounts/[username]/settings/access-tokens

### Como Obter EXPO_TOKEN:
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Fazer login
eas login

# 3. Criar token
eas account:token:create
```

## 🚀 Ativar Builds do Expo (Opcional)

Quando quiser ativar builds automáticos, edite `.github/workflows/mobile-ci.yml`:

```yaml
# Descomentar estas linhas:
# - name: Build preview (Android APK)
#   run: eas build --platform android --profile preview --non-interactive
```

## 📊 Status dos Workflows

Os workflows executam automaticamente em:
- ✅ Push para `main` ou `develop`
- ✅ Pull Requests para `main` ou `develop`
- ✅ Apenas quando há mudanças relevantes

## 🎯 Badges (Opcional)

Adicione ao README.md principal:

```markdown
![Backend CI](https://github.com/gabriel00souzavasconcelos-hue/Projeto-LP-6/workflows/Backend%20CI%2FCD/badge.svg)
![Mobile CI](https://github.com/gabriel00souzavasconcelos-hue/Projeto-LP-6/workflows/Mobile%20CI/badge.svg)
```

## 🔍 Monitoramento

Veja os resultados em:
- GitHub → Actions tab
- Cada commit mostra ✅ ou ❌ indicando o status

## 📝 Notas

- Os workflows são inteligentes e só executam quando necessário
- Node.js 18.x e 20.x são testados para garantir compatibilidade
- Artefatos de build são salvos por 7 dias
- Builds do Expo estão desabilitados por padrão (economiza recursos)
