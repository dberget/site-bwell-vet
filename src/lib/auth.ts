import { createHash, randomBytes } from 'crypto';
import { getFile } from './github';

interface ClientRecord {
  password_hash: string;
  email: string;
  business_name: string;
  plan: string;
  stripe_customer_id: string;
  created_at: string;
  cancelled_at?: string;
}

export type ClientsMap = Record<string, ClientRecord>;

export interface AuthResult {
  authenticated: boolean;
  role: 'admin' | 'client' | 'none';
  site: string | null; // null = all sites (admin)
}

let cachedClients: { data: ClientsMap; sha: string; ts: number } | null = null;

export async function getClients(ghToken: string): Promise<{ data: ClientsMap; sha: string }> {
  if (cachedClients && Date.now() - cachedClients.ts < 60_000) {
    return { data: cachedClients.data, sha: cachedClients.sha };
  }
  try {
    const file = await getFile('data/clients.json', ghToken);
    const data = JSON.parse(file.content) as ClientsMap;
    cachedClients = { data, sha: file.sha, ts: Date.now() };
    return { data, sha: file.sha };
  } catch {
    return { data: {}, sha: '' };
  }
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function generatePassword(): string {
  return randomBytes(6).toString('base64url');
}

export async function checkAuth(
  cookieValue: string | undefined,
  adminSecret: string,
  ghToken: string
): Promise<AuthResult> {
  if (!cookieValue) return { authenticated: false, role: 'none', site: null };

  // Master admin
  if (cookieValue === adminSecret) {
    return { authenticated: true, role: 'admin', site: null };
  }

  // Client auth: "client:{slug}:{password}"
  if (cookieValue.startsWith('client:')) {
    const firstColon = cookieValue.indexOf(':');
    const secondColon = cookieValue.indexOf(':', firstColon + 1);
    if (firstColon > 0 && secondColon > firstColon) {
      const slug = cookieValue.slice(firstColon + 1, secondColon);
      const password = cookieValue.slice(secondColon + 1);
      const { data: clients } = await getClients(ghToken);
      const client = clients[slug];
      if (client && !client.cancelled_at && client.password_hash === hashPassword(password)) {
        return { authenticated: true, role: 'client', site: slug };
      }
    }
  }

  return { authenticated: false, role: 'none', site: null };
}
