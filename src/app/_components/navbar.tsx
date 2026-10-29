interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Feed de Resgates', href: '/animais' },
  { label: 'ONGs Parceiras', href: '/ongs' },
  { label: 'Central de Doações', href: '/doacoes' },
  { label: 'Meu Perfil', href: '/perfil' },
];

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
      {/* Nome do Projeto + Mascote */}
      <div className="flex items-center gap-2 font-bold text-xl">
        <span>🐾 Guardiões da Fauna</span>
      </div>

      {/* Links de Navegação */}
      <ul className="flex gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a 
              href={link.href} 
              className="hover:underline text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}