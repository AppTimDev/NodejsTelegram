const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path');


const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
    //path default: path.resolve(process.cwd(), '.env')
    require('dotenv').config({
        path: path.resolve(process.cwd(), '.env.production')
    })
} else {
    require('dotenv').config()
}
console.log(`DOTENV_ENV: ${process.env.DOTENV_ENV}`);
global.downloadPath = path.resolve(process.cwd(), 'download')
console.log(`download folder path: ${global.downloadPath}`);

// console.log(`Mytoken: ${process.env.MYTOKEN}`);

//init the tg bot
const { InitBot } = require('./common/botLib');
InitBot()

const app = express();
const {
    config
} = require('./config');


//import routes
const botRouter = require("./routes/bot");


const CONFIG = isProduction ? config.production : config.development
const {
    port,
    api_url,
    src
} = CONFIG

const ApiUrl = (link) => {
    return api_url + link;
}
console.log(`API URL: ${api_url}`);

// Import all middlewares
// support parsing of application/json type post data, 
// get req.body
app.use(express.json({
    limit: "100mb"
}));
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

//cors development only
//not in production
if (!isProduction) {
    let allowCrossDomain = function (req, res, next) {
        //console.log('allowCrossDomain');
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Headers', "*");
        next();
    }
    app.use(allowCrossDomain);
}


app.get(ApiUrl('/'), function (req, res) {
    res.send("ok");
});

// Setup all the routers
app.use(ApiUrl('/bot'), botRouter);


//static files
app.use('/', express.static(path.join(src)))

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})