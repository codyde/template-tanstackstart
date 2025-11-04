import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const quickStartSteps = [
    'npm install',
    'npm run dev',
    'Visit http://localhost:3000',
  ]

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-12">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-600">
          Vibecoding starter
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          TanStack Start template for vibecoding projects
        </h1>
        <p className="text-base text-slate-600">
          This project gives you a clean TanStack Start setup with Tailwind CSS
          and an example server function. Start building right away by editing{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">
            src/routes/index.tsx
          </code>{' '}
          and add your own routes under{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">
            src/routes
          </code>
          .
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Quick start</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          {quickStartSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <code className="rounded bg-slate-100 px-2 py-1">{step}</code>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">
          Explore the server functions demo
        </h2>
        <p className="text-sm text-slate-600">
          A working example lives at{' '}
          <Link
            to="/examples/server-functions"
            className="font-medium text-cyan-600 underline hover:text-cyan-700"
          >
            /examples/server-functions
          </Link>
          . It showcases `createServerFn` with a persistent todo list. Use it as
          a reference when wiring up your own backend logic.
        </p>
      </section>
    </main>
  )
}
