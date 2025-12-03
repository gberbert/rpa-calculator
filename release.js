import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ler diretórios em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos
const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');
const versionFilePath = path.join(__dirname, 'frontend', 'src', 'version.js');

// Verifica se o package.json existe
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Erro: Arquivo frontend/package.json não encontrado.');
    process.exit(1);
}

// 1. Ler o package.json atual
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.version) {
    packageJson.version = "1.0.0";
}

const currentVersion = packageJson.version;

// 2. Incrementar a versão (Lógica: Patch 0.0.X)
let versionParts = currentVersion.split('.').map(Number);
versionParts[2] += 1; 
const newVersion = versionParts.join('.');

// 3. Atualizar o package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 4. Criar/Atualizar o arquivo src/version.js
const versionFileContent = `export const appVersion = "${newVersion}";\n`;

const dir = path.dirname(versionFilePath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`✅ Versão atualizada: ${currentVersion} -> ${newVersion}`);

// 5. Executar comandos GIT com stdio: 'inherit' para evitar ENOBUFS
try {
    console.log('📦 Adicionando arquivos ao Git...');
    // O 'stdio: inherit' joga a saída direto pro terminal e evita estourar o buffer
    execSync('git add .', { stdio: 'inherit' });

    console.log('🔖 Criando commit...');
    execSync(`git commit -m "versão ${newVersion}"`, { stdio: 'inherit' });

    try {
        console.log('🚀 Enviando para o repositório (Push)...');
        execSync('git push', { stdio: 'inherit' });
    } catch (pushError) {
        console.log('⚠️ Aviso: Não foi possível fazer o push (verifique o remote).');
    }

    console.log('🎉 Deploy realizado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao executar comandos do Git:', error.message);
}