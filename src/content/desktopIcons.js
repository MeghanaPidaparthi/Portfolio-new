/**
 * Desktop shortcuts, in display order (two columns, filled row by row).
 * `icon` is the file name (without extension) in src/assets/icons/.
 * `appId` is what the window manager opens in the next step.
 */
export const desktopIcons = [
  { id: 'projects', label: 'Projects', icon: 'projects', appId: 'projects' },
  { id: 'web-explorer', label: 'Internet Explorer', icon: 'explorer', appId: 'web-explorer' },
  { id: 'about-me', label: 'About-me.txt', icon: 'aboutme', appId: 'notepad' },
  { id: 'mail', label: 'Emails', icon: 'Email', appId: 'mail' },
  { id: 'experience', label: 'Experience', icon: 'experience', appId: 'experience' },
  { id: 'community', label: 'Community', icon: 'empty-folder', appId: 'community' },
  { id: 'resume', label: 'Resume', icon: 'file', appId: 'resume' },
  { id: 'notepad', label: 'Notepad', icon: 'notepad', appId: 'notepad' },
  { id: 'gallery', label: 'Gallery', icon: 'gallery', appId: 'pictures' },
  { id: 'music', label: 'My Music', icon: 'music', appId: 'music' },
]