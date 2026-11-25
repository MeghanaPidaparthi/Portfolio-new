import { desktopIcons } from '../content/desktopIcons.js'
import { useWindowStore } from '../windows/windowStore.js'

/**
 * Open the window for one desktop item. Every entry point (icons, welcome links) uses this.
 * @param {import('../content/desktopIcons.js').DesktopItem} item
 */
export function launchItem(item) {
  useWindowStore.getState().open({
    key: item.id,
    appId: item.appId,
    title: item.windowTitle ?? item.label,
    icon: item.icon,
    props: item.props,
    size: item.size,
  })
}

/**
 * Open a desktop item by id.
 * @param {string} id
 */
export function launchById(id) {
  const item = desktopIcons.find((entry) => entry.id === id)
  if (item) launchItem(item)
}