import { execSync } from 'child_process';
import { resolve } from 'node:path';
import os from 'os';
import fs from 'fs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Brak wymaganej zmiennej środowiskowej: ${name}`);
  return value;
}

const HOST = requireEnv('FTP_HOST');
const PORT = Number(process.env.FTP_PORT || 21);
const USER = requireEnv('FTP_USER');
const PASS = requireEnv('FTP_PASSWORD');
const REMOTE_ROOT = requireEnv('FTP_REMOTE_ROOT');
const SECRET_KEY = requireEnv('SECRET_KEY');
const DEPLOY_URL = requireEnv('DEPLOY_URL');

function curlGet(url) {
  const curl = os.platform() === 'win32' ? 'curl.exe' : 'curl';
  return execSync(`${curl} -s -m 60 "${url}"`, { encoding: 'utf8', timeout: 65000 });
}

function curlPost(filePath, url) {
  const curl = os.platform() === 'win32' ? 'curl.exe' : 'curl';
  return execSync(`${curl} -s -m 120 -F "build_zip=@${filePath}" "${url}"`, { encoding: 'utf8', timeout: 130000 });
}

async function deployTurbo() {
  const tmp = './temp_deploy';
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true });
  fs.mkdirSync(tmp);

  const phpPath = './dist/deploy-turbo.php';
  if (!fs.existsSync(phpPath)) {
    console.log('Brak deploy-turbo.php w dist, pomijam turbo');
    return false;
  }

  console.log('Pakowanie dist/ do ZIP...');
  if (os.platform() === 'win32') {
    execSync(`powershell -Command "Compress-Archive -Path ./dist/* -DestinationPath ${tmp}/build.zip -Force"`);
  } else {
    execSync(`cd dist && zip -r ../${tmp}/build.zip .`);
  }

  console.log('Wysylanie deploy-turbo.php na serwer...');
  const { default: PromiseFtp } = await import('promise-ftp');
  try {
    const ftp = new PromiseFtp();
    await ftp.connect({
      host: HOST, port: PORT, user: USER, password: PASS,
      connTimeout: 30000, pasvTimeout: 60000,
    });
    const phpTemplate = fs.readFileSync(phpPath, 'utf8');
    if (!phpTemplate.includes('__DEPLOY_SECRET_KEY__')) {
      throw new Error('deploy-turbo.php nie zawiera znacznika __DEPLOY_SECRET_KEY__.');
    }
    const phpData = Buffer.from(phpTemplate.replace('__DEPLOY_SECRET_KEY__', SECRET_KEY), 'utf8');
    await ftp.put(phpData, `./${REMOTE_ROOT}/deploy-turbo.php`);
    await ftp.end();
    console.log('  deploy-turbo.php OK');
  } catch (e) {
    console.log('Blad uploadu PHP:', e.message.substring(0, 200));
    fs.rmSync(tmp, { recursive: true });
    return false;
  }

  console.log('Wysylanie build.zip przez HTTP POST...');
  try {
    const postUrl = `${DEPLOY_URL}/deploy-turbo.php?key=${SECRET_KEY}`;
    const out = curlPost(`${tmp}/build.zip`, postUrl);
    if (out.includes('OK')) {
      console.log('  build.zip OK (przez HTTP)');
    } else {
      console.log('Blad HTTP uploadu:', out.substring(0, 200));
      fs.rmSync(tmp, { recursive: true });
      return false;
    }
  } catch (e) {
    console.log('Blad HTTP uploadu:', e.message.substring(0, 200));
    fs.rmSync(tmp, { recursive: true });
    return false;
  }

  console.log('Rozpakowywanie...');
  try {
    const out = curlGet(`${DEPLOY_URL}/deploy-turbo.php?key=${SECRET_KEY}`);
    if (out.includes('SUKCES')) {
      console.log('Deploy OK (zip).');
      fs.rmSync(tmp, { recursive: true });
      return true;
    }
    console.log('Blad unzipu:', out.substring(0, 200));
  } catch (e) {
    console.log('Blad wywolania:', e.message.substring(0, 200));
  }

  fs.rmSync(tmp, { recursive: true });
  return false;
}

async function deployFiles() {
  console.log('Fallback: wysylanie plikow...');
  const { default: FtpDeploy } = await import('ftp-deploy');
  const ftpDeploy = new FtpDeploy();
  let count = 0;
  ftpDeploy.on('uploading', () => { count++; });
  await ftpDeploy.deploy({
    user: USER, password: PASS, host: HOST, port: PORT,
    localRoot: resolve('./dist'),
    remoteRoot: REMOTE_ROOT,
    include: ['*', '**/*'],
    deleteRemote: false,
    forcePasv: true,
  });
  console.log(`Wyslano ${count} plikow. OK.`);
}

const ok = await deployTurbo();
if (!ok) await deployFiles();
