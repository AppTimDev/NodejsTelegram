const axios = require('axios')
const fs = require('fs')


function DownloadFileFromRequest(url, filepath){
    return axios({
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
}


module.exports.DownloadFileFromRequest = DownloadFileFromRequest