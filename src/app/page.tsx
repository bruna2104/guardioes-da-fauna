import Link from "next/link";
import { auth } from "~/server/auth";
import { Card, CardHeader } from "~/app/_components/ui/card";
import { UrgencyBadge, StatusBadge } from "~/app/_components/ui/badge";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/50 px-4 py-1.5 text-xs font-medium text-emerald-200 backdrop-blur-sm">
            <span>🛡️ Plataforma Colaborativa de Resgate e Preservação da Fauna</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight">
            Cada segundo conta quando uma vida precisa de <span className="text-amber-400">socorro</span>.
          </h1>

          <p className="mt-6 text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Conectamos cidadãos que encontram animais feridos ou em risco a voluntários, 
            veterinários e ONGs capacitadas para realizar o resgate imediato.
          </p>

          {/* Botões de Ação Principal */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/animais/novo"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-bold text-emerald-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 hover:scale-[1.02]"
            >
              <span>🚨 Reportar Animal em Risco</span>
            </Link>

            <Link
              href="/animais"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-[1.02]"
            >
              <span>🐾 Feed de Resgates</span>
            </Link>

            <Link
              href="/ongs"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-800/40 px-6 py-3.5 text-base font-semibold text-emerald-100 transition hover:bg-emerald-700/60"
            >
              <span>💚 Apoiar ONGs Parceiras</span>
            </Link>
          </div>

          {/* Status do Usuário */}
          <div className="mt-8 text-xs text-emerald-300">
            {session?.user ? (
              <span>Conectado como <strong className="text-white">{session.user.name ?? session.user.email}</strong> • <Link href="/perfil" className="underline hover:text-white">Meu Painel</Link></span>
            ) : (
              <span>Ajude a salvar vidas: <Link href="/api/auth/signin" className="underline hover:text-white font-medium">Faça login com sua conta</Link></span>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Métricas Rápidas */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="text-center border-t-4 border-t-rose-500">
            <div className="text-3xl font-extrabold text-rose-600">Alerta Rápido</div>
            <div className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">
              Casos com triagem de urgência (crítica, alta e média)
            </div>
          </Card>

          <Card className="text-center border-t-4 border-t-emerald-600">
            <div className="text-3xl font-extrabold text-emerald-600">Rede Integrada</div>
            <div className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">
              ONGs parceiras e protetores independentes credenciados
            </div>
          </Card>

          <Card className="text-center border-t-4 border-t-amber-500">
            <div className="text-3xl font-extrabold text-amber-600">Apoio Direto</div>
            <div className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">
              Campanhas de tratamento e cirurgias via PIX transparente
            </div>
          </Card>
        </div>
      </section>

      {/* Como Funciona a Plataforma */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            Como funciona a rede dos Guardiões
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400 text-sm">
            Um fluxo ágil para transformar o encontro de um animal indefeso em um resgate bem-sucedido.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-2xl mb-4">
              📍
            </div>
            <CardHeader
              title="1. Mapeie e Registre"
              subtitle="Encontrou um animal machucado ou abandonado? Tire uma foto, descreva o local e envie no feed de ocorrências."
            />
            <div className="mt-3 flex gap-2">
              <UrgencyBadge urgency="CRITICAL" />
            </div>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-2xl mb-4">
              🚐
            </div>
            <CardHeader
              title="2. Acolhimento em Ação"
              subtitle="ONGs e protetores da região recebem a notificação, assumem o resgate e prestam os primeiros socorros."
            />
            <div className="mt-3 flex gap-2">
              <StatusBadge status="IN_PROGRESS" />
            </div>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-2xl mb-4">
              💚
            </div>
            <CardHeader
              title="3. Recuperação & Adoção"
              subtitle="Acompanhe a evolução do tratamento na linha do tempo até a total recuperação ou lar temporário."
            />
            <div className="mt-3 flex gap-2">
              <StatusBadge status="READY_ADOPTION" />
            </div>
          </Card>
        </div>
      </section>

      {/* Aviso de Emergência e Protocolos */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                  Atenção ao manusear animais desconhecidos ou silvestres
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  Animais feridos podem morder ou arranhar por medo. Mantenha distância segura, fotografe 
                  e registre a localização exata para a equipe especializada.
                </p>
              </div>
            </div>
            <Link
              href="/animais"
              className="shrink-0 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-amber-700"
            >
              Explorar Ocorrências Ativas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
