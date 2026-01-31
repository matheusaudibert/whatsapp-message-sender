const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { MENSAGEM_APROVADO, MENSAGEM_ESPERA } = require('./config');

const AUTH_FOLDER = './auth_info_baileys';

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`Usando Baileys versão: ${version.join('.')}`);

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.clear();
      console.log('='.repeat(50));
      console.log('ESCANEIE O QR CODE COM SEU WHATSAPP:');
      console.log('WhatsApp > Dispositivos conectados > Conectar dispositivo');
      console.log('='.repeat(50));
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const reason = DisconnectReason;

      console.log(`Desconectado. Código: ${statusCode}`);

      if (statusCode === reason.loggedOut) {
        console.log('Sessão encerrada. Delete auth_info_baileys e reinicie.');
        process.exit(0);
      } else {
        console.log('Reconectando em 3 segundos...');
        await new Promise(r => setTimeout(r, 3000));
        connectToWhatsApp();
      }
    }

    if (connection === 'open') {
      console.log('='.repeat(50));
      console.log('CONECTADO COM SUCESSO!');
      console.log('='.repeat(50));
      await processQueue(sock);
    }
  });

  return sock;
}

function readCsvAprovados(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);

    // Remove cabeçalho
    lines.shift();

    return lines
      .map(line => {
        const [firstName, phoneNumber] = line.split(',');
        // Ignora linhas sem nome ou telefone
        if (!firstName || !phoneNumber || phoneNumber.trim() === '') return null;
        return {
          name: firstName.trim(),
          phone: phoneNumber.trim() + '@s.whatsapp.net'
        };
      })
      .filter(item => item !== null);
  } catch (e) {
    console.error(`Erro ao ler CSV ${filePath}:`, e.message);
    return [];
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function processQueue(sock) {
  const aprovados = readCsvAprovados('./csv/celulares_aprovados.csv');

  console.log(`Carregados: ${aprovados.length} aprovados.`);

  for (let i = 0; i < aprovados.length; i++) {
    const pessoa = aprovados[i];
    const mensagem = MENSAGEM_APROVADO(pessoa.name);

    try {
      console.log(`\n[${i + 1}/${aprovados.length}] Enviando para ${pessoa.name} (${pessoa.phone})...`);

      // Verifica se o número existe no WhatsApp antes de enviar
      const [result] = await sock.onWhatsApp(pessoa.phone);

      if (result?.exists) {
        await sock.sendMessage(pessoa.phone, { text: mensagem });
        console.log('✅ Mensagem enviada com sucesso!');
      } else {
        console.log('❌ Número não registrado no WhatsApp.');
      }

      if (i < aprovados.length - 1) {
        console.log('⏳ Aguardando 10 segundos...');
        await delay(10000);
      }

    } catch (err) {
      console.error(`❌ Falha ao enviar para ${pessoa.name}:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('FIM DO ENVIO!');
  console.log('='.repeat(50));
}

console.log('Iniciando WhatsApp Sender...');
console.log('Aguarde o QR Code aparecer...\n');
connectToWhatsApp().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
