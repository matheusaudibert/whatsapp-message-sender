const MENSAGEM_APROVADO = (nome) => `Olá *${nome}*! 👋
Passando para te lembrar que *você está confirmado(a)* no Meetup presencial do *Servidor dos Programadores*, que acontece *neste sábado (07/02)*, em *São Paulo*, na *Oracle* 🚀

*📍 Local*: Oracle do Brasil Sistemas
Rua Dr. José Áureo Bustamante, 455 – Chácara Santo Antônio (Zona Sul)
*🕘 Horário*: das *9h* às *12h*

🧑‍💻 Teremos *3 palestras imperdíveis* com profissionais que já atuam na área:
- *Eric Dallo* (Staff Software Engineer no Nubank)
- *Eduarda Alves* (Front-end Sênior no Itaú Unibanco)
- *Matheus Hugolini* (Engenheiro de Software Júnior no Itaú Unibanco)

*☕ Coffee break oferecido pela Oracle* durante o evento.

💙 Será um momento incrível para *networking, troca de conhecimento e conexão* com outros devs da comunidade.

👉 Entre no grupo do *Meetup*: https://chat.whatsapp.com/GtsQzDcQd1QDldwI5qkcZc
👉 Entre no nosso *Discord*: https://discord.gg/programador

_Contamos com a sua presença!_`;

const MENSAGEM_ESPERA = (nome) => `Olá *${nome}*! 👋
Obrigado pelo interesse no meetup presencial do *Servidor dos Programadores* 💙

Devido à limitação de capacidade do local, as vagas foram aprovadas por ordem de inscrição. No momento, *você não está entre os aprovados* para participar presencialmente e *ficará em fila de espera*.

👉 Para participar do evento, *é necessário estar aprovado*.
👉 Caso alguma vaga seja liberada, entraremos em contato para avisar.

*⚠️ Mas não desanime!*
Estamos organizando novos meetups e eventos, com mais vagas e novas oportunidades para a comunidade 🚀

👉 Para ficar por dentro das próximas edições, novidades e conteúdos, entre no nosso Discord: https://discord.gg/programador

_Agradecemos muito o seu interesse e esperamos te ver em breve em um dos nossos próximos encontros!_`;

module.exports = {
  MENSAGEM_APROVADO,
  MENSAGEM_ESPERA
};
