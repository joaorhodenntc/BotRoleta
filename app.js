const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6412741362:AAHFY_V63FdRjog1L73SMsHL1nex_GaQGVc', { polling: true });
const chatId = '2095687147';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('load', async () => {
    let consecutiveParBrasileira = 0;
    let consecutiveImparBrasileira = 0;
    let greens = 0;
    let reds = 0;
    let firstNumBrasileira = null;
    let secondNumBrasileira = null;
    let threeNumBrasileira = null;
    let alertMessageBrasileira = null;
    let listaBrasileira = [];

    let consecutiveParAoVivo = 0;
    let consecutiveImparAoVivo = 0;
    let firstNumAoVivo = null;
    let secondNumAoVivo = null;
    let threeNumAoVivo = null;
    let alertMessageAoVivo = null;
    let listaAoVivo = [];

    while (true) {
      const agora = new Date(); 
      const horaAtual = agora.getHours(); 
      const minutos = agora.getMinutes();
      
      if (horaAtual === 3 && minutos === 0) {
        greens = 0; 
        reds = 0;
      }
      
      let novaListaBrasileira = await atualizaListaRoletaBrasileira(page);
      if (!listasIguais(listaBrasileira, novaListaBrasileira)) {
        listaBrasileira = novaListaBrasileira;

        if(consecutiveParBrasileira === 0 || consecutiveImparBrasileira === 0){
          if(alertMessageBrasileira){
            bot.deleteMessage(chatId, alertMessageBrasileira);
            alertMessageBrasileira = null;
          }
        }
  
          if(consecutiveParBrasileira === 5){
              firstNumBrasileira = listaBrasileira[0];
              if(firstNumBrasileira % 2!==0){
                greens++
                bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNumBrasileira +")\n"+greens+" x "+reds);
              } 
          }
          if(consecutiveParBrasileira === 6){
            secondNumBrasileira = listaBrasileira[0];
            if(secondNumBrasileira % 2!==0){
              greens++;
              bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNumBrasileira +" | " + secondNumBrasileira +")\n"+greens+" x "+reds);
            }
          }
          if(consecutiveParBrasileira === 7){
            threeNumBrasileira = listaBrasileira[0];
            if(threeNumBrasileira % 2!==0){
              greens++
              bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNumBrasileira +" | " + secondNumBrasileira +" | " + threeNumBrasileira +")\n"+greens+" x "+reds);
            }else{
              reds++;
              bot.sendMessage(chatId,"RED 🔻(" + firstNumBrasileira +" | " + secondNumBrasileira +" | " + threeNumBrasileira +")\n"+greens+" x "+reds);
            }
          }
          if(consecutiveImparBrasileira === 5){
            firstNumBrasileira = listaBrasileira[0];
            if(firstNumBrasileira % 2===0){
              greens++
              bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNumBrasileira +")\n"+greens+" x "+reds);
            } 
        }
        if(consecutiveImparBrasileira === 6){
          secondNumBrasileira = listaBrasileira[0];
          if(secondNumBrasileira % 2===0){
            greens++;
            bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNumBrasileira +" | " + secondNumBrasileira +")\n"+greens+" x "+reds);
          }
        }
        if(consecutiveImparBrasileira === 7){
          threeNumBrasileira = listaBrasileira[0];
          if(threeNumBrasileira % 2===0){
            greens++
            bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNumBrasileira +" | " + secondNumBrasileira +" | " + threeNumBrasileira +")\n"+greens+" x "+reds);
          }else{
            reds++;
            bot.sendMessage(chatId,"RED 🔻(" + firstNumBrasileira +" | " + secondNumBrasileira +" | " + threeNumBrasileira +")\n"+greens+" x "+reds);
          }
        }
        if (listaBrasileira[0] % 2 === 0 && listaBrasileira[0] !== '0') {
            consecutiveParBrasileira++; 
            consecutiveImparBrasileira =0;
            console.log("Roleta Brasileira: ")
            console.log(listaBrasileira[0] + " - par");
            console.log("Pares consecutivos: " + consecutiveParBrasileira);
            console.log("--------------------")
            if(consecutiveParBrasileira === 4 ){
              let message = "🚨Atentos possivel entrada ROLETA BRASILEIRA";
              bot.sendMessage(chatId, message).then(msg => {
                  alertMessageBrasileira = msg.message_id;
              });
          }
            if(consecutiveParBrasileira === 5 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números ímpares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + listaBrasileira[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        } if (listaBrasileira[0] % 2 !== 0 ) {
            consecutiveImparBrasileira++;
            consecutiveParBrasileira=0;
            console.log("Roleta Brasileira: ")
            console.log(listaBrasileira[0] + " - ímpar");
            console.log("Ímpares consecutivos: " + consecutiveImparBrasileira);
            console.log("--------------------")
            if(consecutiveImparBrasileira === 4 ){
              let message = "🚨Atentos possivel entrada ROLETA BRASILEIRA";
              bot.sendMessage(chatId, message).then(msg => {
                  alertMessageBrasileira = msg.message_id;
              });
          }
            if(consecutiveImparBrasileira === 5 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA BRASILEIRA\n🔥 Entrada nos números pares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + listaBrasileira[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        }
        if( listaBrasileira[0] === '0'){
          consecutiveImparBrasileira=0;
          consecutiveParBrasileira = 0;
        }
      }
      
      let novaListaAoVivo = await atualizaListaRoletaAoVivo(page);
      if(!listasIguais(listaAoVivo,novaListaAoVivo)){
        listaAoVivo = novaListaAoVivo;

        if(consecutiveParAoVivo === 0 || consecutiveImparAoVivo === 0){
          if(alertMessageAoVivo){
            bot.deleteMessage(chatId, alertMessageAoVivo);
            alertMessageAoVivo = null;
          }
        }
  
          if(consecutiveParAoVivo === 5){
            firstNumAoVivo = listaAoVivo[0];
              if(firstNumAoVivo % 2!==0){
                greens++
                bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNumAoVivo +")\n"+greens+" x "+reds);
              } 
          }
          if(consecutiveParAoVivo === 6){
            secondNumAoVivo = listaAoVivo[0];
            if(secondNumAoVivo % 2!==0){
              greens++;
              bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNumAoVivo +" | " + secondNumAoVivo +")\n"+greens+" x "+reds);
            }
          }
          if(consecutiveParAoVivo === 7){
            threeNumAoVivo = listaAoVivo[0];
            if(threeNumAoVivo % 2!==0){
              greens++
              bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNumAoVivo +" | " + secondNumAoVivo +" | " + threeNumAoVivo +")\n"+greens+" x "+reds);
            }else{
              reds++;
              bot.sendMessage(chatId,"RED 🔻(" + firstNumAoVivo +" | " + secondNumAoVivo +" | " + threeNumAoVivo +")\n"+greens+" x "+reds);
            }
          }
          if(consecutiveImparAoVivo === 5){
            firstNumAoVivo = listaAoVivo[0];
            if(firstNumAoVivo % 2===0){
              greens++
              bot.sendMessage(chatId, "GREEN SG ✅ (" + firstNumAoVivo +")\n"+greens+" x "+reds);
            } 
        }
        if(consecutiveImparAoVivo === 6){
          secondNumAoVivo = listaAoVivo[0];
          if(secondNumAoVivo % 2===0){
            greens++;
            bot.sendMessage(chatId, "GREEN G1 ✅ (" + firstNumAoVivo +" | " + secondNumAoVivo +")\n"+greens+" x "+reds);
          }
        }
        if(consecutiveImparAoVivo === 7){
          threeNumAoVivo = listaAoVivo[0];
          if(threeNumAoVivo % 2===0){
            greens++
            bot.sendMessage(chatId, "GREEN G2 ✅ (" + firstNumAoVivo +" | " + secondNumAoVivo +" | " + threeNumAoVivo +")\n"+greens+" x "+reds);
          }else{
            reds++;
            bot.sendMessage(chatId,"RED 🔻(" + firstNumAoVivo +" | " + secondNumAoVivo +" | " + threeNumAoVivo +")\n"+greens+" x "+reds);
          }
        }
        if (listaAoVivo[0] % 2 === 0 && listaAoVivo[0] !== '0') {
            consecutiveParAoVivo++; 
            consecutiveImparAoVivo =0;
            console.log("Roleta Ao Vivo: ")
            console.log(listaAoVivo[0] + " - par");
            console.log("Pares consecutivos: " + consecutiveParAoVivo);
            console.log("--------------------")
            if(consecutiveParAoVivo === 4 ){
              let message = "🚨Atentos possivel entrada ROLETA AO VIVO";
              bot.sendMessage(chatId, message).then(msg => {
                alertMessageAoVivo = msg.message_id;
              });
          }
            if(consecutiveParAoVivo === 5 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA AO VIVO\n🔥 Entrada nos números ímpares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + listaAoVivo[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        } if (listaAoVivo[0] % 2 !== 0 ) {
          consecutiveImparAoVivo++;
          consecutiveParAoVivo=0;
          console.log("Roleta Ao Vivo: ")
            console.log(listaAoVivo[0] + " - ímpar");
            console.log("Ímpares consecutivos: " + consecutiveImparAoVivo);
            console.log("--------------------")
            if(consecutiveImparAoVivo === 4 ){
              let message = "🚨Atentos possivel entrada ROLETA AO VIVO";
              bot.sendMessage(chatId, message).then(msg => {
                alertMessageAoVivo = msg.message_id;
              });
          }
            if(consecutiveImparAoVivo === 5 ){
                let message = "*🇧🇷 ENTRADA CONFIRMADA 🇧🇷\n\n💻 Roleta:  ROLETA AO VIVO\n🔥 Entrada nos números pares\n🛟 Fazer até 2 proteções!\n\n🧨 Último número: " + listaAoVivo[0] +"*"
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            }
        }
        if( listaAoVivo[0] === '0'){
          consecutiveImparAoVivo=0;
          consecutiveParAoVivo = 0;
        }
      }
      }


      await new Promise(resolve => setTimeout(resolve, 5000));
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

//arrumar 0, não está contando quando dá green