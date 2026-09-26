// Remembers where a signed-out visitor was heading so they land there after
// signing in. Kept in sessionStorage because Google sign-in leaves the app
// and comes back to the fixed OAuth redirect URL (/dashboard).
const KEY = "postLoginRedirect";

// Only same-origin paths, so the stored value can't send users off-site
const isSafePath = (path: string) => path.startsWith("/") && !path.startsWith("//");

export function savePostLoginRedirect(path: string) {
  if (!isSafePath(path)) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // Storage can be unavailable (private mode); fall back to the default route
  }
}

export function consumePostLoginRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return path && isSafePath(path) ? path : null;
  } catch {
    return null;
  }
}
