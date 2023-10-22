const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6412741362:AAHFY_V63FdRjog1L73SMsHL1nex_GaQGVc', { polling: true });
const chatId = '2095687147';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('load', async () => {
    let consecutivePar = 0;
    let consecutiveImpar = 0;
    let firstNum = null;
    let secondNum = null;
    let alertMessageId = null;
    let lista = [];

    while (true) {
      let novaLista = await atualizaLista(page);
      if (!listasIguais(lista, novaLista)) {
        lista = novaLista;

        if(consecutivePar === 0 || consecutiveImpar === 0){
          if(alertMessageId){
            bot.deleteMessage(chatId, alertMessageId);
            alertMessageId = null;
          }
        }
  
          if(consecutivePar === 3){
              firstNum = lista[0];
              if(firstNum % 2!==0){
                bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNum +")");
              } 
          }
          if(consecutivePar === 4){
            secondNum = lista[0];
            if(secondNum % 2!==0){
              bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")");
            }
          }
          if(consecutivePar === 5){
            const threeNum = lista[0];
            if(threeNum % 2!==0){
              bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNum +" | " + secondNum +" | " + threeNum +")");
            }else{
              bot.sendMessage(chatId,"RED 🔻(" + firstNum +" | " + secondNum +" | " + threeNum +")");
            }
          }
          if(consecutiveImpar === 3){
            firstNum = lista[0];
            if(firstNum % 2===0){
              bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNum +")");
            } 
        }
        if(consecutiveImpar === 4){
          secondNum = lista[0];
          if(secondNum % 2===0){
            bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")");
          }
        }
        if(consecutiveImpar === 5){
          const threeNum = lista[0];
          if(threeNum % 2===0){
            bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNum +" | " + secondNum +" | " + threeNum +")");
          }else{
            bot.sendMessage(chatId,"RED 🔻(" + firstNum +" | " + secondNum +" | " + threeNum +")");
          }
        }
        if (lista[0] % 2 === 0 && lista[0] !== '0') {
            consecutivePar++; 
            consecutiveImpar =0;
            console.log(lista[0] + " - par");
            console.log("Pares consecutivos: " + consecutivePar);
            if(consecutivePar === 2 ){
              let message = "🚨Atentos possivel entrada";
              bot.sendMessage(chatId, message).then(msg => {
                  alertMessageId = msg.message_id;
              });
          }
            if(consecutivePar === 3 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números ímpares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        } if (lista[0] % 2 !== 0 ) {
            consecutiveImpar++;
            consecutivePar=0;
            console.log(lista[0] + " - ímpar");
            console.log("Ímpares consecutivos: " + consecutiveImpar);
            if(consecutiveImpar === 2 ){
              let message = "🚨Atentos possivel entrada";
              bot.sendMessage(chatId, message).then(msg => {
                  alertMessageId = msg.message_id;
              });
          }
            if(consecutiveImpar === 3 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números pares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        }
        if( lista[0] === '0'){
          consecutiveImpar=0;
          consecutivePar = 0;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
  }
  });

  await page.goto('https://casino.betfair.com/pt-br/c/roleta');
})();

async function atualizaLista(page) {
  const elements = await page.$$('.number');
  let lista = [];

  for (let x = 0; x < 8; x++) {
      const elem = elements[x];
      const elemText = await page.evaluate(element => element.textContent, elem);
      lista.push(elemText);
  }

  return lista;
}

function listasIguais(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
  }
  return true;
}

//arrumar 0, não está contando quando dá green