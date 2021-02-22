/**
 * 根据给定的正则 regList ，将页面分成 regList.length + 1 块，取其中第 nth 个内容并返回。
 * TODO: 缓存处理
 * @param htmlStr {string} 要处理的模板字符串
 * @param regList
 * @param nth {number} 需要返回片段的索引
 * @return {string} 第 nth 个片段内容
 */
function getNthBlockHtml(htmlStr, regList, nth) {
  let leftPos = 0;
  let rightPos = 0;
  let regStart = null;
  let regEnd = null;
  if (nth === 0) {
    leftPos = 0;
    regStart = /^/;
    regEnd = regList[nth];
  } else if (nth === regList.length) {
    rightPos = htmlStr.length;
    regStart = regList[regList.length - 1];
    regEnd = /$/;
  } else {
    regStart = regList[nth - 1];
    regEnd = regList[nth];
  }

  leftPos = htmlStr.match(regStart).index;
  rightPos = htmlStr.match(regEnd).index;
  return htmlStr.substring(leftPos, rightPos);
}

/**
 * @type {{[string]: {tpl: string}}|{}} parseTplObj 解析 tpl 后获得结构化数据
 * {
 *   'blockHeader': {
 *     'tpl': '<div>xxx</div>'
 *   },
 *   'blockFooter':{
 *     'tpl': '<div>xxx</div>;
 *   }
 * }
 */

/**
 * 根据分割符将字符串解析为结构化的数据
 * // TODO:
 *  1. 由于使用了 string.matchAll 方法，暂时仅用于 Node.js > 12.0.0 版本
 *  2. 直接使用正则全局匹配的方式效率会比较低，后续有空的话考虑逐字匹配的方式提高运行效率
 *
 * @param {string} tplStr 解析的模板字符串
 * @return {object} parseTplObj
 */
function parseTpl(tplStr) {
  // const commentStart = '<!--';
  // const commentEnd = '-->';
  const TYPE = {
    start: 'start',
    end: 'end',
  };
  const parseObj = {};
  const reg = /<!--\s*?spark:(start|end)\s+(\w*)[^]*?-->/gm;
  const html = tplStr;
  const res = [...html.matchAll(reg)];
  let isStart = true;
  let startPos = 0;
  let endPos = 0;
  let currentId = null;
  for (let i = 0; i < res.length; i++) {
    const cur = res[i];
    const [match, type, id] = cur;
    const { index } = cur;
    if (isStart && type === TYPE.start) {
      isStart = false;
      startPos = index + match.length;
      currentId = id;
    } else if (!isStart && type === TYPE.end) {
      endPos = index;
      isStart = false;
      if (currentId === id) {
        isStart = true;
        parseObj[currentId] = {
          tpl: html.substring(startPos, endPos),
        };
      } else {
        throw new Error(`parseTpl error: block id 为 ${currentId} 的结束标志没有找到，请检查模板标志是否正确。`);
      }
    } else {
      throw new Error(`parseTpl error: block id 为 ${currentId} 的结束标志没有找到，页面标志必须按照 spark:start spark:end  的顺序进行配置。`);
    }
  }
  return parseObj;
}

exports.parseTpl = parseTpl;
exports.getNthBlockHtml = getNthBlockHtml;
