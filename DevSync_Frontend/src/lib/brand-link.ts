export function getBrandHomePath(): string {
  if (typeof window === "undefined") {
    return "/"
  }

  try {
    const rawUser = localStorage.getItem("user")
    const user = rawUser ? JSON.parse(rawUser) : null
    const username = typeof user?.username === "string" ? user.username.trim() : ""

    if (username) {
      return `/dashboard/${username}`
    }
  } catch (error) {
    console.error("Failed to resolve brand home path:", error)
  }

  return "/"
}