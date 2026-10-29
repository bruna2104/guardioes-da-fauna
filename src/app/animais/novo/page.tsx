"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { UrgencyLevel } from "~/app/_components/ui/badge";

const SPECIES_PRESETS = [
  { label: "Cão", value: "Cão", icon: "🐶" },
  { label: "Gato", value: "Gato", icon: "🐱" },
  { label: "Silvestre", value: "Silvestre", icon: "🦉" },
  { label: "Ave", value: "Ave", icon: "🦜" },
  { label: "Outro", value: "Outro", icon: "🐾" },
];

const URGENCY_OPTIONS: Array<{
  value: UrgencyLevel;
  label: string;
  badge: string;
  desc: string;
  borderClass: string;
  bgClass: string;
}> = [
  {
    value: "CRITICAL",
    label: "Crítica / Emergência",
    badge: "🚨 Crítica",
    desc: "Risco de vida imediato, atropelamento grave, hemorragia ativa, queimaduras severas.",
    borderClass: "border-red-500",
    bgClass: "bg-red-50/70 dark:bg-red-950/30 text-red-900 dark:text-red-200",
  },
  {
    value: "HIGH",
    label: "Alta",
    badge: "⚠️ Alta",
    desc: "Animal ferido, suspeita de fratura, dores intensas, muito debilitado ou desidratado.",
    borderClass: "border-orange-500",
    bgClass: "bg-orange-50/70 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200",
  },
  {
    value: "MEDIUM",
    label: "Média",
    badge: "🟡 Média",
    desc: "Animal abandonado sob intempéries, filhotes sozinhos, machucado leve ou sarna inicial.",
    borderClass: "border-amber-500",
    bgClass: "bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200",
  },
  {
    value: "LOW",
    label: "Baixa",
    badge: "🟢 Baixa",
    desc: "Animal estável, já em local seguro temporário, aguardando acolhimento ou triagem de adoção.",
    borderClass: "border-emerald-500",
    bgClass: "bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200",
  },
];

const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// URLs de imagens de exemplo para facilitar testes rápidos na POC
const SAMPLE_PHOTOS = [
  {
    label: "Cão ferido",
    url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Gatinho",
    url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Ave / Silvestre",
    url: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80",
  },
];

