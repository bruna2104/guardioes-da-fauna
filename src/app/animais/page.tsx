"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { UrgencyBadge, StatusBadge } from "~/app/_components/ui/badge";
import { formatRelativeTime, getSpeciesIcon } from "~/lib/formatters";
import type { UrgencyLevel } from "~/app/_components/ui/badge";

const SPECIES_OPTIONS = [
  { label: "Todas", value: "ALL", icon: "🐾" },
  { label: "Cão", value: "Cão", icon: "🐶" },
  { label: "Gato", value: "Gato", icon: "🐱" },
  { label: "Silvestre", value: "Silvestre", icon: "🦉" },
  { label: "Outros", value: "Outro", icon: "🐢" },
];

const URGENCY_OPTIONS = [
  { label: "Todas", value: "ALL", dotColor: "bg-stone-400" },
  { label: "Crítica", value: "CRITICAL", dotColor: "bg-red-500" },
  { label: "Alta", value: "HIGH", dotColor: "bg-orange-500" },
  { label: "Média", value: "MEDIUM", dotColor: "bg-amber-500" },
  { label: "Baixa", value: "LOW", dotColor: "bg-emerald-500" },
];

export default function RescuesFeedPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("ALL");
  const [cityInput, setCityInput] = useState<string>("");
  const [debouncedCity, setDebouncedCity] = useState<string>("");

  // Debounce da busca por cidade
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(cityInput);
    }, 350);
    return () => clearTimeout(timer);
  }, [cityInput]);

  const hasActiveFilters =
    selectedSpecies !== "ALL" ||
    selectedUrgency !== "ALL" ||
    cityInput.trim().length > 0;

  const resetFilters = () => {
    setSelectedSpecies("ALL");
    setSelectedUrgency("ALL");
    setCityInput("");
    setDebouncedCity("");
  };

  // Consulta tRPC
  const {
    data: rescues,
    isLoading,
    isError,
    error,
    refetch,
  } = api.rescue.getAll.useQuery({
    species: selectedSpecies !== "ALL" ? selectedSpecies : undefined,
    urgency:
      selectedUrgency !== "ALL"
        ? (selectedUrgency as UrgencyLevel)
        : undefined,
    city: debouncedCity.trim() ? debouncedCity.trim() : undefined,
  });

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20 dark:bg-zinc-950">
      {/* Top Header Section */}
      <section className="border-b border-emerald-900/10 bg-white py-10 shadow-xs dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span>🟢 Feed Colaborativo em Tempo Real</span>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                Ocorrências de Resgate Animal
              </h1>
              <p className="mt-1 text-sm text-stone-600 sm:text-base dark:text-stone-300">
                Casos reportados pela comunidade aguardando acolhimento ou em
                atendimento por voluntários e ONGs parceiras.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/animais/novo"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-emerald-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-base">🚨</span>
                <span>Reportar Animal em Risco</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Barra de Filtros Interativa */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-5">
            {/* Linha Superior: Campo de Cidade e Espécies */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Campo de Busca por Cidade */}
              <div className="lg:col-span-5">
                <label
                  htmlFor="city-search"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400"
                >
                  Localização (Cidade)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    📍
                  </span>
                  <input
                    id="city-search"
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Filtrar por cidade (ex: Campinas, São Paulo)..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/80 py-2.5 pr-10 pl-10 text-sm text-stone-900 transition-all placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-500"
                  />
                  {cityInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCityInput("");
                        setDebouncedCity("");
                      }}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      title="Limpar busca"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro por Espécie */}
              <div className="lg:col-span-7">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Espécie
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIES_OPTIONS.map((item) => {
                    const isSelected = selectedSpecies === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSelectedSpecies(item.value)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                            : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Linha Inferior: Grau de Urgência e Status de Filtros */}
            <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 sm:mr-2 dark:text-stone-400">
                  Urgência:
                </span>
                {URGENCY_OPTIONS.map((urg) => {
                  const isSelected = selectedUrgency === urg.value;
                  return (
                    <button
                      key={urg.value}
                      type="button"
                      onClick={() => setSelectedUrgency(urg.value)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-stone-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                          : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${urg.dotColor}`}
                      />
                      <span>{urg.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Contador de Resultados e Reset */}
              <div className="flex items-center gap-3 text-xs">
                {rescues && (
                  <span className="font-medium text-stone-500 dark:text-stone-400">
                    <strong className="text-stone-800 dark:text-white">
                      {rescues.length}
                    </strong>{" "}
                    {rescues.length === 1
                      ? "ocorrência encontrada"
                      : "ocorrências encontradas"}
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-medium text-amber-700 hover:underline dark:text-amber-400"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback de Erro */}
        {isError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              Ocorreu uma instabilidade ao carregar o feed de resgates:{" "}
              {error.message}
            </p>
            <button
              onClick={() => void refetch()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de Cards ou Skeletons */}
        <div className="mt-8">
          {isLoading ? (
            <RescueFeedSkeleton />
          ) : rescues && rescues.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rescues.map((rescue) => (
                <RescueCard key={rescue.id} rescue={rescue} />
              ))}
            </div>
          ) : (
            <RescueFeedEmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponente: Card Individual de Resgate
function RescueCard({
  rescue,
}: {
  rescue: {
    id: string;
    title: string;
    description: string;
    species: string;
    urgency: string;
    status: string;
    city: string;
    state: string;
    address?: string | null;
    photos: string[];
    createdAt: Date | string;
    reportedBy?: { id: string; name: string | null; image: string | null } | null;
    assignedNgo?: {
      id: string;
      name: string;
      slug: string;
      logo: string | null;
    } | null;
  };
}) {
  const [imgError, setImgError] = useState(false);
  const primaryPhoto = rescue.photos?.[0];
  const speciesIcon = getSpeciesIcon(rescue.species);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-600/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {/* Imagem do Animal com Badges Flutuantes */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
        {primaryPhoto && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryPhoto}
            alt={rescue.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-radial from-emerald-100/60 to-emerald-200/30 text-stone-400 dark:from-zinc-800 dark:to-zinc-900">
            <span className="text-4xl">{speciesIcon}</span>
            <span className="mt-1 text-xs font-medium text-stone-500 dark:text-zinc-400">
              Sem foto registrada
            </span>
          </div>
        )}

        {/* Badges no Topo da Imagem */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <UrgencyBadge urgency={rescue.urgency} />
          <StatusBadge status={rescue.status} />
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5">
        {/* Metadados: Espécie e Tempo Relativo */}
        <div className="mb-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-400">
            <span>{speciesIcon}</span>
            <span>{rescue.species}</span>
          </span>
          <span className="text-stone-400 dark:text-stone-500">
            {formatRelativeTime(rescue.createdAt)}
          </span>
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold tracking-tight text-stone-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
          <Link href={`/animais/${rescue.id}`} className="line-clamp-1">
            {rescue.title}
          </Link>
        </h2>

        {/* Breve Descrição */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {rescue.description}
        </p>

        {/* Localização */}
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
          <span className="text-emerald-600">📍</span>
          <span className="line-clamp-1">
            {rescue.city}, {rescue.state}
            {rescue.address ? ` • ${rescue.address}` : ""}
          </span>
        </div>

        {/* Footer do Card com ONG/Reportado e Ação */}
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {rescue.assignedNgo ? (
              <div className="flex items-center gap-1.5" title={`ONG: ${rescue.assignedNgo.name}`}>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  🏥
                </div>
                <span className="max-w-[110px] truncate text-xs font-medium text-stone-700 dark:text-zinc-300">
                  {rescue.assignedNgo.name}
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-600 dark:text-stone-400">
                Por:{" "}
                <strong className="font-medium text-stone-700 dark:text-zinc-300">
                  {rescue.reportedBy?.name ?? "Cidadão Anônimo"}
                </strong>
              </span>
            )}
          </div>

          <Link
            href={`/animais/${rescue.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-700 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
          >
            <span>Ver Detalhes</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

// Skeleton de Carregamento
function RescueFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="aspect-16/10 w-full bg-stone-200 dark:bg-zinc-800" />
          <div className="space-y-3 p-5">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-stone-200 dark:bg-zinc-800" />
              <div className="h-4 w-16 rounded bg-stone-200 dark:bg-zinc-800" />
            </div>
            <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded bg-stone-200 dark:bg-zinc-800" />
              <div className="h-3.5 w-4/5 rounded bg-stone-200 dark:bg-zinc-800" />
            </div>
            <div className="h-3.5 w-1/2 rounded bg-stone-200 dark:bg-zinc-800" />
            <div className="flex items-center justify-between border-t border-stone-100 pt-3 dark:border-zinc-800">
              <div className="h-4 w-24 rounded bg-stone-200 dark:bg-zinc-800" />
              <div className="h-6 w-20 rounded-lg bg-stone-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Estado Vazio
function RescueFeedEmptyState({
  hasFilters,
  onResetFilters,
}: {
  hasFilters: boolean;
  onResetFilters: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950">
        🐾
      </div>
      <h3 className="mt-4 text-lg font-bold text-stone-900 dark:text-white">
        {hasFilters
          ? "Nenhuma ocorrência encontrada com estes filtros"
          : "Nenhum resgate registrado no momento"}
      </h3>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
        {hasFilters
          ? "Experimente ajustar a busca por cidade, selecionar outra espécie ou limpar os filtros para ver todos os casos."
          : "Seja o primeiro a alertar nossa rede sobre um animal em perigo ou necessitando de acolhimento."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            Limpar Filtros
          </button>
        )}
        <Link
          href="/animais/novo"
          className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-emerald-950 shadow-sm transition hover:bg-amber-400"
        >
          🚨 Reportar Ocorrência
        </Link>
      </div>
    </div>
  );
}
