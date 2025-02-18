import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch';
import MD5 from '../utils/md5.js';


export class translate extends plugin {
  constructor() {
    super({
      name: '百度翻译',
      dsc: '百度翻译',
      event: 'message',
      priority: 1000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#翻译",
          /** 执行方法 */
          fnc: 'translate'
        }
      ]
    })
  }
  genSign(data) {
    const secret = 'G9bqL2z3PPt7qnirR6nd'
    const s = `${data.appid}${data.q}${data.salt}${secret}`
    // console.log(s);
    return MD5(s)
    // return MD5('2015063000000001apple143566028812345678')
  }


  async translate(e) {
    const str = e.msg.replace('#翻译', '')
    // const data = {
    //   q: 'apple',
    //   from: 'en',
    //   to: 'zh',
    //   appid: 2015063000000001,
    //   salt: 1435660288,
    // }
    const data = {
      q: str,
      from: 'auto',
      to: 'zh',
      appid: '20220908001335899',
      salt: 18200193133,
    }
    const sign = this.genSign(data)
    // console.log(sign);
    data.q = encodeURI(data.q)
    data.sign = sign
    const res = await fetch(`https://fanyi-api.baidu.com/api/trans/vip/translate?q=${data.q}&from=${data.from}&to=${data.to}&appid=${data.appid}&salt=${data.salt}&sign=${data.sign}`)
    const jsn = await res.json()
    // console.log(jsn);
    if (jsn.trans_result) {
      e.reply(`翻译结果：${jsn.trans_result[0].dst}`)
    } else {
      e.reply(`错误码：${jsn.error_code}\n错误信息：${jsn.error_msg}`)
    }
    return true
  }
}