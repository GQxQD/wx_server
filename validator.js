const crypto = require('crypto');
const config = require('./config.json');
module.exports = (params) => {
    console.log(params);
    let {
        signature,
        timestamp,
        nonce,
        echostr,
        openid
    } = params;
    let token = config.token;
    let arr = [token, timestamp, nonce];
    arr.sort();
    let sha1 = crypto.createHash('sha1');
    arr.map((val) => {
        sha1.update('' + val);
    });
    let hashCode = sha1.digest('hex');
    // console.log(' ~ signature: ' + signature);
    // console.log(' ~ hashCode : ' + hashCode);
    return signature === hashCode && echostr || openid;
};