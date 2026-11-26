/**
 * Start menu contents.
 * `icon` is a file name (no extension) in src/assets/icons/.
 * Each entry does exactly one of:
 *   open: id of a desktop item in desktopIcons.js
 *   app:  a window to open directly { key, appId, title, props }
 *   link: key in links.js (opens in a new tab)
 */
export const startMenu = {
  userName: 'Meghana Pidaparthi :)',
  pinned: [
    { id: 'internet', label: 'Internet', sub: 'View all my socials', icon: 'explorer', open: 'web-explorer' },
    { id: 'email', label: 'E-Mail', sub: 'Contact me!', icon: 'email', open: 'mail' },
  ],
  programs: [
    { id: 'resume', label: 'Resume', icon: 'file', open: 'resume' },
    { id: 'projects', label: 'Projects', icon: 'projects', open: 'projects' },
    { id: 'experience', label: 'Experience', icon: 'experience', open: 'experience' },
    { id: 'about-me', label: 'About-me.txt', icon: 'aboutme', open: 'about-me' },
    { id: 'github', label: 'GitHub', icon: 'github', link: 'github' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', link: 'linkedin' },
  ],
  places: [
    {
      id: 'my-documents',
      label: 'My Documents',
      icon: 'my-documents',
      app: { key: 'my-documents', appId: 'explorer', title: 'My Documents', props: { path: '/My Documents' } },
    },
    { id: 'my-pictures', label: 'My Pictures', icon: 'my-pictures', open: 'gallery' },
    { id: 'my-music', label: 'My Music Playlist', icon: 'my-music', open: 'music' },
    {
      id: 'search',
      label: 'Search',
      icon: 'search',
      plain: true,
      divider: true,
      app: { key: 'rover', appId: 'rover', title: 'Rover' },
    },
  ],
  logOffLabel: 'Log off',
  turnOffLabel: 'Turn off',
}