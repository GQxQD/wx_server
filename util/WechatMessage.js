const convert = require('xml-js');

const WechatMessage = {};
const convertConfig = {
    compact: true,
    spaces: 2
};

// 所有类型共同的属性
const commons = [
    ['ToUserName', '_cdata'],
    ['FromUserName', '_cdata'],
    ['CreateTime', '_text'],
    ['MsgType', '_cdata']
];

const receiveCommons = [
    ['MsgId', '_text'],
    ...commons
];

// 类型各异的属性
const receiveTypes = {
    'text': [['Content', '_cdata']],
    'image': [['PicUrl', '_cdata'], ['MediaId', '_cdata']],
    'voice': [['Format', '_cdata'], ['MediaId', '_cdata'], ['Recognition', '_cdata']],
    'video': [['ThumbMediaId', '_cdata'], ['MediaId', '_cdata']],
    'shortvideo': [['ThumbMediaId', '_cdata'], ['MediaId', '_cdata']],
    'location': [['Location_X', '_text'], ['Location_Y', '_text'], ['Scale', '_text'], ['Label', '_cdata']],
    'link': [['Title', '_cdata'], ['Description', '_cdata'], ['Url', '_cdata']],
};

const sendTypes = {
    'text': [['Content', '_cdata']],
    'image': [['MediaId', '_cdata']],
    'voice': [['MediaId', '_cdata']],
    'video': [['Title', '_cdata'], ['Description', '_cdata'], ['MediaId', '_cdata']],
    'music': [['Title', '_cdata'], ['Description', '_cdata'], ['MusicURL', '_cdata'], ['HQMusicUrl', '_cdata'], ['ThumbMediaId', '_cdata']],
    'news': [['ArticleCount', '_text']]
};

WechatMessage.parse = (xml) => {
    if (!xml || typeof xml !== 'string')
        return xml;
    let js = convert.xml2js(xml, convertConfig);
    js = js.xml;
    const result = {};
    receiveCommons.map((val) => {
        result[val[0]] = js && js[val[0]] && js[val[0]][val[1]];
    });
    receiveTypes[result['MsgType']].map((val) => {
        result[val[0]] = js && js[val[0]] && js[val[0]][val[1]];
    });
    return result;
};

WechatMessage.createMsg = (data = {}) => {
    let js = {};
    commons.map((val) => {
        let temp = {};
        temp[val[1]] = data[val[0]] || '';
        js[val[0]] = temp;
    });
    if (data['MsgType'] === 'news') {
        let item = [];
        data['Articles'].map((val) => {
            let temp = {
                Title: {
                    _cdata: val.Title
                },
                Description: {
                    _cdata: val.Description
                },
                PicUrl: {
                    _cdata: val.PicUrl
                },
                Url: {
                    _cdata: val.Url
                }
            };
            item.push(temp);
        });
        js['Articles'] = {item};
    }
    sendTypes[data['MsgType']].map((val) => {
        let temp = {};
        temp[val[1]] = data[val[0]] || '';
        js[val[0]] = temp;
    });
    return convert.js2xml({xml: js}, convertConfig);
};

module.exports = WechatMessage;