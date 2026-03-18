// TODO: JWT / cookie helpers

export async function createSession(userId: string, role: string) {
  // TODO: Create JWT, set cookie
}

export async function verifySession() {
  // TODO: Read cookie, verify JWT, return user info
}

export async function destroySession() {
  // TODO: Clear auth cookie
}
