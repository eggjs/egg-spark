const { Readable } = require('stream');
const parseTpl = require('./parse-tpl');
const isFunction = require('lodash.isfunction');
/**
 * 流式渲染
 */
class Spark extends Readable {
  constructor(options) {
    super(options);
    this.appContext = options.ctx;
    this.tplPath = null;
    this.dataList = [];
    this.regList = [];
  }

  _read() {
  }

  /**
   * 对外暴露的 render 方法，开始分块渲染整个页面并 push 到流中，渲染结束后关闭当前流
   * @public
   * @return {Promise<void>}
   */
  async render(tplPath, pageConfig) {
    try {
      this.tplPath = tplPath;
      const { regList, dataList } = pageConfig;
      this.regList = regList;
      this.dataList = dataList;
      await this.renderBlockList();
      this.checkIsDone();
    } catch (e) {
      this.appContext.logger.error(`[egg-spark] render error: ${e.stack}`, e);
    }
  }

  /**
   * 渲染页面 block ，并将渲染结果 push 到当前流中
   * @private
   * @param data
   * @param index
   * @return {Promise<void>}
   */
  async renderBlock(data, index) {
    this.appContext.logger.debug(`[egg-spark] RenderBlock ${index} start.`);
    // 获取 block 数据 -> 尝试用现有数据渲染整个模板 -> 从渲染结果中提取当前 block 的内容

    const blockData = await (isFunction(data) ? Promise.resolve(data()) : Promise.resolve(data));

    const renderStart = Date.now();
    this.appContext.logger.debug(`[egg-spark] RenderBlock ${index} renderTplString start time: ${renderStart}`);
    const renderResult = await this.renderTplString(this.tplPath, blockData);
    this.appContext.logger.debug(`[egg-spark] RenderBlock ${index} renderTplString end time: ${Date.now() - renderStart}`);

    const blockHtml = this.getNthBlockHtml(renderResult, this.regList, index);

    this.push(`${blockHtml}`);
    this.appContext.logger.debug(`[egg-spark] RenderBlock ${index} end.`);
  }

  /**
   * 根据给定的正则，将页面分成 n+1 块，取其中第 index 个内容并返回
   * @private
   * @param html
   * @param regList
   * @param index
   * @return {string}
   */
  getNthBlockHtml(html, regList, index) {
    return parseTpl.getNthBlockHtml(html, regList, index);
  }

  /**
   * 给定模板字符串和数据，得到渲染后的结果. 默认会从 viewEngine 上根据文件后戳获取渲染引擎，取不到的情况下走 nunjucks 渲染。
   * @private
   * @param tplString {string} 模板字符串
   * @param tplData {object} 渲染模板需要的数据
   * @returns {Promise<string>}
   */
  async renderTplString(tplString, tplData) {
    return await this.appContext.renderView(tplString, tplData);
  }

  /**
   * 判断并关闭当前 stream
   * @private
   */
  checkIsDone() {
    this.push(null);
  }


  /**
   * 根据页面配置，渲染所有页面 block
   * @private
   * @return {Promise<any>}
   */
   renderBlockList = () => {
     return new Promise((r, reject) => {
       const asyncList = this.dataList.map((data, index) => {
         return () => this.renderBlock(data, index);
       });
       // TODO: 先串行执行, 后续考虑并发,但是需要控制顺序.(不采用 bigpipe 而仅采用流式渲染, 是因为兼容问题太多, 要解决的话侵入性太强.)
       return asyncList.reduce((previousValue, currentValue) => {
         return previousValue.then(() => currentValue());
       }, Promise.resolve())
         .then(() => {
           r();
         })
         .catch((err) => {
           reject(err);
         });
     });
   }
}

module.exports = Spark;

