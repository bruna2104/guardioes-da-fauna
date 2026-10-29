import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Feed de Resgates", href: "/animais" },
  { label: "ONGs Parceiras", href: "/ongs" },
  { label: "Central de Doações", href: "/doacoes" },
  { label: "Meu Perfil", href: "/perfil" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-emerald-800/95 text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Nome do Projeto + Mascote */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="text-2xl">🐾</span>
          <span>Guardiões da Fauna</span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-emerald-100 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/animais/novo"
            className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-amber-400"
          >
            🚨 Reportar Resgate
          </Link>
        </div>
      </div>
    </nav>
  );
}
