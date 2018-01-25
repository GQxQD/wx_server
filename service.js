const url = require('url');
const convert = require('xml-js');
const validator = require('./validator');
const robot = require('./robot');
const WechatMessage = require('./util/WechatMessage');
module.exports = {
    get(req, res) {
        return validator(url.parse(req.url, true).query);
    },
    post: async (req, res) => {
        const result = validator(url.parse(req.url, true).query);
        if (result) {
            let xml = await getXML(req);
            let data = WechatMessage.parse(xml);
            console.log('收到一条消息：');
            console.log(data);
            let {ToUserName, FromUserName, Content} = data;
            data = {
                ToUserName: FromUserName,
                FromUserName: ToUserName,
                CreateTime: Date.now(),
                ...await robot(Content, FromUserName.replace(/\W*/ig, '').toLowerCase())
            };
            return WechatMessage.createMsg(data);
        } else {
            return 'validate fail.';
        }
    }
};

function getXML(req) {
    let xml = '';
    return new Promise((resolve, reject) => {
        try {
            req.on('data', (chunk) => {
                xml += chunk;
            });
            req.on('end', () => {
                resolve(xml);
            });
        } catch (e) {
            reject(e);
        }
    });
}