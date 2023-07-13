import plugin from '../../lib/plugins/plugin.js'
import fs from 'fs'
import child_process from 'child_process'

// 这里将urgroupid替换成你的内裤群号
const mygroupid = urgroupid
// 这里将C:/Users/Administrator/Documents/new-ender-lol替换为你clone下来仓库的地址
const globaladdr = 'C:/Users/Administrator/Documents/new-ender-lol'
// 这里将backtrouname改为你内裤的名字
const backtrouname = 'backtrouname'
export class QQVerify extends plugin {
  constructor() {
    super({
      name: 'QQVerify',
      dsc: '自动hwid插件 For YunzaiBot By Guagua#1337',
      event: 'message',
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: /^#验证\s+(.+)/i,
          /** 执行方法 */
          fnc: 'getVerify'
        }
      ]
    })
  }

  async getVerify(e, q) {
    if (e.group_id !== mygroupid) {
      e.reply(`你没有验证权限！`, true)
      logger.info(e.group_id)
      return
    }

    const alreadyVerified = checkIfUserAlreadyVerified(e.user_id)
    if (alreadyVerified) {
      e.reply(`你已经验证过了！`, true)
      return
    }

    // 提取验证内容
    const commandRegex = /^#验证\s+(.+)/i;
    const commandMatch = e.raw_message.match(commandRegex);
    if (!commandMatch) {
      e.reply(`验证指令格式不正确！`, true);
      return;
    }
    const content = commandMatch[1];

    // 写入内容到文件的最后一行
    fs.appendFile(`${globaladdr}/1`, `${content}\r\n`, function (err) {
      if (err) throw err
      console.log('Saved!')
      child_process.execFile(`${globaladdr}/114514.bat`, null, { shell: true }, function (err, stdout, stderr) {
        if (err) throw err
        console.log(stdout)
      })
    })

    // 将整数型 e.user_id 写入文件
    fs.appendFile(`${globaladdr}/checkqq`, `${e.user_id}\r\n`, function (err) {
      if (err) throw err
      console.log('User ID saved to checkqq file!')
    })

    e.reply(`尊敬的${backtrouname} User ${e.user_id} 已通过验证！`, true)
  }
}

function checkIfUserAlreadyVerified(userId) {
  const filePath = `${globaladdr}/checkqq`;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const userIDs = fileContent.trim().split('\r\n');
    const parsedUserIDs = userIDs.map(id => parseInt(id));

    if (parsedUserIDs.includes(userId)) {
      return true;
    }
  } catch (err) {
    console.error('Error reading verification file:', err);
  }

  return false;
}
