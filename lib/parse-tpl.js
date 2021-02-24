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

exports.getNthBlockHtml = getNthBlockHtml;
