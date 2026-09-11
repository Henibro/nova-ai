import crypto from 'crypto';

export interface PrivacyConfig {
  anonymizeIp: boolean;
  stripQueryPii: boolean;
  honorDNT: boolean;
  cookieFree: boolean;
  saltRotationDays: number;
}

export const defaultPrivacyConfig: PrivacyConfig = {
  anonymizeIp: true,
  stripQueryPii: true,
  honorDNT: true,
  cookieFree: true,
  saltRotationDays: 1,
};

// Daily rotating salt for one-way privacy-safe hashing
let currentSalt = crypto.randomBytes(16).toString('hex');
let lastSaltRotation = Date.now();

function getRotatingSalt(): string {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  if (Date.now() - lastSaltRotation > ONE_DAY_MS) {
    currentSalt = crypto.randomBytes(16).toString('hex');
    lastSaltRotation = Date.now();
  }
  return currentSalt;
}

/**
 * Anonymizes raw IP address.
 * IPv4: Zeroes the last octet (192.168.1.123 -> 192.168.1.0) and computes a privacy hash.
 * IPv6: Zeroes the last 80 bits.
 * Raw IP is NEVER stored.
 */
export function anonymizeIp(rawIp?: string): { maskedSubnet: string; privacyHash: string } {
  if (!rawIp || rawIp === '127.0.0.1' || rawIp === '::1') {
    return { maskedSubnet: '127.0.0.0', privacyHash: 'local_anon' };
  }

  // Handle IPv4
  if (rawIp.includes('.')) {
    const parts = rawIp.split('.');
    const masked = parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : '0.0.0.0';
    const hash = crypto
      .createHash('sha256')
      .update(rawIp + getRotatingSalt())
      .digest('hex')
      .substring(0, 16);
    return { maskedSubnet: masked, privacyHash: `ip_${hash}` };
  }

  // Handle IPv6
  const masked = rawIp.substring(0, rawIp.lastIndexOf(':')) + ':0000';
  const hash = crypto
    .createHash('sha256')
    .update(rawIp + getRotatingSalt())
    .digest('hex')
    .substring(0, 16);
  return { maskedSubnet: masked, privacyHash: `ip6_${hash}` };
}

/**
 * Strips PII query parameters (e.g. token, email, name, pwd, ssn, card)
 */
export function sanitizeUrl(urlStr?: string): string {
  if (!urlStr) return '/';
  try {
    const parsed = new URL(urlStr, 'http://localhost');
    const sensitiveKeys = ['token', 'key', 'auth', 'email', 'name', 'password', 'pwd', 'ssn', 'card', 'cvv'];
    for (const key of sensitiveKeys) {
      if (parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, '[REDACTED]');
      }
    }
    return parsed.pathname + (parsed.search ? parsed.search : '');
  } catch {
    return urlStr;
  }
}

/**
 * Parses user agent string to extract basic browser and OS without storing the raw user-agent string.
 */
export function parseUserAgent(ua?: string): { browser: string; os: string; device: 'desktop' | 'mobile' | 'tablet' } {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'desktop' };

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let os = 'Windows';
  if (ua.includes('Mac OS') || ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (ua.includes('Mobile') || ua.includes('Android')) device = 'mobile';
  if (ua.includes('iPad') || ua.includes('Tablet')) device = 'tablet';

  return { browser, os, device };
}

/**
 * Filters and sanitizes event properties to prevent accidental PII leakage.
 */
export function sanitizeProperties(props: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const forbiddenKeys = ['email', 'password', 'token', 'credit_card', 'phone', 'ssn', 'secret'];

  for (const [key, value] of Object.entries(props)) {
    const lowerKey = key.toLowerCase();
    if (forbiddenKeys.some((f) => lowerKey.includes(f))) {
      continue; // drop PII property entirely
    }
    // Limit string length to 256 chars
    if (typeof value === 'string') {
      sanitized[key] = value.substring(0, 256);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeProperties(value);
    }
  }

  return sanitized;
}
