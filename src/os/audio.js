import { useOsStore } from './osStore.js'

const SOUND_PATHS = {
  login: '../assets/sounds/login-chime.mp3',
  shutdown: '../assets/sounds/shutdown.mp3',
}

const soundFiles = import.meta.glob('../assets/sounds/*.{mp3,ogg,wav}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const audioElements = new Map()
let audioUnlocked = false

/** Mark audio as unlocked after an explicit user gesture. */
export function unlockAudio() {
  audioUnlocked = true
}

/**
 * Play one of the supplied sound files after a user gesture.
 * @param {'login' | 'shutdown'} name
 */
export async function play(name) {
  if (!audioUnlocked || useOsStore.getState().muted) return

  const source = soundFiles[SOUND_PATHS[name]]
  if (!source) return

  try {
    let audio = audioElements.get(name)
    if (!audio) {
      audio = new Audio(source)
      audio.preload = 'none'
      audioElements.set(name, audio)
    }

    audio.currentTime = 0
    await audio.play()
  } catch {
    // Missing, unsupported, or blocked audio should never interrupt the OS flow.
  }
}

export function mute() {
  useOsStore.getState().setMuted(true)
}

export function unmute() {
  useOsStore.getState().setMuted(false)
}
