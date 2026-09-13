import fs from 'node:fs';
import path from 'node:path';

const adminDir = path.resolve('public/admin');
const productionConfigPath = path.join(adminDir, 'config.yml');
const localConfigPath = path.join(adminDir, 'config.local.yml');

if (!fs.existsSync(productionConfigPath)) {
  throw new Error('Brak public/admin/config.yml. Uruchom najpierw npm run cms:gen.');
}

const productionConfig = fs.readFileSync(productionConfigPath, 'utf8');
const localBackendConfig = productionConfig.replace(
  'backend:\n  name: github',
  'backend:\n  name: git-gateway',
);
const localConfig = [
  '# Konfiguracja lokalna generowana przez npm run cms:local.',
  '# Backend zapisuje zmiany przez proxy Decap na http://localhost:8081.',
  'local_backend:',
  '  url: http://localhost:8081/api/v1',
  '  allowed_hosts:',
  '    - localhost',
  '    - 127.0.0.1',
  localBackendConfig,
].join('\n');

fs.writeFileSync(localConfigPath, localConfig, 'utf8');
console.log(`Zapisano lokalną konfigurację CMS: ${localConfigPath}`);
