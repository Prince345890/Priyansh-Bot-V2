module.exports.config = {
  name: "boydp",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "PREM BABU (Edited by Aryan + Fixed by ChatGPT)",
  description: "Send random boy DP photo with yes/no confirm (safe upload & retry)",
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
    global.client.handleReply.push({
      name: commandName,
      messageID: info.messageID,
      author: event.senderID,
      type: "confirm"
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  if (handleReply.type !== "confirm" || event.senderID !== handleReply.author) return;

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { join } = require("path");

  const msg = (event.body || "").trim().toLowerCase();
  if (msg !== "yes" && msg !== "no") return;

  if (msg === "no") {
    return api.sendMessage("Thik hai, cancel kar diya 😏", event.threadID, () => {}, handleReply.messageID);
  }

  // YES: download & send image
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
    "https://i.imgur.com/Ln7It9C.jpeg"
    // ... aur bhi links add kar sakte ho
  ];

  const cacheDir = join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = join(cacheDir, `boydp_${Date.now()}.jpg`);
  const randomLink = links[Math.floor(Math.random() * links.length)];

  const sendWithRetry = async (attempt = 1) => {
    if (attempt > 2) {
      // 2 attempts ke baad fail → send link fallback
      return api.sendMessage(`Kuch gadbad ho gayi 😅. Yeh lo link:\n${randomLink}`, event.threadID, () => {}, handleReply.messageID);
    }

    try {
      const response = await axios({
        method: "GET",
        url: encodeURI(randomLink),
        responseType: "stream",
        timeout: 20000
      });

      await new Promise((resolve, reject) => {
        const writer = response.data.pipe(fs.createWriteStream(filePath));
        writer.on("finish", resolve);
        writer.on("close", resolve);
        writer.on("error", reject);
        response.data.on("error", reject);
      });

      // Check file exists & size > 0
      const stat = fs.statSync(filePath);
      if (!stat || stat.size <= 0) throw new Error("Empty file");

      // Send attachment safely
      api.sendMessage({ body: "💝 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐀𝐚𝐫𝐲𝐚𝐧 𝐁𝐚𝐛𝐮", attachment: fs.createReadStream(filePath) }, event.threadID, (err) => {
        fs.unlinkSync(filePath); // cleanup
        if (err) {
          // Temporary FB error → retry
          return sendWithRetry(attempt + 1);
        }
      }, handleReply.messageID);

    } catch (e) {
      // Download/stream fail → retry
      return sendWithRetry(attempt + 1);
    }
  };

  // Start send attempt
  sendWithRetry();
};
