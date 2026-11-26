/**
 * @typedef {object} DesktopItem
 * @property {string} id
 * @property {string} label            Text under the desktop icon.
 * @property {string} icon             File name (no extension) in src/assets/icons/.
 * @property {string} appId            Which app opens (see src/apps/registry.jsx).
 * @property {string} [windowTitle]    Window and taskbar title, if different from the label.
 * @property {object} [props]          Passed to the app, e.g. which text file Notepad shows.
 * @property {{ w: number, h: number }} [size]  Opening size, if not the default.
 * @property {string} [windowIcon]      Title-bar icon (file name in src/assets/icons/), if different from the desktop icon.
 * @property {boolean} [center]        Open centred instead of cascading.
 */

/**
 * Desktop shortcuts, in display order (two columns, filled row by row).
 * @type {DesktopItem[]}
 */
export const desktopIcons = [
  { id: 'projects', label: 'Projects', icon: 'projects', appId: 'projects' },
  { id: 'web-explorer', label: 'Internet Explorer', icon: 'explorer', appId: 'web-explorer' },
  {
    id: 'about-me',
    label: 'About-me.txt',
    icon: 'aboutme',
    appId: 'notepad',
    windowTitle: 'About-me.txt - Notepad',
    props: { file: 'about-me' },
    size: { w: 620, h: 460 },
  },
  {
    id: 'mail',
    label: 'Emails',
    icon: 'email',
    appId: 'mail',
    windowTitle: 'Contact me :)',
    windowIcon: 'mail-small',
    size: { w: 845, h: 579 },
    center: true,
  },
  { id: 'experience', label: 'Experience', icon: 'experience', appId: 'experience' },
  { id: 'community', label: 'Community', icon: 'empty-folder', appId: 'community' },
  { id: 'resume', label: 'Resume', icon: 'file', appId: 'resume' },
  {
    id: 'notepad',
    label: 'Notepad',
    icon: 'notepad',
    appId: 'notepad',
    windowTitle: 'scratch.txt - Notepad',
    props: { file: 'scratch' },
  },
  { id: 'gallery', label: 'Gallery', icon: 'gallery', appId: 'pictures' },
  { id: 'music', label: 'My Music', icon: 'music', appId: 'music' },
]