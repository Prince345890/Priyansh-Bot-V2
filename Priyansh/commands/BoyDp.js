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
  // Yahan sirf naya link daala gaya hai
  const links = [
    "https://i.ibb.co/mrT4ghCN/e0cf3ffa8eaada3c50fb136d3774f082-1.jpg"
  ];

  const cacheDir = join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = join(cacheDir, `boydp_${Date.now()}.jpg`);
  const randomLink = links[Math.floor(Math.random() * links.length)];

  const sendWithRetry = async (attempt = 1) => {
    if (attempt > 3) { // Attempts ko 2 se 3 kar dete hain for more reliability
      // 3 attempts ke baad bhi fail ho toh link bhej do
      return api.sendMessage(`Arey, image download nahi ho pa rahi hai. Yeh lo link: ${randomLink}`, event.threadID, () => {}, handleReply.messageID);
    }

    try {
      const response = await axios({
        method: "GET",
        url: encodeURI(randomLink),
        responseType: "stream",
        timeout: 30000 // Timeout ko 20 se 30 seconds kar dete hain
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) => {
            console.error("File write error:", err); // Error console me print karo
            reject(err);
        });
      });

      // File exists and has data?
      const stat = fs.statSync(filePath);
      if (!stat || stat.size <= 0) {
        throw new Error("Empty file or file not found.");
      }

      // Final attempt to send the image
      api.sendMessage({ 
          body: "💝 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐀𝐚𝐫𝐲𝐚𝐧 𝐁𝐚𝐛𝐮", 
          attachment: fs.createReadStream(filePath) 
      }, event.threadID, (err) => {
          fs.unlinkSync(filePath); // file ko delete kar do
          if (err) {
            console.error("Facebook API send error:", err); // FB error bhi console me dikhao
            return sendWithRetry(attempt + 1); // retry again
          }
      }, handleReply.messageID);

    } catch (e) {
      console.error("Image download/processing error:", e.message); // Error message ko console me print karo
      fs.unlink(filePath, () => {}); // agar download fail ho toh incomplete file ko delete kar do
      return sendWithRetry(attempt + 1); // retry again
    }
  };

  // Start send attempt
  sendWithRetry();
};
