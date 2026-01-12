import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ler diretórios em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos
// Caminhos
const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
const versionFilePath = path.join(__dirname, 'frontend', 'src', 'version.js');

// Função auxiliar para incrementar versão
const incrementVersion = (filePath, name) => {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Erro: ${name} package.json não encontrado.`);
        return null;
    }
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!pkg.version) pkg.version = "1.0.0";

    let parts = pkg.version.split('.').map(Number);
    parts[2] += 1;
    pkg.version = parts.join('.');

    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
    console.log(`✅ ${name} atualizado: -> ${pkg.version}`);
    return pkg.version;
};

// 1. Atualizar Frontend
const newVersionFrontend = incrementVersion(frontendPackagePath, 'Frontend');

// 2. Atualizar Backend (Sincronizando versões ou incrementando independente)
// Para simplificar, vou incrementar o backend também para garantir que o Render perceba a mudança
const newVersionBackend = incrementVersion(backendPackagePath, 'Backend');

if (!newVersionFrontend) process.exit(1);

const newVersion = newVersionFrontend;

// 4. Criar/Atualizar o arquivo src/version.js
const versionFileContent = `export const appVersion = "${newVersion}";\n`;

const dir = path.dirname(versionFilePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(versionFilePath, versionFileContent);

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