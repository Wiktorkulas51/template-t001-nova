import path from 'node:path';

export type FtpDeployInput = {
  /**
   * Folder na serwerze FTP, np. `/sites` lub `/var/www`.
   * (bez trailing slash, ale funkcja i tak to ujednolici)
   */
  remoteRootDir: string;
  /**
   * Opcjonalna nazwa subdomeny, np. `acme`.
   * Jesli pusta - wracamy do `remoteRootDir`.
   */
  subdomain?: string;
};

export function sanitizeSubdomain(input: string): string {
  const trimmed = input.trim().toLowerCase().replace(/^\.+|\.+$/g, '');
  if (!trimmed) throw new Error('Subdomain is empty');

  // FTP directory names are typically expected to be simple; we normalize hard chars.
  return trimmed
    .replace(/[^a-z0-9-]/g, '-') // spaces, dots, underscores -> `-`
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-|-$/g, ''); // trim dash from both ends
}

export function normalizeFtpPath(...parts: string[]): string {
  const joined = parts
    .filter((p) => p !== undefined && p !== null)
    .map((p) => String(p))
    .map((p) => p.replace(/\\/g, '/'))
    .join('/');

  // Collapse multiple slashes; remove trailing slash for stable comparisons.
  const collapsed = joined.replace(/\/+/g, '/');
  return collapsed.endsWith('/') && collapsed.length > 1 ? collapsed.slice(0, -1) : collapsed;
}

export function buildRemoteDeployDir(input: FtpDeployInput): string {
  const remoteRootDir = path.posix
    .normalize(input.remoteRootDir.replace(/\\/g, '/'))
    .replace(/\/+/g, '/');

  const sub = (input.subdomain ?? '').trim();
  if (!sub) return normalizeFtpPath(remoteRootDir);

  return normalizeFtpPath(remoteRootDir, sanitizeSubdomain(sub));
}

