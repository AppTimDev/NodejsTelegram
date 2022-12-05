//node server dev 2000
//node server pro 2000
const path = require('path');

const version_number = 'v1'

const config = {
    production: {
        port: 2000,
        version: `production_${version_number}`,
        src: path.resolve(process.cwd(), 'public'),
        api_url: '/api'
    },
    development: {
        port: 2000,
        version: `development_${version_number}`,
        src: path.resolve(process.cwd(), 'public'),
        api_url: '/api'
    }
}

module.exports = {
    version_number,
    config
}