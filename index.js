const login = require("@xaviabot/fca-unofficial");
const fs = require("fs");
const tu = require('./addon/tuimgg');
const long = require('./addon/longimgg');
const thuc = require("./addon/thucimgg");
const hao = require("./addon/haoimgg");
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ffmpeg = require("fluent-ffmpeg");

async function gpt(text) {
  const { ChatGPTAPI } = await import('chatgpt')
  const api = new ChatGPTAPI({ apiKey: "hehe" })

  const res = await api.sendMessage(text)
  return res.text
}
async function bard(text){
  const Bard = require('fix-esm').require('bard-ai').default;
  var myBard = new Bard({
    "__Secure-1PSID": "nah.",
    "__Secure-1PSIDTS":"nop",
});
  return myBard.ask(text) 
}
login({appState: JSON.parse(fs.readFileSync('fbstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
     console.log(`Logged in as ${api.getCurrentUserID()}`);
    api.sendMessage("Bot đã online", "100038873234133");
    api.listenMqtt(async(err, message) => {
        if(err){
         console.error(err)
        } 
        if(message.body == "long"){
            var msg= { body:"Nguyễn Thành Long\nBirthday: 27/03/2008",
            attachment: fs.createReadStream(long.getRandomImage())}
        api.sendMessage(msg, message.threadID)
        console.log(`Đã gửi ảnh cho ${message.senderID}`)
    }
        if(message.senderID == api.getCurrentUserID()){
         return;
        }
        if(message.body == "tú"){
            var msg= { body:"Đoàn Ngọc Tú\nBirthday: 20/12/2008",
            attachment: fs.createReadStream(tu.getRandomImage())}
        api.sendMessage(msg, message.threadID)
        console.log(`Đã gửi ảnh cho ${message.senderID}`)
    }
    if(message.body == "thức"){
        var msg= { body:"Nguyễn Chí Thức \nBirthday: 03/05/2009",
        attachment: fs.createReadStream(thuc.getRandomImage())}
    api.sendMessage(msg, message.threadID)
    console.log(`Đã gửi ảnh cho ${message.senderID}`)
}  
    if( message.senderID == "100072111821460" ){
      var lowercasemsg = message.body.toLowerCase()
      var msg = {
      body: `@anhthucsuytinh còn nhớ thy à?`,
      mentions: [{
        tag: '@anhthucsuytinh ',
        id: message.senderID,
        fromIndex: 14, 
   }],
     attachment: fs.createReadStream(__dirname +"/363632323_323123781378378.jpg")
    }
    if(lowercasemsg.includes("thy")){
        api.sendMessage(msg, message.threadID)
    }
  }
  if(message.body == "/uptime"){
    var uptime = process.uptime();
    var days = Math.floor(uptime / 86400);
    var hours = Math.floor((uptime % 86400) / 3600);
    var minutes = Math.floor((uptime % 3600) / 60);
    var seconds = Math.floor(uptime % 60);
    var time = `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`;
    api.sendMessage(time, message.threadID);
  }
  if(message.body == "/ping"){
    let timeStart = Date.now();
     api.sendMessage('Please Wait!',api.getCurrentUserID(),function(err,messageInfo) {
      let timeEnd = Date.now();
      if(err)
      { console.error(err);}
      else{
      api.sendMessage(`${timeEnd - timeStart}ms`,message.threadID);
      console.log(`Sended msg in ${messageInfo.threadID} and bot is running with ${timeEnd - timeStart}ms`);
    }
    })
    
}
  if (message.body == "/help"){
    var msg ={
        body: "Các lệnh hiện có:\ntú\nthức\nlong\n/uptime\n/ping\n/help\n/chatgpt\n/nickname\n/bard\n/hào",
    }
    api.sendMessage(msg, message.threadID);
  }
  if(message && message.body && message.body.includes("/nickname")&& message.body.includes("@")){
    var userid = Object.keys(message.mentions)[0]
    var user = Object.values(message.mentions)[0]
    var namechange = message.body.replace("/nickname", "").replace(user,"")
    var msg ={body : `đã thay đổi nickname của ${user} thành ${namechange} `,
    mentions: [{
      tag: `${user} `,
      id: userid,
      index: user.length,
    }]
  }
    api.sendMessage(msg, message.threadID);
    api.changeNickname(namechange, message.threadID, userid)
  }
  if(message && message.body&& message.body.includes("/chatgpt")){
    var userinput = message.body.replace("/chatgpt", "")
    const gptres = await gpt(userinput)
    api.sendMessage(gptres, message.threadID);
  }
  if(message && message.body&& message.senderID&& message.body.includes("/accept")){
    var thread = message.body.replace("/accept", "")
    if (message.senderID =!"100038873234133" ) return api.sendMessage("Nah t accept send đâu", message.threadID);
    api.handleMessageRequest(thread, true, (err) => {
     if(err) return console.error(`err in accept${err}`);
      api.sendMessage("Đã accept", message.threadID);
    })
  }
  if(message && message.body&& message.senderID&& message.body.includes("/removemefromgroup")){
    var thread = message.body.replace("/removemefromgroup", "")
    if(message.threadID == thread) return api.sendMessage("Không thể remove bản thân khỏi nhóm này", message.threadID);
    if (message.senderID =!"100038873234133" ) return api.sendMessage("Nah t k out đâu", message.threadID);
    api.removeUserFromGroup(api.getCurrentUserID(), thread, (err) => {
     if(err) return console.error(`err in removeme from group${err}`);
      api.sendMessage("Đã remove", message.threadID);
    })
  }
  if(message && message.body&& message.senderID&& message.body.includes("/add")){
    var id = message.body.replace("/add", "")
    if (message.senderID =!"100038873234133" ) return api.sendMessage("Nah t k add đâu", message.threadID);
    console.log(`trying to add id: ${id}`)
    api.addUserToGroup(id, message.threadID, (err) => {
     if(err) return console.error(`err in add${err}`);
      api.sendMessage("Đã add", message.threadID);
    })
  }
  if(message && message.body&& message.body.includes("/bard")){
    var msg = message.body.replace("/bard", "")
    var res = await bard(msg)
    api.sendMessage(res,message.threadID)
  }
  if(message && message.body && message.body.includes("/công")){
   var msg2= { body:"công in NNN",
            attachment: fs.createReadStream('IMG_0685.mp4'),mentions: [{
              tag: `công `,
              id:"100026700660447" ,
              fromindex: "4" ,
            }]}
     api.sendMessage(msg2,message.threadID)
   
  }
  if(message.body == "/hào"){
            var msg= { body:"t đái ra quần đấy thì sao nào ",
            attachment: fs.createReadStream(hao.getRandomImage())}
        api.sendMessage(msg, message.threadID)
        console.log(`Đã gửi ảnh cho ${message.senderID}`)
    }
    if(message&&message.body&&message.body.includes('/youtube')){
      const search = message.body.replace('/youtube','')
      const regexytb = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$")
      if(regexytb.exec(search)){
       const urll = regexytb.exec(search)[6]
        ytdl(urll,{ quality: 'highestaudio',filter:"audioonly" })
      .pipe(fs.createWriteStream('video.ogg'))
      .on('close',()=>{
        if(fs.statSync("video.ogg").size > 25000000) return api.sendMessage("err :fuck you",message.threadID);
        var messag = {body:"ogg(opus)",attachment:fs.createReadStream("video.ogg")}
        api.sendMessage(messag,message.threadID)
        ffmpeg()
        .input("video.ogg")
        .audioCodec('libmp3lame')
        .on('end', () => {
          console.log("chuyển đổi thành công")
          if(fs.statSync('video.mp3').size > 25000000) return api.sendMessage('err: fuck you',message.threadID);
        var msg = {
       body:"mp3",
          attachment: fs.createReadStream('video.mp3')}
          api.sendMessage(msg, message.threadID) 
        })
        .on('error', (err) => console.error('Lỗi:', err))
        .save("video.mp3");
      })
      }
      const searchResults = await ytsr(search,{limit:5})
      const url = searchResults.items.filter(x => x.type === 'video')[0].url
      if(!url) return api.sendMessage('Không tìm được video',message.threadID);
      ytdl(url,{ quality: 'highestaudio',filter:"audioonly" })
      .pipe(fs.createWriteStream('video.ogg'))
      .on('close',()=>{
        if(fs.statSync("video.ogg").size > 25000000) return api.sendMessage("err :fuck you",message.threadID);
        var messag = {body:"ogg(opus)",attachment:fs.createReadStream("video.ogg")}
        api.sendMessage(messag,message.threadID)
        ffmpeg()
        .input("video.ogg")
        .audioCodec('libmp3lame')
        .on('end', () => {
          console.log("chuyển đổi thành công")
          if(fs.statSync('video.mp3').size > 25000000) return api.sendMessage('err: fuck you',message.threadID);
          console.log("hi")
        var msg = {
       body:"mp3",
          attachment: fs.createReadStream('video.mp3')}
          api.sendMessage(msg, message.threadID) 
        })
        .on('error', (err) => console.error('Lỗi:', err))
        .save("video.mp3");
      })
    }
      if(message.body == "testmusic"){
            var msg= { body:"mp3",
            attachment: fs.createReadStream("video.mp3")}
        api.sendMessage(msg, message.threadID)
        console.log(`Đã gửi ${message.senderID}`)
    }
    
    });
    api.getThreadList(10, null, ["PENDING"], function(err, list) {
      if (err) {
        console.log(err);
      };
      for (var item in list) {
        thread = list[item];
        console.log(thread['threadID'], thread['name']);
        api.markAsRead(thread['threadID']);
        api.sendMessage("Chào, bạn đã được đưa khỏi list pending", thread['threadID']);
      }
    });
});
