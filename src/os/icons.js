const iconFiles = import.meta.glob('../assets/icons/*.{png,svg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const iconSources = Object.fromEntries(
  Object.entries(iconFiles).map(([path, url]) => [
    path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase(),
    url,
  ]),
)

/**
 * @param {string} name
 * @returns {string | undefined}
 */
export function getIconSource(name) {
  return iconSources[name.toLowerCase()]
}

