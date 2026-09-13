import { describe, it, expect } from 'vitest';
import { buildRemoteDeployDir, normalizeFtpPath, sanitizeSubdomain } from './ftpDeploy';

describe('ftpDeploy helpers', () => {
  it('sanitizes subdomain into safe directory token', () => {
    expect(sanitizeSubdomain('  Acme.Co  ')).toBe('acme-co');
    expect(sanitizeSubdomain('a__b')).toBe('a-b');
    expect(sanitizeSubdomain('---a---b---')).toBe('a-b');
  });

  it('normalizes ftp paths (backslashes, slashes, trailing slash)', () => {
    expect(normalizeFtpPath('C:\\sites\\', 'acme', '/www/')).toBe('C:/sites/acme/www');
    expect(normalizeFtpPath('/var/www/', 'acme/')).toBe('/var/www/acme');
  });

  it('builds remote deploy dir with optional subdomain', () => {
    expect(buildRemoteDeployDir({ remoteRootDir: '/sites', subdomain: 'acme' })).toBe(
      '/sites/acme',
    );
    expect(buildRemoteDeployDir({ remoteRootDir: '/sites/' })).toBe('/sites');
  });
});

