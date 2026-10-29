"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { UrgencyBadge, StatusBadge } from "~/app/_components/ui/badge";
import { formatRelativeTime, formatFullDate, getSpeciesIcon } from "~/lib/formatters";

export default function RescueDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpSubmitted, setHelpSubmitted] = useState(false);
  const [helpForm, setHelpForm] = useState({
    helpType: "TEMPORARY_HOME",
    name: "",
    phone: "",
    message: "",
  });

  const {
    data: rescue,
    isLoading,
    isError,
    error,
  } = api.rescue.getById.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id) },
  );

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: rescue?.title ?? "Caso de Resgate - Guardiões da Fauna",
          text: `Animal precisando de socorro/apoio: ${rescue?.title}. Veja detalhes no Guardiões da Fauna!`,
          url: currentUrl,
        });
        return;
      } catch {
        // Fallback para clipboard caso o usuário cancele ou não suporte
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    }
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpSubmitted(true);
    setTimeout(() => {
      setHelpSubmitted(false);
      setIsHelpModalOpen(false);
      setHelpForm({
        helpType: "TEMPORARY_HOME",
        name: "",
        phone: "",
        message: "",
      });
    }, 2500);
  };

  if (isLoading) {
    return <RescueDetailSkeleton />;
  }

  if (isError || !rescue) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl text-red-600 dark:bg-red-950/60 dark:text-red-400">
          ⚠️
        </div>
        <h2 className="mt-4 text-2xl font-bold text-stone-900 dark:text-white">
          Ocorrência não encontrada
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          {error?.message ??
            "O caso de resgate que você está procurando pode ter sido removido ou o código de identificação está incorreto."}
        </p>
        <div className="mt-6">
          <Link
            href="/animais"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-600"
          >
            ← Voltar para o Feed de Resgates
          </Link>
        </div>
      </div>
    );
  }

  const photos = rescue.photos && rescue.photos.length > 0 ? rescue.photos : [];
  const currentPhoto = photos[selectedPhotoIndex] ?? photos[0];
  const speciesIcon = getSpeciesIcon(rescue.species);

  // Maps URL
  const locationQuery = `${rescue.address ? rescue.address + ", " : ""}${rescue.city}, ${rescue.state}, Brasil`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20 dark:bg-zinc-950">
      {/* Barra de Navegação Superior / Breadcrumb */}
      <div className="border-b border-stone-200/80 bg-white py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/animais"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 transition hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400"
          >
            <span>←</span>
            <span>Voltar ao Feed de Resgates</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-xs transition hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <span>🔗</span>
              <span>{copyFeedback ? "Link Copiado! ✓" : "Compartilhar"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho do Caso */}
        <div className="mb-8 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <UrgencyBadge urgency={rescue.urgency} />
                <StatusBadge status={rescue.status} />
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <span>{speciesIcon}</span>
                  <span>{rescue.species}</span>
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  Registrado {formatRelativeTime(rescue.createdAt)}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl dark:text-white">
                {rescue.title}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                <span className="text-emerald-600">📍</span>
                <span>
                  {rescue.city}, {rescue.state}
                  {rescue.address ? ` • ${rescue.address}` : ""}
                </span>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-emerald-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>🤝</span>
                <span>Oferecer Ajuda / Acolhimento</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 shadow-xs transition hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <span>📢</span>
                <span>{copyFeedback ? "Copiado!" : "Divulgar Caso"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout de 2 Colunas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Coluna Esquerda: Galeria, Descrição e Campanha (8 colunas) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Galeria de Fotos */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              {currentPhoto ? (
                <div className="relative aspect-16/9 w-full bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPhoto}
                    alt={rescue.title}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute right-3 bottom-3 rounded-md bg-stone-900/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-xs">
                    Foto {selectedPhotoIndex + 1} de {photos.length}
                  </div>
                </div>
              ) : (
                <div className="flex aspect-16/9 w-full flex-col items-center justify-center bg-stone-100 text-stone-400 dark:bg-zinc-800">
                  <span className="text-6xl">{speciesIcon}</span>
                  <span className="mt-2 text-sm font-medium text-stone-500">
                    Nenhuma fotografia anexada
                  </span>
                </div>
              )}

              {/* Thumbnails se houver mais de uma foto */}
              {photos.length > 1 && (
                <div className="flex gap-2 border-t border-stone-100 p-3 overflow-x-auto dark:border-zinc-800">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        selectedPhotoIndex === index
                          ? "border-emerald-600 ring-2 ring-emerald-500/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Miniatura ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações Completas do Animal */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                📋 Descrição e Estado de Saúde
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {rescue.description}
              </div>

              {/* Ficha Técnica Rápida */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-100 pt-6 sm:grid-cols-4 dark:border-zinc-800">
                <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Espécie
                  </span>
                  <span className="mt-1 block text-sm font-bold text-stone-900 dark:text-white">
                    {rescue.species}
                  </span>
                </div>

                <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Urgência
                  </span>
                  <span className="mt-1 block text-sm font-bold text-stone-900 dark:text-white">
                    {rescue.urgency}
                  </span>
                </div>

                <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Status Atual
                  </span>
                  <span className="mt-1 block text-sm font-bold text-stone-900 dark:text-white">
                    {rescue.status}
                  </span>
                </div>

                <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-zinc-800/60">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Data do Alerta
                  </span>
                  <span className="mt-1 block text-xs font-bold text-stone-900 dark:text-white">
                    {formatFullDate(rescue.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Campanha de Doação Vinculada (se existir) */}
            {rescue.campaign && (
              <div className="rounded-2xl border border-emerald-500/30 bg-radial from-emerald-50/50 to-emerald-100/20 p-6 shadow-xs dark:from-emerald-950/20 dark:to-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/70 px-2.5 py-0.5 text-xs font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                      💚 Campanha de Tratamento Ativa
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-white">
                      {rescue.campaign.title}
                    </h3>
                  </div>

                  <Link
                    href={`/doacoes?campanha=${rescue.campaign.id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
                  >
                    <span>Contribuir via PIX</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Barra de Progresso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                    <span>
                      Arrecadado: R${" "}
                      {rescue.campaign.currentAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span>
                      Meta: R${" "}
                      {rescue.campaign.goalAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (rescue.campaign.currentAmount /
                            rescue.campaign.goalAmount) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                    {Math.round(
                      (rescue.campaign.currentAmount /
                        rescue.campaign.goalAmount) *
                        100,
                    )}
                    % da meta necessária para cobrir consultas, cirurgias e
                    medicamentos deste caso.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Localização, Quem Reportou e ONG (4 colunas) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Box de Localização */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                📍 Localização da Ocorrência
              </h3>
              <div className="mt-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                <p className="font-semibold text-stone-800 dark:text-zinc-100">
                  {rescue.city} - {rescue.state}
                </p>
                {rescue.address && (
                  <p className="mt-1 text-stone-500 dark:text-stone-400">
                    Endereço / Referência: {rescue.address}
                  </p>
                )}
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <span>🗺️</span>
                <span>Abrir no Google Maps</span>
              </a>
            </div>

            {/* Box de Quem Reportou */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                👤 Quem Reportou
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {rescue.reportedBy?.name
                    ? rescue.reportedBy.name.slice(0, 2).toUpperCase()
                    : "CA"}
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-900 dark:text-white">
                    {rescue.reportedBy?.name ?? "Cidadão Anônimo"}
                  </span>
                  <span className="block text-[11px] text-stone-500 dark:text-stone-400">
                    Membro da comunidade
                  </span>
                </div>
              </div>
            </div>

            {/* Box de ONG Designada */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                🏥 ONG / Entidade Responsável
              </h3>
              {rescue.assignedNgo ? (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    {rescue.assignedNgo.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rescue.assignedNgo.logo}
                        alt={rescue.assignedNgo.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        🐾
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                        {rescue.assignedNgo.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {rescue.assignedNgo.city} - {rescue.assignedNgo.state}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-stone-100 pt-3 text-xs text-stone-600 dark:border-zinc-800 dark:text-stone-300">
                    <p>📞 Contato: {rescue.assignedNgo.phone}</p>
                    <p>✉️ Email: {rescue.assignedNgo.email}</p>
                    {rescue.assignedNgo.pixKey && (
                      <p className="rounded-md bg-stone-50 p-2 text-[11px] font-mono text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                        PIX: {rescue.assignedNgo.pixKey}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-300">
                  <p className="font-semibold">Aguardando atendimento</p>
                  <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-400">
                    Nenhuma instituição parceira assumiu a custódia deste
                    resgate até o momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de "Oferecer Ajuda / Acolhimento" */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {helpSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  💚
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900 dark:text-white">
                  Obrigado pela iniciativa!
                </h3>
                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
                  Sua oferta de ajuda foi registrada. O responsável pela
                  ocorrência e a equipe de voluntários entrarão em contato em
                  breve.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      Oferecer Apoio a este Resgate
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      Caso: {rescue.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsHelpModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleHelpSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Como você pode ajudar?
                    </label>
                    <select
                      value={helpForm.helpType}
                      onChange={(e) =>
                        setHelpForm({ ...helpForm, helpType: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="TEMPORARY_HOME">
                        🏠 Oferecer Lar Temporário
                      </option>
                      <option value="TRANSPORT">
                        🚗 Resgate e Transporte com Veículo
                      </option>
                      <option value="MEDICATION">
                        💊 Doação de Medicamentos / Ração
                      </option>
                      <option value="VET">
                        🩺 Atendimento Veterinário Voluntário
                      </option>
                      <option value="OTHER">💬 Outra forma de auxílio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={helpForm.name}
                      onChange={(e) =>
                        setHelpForm({ ...helpForm, name: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Telefone / WhatsApp para contato rápido
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(XX) 99999-9999"
                      value={helpForm.phone}
                      onChange={(e) =>
                        setHelpForm({ ...helpForm, phone: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Mensagem / Observação
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Moro a 10 minutos do local e tenho caixa de transporte disponível..."
                      value={helpForm.message}
                      onChange={(e) =>
                        setHelpForm({ ...helpForm, message: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsHelpModalOpen(false)}
                      className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 dark:border-zinc-700 dark:text-stone-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-emerald-950 shadow-xs hover:bg-amber-400"
                    >
                      Confirmar Apoio
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RescueDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-40 rounded bg-stone-200 dark:bg-zinc-800" />
      <div className="mt-6 h-32 rounded-2xl bg-stone-200 dark:bg-zinc-800" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="aspect-16/9 rounded-2xl bg-stone-200 dark:bg-zinc-800" />
          <div className="h-48 rounded-2xl bg-stone-200 dark:bg-zinc-800" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-36 rounded-2xl bg-stone-200 dark:bg-zinc-800" />
          <div className="h-36 rounded-2xl bg-stone-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
