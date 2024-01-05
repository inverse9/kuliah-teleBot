import { bot } from "./bot.js";
import { getData, deleteData, storeData, updateData } from "./function.js";

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === "/start")
    bot.sendMessage(
      chatId,
      "Selamat Datang, ketik /help untuk mengetahui daftar perintah pada bot ini"
    );
  else if (messageText === "/get") getData(chatId);
  else if (messageText.startsWith("/store")) storeData(chatId, messageText);
  else if (messageText.startsWith("/update")) updateData(chatId, messageText);
  else if (messageText.startsWith("/delete")) deleteData(chatId, messageText);
  else if (messageText === "/help")
    bot.sendMessage(
      chatId,
      `Daftar perintah:
      - /get untuk menampilkan daftar pengguna
      - /store untuk menambahkan pengguna
      - /update untuk mengedit pengguna
      - /delete untuk menghapus pengguna`
    );
  else bot.sendMessage(chatId, "Invalid command");
});
