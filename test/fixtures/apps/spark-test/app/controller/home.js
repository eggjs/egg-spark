'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    this.ctx.spark.render('index.nj', {
      regList: [/<!--\s*?spark:split\s*?-->/, /<!--\s*?spark:spli\s*?-->/],
      dataList: [
        { spark1: 'spark1' },
        Promise.resolve({
          spark2: 'spark2',
        }),
        { spark3: 'spark3' },
      ],
    });
  }
}

module.exports = HomeController;
