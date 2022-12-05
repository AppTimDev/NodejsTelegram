const {
    Telegraf,
    Telegram,
    Markup
} = require('telegraf');
const path = require('path')
const axios = require('axios')
const {
    DownloadFileFromRequest
} = require('./file');
const bot = new Telegraf(process.env.MYTOKEN);
const telegram = new Telegram(process.env.MYTOKEN)

//For playing rock-paper-scissors.
function getRockPaperScissors() {
    const num = Math.floor(Math.random() * 3)
    let result = ''
    switch (num) {
        case 0:
            result = '🖐'
            break
        case 1:
            result = '✌️'

            break
        case 2:
            result = '👊'
            break
    }
    return result
}

function GetTelegramFilePath(file_id) {
    const url = `${process.env.TG_BOT_API}${process.env.MYTOKEN}/getFile?file_id=${file_id}`
    console.log(`GetTelegramFilePath: ${url}`);
    return axios({
        method: 'get',
        url: url,
        'Content-Type': 'application/json'
    }).then((result) => {
        const data = result.data
        if (data && data.ok) {
            //console.log(data)
            return Promise.resolve(data.result.file_path)
        } else {
            return Promise.resolve(null)
        }
    }).catch(err => {
        console.log(err);
        return Promise.resolve(null)
    })
}

//bot send message to all users chat with him
function InitBot() {
    const extraRemoveReplyKeyboard = {
        disable_notification: true,
        reply_markup: {
            "remove_keyboard": true,
            "selective": false
        }
    }
    //must be above on text
    bot.command('del', async (ctx) => {
        try {
            console.log('on command: delete');
            const extra = {
                disable_notification: true
            }
            //await ctx.telegram.sendMessage(ctx.message.chat.id, `delete message`, extra);
            let k = 0;
            for (let i = 0; i <= 100; i++) {
                k = ctx.message.message_id - i;
                await ctx.deleteMessage(k)
            }
        } catch (err) {
            console.log(err);
        }
    });

    bot.command('play', (ctx) => {
        ctx.reply('Let\'s play rock-paper-scissors.', Markup.keyboard([
            ['🖐', '✌️', '👊']
        ]).oneTime().resize())
    })

    bot.hears('🖐', async (ctx) => {
        ctx.reply(getRockPaperScissors(), extraRemoveReplyKeyboard)
    })
    bot.hears('✌️', async (ctx) => {
        ctx.reply(getRockPaperScissors(), extraRemoveReplyKeyboard)
    })
    bot.hears('👊', async (ctx) => {
        ctx.reply(getRockPaperScissors(), extraRemoveReplyKeyboard)
    })

    bot.command('onetime', (ctx) => {
        ctx.reply('One time keyboard', Markup.keyboard(['text1', 'text2', 'text3']).oneTime().resize())
    })

    bot.command('inline', (ctx) => {
        const extra = {
            disable_notification: true
        }
        ctx.reply('inline keyboard', Markup.inlineKeyboard([
            Markup
            .button
            .callback('1', 'text1'),
            Markup
            .button
            .callback('2', 'text2')
        ]), extra)
    })

    bot.action('text1', async (ctx) => {
        console.log('on action: text1');
        await ctx.answerCbQuery()

    })

    bot.hears('hi', async (ctx) => {
        try {
            console.log('on hear: hi');
            //ctx.reply('Hi!')
        } catch (err) {
            console.log(err);
        }
    })


    bot.hears('football.jpg', async (ctx) => {
        try {
            //await ctx.replyWithPhoto({ source: path.join(global.downloadPath, 'photos/football.jpg') });
            await ctx.telegram.sendPhoto(ctx.message.chat.id, { source: path.join(global.downloadPath, 'photos/football.jpg') })
        } catch (err) {
            console.log(err);
        }
    })
    
    
    bot.on('text', async (ctx) => {
        // Explicit usage
        console.log('on text:');
        console.log(ctx.message.text);
        //console.log(ctx);

        const extra = {
            disable_notification: true
        }
        // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello!`, extra); Using
        // context shortcut await ctx.reply(`Hello`);
    });

    bot.on('photo', async (ctx) => {
        try {
            console.log('on photo:');
            // console.log(ctx.message.from.id);
            // console.log(ctx.message.photo);
            const extra = {
                disable_notification: true
            }
            
            //check the photo is sent by me
            if (ctx.message.from.id.toString() === process.env.MYID) {
                //console.log('The photo is sent by me');                
                const photo = ctx.message.photo
                if (photo && photo.length > 0) {

                    const requestPromises = photo.map((p) => {
                        let {
                            file_id
                        } = p
                        return GetTelegramFilePath(file_id).then((filepath) => {
                            if (filepath) {
                                const url = `${process.env.TG_BOT_DOWNLOAD_FILE_API}${process.env.MYTOKEN}/${filepath}`
                                const downloadPath = path.join(global.downloadPath, filepath)
                                console.log('downloadPath:');
                                console.log(downloadPath);
                                return DownloadFileFromRequest(url, downloadPath)
                            }
                        }).catch((err) => {
                            console.log('GetTelegramFilePath catch:');
                            console.log(err);
                            return Promise.resolve(null)
                        })
                    })
        
                    await Promise.all(requestPromises).then((files) => {
                        console.log(`files: ${files}`);
                    }).catch((err) => {
                        console.log('Promise.all catch:');
                        console.log(err);
                    })


                }

            } else {
                console.log('The photo is not sent by me');
                //await ctx.telegram.sendMessage(ctx.message.chat.id, ``, extra);
            }
        } catch (err) {
            console.log(err);
        }
    });

    bot.on('callback_query', async (ctx) => {
        console.log('on callback_query:');
        console.log(ctx.callbackQuery.id);
        console.log(ctx.callbackQuery.message);
        console.log(ctx.callbackQuery.data);
        //console.log(ctx);

        await ctx
            .telegram
            .answerCbQuery(ctx.callbackQuery.id);
        const extra = {
            disable_notification: true
        }
        await ctx.reply(ctx.callbackQuery.data, extra)

        // Using context shortcut await ctx.answerCbQuery();
    });

    bot.on('inline_query', async (ctx) => {
        console.log('on inline_query:');
        const result = [];
        await ctx
            .telegram
            .answerInlineQuery(ctx.inlineQuery.id, result);

        // Using context shortcut await ctx.answerInlineQuery(result);
    });

    bot.on('sticker', (ctx) => ctx.reply('👍'));

    bot.on('message', async (ctx) => {
        try {
            console.log('on message:');
            console.log(ctx.message);
        } catch (err) {
            console.log(err);            
        }        
    })

    //for testing 
    //development only
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

}

//sent to me only
function sendMessage(msg) {
    const {
        text,
        disable_notification,
        reply_to_message_id,
        reply_markup
    } = msg
    let extra = {
        disable_notification,
        reply_to_message_id
    }
    if (reply_markup) {
        extra.reply_markup = JSON.stringify(reply_markup)
    }
    return telegram.sendMessage(process.env.MYID, text, extra);
}

module.exports.bot = bot
module.exports.telegram = telegram
module.exports.InitBot = InitBot
module.exports.sendMessage = sendMessage