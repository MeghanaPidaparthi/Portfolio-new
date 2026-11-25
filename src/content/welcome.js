export const welcome = {
  windowTitle: 'Welcome to Meghana OS',
  heading: "hii, i\u2019m Meghana :)",
  intro: 'final-year CS (AI) student. i write, build and lead teams.',
  // `open` is the id of a desktop icon in desktopIcons.js. Items without it are plain notes.
  items: [
    { label: "see what i've built", open: 'projects' },
    { label: 'read the long version of me', open: 'about-me' },
    { label: 'grab my resume', open: 'resume' },
    {
      label:
        'this site is an old computer on purpose. click around, it all works. if you get lost, ask the dog.',
    },
  ],
  // The default button opens one of these at random, then closes the welcome window.
  surprise: {
    label: 'Surprise me',
    pool: ['projects', 'about-me', 'experience', 'community', 'gallery', 'music'],
  },
  closeLabel: 'Cancel',
}