import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { buildRemoteDeployDir } from '@/utils/ftpDeploy';
import cliProgress from 'cli-progress';

type EnvConfig = {
  ftpHost: string;
  ftpPort: number;
  ftpUser: string;
  ftpPassword: string;
  remoteRootDir: string;
  localDir: string;
  subdomain?: string;
  dryRun: boolean;
};

function getBooleanEnv(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function loadConfig(): EnvConfig {
  const ftpHost = requireEnv('FTP_HOST');
  const ftpPort = parseInt(process.env.FTP_PORT || '21', 10);
  if (isNaN(ftpPort)) throw new Error('FTP_PORT must be a valid number');

  const ftpUser = requireEnv('FTP_USER');
  const ftpPassword = requireEnv('FTP_PASSWORD');

  const remoteRootDir =
    process.env.FTP_REMOTE_ROOT_DIR ?? process.env.FTP_REMOTE_ROOT ?? '/sites';
  const localDir = process.env.FTP_LOCAL_DIR || 'dist';
  const subdomain = process.env.FTP_SUBDOMAIN || undefined;
  const dryRun = getBooleanEnv('FTP_DRY_RUN', false);

  return { ftpHost, ftpPort, ftpUser, ftpPassword, remoteRootDir, localDir, subdomain, dryRun };
}

async function main() {
  const config = loadConfig();

  const require = createRequire(import.meta.url);
  const FtpDeploy = require('ftp-deploy');

  const localDirAbs = resolve(process.cwd(), config.localDir);
  const remoteDeployDir = buildRemoteDeployDir({
    remoteRootDir: config.remoteRootDir,
    subdomain: config.subdomain,
  });

  if (config.dryRun) {
    console.log(`[DRY RUN] Local: ${localDirAbs}`);
    console.log(`[DRY RUN] Remote dir: ${remoteDeployDir}`);
    return;
  }

  const progressBar = new cliProgress.SingleBar(
    {
      format: 'Deploying | {bar} | {percentage}% | {value}/{total} Files | {file}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  );
  let progressStarted = false;

  try {
    const ftpDeploy = new FtpDeploy();

    ftpDeploy.on('uploading', (data: any) => {
      if (data.totalFilesCount > 0) {
        if (!progressStarted) {
          progressBar.start(data.totalFilesCount, 0, { file: '' });
          progressStarted = true;
        }
        progressBar.update(data.transferredFileCount, { file: data.filename });
      }
    });

    ftpDeploy.on('upload-res', (data: any) => {
      progressBar.update(data.transferredFileCount, { file: data.filename });
    });

    await ftpDeploy.deploy({
      user: config.ftpUser,
      password: config.ftpPassword,
      host: config.ftpHost,
      port: config.ftpPort,
      localRoot: localDirAbs,
      remoteRoot: remoteDeployDir,
      include: ['*', '**/*'],
      exclude: [],
      deleteRemote: false,
      forcePasv: true,
    });

    progressBar.stop();
    console.log('\n✅ Deployment complete!');
    console.log(`Target: ${config.ftpHost}:${remoteDeployDir}`);
  } catch (err) {
    progressBar.stop();
    console.error('\n❌ FTP deploy failed:', err);
    process.exit(1);
  }
}

main();
