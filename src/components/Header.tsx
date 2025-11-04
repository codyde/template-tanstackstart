import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <HomeLink />
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <NavLink to="/" label="Home" />
          <NavLink to="/examples/server-functions" label="Server Functions" />
        </nav>
      </div>
    </header>
  )
}

type NavLinkProps = {
  to: string
  label: string
}

function NavLink({ to, label }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="rounded-md px-2 py-1 transition hover:text-slate-900"
      activeProps={{
        className: 'rounded-md px-2 py-1 text-slate-900 underline',
      }}
    >
      {label}
    </Link>
  )
}

function HomeLink() {
  return (
    <Link to="/" className="text-base font-semibold tracking-tight text-slate-900">
      Vibecoding TanStack Start
    </Link>
  )
}
