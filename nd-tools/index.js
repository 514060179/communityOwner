const fs = require('fs-extra')
const path = require('path')
const readline = require('linebyline')
const os = require('os')
const tunnel = require('tunnel')
const google = require('@vitalets/google-translate-api')
const resolve = path.resolve('')
const pPath = src => path.join(resolve, src)
const zhI18nJson = require(pPath('/locale/zh-Hans.json'))
const ora = require('ora')
const spinner = ora('Loading unicorns').start()
spinner.color = 'red'

// 匹配文件中需要翻译的字段
const i18nKey = /(?<=(\$t|i18nRender|i18n\.t)\(["'])[^'"]+/gm
// 是否已替换
const isReplaced = /-[a-zA-Z0-9]{3}$/
// 匹配单行注释
const comment = /(\/\/)|(<!--)|(\/\*)/g
// 匹配汉字
const chinese = /[\u4e00-\u9fa5]+/g

// src views路径
// const srcPath = path.resolve('../../src')
const resolveLocalesPath = filePath => path.join(resolve, '/locale', filePath)

class I18nAutoText {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    // 源数据
    this.sourceData = []
    // 翻译表
    this.translationData = {}
    // 需要翻译国际化字段
    this.translateLanguage = ['zh-Hans', 'zh-Hant']
  }
  /**
   * 开启
   * */
  auto() {
    this.startSpinner('1: 初始化工具。。。')
    this.finishSpinner('succeed', '开启翻译工具')
    this.start()
  }
  startSpinner(text) {
    spinner.start()
    spinner.text = '🚀 ' + text
  }
  finishSpinner(type, text) {
    spinner[type](text)
  }
  /**
   * 自动化翻译
   * */
  async start() {
    try {
      const viewsPath = path.join(resolve, '/pages')
      const componentsPath = path.join(resolve, '/components')
      const apiPath = path.join(resolve, '/api')
      this.startSpinner('查找文件文件列表。。。')
      // 文件列表
      const [vueFiles, componentsFiles, apiFile] = await Promise.all([viewsPath, componentsPath, apiPath].map(modulePath => this.queryFile(modulePath)))
      this.finishSpinner('succeed', `2: 查找文件文件列表成功, 'views'(${vueFiles.length})、components(${componentsFiles.length}})和api(${apiFile.length})'`)
      this.startSpinner('查找匹配文件中的中文国际化字段。。。')
      // 遍历查询
      for await (const input of [...vueFiles, ...componentsFiles, ...apiFile]) {
        const res = await this.getCnTextFromViewFile(input)
        if (res.i18nKeyList.length) {
          this.sourceData.push(res)
        }
      }
      this.finishSpinner('succeed', `3: 需要翻译${this.translationData['zh-Hans'].length}个`)
      if (this.translationData['zh-Hans'].length) {
        console.log(
          '中文简体：',
          this.translationData['zh-Hans'].map(item => item.text)
        )
      }
      // 是否需要替换或者翻译的文件
      if (!this.sourceData.length) {
        this.finishSpinner('warn', '暂无需要翻译的文件')
        this.finishSpinner('warn', `+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+✅${new Date()}✅+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+📝+`)
        return
      }
      // 翻译表是否需要翻译
      if (this.translationData['zh-Hans'].length) {
        this.startSpinner('翻译。。。')
        // 循环翻译
        const size = 100
        for await (const lang of this.translateLanguage.filter(lang => lang !== 'zh-Hans')) {
          let result = []
          const sourceData = this.translationData['zh-Hans'].slice()
          if (sourceData.length > size) {
            let sourceList = []
            let _result = []
            const page = Math.ceil(sourceData.length / size)
            for (let i = 0; i < page; i++) {
              sourceList = sourceData.splice(0, size)
              _result = await this.generatedLocaleParams(sourceList, { from: 'zh-Hans', to: lang })
              _result.forEach(item => result.push(item))
            }
          } else {
            result = await this.generatedLocaleParams(sourceData, { from: 'zh-Hans', to: lang })
          }
          this.translationData[lang] = result
        }
        this.finishSpinner('info', '4: (a):翻译成功')
        this.startSpinner('写入到翻译表中。。。')
        // 写入到翻译表中
        await Promise.all(this.translateLanguage.map(key => this.setLocaleMap(key, this.translationData[key])))
        this.finishSpinner('succeed', '4: (b):写入翻译表')
      } else {
        spinner.info('4: 无需翻译，翻译表中已存在！！！')
      }
      this.startSpinner('🚀替换文件。。。')
      // 替换文件
      for await (const file of this.sourceData) {
        await this.replaceI18n(file)
      }
      this.finishSpinner('succeed', '5: 替换文本国际化成功。✨✨✨')
      this.finishSpinner('info', '请检查翻译表！！！')
      this.finishSpinner('info', '请检查源文件！！！')
      this.finishSpinner('info', '请检查视图！！！')
    } catch (e) {
      console.log(e)
      spinner.fail('翻译失败-------------')
    }
  }
  /**
   * 查询文件
   * */
  async queryFile(modulePath) {
    try {
      const firstModuleList = fs
        .readdirSync(modulePath)
        // 过滤掉非目录
        .filter(item => !item.includes('.'))
      // 需要翻译的.vue文件
      const vueFileList = []
      // view页面模块
      firstModuleList.forEach(fileModule => {
        // 查找view业务文件
        this.traversalDir(`${modulePath}/${fileModule}`, (filePath, file) => {
          if (file.match(/\.vue|\.js$/)) {
            vueFileList.push({
              fileModule,
              name: file,
              filePath
            })
          }
        })
      })
      return Promise.resolve(vueFileList)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * 遍历文件夹
   * @param {String | URL} path
   * @param {Function} callBack
   * */
  traversalDir(path, callBack) {
    const dirList = fs.readdirSync(path)
    dirList.forEach(item => {
      const fullPath = path + '/' + item
      if (fs.statSync(fullPath).isFile()) {
        callBack(fullPath, item)
      } else if (fs.statSync(fullPath).isDirectory()) {
        this.traversalDir(fullPath, callBack)
      }
    })
  }
  /**
   * 生成随机Key，随机范围是大小写字母和数字
   * @param {Number} length
   * @returns {string}
   */
  generateRandomKey(length) {
    let result = ''
    const generateSequenceArr = (start, end) => {
      return Array.from({ length: end - start + 1 }, (item, index) => start + index)
    }
    const generateRandomNum = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min) // 不含最大值，含最小值
    }
    const source = String.fromCharCode(
      ...[
        ...generateSequenceArr(49, 57), // num 49-57
        ...generateSequenceArr(65, 90), // lowerCase 97-122
        ...generateSequenceArr(97, 122) // upperCase 65-90
      ]
    )
    for (let i = 0; i < length; i++) {
      result += source[generateRandomNum(0, source.length)]
    }
    // 也可以通过下面方式生成,但最高13位
    // Math.random().toString(16).slice(2, 2 + length)
    return result
  }
  /**
   * 找出src/view下所有组件中i18n中文文本
   * @param {String | URL} file
   * */
  getCnTextFromViewFile(file) {
    return new Promise(resolve => {
      if (Object.prototype.toString.call(this.translationData['zh-Hans']) !== '[object Array]') {
        this.translationData['zh-Hans'] = []
      }
      const r1 = readline(file.filePath)
      const i18nKeyList = []
      const zhList = Object.keys(zhI18nJson).map(item => ({ key: item, text: zhI18nJson[item] }))
      r1.on('line', (line, lineCount) => {
        // 过滤单行注释
        const isCommentLine = line.match(comment)
        if (isCommentLine) {
          return
        }
        // 找出每一行拥有 i18n.t i18nRender $t的语法
        const i18nText = line.match(i18nKey)
        if (i18nText && i18nText.some(i => i.match(chinese)) && i18nText.some(i => !i.match(isReplaced))) {
          const texts = []
          i18nText.forEach(text => {
            if (!text.match(isReplaced)) {
              const data = { text }
              const sourceFind = zhList.find(item => item.text === text)
              // 查找源文件，如果有就拿翻译表的
              if (sourceFind) {
                data.key = sourceFind.key
              } else {
                const find = this.translationData['zh-Hans'].find(i => i.text === text)
                data.key = (find && find.key) || `${text}-${this.generateRandomKey(3)}`
                !find && this.translationData['zh-Hans'].push(data)
              }
              texts.push(data)
            }
          })
          i18nKeyList.push({
            texts,
            lineCount
          })
        }
      })
      r1.on('close', () => {
        resolve({
          i18nKeyList,
          filePath: file.filePath
        })
      })
    })
  }
  /**
   * 翻译函数
   * @param {Array} zhText
   * @param {Object} options
   * */
  async generatedLocaleParams(zhText, options = { from: 'zh-CN', to: 'zh-TW' }) {
    try {
      let chunkValuesLength = 0
      let chunk = []
      const chunks = []
      const sourceKeyValues = []
      for (let i = 0; i < zhText.length; i++) {
        sourceKeyValues.push([zhText[i].key, zhText[i].text])
      }

      sourceKeyValues.forEach(([key, value]) => {
        // Google 翻译单次最大字符长度 5000 字, 5 为占位分隔符长度
        if (chunkValuesLength + value.length + 5 >= 5000) {
          chunks.push(chunk)
          chunkValuesLength = 0
          chunk = []
        } else {
          chunk.push({ key, value })
          chunkValuesLength += value.length + 5
        }
      })
      if (chunk.length > 0) {
        // 遍历完后检查不满 5000 字符的遗留
        chunks.push(chunk)
        chunkValuesLength = 0
        chunk = []
      }
      const resultJson = {}
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const mergeText = chunk.map(v => v.value).join('\n###\n') // 合并文案
        const { text } = await this.googleTranslator(mergeText)
        const resultValues = text.split(/\n *# *# *# *\n/).map(v => v.trim()) // 拆分文案
        if (chunk.length !== resultValues.length) {
          throw new Error('翻译前文案碎片长度和翻译后的不一致')
        }
        chunk.forEach(({ key }, index) => {
          resultJson[key] = resultValues[index]
        })
      }

      const resultList = []

      for (const key in resultJson) {
        resultList.push({ key, text: resultJson[key] })
      }

      return Promise.resolve(resultList)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  googleTranslator(text) {
    return google(
      text,
      { from: 'zh-CN', to: 'zh-TW' },
      {
        agent: tunnel.httpsOverHttp({
          proxy: {
            host: '127.0.0.1', // 代理 ip
            port: 7890, // 代理 port
            headers: {
              'User-Agent': 'Node'
            }
          }
        })
      }
    )
  }
  /**
   * 添加到项目翻译表中
   * */
  async setLocaleMap(key, data) {
    try {
      const dataJson = require(pPath(`/locale/${key}.json`))
      const params = Object.assign(dataJson)
      data.forEach(item => {
        params[item.key] = item.text
      })
      await fs.outputFile(resolveLocalesPath(`./${key}.json`), JSON.stringify(params, null, 2))
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * 替换项目中i18n文本
   * */
  replaceI18n(file) {
    const r1 = readline(file.filePath)
    const i18nKeyList = file.i18nKeyList
    const bakPath = file.filePath + '.bak'
    const writeStream = fs.createWriteStream(bakPath)
    r1.on('line', (line, lineCount) => {
      // 替换
      // const i18nText = line.match(i18nKey)
      // let newLine = line
      // if (i18nText) {
      //   i18nText.forEach(item => {
      //     const newText = item.replace(/-[a-zA-Z0-9]{3}/g, '')
      //     const regex = new RegExp(`(?<=(\\$t|i18n\\.t)\\(["'])${item}`)
      //     newLine = newLine.replace(regex, newText)
      //   })
      // }
      const find = i18nKeyList.find(item => item.lineCount === lineCount)
      let newLine = line
      if (find) {
        find.texts.forEach(item => {
          const regex = new RegExp(`(?<=(\\$t|i18n\\.t)\\(["'])${item.text}`)
          newLine = newLine.replace(regex, item.key)
          console.log(item)
        })
      }
      writeStream.write(newLine + os.EOL)
    })
    r1.on('close', () => {
      writeStream.end()
      fs.renameSync(bakPath, file.filePath)
    })
  }
}

const i18nAutoText = new I18nAutoText()
i18nAutoText.auto()
