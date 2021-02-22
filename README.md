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

Streaming rendering plugin for eggjs.
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
        // Call the spark.render method and pass in the path of the template to be rendered 
        this.ctx.spark.render('admin/index.nj', {
          // regList is a regular list used to split pages. According to the length of regList, the page is split into regList.length+1 
          regList: [/<!--\s*?spark:split\s*?-->/],
          // dataList：According to the page blocks segmented by regList, the data required by the corresponding rendering template is passed in. 
          // You can pass in a data object, or you can pass in a synchronous or asynchronous data method 
          dataList: [
            mergerCommonContext({}, this.ctx),
            async () => getPageData.call(this),
          ],
        });
    
        async function getPageData() {
          const { id, ...others } = this.ctx.query || {};
          const userInfo = await this.service.getUserInfo(id);
          // Your Business logic 
          const pageData = {
            userInfo,
            ...others
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
