# 🐛 DEBUG: Problemas com Seleção de Especialização

## Problemas Reportados
1. ❌ Erro no LogBoxData.js linha 225
2. ❌ Erro no BookAppointmentScreen.tsx linha 198
3. ❌ Botão continua desabilitado

## Correções Aplicadas

### 1. Removido console.log problemático
**Problema:** Console.log dentro do `.map()` causava erro de renderização
**Solução:** Removido o log que estava dentro do render

### 2. Tipo Specialization corrigido
**Antes:**
```typescript
export type Specialization = {
  codigo?: number;  // ❌ Opcional
  nome: string;
}
```

**Depois:**
```typescript
export type Specialization = {
  codigo: number;  // ✅ Obrigatório
  nome: string;
}
```

### 3. Validação de dados adicionada
```typescript
// Filtra especializações inválidas (sem código)
const validSpecs = data.filter((spec: any) => 
  spec && (spec.codigo !== null && spec.codigo !== undefined)
);

// No render, verifica antes de renderizar
if (!spec || !spec.codigo) {
  console.warn("Especialização inválida:", spec);
  return null;
}
```

### 4. Logs aprimorados
```typescript
// Ao carregar especializações
console.log("Especializações carregadas:", JSON.stringify(data, null, 2));
console.log("Especializações válidas (com código):", validSpecs);

// Ao clicar em especialização
console.log("🎯 Clicou na especialização:", spec.codigo, spec.nome);
console.log("✅ Especialização selecionada:", spec.codigo);

// Ao mudar especialização (useEffect)
console.log("📌 Especialização mudou para:", selectedSpecialization);
```

## 🧪 Como Testar Agora

### Passo 1: Verificar se o backend está rodando
```bash
cd backend
npm start
```

### Passo 2: No app mobile, abrir tela de agendamento

### Passo 3: Verificar logs no console

**Logs esperados ao abrir a tela:**
```
Carregando especializações para clínica: 3
Especializações carregadas: [
  {
    "codigo": 1,
    "nome": "Cardiologia"
  },
  {
    "codigo": 2,
    "nome": "Dermatologia"
  }
]
Especializações válidas (com código): [...]
📌 Especialização mudou para: null
```

**Logs esperados ao clicar em especialização:**
```
🎯 Clicou na especialização: 1 Cardiologia
✅ Especialização selecionada: 1
📌 Especialização mudou para: 1
```

### Passo 4: Verificar painel de debug
Deve mostrar:
```
🔍 Debug:
Especialização: ✅  ← deve aparecer ✅ depois de clicar
Data: ✅
Horário Manual: ✅ (se digitou horário)
Botão: 🟢 HABILITADO
```

## ❓ Se ainda não funcionar

### Cenário 1: Especializações não carregam
**Sintoma:** Console mostra array vazio `[]`

**Causa provável:** Clínica não tem especializações cadastradas no banco

**Solução:** Cadastrar especializações para a clínica via tela de admin ou SQL:
```sql
INSERT INTO clinicas_especializacoes (codigo_clinica, codigo_especializacao)
VALUES (3, 1), (3, 2);
```

### Cenário 2: Código vem como null
**Sintoma:** Console mostra `{ codigo: null, nome: "Cardiologia" }`

**Causa provável:** Problema no JOIN do Supabase

**Solução:** Testar endpoint diretamente:
```bash
curl http://192.168.100.198:4000/clinics/3/specializations
```

Deve retornar:
```json
[
  { "codigo": 1, "nome": "Cardiologia" },
  { "codigo": 2, "nome": "Dermatologia" }
]
```

### Cenário 3: Especialização não muda ao clicar
**Sintoma:** Clic não faz nada, sem logs

**Causa provável:** Componente não está recebendo o onPress

**Solução:** Verificar se TouchableOpacity está renderizando corretamente

## 📊 Estrutura Esperada dos Dados

### Do Backend para o Frontend
```typescript
GET /clinics/3/specializations
Response: [
  {
    codigo: 1,        // ✅ OBRIGATÓRIO - número inteiro
    nome: "Cardiologia"  // ✅ OBRIGATÓRIO - string
  },
  {
    codigo: 2,
    nome: "Dermatologia"
  }
]
```

### Estado do React
```typescript
const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);

// Após clicar na especialização:
selectedSpecialization = 1  // ✅ número, não null
```

### Payload do Agendamento
```typescript
{
  codigo_paciente: 5,
  codigo_clinica: 3,
  codigo_especializacao: 1,  // ✅ deve ter valor numérico
  data_hora: "2025-10-27T14:00:00",
  status: "agendada"
}
```

## ✅ Checklist de Verificação

Antes de agendar, confirme:
- [ ] Backend rodando na porta 4000
- [ ] Especializações aparecem na tela (chips azuis)
- [ ] Ao clicar, chip fica destacado (azul escuro)
- [ ] Console mostra "✅ Especialização selecionada: 1"
- [ ] Console mostra "📌 Especialização mudou para: 1"
- [ ] Painel debug mostra "Especialização: ✅"
- [ ] Botão mostra "🟢 HABILITADO"

Se TODOS os itens acima estiverem OK, o agendamento deve funcionar! 🎉

---

**Próximo Passo:** Teste agora e me diga exatamente o que aparece nos logs do console!
