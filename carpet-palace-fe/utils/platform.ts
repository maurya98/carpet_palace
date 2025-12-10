/**
 * Detects the user's operating system
 * @returns 'mac' | 'windows' | 'linux' | 'unknown'
 */
export function detectOS(): 'mac' | 'windows' | 'linux' | 'unknown' {
  if (typeof window === 'undefined') {
    return 'unknown'
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac'
  }

  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  }

  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }

  return 'unknown'
}

/**
 * Gets the appropriate keyboard shortcut symbol for the current OS
 * @returns The modifier key symbol (⌘ for Mac, Ctrl for Windows/Linux)
 */
export function getModifierKey(): string {
  const os = detectOS()
  return os === 'mac' ? '⌘' : 'Ctrl'
}

/**
 * Gets the keyboard shortcut display text for opening search
 * @returns Formatted shortcut string (e.g., "⌘K" or "Ctrl+K")
 */
export function getSearchShortcut(): string {
  const os = detectOS()
  return os === 'mac' ? '⌘K' : 'Ctrl+K'
}
