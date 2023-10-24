const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('load', async () => {

    let listaRoletaBrasileira = [];
    let roletaBRconsecutivePar = 0;
    let roletaBRconsecutiveImpar = 0;
    const roletaBr = "ROLETA BRASILEIRA";
  
    let alertMessageId = null;

    let listaRoletaAoVivo = [];
    let roletaAoVivoconsecutivePar = 0;
    let roletaAoVivoconsecutiveImpar = 0;
    const roletaAoVivo = "ROLETA AO VIVO"


    const bot = new TelegramBot('6412741362:AAHFY_V63FdRjog1L73SMsHL1nex_GaQGVc', { polling: true });
    const chatId = '2095687147';

      while(true){
        let listaNovaRoletaBrasileira = await atualizaListaRoletaBrasileira(page);
        let listaNovaRoletaAoVivo = await atualizaListaRoletaAoVivo(page);

      if(!listasIguais(listaRoletaBrasileira, listaNovaRoletaBrasileira)){
        listaRoletaBrasileira = listaNovaRoletaBrasileira;

        if(roletaBRconsecutivePar === 0 || roletaBRconsecutiveImpar === 0){
          if(alertMessageId){
            bot.deleteMessage(chatId, alertMessageId);
            alertMessageId = null;
          }
        }

        analisaGreen(listaRoletaBrasileira,roletaBRconsecutivePar,roletaBRconsecutiveImpar,bot,chatId);
          
        if (listaRoletaBrasileira[0] % 2 === 0) {
          roletaBRconsecutivePar++;
          roletaBRconsecutiveImpar = 0;
        }
          if (listaRoletaBrasileira[0] % 2 !== 0) {
            roletaBRconsecutiveImpar++;
            roletaBRconsecutivePar = 0;
        }

        if(roletaBRconsecutivePar === 2 || roletaBRconsecutiveImpar===2){
          let message = "🚨POSSÍVEL ENTRADA [" + roletaBr + "]";
          bot.sendMessage(chatId, message).then(msg => {
              alertMessageId = msg.message_id;
          });
        }

        console.log("Roleta Brasileira: ")
        analisaRoleta(listaRoletaBrasileira,roletaBRconsecutivePar,roletaBRconsecutiveImpar,bot,chatId,roletaBr);
        console.log("--------------------")
      }

      if(!listasIguais(listaRoletaAoVivo, listaNovaRoletaAoVivo)){
        listaRoletaAoVivo = listaNovaRoletaAoVivo;

        analisaGreen(listaRoletaAoVivo,roletaAoVivoconsecutivePar,roletaAoVivoconsecutiveImpar,bot,chatId);

        if(listaRoletaAoVivo[0] % 2 ===0){
          roletaAoVivoconsecutivePar++;
          roletaAoVivoconsecutiveImpar = 0;
        }

        if(listaRoletaAoVivo[0] % 2 !==0){
          roletaAoVivoconsecutiveImpar++;
          roletaAoVivoconsecutivePar = 0;
        }

        console.log("Roleta ao vivo: ")
        analisaRoleta(listaRoletaAoVivo,roletaAoVivoconsecutivePar,roletaAoVivoconsecutiveImpar,bot,chatId,roletaAoVivo);
        console.log("--------------------")
        
      }
    
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  );

  await page.goto('https://casino.betfair.com/pt-br/c/roleta');
})();

async function atualizaListaRoletaBrasileira(page) {
  const elements = await page.$$('.number');
  let lista = [];

  for (let x = 0; x < 8; x++) {
      const elem = elements[x];
      const elemText = await page.evaluate(element => element.textContent, elem);
      lista.push(elemText);
  }

  return lista;
}

async function atualizaListaRoletaAoVivo(page) {
  const elements = await page.$$('.number');
  let lista = [];

  for (let x = 8; x < 16; x++) {
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

function analisaRoleta(lista, consecutivePar,consecutiveImpar,bot,chatId, nomeRoleta){

  if (lista[0] % 2 === 0 && lista[0] !== '0') {
      console.log(lista[0] + " - par");
      console.log("Pares consecutivos: " + consecutivePar);
      if(consecutivePar === 3 ){
          let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  "+ nomeRoleta + "\n🔥 Entrada nos números ímpares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*"
          bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      }
  } if (lista[0] % 2 !== 0 ) {
      console.log(lista[0] + " - ímpar");
      console.log("Ímpares consecutivos: " + consecutiveImpar);
      if(consecutiveImpar === 3 ){
          let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  "+ nomeRoleta + "\n🔥 Entrada nos números pares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + lista[0] +"*"
          bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      }
  }
  if( lista[0] === '0'){
    consecutiveImpar=0;
    consecutivePar = 0;
  }


}

function analisaGreen(lista, consecutivePar,consecutiveImpar,greens,reds,bot,chatId){
  let firstNum = null;
  let secondNum = null;
  let threeNum = null;

  if(consecutivePar === 3){
    firstNum = lista[0];
      bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNum +")");
    } 


if(consecutivePar === 4){
  firstNum = lista[1];
  secondNum = lista[0];
  if(secondNum % 2!==0){
    bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")");
  }
}
if(consecutivePar === 5){
  firstNum = lista[2];
  secondNum = lista[1];
  threeNum = lista[0];
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
  firstNum = lista[1];
  secondNum = lista[0];
if(secondNum % 2===0){
  bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNum +" | " + secondNum +")");
}
}
if(consecutiveImpar === 5){
  firstNum = lista[2];
  secondNum = lista[1];
  threeNum = lista[0];
if(threeNum % 2===0){
  bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNum +" | " + secondNum +" | " + threeNum +")");
}else{
  bot.sendMessage(chatId,"RED 🔻(" + firstNum +" | " + secondNum +" | " + threeNum +")");
}
}
}
