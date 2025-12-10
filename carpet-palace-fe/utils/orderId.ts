/**
 * Generates a readable order ID in the format: DDMMYYYYHHMMSS + random characters
 * Example: 10122025113023ABC123
 */
export function generateOrderId(): string {
  const now = new Date()
  
  // Format: DDMMYYYY
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear())
  const dateStr = `${day}${month}${year}`
  
  // Format: HHMMSS
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timeStr = `${hours}${minutes}${seconds}`
  
  // Generate random alphanumeric characters (6 characters)
  const randomChars = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()
  
  return `${dateStr}${timeStr}${randomChars}`
}
