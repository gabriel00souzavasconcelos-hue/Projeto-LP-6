// Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD
export function convertDateToISO(dateString: string): string {
  if (!dateString || dateString.length !== 10) return dateString;
  
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return dateString;
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Função para converter data do formato YYYY-MM-DD para DD/MM/YYYY
export function convertDateFromISO(dateString: string): string {
  if (!dateString || dateString.length !== 10) return dateString;
  
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  
  return `${day}/${month}/${year}`;
}

// Função para formatar data conforme o usuário digita DD/MM/YYYY
export function formatDateInput(input: string): string {
  // Remove tudo que não é número
  const numbers = input.replace(/\D/g, '');
  
  // Limita a 8 dígitos (DDMMYYYY)
  const limited = numbers.slice(0, 8);
  
  // Adiciona barras automaticamente
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
}

// Função para validar se a data está no formato correto DD/MM/YYYY
export function validateDateFormat(dateString: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}