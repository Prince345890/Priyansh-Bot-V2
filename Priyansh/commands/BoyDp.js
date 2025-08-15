module.exports.config = {
  name: "boydp",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "PREM BABU (Edited by Aryan + Fixed by ChatGPT)",
  description: "Send random boy DP photo with yes/no confirm (safe upload)",
  commandCategory: "Random-IMG",
  usages: "boydp",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const prompt = "Abe Yaar Pura Command To Likh Le 😹 ckbot Yes Or Not ? (reply: yes / no)";
  const commandName = module.exports.config.name;

  api.sendMessage(prompt, event.threadID, (err, info) => {
    if (err) return;
    // Register handleReply so only the same user’s reply is caught
    global.client.handleReply.push({
      name: commandName,
      messageID: info.messageID,
      author: event.senderID,
      type: "confirm"
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  // Only proceed if this reply belongs to our pending confirm and same user
  if (handleReply.type !== "confirm" || event.senderID !== handleReply.author) return;

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { join } = require("path");

  const msg = (event.body || "").trim().toLowerCase();
  if (msg !== "yes" && msg !== "no") return;

  if (msg === "no") {
    return api.sendMessage("Thik hai, cancel kar diya 😏", event.threadID, () => {}, handleReply.messageID);
  }

  // YES: download & send image (safe flow)
  const links = [
    "https://i.imgur.com/lGowut2.jpg",
    "https://i.imgur.com/4qDvuWi.jpg",
    "https://i.imgur.com/vu5yPzj.jpg",
    "https://i.imgur.com/ZCYaMfF.jpeg",
    "https://i.imgur.com/hSQWcAM.jpeg",
    "https://i.imgur.com/ovX6lfA.jpeg",
    "https://i.imgur.com/RgfrYpM.jpeg",
    "https://i.imgur.com/DfvFLov.jpeg",
    "https://i.imgur.com/GPwbrDj.jpeg",
    "https://i.imgur.com/jSifYwo.jpeg",
    "https://i.imgur.com/Chc5pLl.jpeg",
    "https://i.imgur.com/HbznJXK.jpeg",
    "https://i.imgur.com/OLKdt61.jpeg",
    "https://i.imgur.com/tDNqmML.jpeg",
    "https://i.imgur.com/yUwx4o4.jpeg",
    "https://i.imgur.com/e4xWHUv.jpeg",
    "https://i.imgur.com/q6LfLx0.jpeg",
    "https://i.imgur.com/eoKKdzI.jpeg",
    "https://i.imgur.com/n3DS2ha.jpeg",
    "https://i.imgur.com/E5QWGCE.jpeg",
    "https://i.imgur.com/44YNGf6.jpeg",
    "https://i.imgur.com/fh8i2Ph.jpeg",
    "https://i.imgur.com/EMazlEj.jpeg",
    "https://i.imgur.com/Uz4RQSg.jpeg",
    "https://i.imgur.com/INxT1BF.jpeg",
    "https://i.imgur.com/jnU2FrO.jpeg",
    "https://i.imgur.com/qFDKN6v.jpeg",
    "https://i.imgur.com/m84lelb.jpeg",
    "https://i.imgur.com/FmMsaOR.jpeg",
    "https://i.imgur.com/Ln7It9C.jpeg",
    "https://i.imgur.com/SZ9KznS.jpeg",
    "https://i.imgur.com/WypMeee.jpeg",
    "https://i.imgur.com/Zq9sgX0.jpeg",
    "https://i.imgur.com/kIvSt9A.jpeg",
    "https://i.imgur.com/g3R1fQh.jpeg",
    "https://i.imgur.com/jv1LGtq.jpeg",
    "https://i.imgur.com/lKkm83o.jpeg",
    "https://i.imgur.com/Yuai95W.jpeg",
    "https://i.imgur.com/FNWIrNo.jpeg",
    "https://i.imgur.com/YUOScB2.jpeg",
    "https://i.imgur.com/Gd8K8Cg.jpeg",
    "https://i.imgur.com/R0mvOeZ.jpeg",
    "https://i.imgur.com/GGLiv35.jpeg",
    "https://i.imgur.com/b4hHhSk.jpeg",
    "https://i.imgur.com/45QWr06.jpeg",
    "https://i.imgur.com/uz7bh1h.jpeg",
    "https://i.imgur.com/7blSNAk.jpeg",
    "https://i.imgur.com/r11VKsm.jpeg",
    "https://i.imgur.com/4NyGJmu.jpeg",
    "https://i.imgur.com/HMMe7fV.jpeg",
    "https://i.imgur.com/447Dsfb.jpeg",
    "https://i.imgur.com/BsfPGOF.jpeg",
    "https://i.imgur.com/h0C5puK.jpeg",
    "https://i.imgur.com/qpgBE0X.jpeg",
    "https://i.imgur.com/f0HFaCv.jpeg",
    "https://i.imgur.com/a4vo9Cv.jpeg",
    "https://i.imgur.com/J7PAAuR.jpeg",
    "https://i.imgur.com/OG7CCAz.jpeg",
    "https://i.imgur.com/tqnzYDJ.jpeg",
    "https://i.imgur.com/3ItPOnW.jpeg",
    "https://i.imgur.com/yCkue9w.jpeg",
    "https://i.imgur.com/jx6VfM6.jpeg",
    "https://i.imgur.com/52cEmKs.jpg",
    "https://i.imgur.com/9xLfitZ.jpg",
    "https://i.imgur.com/RJ3Lou6.jpg",
    "https://i.imgur.com/dwAKjDy.jpg",
    "https://i.imgur.com/qBlbbCX.jpg"
  ];

  // Ensure cache dir and unique file
  const cacheDir = join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = join(cacheDir, `boydp_${Date.now()}.jpg`);
  const randomLink = links[Math.floor(Math.random() * links.length)];

  // Small helper to send safely
  const safeSend = (bodyText, pathToFile) => {
    const message = { body: bodyText };
    if (pathToFile && fs.existsSync(pathToFile)) {
      try {
        message.attachment = fs.createReadStream(pathToFile);
      } catch (e) {
        // If stream fails, skip attachment to avoid null/undefined error
      }
    }
    api.sendMessage(message, event.threadID, () => {
      // cleanup
      if (pathToFile && fs.existsSync(pathToFile)) {
        try { fs.unlinkSync(pathToFile); } catch {}
      }
    }, handleReply.messageID);
  };

  try {
    // Download via axios stream
    const response = await axios({
      method: "GET",
      url: encodeURI(randomLink),
      responseType: "stream",
      timeout: 20000
    });

    // Pipe to file and wait finish
    await new Promise((resolve, reject) => {
      const writer = response.data.pipe(fs.createWriteStream(filePath));
      writer.on("finish", resolve);
      writer.on("close", resolve);
      writer.on("error", reject);
      response.data.on("error", reject);
    });

    // Double check file exists & size > 0
    let ok = false;
    try {
      const stat = fs.statSync(filePath);
      ok = stat && stat.size > 0;
    } catch {}
    if (!ok) {
      safeSend("File download failed, sending link instead:\n" + randomLink);
      return;
    }

    // Send with attachment safely
    safeSend("💝 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐀𝐚𝐫𝐲𝐚𝐧 𝐁𝐚𝐛𝐮", filePath);
  } catch (err) {
    // On any error, avoid undefined attachment by sending text fallback
    safeSend("Kuch gadbad ho gayi download me 😅. Yeh lo link:\n" + randomLink);
  }
};
