const axios = require('axios');
const config = require('./config.json');
module.exports = async (info, userid) => {
    let res = await axios.post('http://www.tuling123.com/openapi/api', {
        key: config.tuling_key,
        info,
        userid
    });
    console.log(res.data);
    let result = {};
    switch (res.data.code) {
        case 100000:
            // 文本类
            result.MsgType = 'text';
            result.Content = res.data.text;
            break;
        case 200000:
            // 链接类
            result.MsgType = 'text';
            result.Content = `<a href="${res.data.url}">${res.data.text}</a>`;
            // result.MsgType = 'news';
            // result.ArticleCount = 1;
            // result.Articles = [
            //     {
            //         Title: res.data.text,
            //         Description: res.data.text,
            //         PicUrl: res.data.url,
            //         Url: res.data.url
            //     }
            // ];
            break;
        case 302000:
            // 新闻类
            result.MsgType = 'news';
            result.ArticleCount = res.data.list.length > 8 ? 8 : res.data.list.length;
            result.Articles = [];
            for (let i = 0; i < result.ArticleCount; i++) {
                result.Articles.push({
                    Title: res.data.list[i].article + '\n来源：' + res.data.list[i].source,
                    Description: '来源：' + res.data.list[i].source,
                    PicUrl: res.data.list[i].icon,
                    Url: res.data.list[i].detailurl
                });
            }
            break;
        case 308000:
            // 菜谱
            result.MsgType = 'news';
            result.ArticleCount = res.data.list.length > 8 ? 8 : res.data.list.length;
            result.Articles = [];
            for (let i = 0; i < result.ArticleCount; i++) {
                result.Articles.push({
                    Title: res.data.list[i].name + '\n' + res.data.list[i].info,
                    Description: res.data.list[i].info,
                    PicUrl: res.data.list[i].icon,
                    Url: res.data.list[i].detailurl
                });
            }
            break;
        default:
            result.MsgType = 'text';
            result.Content = '（づ￣3￣）づ╭❤～';
    }
    return result;
};