# Usage
Create a node js server and use telegram bot.

## Feature
- Rock-paper-scissors game
- Delete messages command in the menu
- Download the photo automatically when I send a photo to the bot
- Provide bot api for systems to send message to me and for testing the function of the telegram api.

---

## Installation
```cmd
npm i --save telegraf axios

```

---

## Rock-paper-scissors game in telegram
1. Click the menu button and choose 'Let's play rock-paper-scissors.'
![step1](./md/rps1.jpg)

2. You will send a command '/play' to the bot and 
it is waiting for your reply. Choose rock, paper or scissors in the reply keyboard button.
![step2](./md/rps2.jpg)

3. The bot will response automatically.
![step3](./md/rps3.jpg)

---

## Save photo automatically
https://core.telegram.org/bots/api#getfile

1. When I upload a photo, the bot on photo event can receive 
a parameter of file_id.

2. Call the telegram api with the file_id to get the file_path.  
https://api.telegram.org/bot<token>/getFile?file_id=<file_id>

3. Download the photo with the file_path.  
https://api.telegram.org/file/bot<token>/<file_path>

---

## ngrok 
Use ngrok to provide a public url for testing the telgram webhooks.

1. Create an account and log in. 
https://dashboard.ngrok.com/login

2. Download ngrok
https://dashboard.ngrok.com/get-started/setup

3. Running this command will add your authtoken to the default ngrok.yml configuration file.
```cmd
ngrok config add-authtoken [your__token]
```

4. To start a HTTP tunnel forwarding to your local port 2000, run this next:
```cmd
ngrok http 2000
```

---

## Telegram api (keywords)
getUpdates  
getWebhookInfo  
setWebhook  
deleteWebhook  

sendMessage  

CallbackQuery  
InlineKeyboardMarkup  
ReplyKeyboardMarkup  
ReplyKeyboardRemove  

setMyCommands  
deleteMyCommands  

---

## My Related Project
PythonTelegram  
https://github.com/AppTimDev/PythonTelegram

---

# Reference

## Telegram Bot API (Bot API 6.3)
https://core.telegram.org/bots/api

## telegraf.js - v4.11.2
https://telegraf.js.org/#example
