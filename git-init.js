const { execSync } = require('child_process');
const readline = require('readline');

// Configuração para ler entrada do usuário no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores para o terminal (Melhora a visualização)
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m"
};

console.log(`${colors.cyan}--- Script de Inicialização Git Automática ---${colors.reset}`);
console.log('Este script executará: init, add, commit, branch main, remote add e push.');
console.log('Modo de uso: node setup-git.js [URL_DO_REPO] ou apenas node setup-git.js para interativo.\n');

// Função auxiliar para rodar comandos
const runCommand = (command) => {
  try {
    // stdio: 'inherit' permite que você veja a saída do git (cores, progresso) no seu terminal
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}Erro ao executar: ${command}${colors.reset}`);
    return false;
  }
};

const executeGitSequence = (remoteUrl) => {
    if (!remoteUrl || !remoteUrl.trim()) {
      console.log(`${colors.red}URL inválida ou vazia. Operação cancelada.${colors.reset}`);
      rl.close();
      return;
    }

    const url = remoteUrl.trim();

    console.log(`\n${colors.green}1. Inicializando repositório Git...${colors.reset}`);
    if (!runCommand('git init')) return rl.close();

    console.log(`\n${colors.green}2. Adicionando todos os arquivos...${colors.reset}`);
    if (!runCommand('git add .')) return rl.close();

    console.log(`\n${colors.green}3. Criando commit inicial...${colors.reset}`);
    // Tenta commitar. Se não houver mudanças (repo já existente), apenas avisa.
    try {
        execSync('git commit -m "Initial commit - Projeto Uma Casa Boa Pra Cachorro"', { stdio: 'inherit' });
    } catch (e) {
        console.log(`${colors.yellow}Aviso: Talvez não haja nada novo para commitar.${colors.reset}`);
    }

    console.log(`\n${colors.green}4. Definindo branch principal como 'main'...${colors.reset}`);
    runCommand('git branch -M main');

    console.log(`\n${colors.green}5. Configurando repositório remoto...${colors.reset}`);
    // Remove origin antigo se existir para evitar erro de duplicidade
    try { execSync('git remote remove origin', { stdio: 'ignore' }); } catch (e) {}
    
    if (!runCommand(`git remote add origin ${url}`)) return rl.close();

    console.log(`\n${colors.green}6. Enviando arquivos para o servidor (Push)...${colors.reset}`);
    if (runCommand('git push -u origin main')) {
        console.log(`\n${colors.cyan}>>> SUCESSO! Seu projeto está online. <<<${colors.reset}`);
    } else {
        console.log(`\n${colors.red}>>> O Push falhou. Verifique se a URL está correta e se você tem permissão.${colors.reset}`);
    }

    rl.close();
};

const startSetup = () => {
  // Verifica se a URL foi passada como argumento (ex: node setup-git.js https://...)
  // process.argv[0] é o node, [1] é o script, [2] é o primeiro argumento
  const argUrl = process.argv[2];

  if (argUrl) {
    console.log(`${colors.yellow}URL detectada via argumento: ${argUrl}${colors.reset}`);
    executeGitSequence(argUrl);
  } else {
    // Caso não tenha argumento, pergunta interativamente
    rl.question(`${colors.yellow}Cole a URL do repositório remoto (ex: https://github.com/seu-user/repo.git): ${colors.reset}`, (remoteUrl) => {
        executeGitSequence(remoteUrl);
    });
  }
};

// Inicia o script
startSetup();