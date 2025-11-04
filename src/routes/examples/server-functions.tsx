import fs from 'node:fs'
import { useCallback, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const TODOS_FILE = 'todos.json'

async function readTodos() {
  return JSON.parse(
    await fs.promises.readFile(TODOS_FILE, 'utf-8').catch(() =>
      JSON.stringify(
        [
          { id: 1, name: 'Get groceries' },
          { id: 2, name: 'Buy a new phone' },
        ],
        null,
        2,
      ),
    ),
  )
}

const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => await readTodos())

const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const todos = await readTodos()
    todos.push({ id: todos.length + 1, name: data })
    await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
    return todos
  })

export const Route = createFileRoute('/examples/server-functions')({
  component: Home,
  loader: async () => await getTodos(),
})

function Home() {
  const router = useRouter()
  const todos = Route.useLoaderData()

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    const trimmed = todo.trim()
    if (!trimmed) return
    await addTodo({ data: trimmed })
    setTodo('')
    await router.invalidate()
  }, [router, todo])

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Server Functions Example
        </h1>
        <p className="text-sm text-slate-600">
          This page demonstrates `createServerFn` with a simple todo list that
          persists to `todos.json` on the server. Try adding a new item to see
          the round trip between the browser and your server function.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Add a Todo</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submitTodo()
              }
            }}
            placeholder="Pick up snacks for the jam session"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
          <button
            type="button"
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className="inline-flex items-center justify-center rounded-md bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          >
            Save todo
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Current Todos</h2>
        {todos?.length ? (
          <ul className="mt-4 space-y-2">
            {todos.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
              >
                {item.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            No todos yet. Add your first task above to create the file and see
            the server function in action.
          </p>
        )}
      </section>
    </main>
  )
}
