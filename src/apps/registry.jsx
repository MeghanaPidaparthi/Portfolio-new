import Mail from './mail/Mail.jsx'
import Notepad from './notepad/Notepad.jsx'
import PlaceholderApp from './PlaceholderApp.jsx'
import Welcome from './welcome/Welcome.jsx'

/** Built apps, by appId. Each app is a component that receives { windowId, title, ...props }. */
const apps = { mail: Mail, notepad: Notepad, welcome: Welcome }

/** Renders the app for an appId, falling back to the placeholder until it is built. */
export function AppView({ appId, ...props }) {
  const App = apps[appId] ?? PlaceholderApp
  return <App {...props} />
}