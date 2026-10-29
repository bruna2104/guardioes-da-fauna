import React from "react";

export type UrgencyLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type RescueStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "READY_ADOPTION"
  | "RESOLVED";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel | (string & {});
  className?: string;
}

interface StatusBadgeProps {
  status: RescueStatus | (string & {});
  className?: string;
}

export function UrgencyBadge({ urgency, className = "" }: UrgencyBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; icon: string }
  > = {
    CRITICAL: {
      label: "Urgência Crítica",
      bg: "bg-red-500/15 border-red-500/40",
      text: "text-red-700 dark:text-red-300",
      icon: "🚨",
    },
    HIGH: {
      label: "Urgência Alta",
      bg: "bg-orange-500/15 border-orange-500/40",
      text: "text-orange-700 dark:text-orange-300",
      icon: "⚠️",
    },
    MEDIUM: {
      label: "Urgência Média",
      bg: "bg-amber-500/15 border-amber-500/40",
      text: "text-amber-700 dark:text-amber-300",
      icon: "🟡",
    },
    LOW: {
      label: "Baixa Urgência",
      bg: "bg-emerald-500/15 border-emerald-500/40",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: "🟢",
    },
  };

  const config = configs[urgency.toUpperCase()] ?? {
    label: urgency,
    bg: "bg-gray-500/15 border-gray-500/40",
    text: "text-gray-700 dark:text-gray-300",
    icon: "ℹ️",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${config.bg} ${config.text} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    REPORTED: {
      label: "Aguardando Resgate",
      bg: "bg-rose-100 text-rose-800 border-rose-300",
      text: "",
    },
    IN_PROGRESS: {
      label: "Em Atendimento",
      bg: "bg-sky-100 text-sky-800 border-sky-300",
      text: "",
    },
    RESCUED: {
      label: "Resgatado / Em Recuperação",
      bg: "bg-teal-100 text-teal-800 border-teal-300",
      text: "",
    },
    READY_ADOPTION: {
      label: "Pronto para Adoção",
      bg: "bg-purple-100 text-purple-800 border-purple-300",
      text: "",
    },
    RESOLVED: {
      label: "Caso Concluído",
      bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      text: "",
    },
  };

  const config = configs[status.toUpperCase()] ?? {
    label: status,
    bg: "bg-zinc-100 text-zinc-800 border-zinc-300",
    text: "",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.bg} ${className}`}
    >
      {config.label}
    </span>
  );
}
