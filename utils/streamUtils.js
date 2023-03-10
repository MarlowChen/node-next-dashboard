// import { Axios } from 'axios';
// import * as stream from 'stream';
// import { promisify } from 'util';
const Axios = require("axios");
const stream = require("stream");
const { PassThrough } = require("stream");
const util = require('util');
var fs = require('fs');
const finished = util.promisify(stream.finished);


exports.downloadFile = async function (fileUrl, outputLocationPath) {
    const writerStream = fs.createWriteStream(outputLocationPath);
    var controller = new AbortController();
    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream'
    }).then(response => {
        const stream = response.data;
        let imgCount = 0;
        console.log(response.headers)
        stream.on('data', data => {
            const base64Val = Buffer.from(data, 'base64');
            console.log(base64Val.length)
            imgCount++;
            if (imgCount > 5) {

                fs.writeFile('hello.png', data, function () {
                    console.log("Save OK")
                });
                writerStream.end();

            }
            stream.pipe(writerStream);

        });
        //console.log(stream)
        stream.on('end', function () {
            console.log("end")
        })
        return finished(writerStream).then(res => {
            console.log("error")
        }); //this is a Promise
    });
}