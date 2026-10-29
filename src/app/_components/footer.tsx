import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-950/10 bg-emerald-900 text-emerald-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Coluna 1: Missão */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <span>🐾 Guardiões da Fauna</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-emerald-200">
              Conectando cidadãos, voluntários e ONGs para proteger, socorrer e
              garantir a recuperação de animais silvestres e domésticos em perigo.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Plataforma
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-emerald-200">
              <li>
                <Link href="/animais" className="hover:text-white transition-colors">
                  Feed de Resgates
                </Link>
              </li>
              <li>
                <Link href="/animais/novo" className="hover:text-white transition-colors">
                  Reportar Animal em Risco
                </Link>
              </li>
              <li>
                <Link href="/ongs" className="hover:text-white transition-colors">
                  ONGs Credenciadas
                </Link>
              </li>
              <li>
                <Link href="/doacoes" className="hover:text-white transition-colors">
                  Campanhas & Doações
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Telefones de Emergência Ambiental */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              🚨 Emergências Fauna
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-emerald-200">
              <li className="flex flex-col">
                <span className="font-medium text-white">Linha Verde (IBAMA)</span>
                <span className="text-xs text-amber-200">0800 061 8080 (Silvestres)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-white">Polícia Militar Ambiental</span>
                <span className="text-xs text-amber-200">Disque 190</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-white">Corpo de Bombeiros</span>
                <span className="text-xs text-amber-200">Disque 193 (Resgates urgentes)</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Responsabilidade & Transparência */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Aviso Importante
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-emerald-300">
              Esta é uma plataforma colaborativa. Em casos de animais peçonhentos
              ou espécies silvestres de grande porte, nunca tente a contenção por
              conta própria: acione imediatamente as autoridades competentes.
            </p>
            <div className="mt-4 text-xs text-emerald-400">
              Feito com dedicação para a proteção animal 💚
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-800 pt-6 text-center text-xs text-emerald-400">
          © {new Date().getFullYear()} Guardiões da Fauna. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
