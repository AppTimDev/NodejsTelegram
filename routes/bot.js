const fs = require("fs");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const path = require('path');
const {
    sendMessage,
    telegram
} = require("../common/botLib");


router.post('/sendMessage', async (req, res) => {
    console.log('bot api: sendMessage');
    try {
        // console.log('body:');        
        // console.log(req.body);        
        if (!req.body.text) {
            const msgSample = {
                "text": "your message",
                "disable_notification": false,
                "reply_to_message_id": 0
            }
            return res.json({
                ok: true,
                body_sample: msgSample
            })
        }

        const msg = {
            "text": req.body.text,
            "disable_notification": req.body.disable_notification ? true : false,
            "reply_to_message_id": req.body.reply_to_message_id ? req.body.reply_to_message_id : 0,
            "reply_markup": req.body.reply_markup
        }
        const result = await sendMessage(msg)
        return res.json({
            ok: true,
            message_sent: msg,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


router.get('/testInlineKeyboard', async (req, res) => {
    console.log('bot api: testInlineKeyboard');
    try {
        const msg = {
            "text": "testInlineKeyboard",
            "disable_notification": true,
            "reply_to_message_id": 0,
            "reply_markup": {
                "inline_keyboard": [
                    [{
                        "text": "1",
                        "callback_data": "text1"
                    }, {
                        "text": "2",
                        "callback_data": "text2"
                    }],
                    [{
                        "text": "3",
                        "callback_data": "text3"
                    }]
                ]
            }
        }
        const result = await sendMessage(msg)
        return res.json({
            ok: true,
            message_sent: msg,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


router.get('/testReplyKeyboardMarkup', async (req, res) => {
    console.log('bot api: testReplyKeyboardMarkup');
    try {
        const msg = {
            "text": "testReplyKeyboardMarkup",
            "disable_notification": true,
            "reply_to_message_id": 0,
            "reply_markup": {
                "keyboard": [
                    [{
                        "text": "1"
                    }, {
                        "text": "2"
                    }]
                ],
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "selective": false
            }

        }
        const result = await sendMessage(msg)
        return res.json({
            ok: true,
            message_sent: msg,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


router.get('/testReplyKeyboardRemove', async (req, res) => {
    console.log('bot api: testReplyKeyboardRemove');
    try {
        const msg = {
            "text": "testReplyKeyboardRemove",
            "disable_notification": true,
            "reply_to_message_id": 0,
            "reply_markup": {
                "remove_keyboard": true,
                "selective": false
            }
        }
        const result = await sendMessage(msg)
        return res.json({
            ok: true,
            message_sent: msg,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})



router.post('/setMyCommands', async (req, res) => {
    //setMyCommands
    console.log('bot api: setMyCommands');
    try {
        // const commands = [
        //     {
        //         "command": "/play",
        //         "description": "Let\'s play rock-paper-scissors."
        //     }
        // ]
        const {
            commands
        } = req.body
        if (!commands) {
            return res.json({
                ok: false,
                description: "Please post the body of the following format",
                body: {
                    commands: [{
                        "command": "/play",
                        "description": "Let\'s play rock-paper-scissors."
                    },{
                        "command": "/del",
                        "description": "Delete all messages"
                    }]
                }
            })
        }
        const result = await telegram.setMyCommands(commands)
        return res.json({
            ok: true,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


router.get('/deleteMyCommands', async (req, res) => {
    console.log('bot api: deleteMyCommands');
    try {
        const result = await telegram.deleteMyCommands()
        return res.json({
            ok: true,
            result: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


router.get('/testDownloadTgImage', async (req, res) => {
    console.log('bot api: testDownloadTgImage');
    try {
        const url = `https://api.telegram.org/file/bot${process.env.MYTOKEN}/photos/file_4.jpg`
        const filepath = path.resolve(process.cwd(), 'download', 'file_4.jpg')

        const result = await axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            })
            .then(function (res) {
                res.data.pipe(fs.createWriteStream(filepath))
                console.log('The file has been saved to:');
                console.log(filepath);
                return Promise.resolve(filepath)        
                
            }).catch(err=>{         
                console.log(err);
                return Promise.reject(err)        
            })
        // console.log('result:');
        // console.log(result);
        return res.json({
            ok: true,
            result: result
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
})


router.get('/download/:file_id', async (req, res) => {
    console.log('bot api: download file');
    try {
        const {file_id} = req.params
        const url = `${process.env.TG_BOT_API}${process.env.MYTOKEN}/getFile?file_id=${file_id}`
        let filename = ''
        const data = await axios({
                method: 'get',
                url: url
            })
            .then(async function (response) {
                if(response.data && response.data.ok){
                    const {file_path} = response.data.result
                    const downloadUrl = `${process.env.TG_BOT_DOWNLOAD_FILE_API}${process.env.MYTOKEN}/${file_path}`
                    filename = path.basename(file_path)  

                    const data = await axios({
                        method: 'get',
                        url: downloadUrl,
                        responseType: 'stream'
                    })
                    .then(function (res) {                  
                        return Promise.resolve(res.data)
                    }).catch(err=>{         
                        console.log(err);
                        return Promise.reject(null)        
                    })
                    return Promise.resolve(data)        
                }else{
                    return Promise.resolve(null) 
                }                               
            }).catch(err=>{         
                console.log(err);
                return Promise.resolve(null)    
            })
        if(data){
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + filename
            });
            data.pipe(res)
        }else{
            //file not exist
            return res.json({
                ok: false,
                message: 'file not exist!!'
            })
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
})


module.exports = router