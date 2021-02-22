# egg-spark

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-spark.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-spark
[travis-image]: https://img.shields.io/travis/eggjs/egg-spark.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-spark
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-spark.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-spark?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-spark.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-spark
[snyk-image]: https://snyk.io/test/npm/egg-spark/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-spark
[download-image]: https://img.shields.io/npm/dm/egg-spark.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-spark

egg 流式渲染插件。

## Install

```bash
$ npm i egg-spark --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.spark = {
  enable: true,
  package: 'egg-spark',
};
```

## Example

```js
    // {app_root}/controller/admin.js
    module.exports = app => class AdminController extends app.Controller {
      async index() {
        // 调用 spark.render 方法，传入要渲染的模板地址
        this.ctx.spark.render('admin/index.nj', {
          // regList 是一个用来切分页面的正则列表，根据 regList 的长度将页面切分为 regList.length+1 份
          regList: [/<!--\s*?spark:split\s*?-->/],
          // dataList：根据 regList 切分的页面块，来传入对应的渲染模板需要的数据。可以传入数据 object ，也可以传入同步或者异步的数据方法
          dataList: [
            mergerCommonContext({}, this.ctx),
            async () => getPageData.call(this),
          ],
        });
    
        async function getPageData() {
          const { categoryId, ...others } = this.ctx.query || {};
          const allCategories = await this.service.userInfo.getCategories();
          let activeCategory = allCategories[0].categoryId;
          // 业务逻辑
          const pageData = {
            categoryInfo,
            accountInfo: {
              subAccounts,
            },
            ...catPageData,
          };
          return mergerCommonContext({ pageData }, this.ctx);
        }
      }
    };
```


## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