export default function NewRescuePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("Cão");
  const [customSpecies, setCustomSpecies] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("MEDIUM");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");
  const [address, setAddress] = useState("");
  const [photoInput, setPhotoInput] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const createRescue = api.rescue.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/animais");
      }, 2000);
    },
  });

  const handleAddPhoto = () => {
    const trimmed = photoInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
      if (!photos.includes(trimmed)) {
        setPhotos([...photos, trimmed]);
      }
      setPhotoInput("");
      setFormErrors((prev) => ({ ...prev, photos: "" }));
    } catch {
      setFormErrors((prev) => ({
        ...prev,
        photos: "Por favor, insira uma URL válida (ex: https://...)",
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 3) {
      errors.title = "O título da ocorrência deve ter no mínimo 3 caracteres.";
    }

    if (!description.trim() || description.trim().length < 10) {
      errors.description =
        "A descrição do estado do animal deve ter no mínimo 10 caracteres.";
    }

    const effectiveSpecies =
      selectedSpecies === "Outro" ? customSpecies.trim() : selectedSpecies;
    if (!effectiveSpecies || effectiveSpecies.length < 2) {
      errors.species = "Especifique a espécie do animal.";
    }

    if (!city.trim() || city.trim().length < 2) {
      errors.city = "A cidade onde o animal se encontra é obrigatória.";
    }

    if (!state.trim()) {
      errors.state = "O estado (UF) é obrigatório.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const effectiveSpecies =
      selectedSpecies === "Outro" ? customSpecies.trim() : selectedSpecies;

    // Se o usuário digitou uma URL no campo mas esqueceu de clicar em adicionar, inclui
    const finalPhotos = [...photos];
    if (photoInput.trim()) {
      try {
        new URL(photoInput.trim());
        if (!finalPhotos.includes(photoInput.trim())) {
          finalPhotos.push(photoInput.trim());
        }
      } catch {
        // Ignora caso inválido
      }
    }

    createRescue.mutate({
      title: title.trim(),
      description: description.trim(),
      species: effectiveSpecies,
      urgency,
      city: city.trim(),
      state,
      address: address.trim() || undefined,
      photos: finalPhotos,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24 dark:bg-zinc-950">
      {/* Top Banner */}
      <section className="border-b border-emerald-900/10 bg-white py-8 shadow-xs dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/animais"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 transition hover:text-emerald-600 dark:text-emerald-400"
          >
            <span>←</span>
            <span>Voltar ao Feed de Resgates</span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
              🚨
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl dark:text-white">
                Reportar Animal em Situação de Risco
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 sm:text-sm dark:text-stone-300">
                Preencha os detalhes para que voluntários e ONGs parceiras
                possam agir com rapidez no resgate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Container do Formulário */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner de Sucesso */}
        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-50 p-8 text-center shadow-md dark:border-emerald-800 dark:bg-emerald-950/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white">
              ✓
            </div>
            <h2 className="mt-4 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              Ocorrência Registrada com Sucesso!
            </h2>
            <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
              O animal agora está visível no feed de resgates da sua região.
              Redirecionando para o feed...
            </p>
            <div className="mt-6">
              <Link
                href="/animais"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-600"
              >
                <span>Ver Feed de Resgates</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Mensagem de Erro da API */}
            {createRescue.isError && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                ⚠️ Erro ao registrar ocorrência: {createRescue.error.message}
              </div>
            )}

            {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                1. Informações Básicas do Animal
              </h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Identifique a ocorrência e ajude os socorristas a reconhecer o caso.
              </p>

              <div className="mt-5 space-y-5">
                {/* Título da Ocorrência */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Título Resumido da Ocorrência{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Cão atropelado precisando de socorro urgente na Av. Brasil"
                    className={`mt-1.5 w-full rounded-xl border bg-stone-50/80 px-3.5 py-2.5 text-sm text-stone-900 transition focus:bg-white focus:outline-hidden dark:bg-zinc-800/80 dark:text-white ${
                      formErrors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:focus:border-emerald-500"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Seleção de Espécie */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Espécie do Animal <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {SPECIES_PRESETS.map((item) => {
                      const isSelected = selectedSpecies === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setSelectedSpecies(item.value)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            isSelected
                              ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                              : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedSpecies === "Outro" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Digite a espécie (ex: Equino, Réptil, Gambá...)"
                        value={customSpecies}
                        onChange={(e) => setCustomSpecies(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                  )}

                  {formErrors.species && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.species}
                    </p>
                  )}
                </div>

                {/* Grau de Urgência */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Grau de Urgência / Triagem Inicial{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Selecione a gravidade para priorização na lista de resgate.
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {URGENCY_OPTIONS.map((opt) => {
                      const isChecked = urgency === opt.value;
                      return (
                        <label
                          key={opt.value}
                          onClick={() => setUrgency(opt.value)}
                          className={`flex cursor-pointer flex-col rounded-xl border-2 p-3.5 transition-all ${
                            isChecked
                              ? `${opt.borderClass} ${opt.bgClass} shadow-xs ring-2 ring-emerald-500/10`
                              : "border-stone-200 bg-white hover:border-stone-300 dark:border-zinc-800 dark:bg-zinc-800/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">
                              {opt.badge}
                            </span>
                            <input
                              type="radio"
                              name="urgency"
                              checked={isChecked}
                              onChange={() => setUrgency(opt.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400">
                            {opt.desc}
                          </p>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Descrição Detalhada */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Descrição Detalhada do Estado do Animal{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Descreva porte, cor da pelagem, comportamento, ferimentos
                    visíveis e se o animal está contido ou em fuga.
                  </p>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Animal mestiço com pelagem caramelo, porte médio. Apresenta claudicação na pata dianteira e corte superficial na cabeça. Está acolhido sob uma marquise, aceitou água mas não consegue apoiar o membro..."
                    className={`mt-2 w-full rounded-xl border bg-stone-50/80 p-3.5 text-sm text-stone-900 transition focus:bg-white focus:outline-hidden dark:bg-zinc-800/80 dark:text-white ${
                      formErrors.description
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:focus:border-emerald-500"
                    }`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: LOCALIZAÇÃO */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                2. Localização do Resgate
              </h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Onde os voluntários ou equipe de resgate devem se deslocar.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
                {/* Cidade */}
                <div className="sm:col-span-8">
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Campinas"
                    className={`mt-1.5 w-full rounded-xl border bg-stone-50/80 px-3.5 py-2.5 text-sm text-stone-900 transition focus:bg-white focus:outline-hidden dark:bg-zinc-800/80 dark:text-white ${
                      formErrors.city
                        ? "border-red-400 focus:border-red-500"
                        : "border-stone-200 focus:border-emerald-600 dark:border-zinc-700"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                {/* Estado (UF) */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="state"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Estado (UF) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-stone-900 transition focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white"
                  >
                    {BRAZIL_STATES.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Endereço / Ponto de Referência */}
                <div className="sm:col-span-12">
                  <label
                    htmlFor="address"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Endereço Completo ou Ponto de Referência
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Prestes Maia, nº 840 - próx. ao viaduto / Barão Geraldo"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-stone-900 transition focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: FOTOS DO ANIMAL COM PREVIEW */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                3. Fotos do Animal e do Local
              </h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Adicione URLs de imagens para que a equipe veterinária e ONGs
                possam avaliar visualmente o quadro.
              </p>

              {/* Input de URL */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => {
                    setPhotoInput(e.target.value);
                    if (formErrors.photos) {
                      setFormErrors((prev) => ({ ...prev, photos: "" }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPhoto();
                    }
                  }}
                  placeholder="Cole aqui a URL direta da imagem (ex: https://...)"
                  className="flex-1 rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-stone-900 transition focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
                >
                  Adicionar Foto
                </button>
              </div>

              {formErrors.photos && (
                <p className="mt-1.5 text-xs text-red-600">
                  {formErrors.photos}
                </p>
              )}

              {/* Botões Rápidos de Amostra para Demonstração da POC */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-stone-400">
                  Exemplos para teste rápido:
                </span>
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      if (!photos.includes(sample.url)) {
                        setPhotos([...photos, sample.url]);
                      }
                    }}
                    className="rounded-lg border border-stone-200 bg-stone-100/70 px-2 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>

              {/* Galeria de Previews de Fotos Adicionadas */}
              {photos.length > 0 && (
                <div className="mt-5 border-t border-stone-100 pt-4 dark:border-zinc-800">
                  <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Fotos Anexadas ({photos.length}):
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-4/3 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-xs dark:border-zinc-800 dark:bg-zinc-800"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Prévia ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900/80 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-red-600"
                          title="Remover foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES DE SUBMISSÃO */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <Link
                href="/animais"
                className="w-full rounded-xl border border-stone-200 bg-white py-3 text-center text-xs font-semibold text-stone-700 transition hover:bg-stone-50 sm:w-auto sm:px-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-stone-300"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={createRescue.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-emerald-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {createRescue.isPending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" />
                    <span>Publicando Ocorrência...</span>
                  </>
                ) : (
                  <>
                    <span>🚨</span>
                    <span>Publicar Ocorrência de Resgate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
