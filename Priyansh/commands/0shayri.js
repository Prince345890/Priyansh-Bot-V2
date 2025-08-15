module.exports.config = {
    name: "Shayri",
    version: "1.0.6",
    hasPermssion: 0, // sab use kar sakte
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "User ke liye ek ek karke Shayari bhejne wala bot",
    commandCategory: "group",
    usages: "shyari likho, bot reply karega",
    cooldowns: 1
}

const userShayariMemory = {};

const shayariList = [
    "💅💔...𝘑𝘢𝘣 𝘑𝘪𝘪𝘴𝘔 𝘚𝘦 𝘙𝘶𝘩 𝘕𝘪𝘪𝘒𝘢𝘓 𝘚𝘢𝘬𝘛𝘪𝘪 𝘏𝘢𝘪𝘪 𝘛𝘰𝘩 𝘋𝘪𝘓 𝘚𝘦 𝘓𝘰𝘨 𝘒𝘺𝘜𝘯 𝘕𝘩𝘪𝘪..💚☞𝗝𝗨𝗟𝗠𝗜 𝗝𝗔𝗔𝗧☜",
    "🌻💋 ...𝘜𝘴𝘩𝘌 𝘈𝘱𝘯𝘢 𝘒𝘦𝘩𝘯𝘦 𝘒𝘪 𝘉𝘢𝘥𝘪 𝘛𝘢𝘮𝘢𝘯𝘯𝘢 𝘛𝘩𝘪 𝘋𝘪𝘭 𝘔𝘦 𝘐𝘴 𝘚𝘦 𝘗𝘩𝘦𝘭𝘦 𝘒𝘪 𝘉𝘢𝘢𝘵 𝘓𝘢𝘣𝘰𝘯 𝘗𝘳 𝘈𝘢𝘛𝘵𝘪 𝘒𝘪 𝘞𝘰 𝘎𝘢𝘪𝘳 H𝘰 𝘎𝘺𝘦:))*♥️☞𝗝𝗨𝗟𝗠𝗜 𝗝𝗔𝗔𝗧☜",
    "💅🌾 ...𝘕𝘢𝘥𝘢𝘢𝘯 𝘉𝘢𝘩𝘶𝘵 𝘏𝘢𝘪 𝘞𝘰 𝘑𝘢𝘪𝘴𝘦 𝘒𝘶𝘤𝘩 𝘚𝘢𝘮𝘻𝘩𝘵𝘪 𝘏𝘪 𝘕𝘢𝘩𝘪 𝘏𝘢𝘪 𝘚𝘩𝘪𝘯𝘦 𝘚𝘦 𝘓𝘢𝘨𝘢 𝘒𝘳 𝘗𝘶𝘤𝘩𝘵𝘪𝘪 𝘏𝘢𝘪 𝘒𝘪 𝘋𝘩𝘢𝘥𝘬𝘢𝘯𝘦 𝘐𝘵𝘯𝘪 𝘛𝘦𝘫 𝘒𝘺𝘶𝘯 𝘏𝘢𝘪 :))*😈☞𝗝𝗨𝗟𝗠𝗜 𝗝𝗔𝗔𝗧☜",
    "💅🍷 ...𝘕𝘢𝘚𝘦𝘦𝘣 𝘚e 𝘑𝘺𝘢𝘥𝘢 𝘉𝘩𝘢𝘳𝘰𝘴𝘩𝘢 𝘛𝘶𝘮 𝘗e 𝘒ıı𝘠𝘢 𝘛𝘩𝘢 𝘍ıı𝘳 𝘉𝘩ıı 𝘕𝘢𝘚𝘦𝘦𝘣 𝘐𝘯𝘯𝘈 𝘕𝘩ıı 𝘉𝘢𝘥𝘓𝘢 𝘑ıı𝘛𝘯𝘈 𝘛𝘶𝘮 𝘉𝘢𝘥𝘢𝘓 𝘎𝘺e.🍁☞𝗝𝗨𝗟𝗠𝗜 𝗝𝗔𝗔𝗧☜",
    "🪴🌻 ...𝘒𝘺𝘜 𝘒𝘩𝘦𝘭𝘵𝘦 𝘏𝘰 𝘛𝘶𝘮 𝘏𝘶𝘮𝘚𝘩𝘦 𝘔𝘢𝘩𝘰𝘣𝘣𝘢𝘵 𝘒𝘢 𝘒𝘩𝘦𝘭...",
    "🌧🍓 ...𝘛𝘶𝘮𝘩𝘦 𝘔𝘢𝘭𝘰𝘰𝘮 𝘏𝘪 𝘛𝘩𝘢 𝘒ıı 𝘔𝘢ıı𝘕 𝘛𝘢𝘯𝘩𝘈 𝘕𝘩ıı 𝘙𝘩 𝘚𝘢𝘬𝘵𝘢...",
    "🍒🌾 ...𝘗𝘵𝘢 𝘕𝘩ıı 𝘒𝘢𝘣 𝘑𝘢𝘺𝘨ıı 𝘛𝘦𝘳ıı 𝘓𝘢𝘢𝘱𝘳𝘸𝘢𝘺ıı..."
    // Yahan baki Shayari add karte jao
];

module.exports.run = async function({ api, event }) {
    const message = event.body;
    const userID = event.senderID;

    // Sirf "shyari" word ya koi trigger word ho tab hi bot chale
    if (!message.toLowerCase().includes("shyari")) return;

    // Agar user pehli baar shyari likh raha hai → start index 0
    if (!userShayariMemory[userID]) userShayariMemory[userID] = 0;

    // Current Shayari index
    const shayariIndex = userShayariMemory[userID];

    // Ek hi Shayari bhejo
    api.sendMessage(shayariList[shayariIndex], event.threadID);

    // Agle message pe next Shayari bheje
    userShayariMemory[userID] = (shayariIndex + 1) % shayariList.length;
}
