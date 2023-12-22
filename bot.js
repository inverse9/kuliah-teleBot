import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import "dotenv/config";

const API_URL = "http://localhost:3333/user";
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const sendMsg = (chatId, msg) => {
  bot.sendMessage(chatId, msg);
};

const getData = async (chatId) => {
  let msg = "";
  try {
    const res = await axios.get(API_URL);
    console.log(res.data.data);
    msg = "Daftar Pengguna :\n";
    res.data.data.map((v) => {
      msg += `- (ID ${v.id}) ${v.name} ${v.age} tahun\n`;
    });
  } catch (error) {
    console.log(error);
    msg = "Error get data";
  }
  sendMsg(chatId, msg);
};

const storeData = async (chatId, msg) => {
  const data = msg.split(" ");
  if (data.length === 1)
    sendMsg(
      chatId,
      `untuk menambah pengguna, gunakan format:\n /store [nama] [umur]\ncontoh: /store bob 54`
    );
  else if (data.length === 3)
    try {
      const res = await axios.post(API_URL, { name: data[1], age: data[2] });
      if (res.status === 200) {
        sendMsg(chatId, "Pengguna berhasil ditambahkan 👌");
      } else {
        sendMsg(chatId, "Pengguna gagal ditambahkan");
      }
    } catch (error) {
      console.log(error);
    }
  else
    sendMsg(
      chatId,
      `Format salah gunakan format:\n /store [nama] [umur]\ncontoh: /store bob 54`
    );
};

const updateData = async (chatId, msg) => {
  const data = msg.split(" ");
  if (data.length === 1)
    sendMsg(
      chatId,
      `untuk edit pengguna, gunakan format:\n /update [ID] [nama] [umur]\ncontoh: /edit 13 bob 24`
    );
  else if (data.length === 4)
    try {
      const res = await axios.put(`${API_URL}/${data[1]}`, {
        name: data[2],
        age: data[3],
      });
      if (res.status === 200) {
        sendMsg(chatId, "Pengguna berhasil diedit 👌");
      } else {
        sendMsg(chatId, "Pengguna gagal diedit");
      }
    } catch (error) {
      console.log(error);
    }
  else
    sendMsg(
      chatId,
      `Format salah gunakan format:\n /update [ID] [nama] [umur]\ncontoh: /edit 13 bob 24`
    );
};

const deleteData = async (chatId, msg) => {
  const data = msg.split(" ");
  if (data.length === 1)
    sendMsg(
      chatId,
      `untuk hapus pengguna, gunakan format:\n /delete [ID]\ncontoh: /delete 11`
    );
  else if (data.length === 2)
    try {
      const res = await axios.delete(`${API_URL}/${data[1]}`);
      if (res.status === 200) {
        sendMsg(chatId, "Pengguna berhasil dihapus 👌");
      } else {
        sendMsg(chatId, "Pengguna gagal dihapus");
      }
    } catch (error) {
      console.log(error);
    }
  else
    sendMsg(
      chatId,
      `Format salah gunakan format:\n /delete [ID]\ncontoh: /delete 11`
    );
};
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
      `Daftar perintah:\n- /get untuk menampilkan daftar pengguna\n- /store untuk menambahka pengguna\n- /update untuk mengedit pengguna\n- /delete untuk menghapus pengguna\n`
    );
  else bot.sendMessage(chatId, "Invalid command");
});
