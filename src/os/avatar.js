const avatarFiles = import.meta.glob('../assets/photos/avatar.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

/** URL of src/assets/photos/avatar.*, or undefined if it has not been added yet. */
export const avatarSrc = Object.values(avatarFiles)[0]