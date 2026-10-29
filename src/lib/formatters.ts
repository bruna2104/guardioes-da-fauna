/**
 * Utilitários de formatação para datas e espécies do Guardiões da Fauna.
 */

export function formatRelativeTime(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds)) return "Data desconhecida";

  if (diffInSeconds < 60) {
    return "agora há pouco";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "ontem";
  }
  if (diffInDays < 30) {
    return `há ${diffInDays} dias`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatFullDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSpeciesIcon(species?: string | null): string {
  if (!species) return "🐾";
  const s = species.toLowerCase();
  if (s.includes("cão") || s.includes("cachorro") || s.includes("cao")) return "🐶";
  if (s.includes("gato") || s.includes("felino")) return "🐱";
  if (s.includes("silvestre") || s.includes("tucano") || s.includes("coruja") || s.includes("ave") || s.includes("pássaro")) return "🦉";
  if (s.includes("cavalo") || s.includes("equino")) return "🐴";
  if (s.includes("tartaruga") || s.includes("jabuti") || s.includes("réptil")) return "🐢";
  return "🐾";
}
