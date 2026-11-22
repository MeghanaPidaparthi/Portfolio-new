import { system } from './content/system.js'
import { useOsStore } from './os/osStore.js'

const stateText = {
  boot: system.bootText,
  login: system.loginWelcomeText,
  desktop: system.desktopText,
  shutdown: system.shutdownText,
}

const osStates = ['boot', 'login', 'desktop', 'shutdown']

function App() {
  const osState = useOsStore((state) => state.osState)
  const setOsState = useOsStore((state) => state.setOsState)

  return (
    <main className="os-shell flex flex-col items-center justify-center gap-6 bg-slate-100 p-6 text-slate-900">
      <section aria-live="polite" className="text-center">
        <h1 className="text-2xl font-semibold">{system.siteName}</h1>
        <p className="mt-2 text-sm" data-os-state={osState}>
          {stateText[osState]}
        </p>
      </section>

      {import.meta.env.DEV && (
        <nav aria-label="Development OS state switcher" className="flex flex-wrap justify-center gap-2">
          {osStates.map((state) => (
            <button
              aria-pressed={osState === state}
              className="rounded border border-slate-400 bg-white px-3 py-1.5 text-sm capitalize hover:bg-slate-200"
              key={state}
              onClick={() => setOsState(state)}
              type="button"
            >
              {state}
            </button>
          ))}
        </nav>
      )}
    </main>
  )
}

export default App
