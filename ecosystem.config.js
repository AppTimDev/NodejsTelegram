module.exports = {
    apps: [{
        name: "tgbot",
        cwd: "./",
        script: "./server.js",
        instances  : 1,
        exec_mode  : "cluster",

        time:true,
        log_date_format: "YYYY-MM-DD",
        combine_logs: true,
        error_file    : "./log/tgbotapp.log",
        out_file    : "./log/tgbotapp.log",

        max_memory_restart: "300M",
        max_restarts: 3,
        min_uptime: 10000,
        restart_delay: 20000,
        force: true,

        env_production: {
            NODE_ENV: "production",
            PM2_VERSION: "v1" //process.env.PM2_VERSION
        },
        env_development: {
            NODE_ENV: "development",
            PM2_VERSION: "v1"
        }
    },{
        name: "tgbot-dev",
        cwd: "./",
        script: "./server.js",
        instances  : 1,
        exec_mode  : "cluster",

        watch:true,
        ignore_watch:["node_modules"],

        time:true,
        log_date_format: "YYYY-MM-DD",
        combine_logs: true,

        max_memory_restart: "300M",
        autorestart: false,
        force: true
    }]
}