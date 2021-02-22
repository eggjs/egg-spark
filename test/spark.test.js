'use strict';

const mock = require('egg-mock');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const parseTpl = require('../lib/parse-tpl');

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

describe('spark-test', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/spark-test',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mock.restore);
  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200);
  });
});

describe('spark-test spark', () => {
  let app;
  let ctx;
  let result;
  before(() => {
    app = mock.app({
      baseDir: 'apps/spark-test',
    });
    return app.ready();
  });
  beforeEach(async () => {
    ctx = app.mockContext();

    ctx.spark.render('index.nj', {
      regList: [/<!--\s*?spark:split\s*?-->/, /<!--\s*?spark:spli\s*?-->/],
      dataList: [
        { spark1: 'spark-1' },
        Promise.resolve({
          spark2: 'spark-2',
        }),
        { spark3: 'spark-3' },
      ],
    });
    result = await streamToString(ctx.body);
  });
  after(() => app.close());
  afterEach(mock.restore);

  it('should set header', async () => {
    assert(ctx.response.header['x-accel-buffering'] === 'no');
  });

  it('should render tpl extends', async () => {
    assert(result.includes('customize'));
    assert(result.includes('Footer'));
  });

  it('should split right', async () => {
    assert(result.includes('spark-1'));
    assert(result.includes('spark-2'));
    assert(result.includes('spark-3'));
  });
  it('should return once', async () => {
    assert(result.indexOf('spark-1') === result.lastIndexOf('spark-1'));
    assert(result.indexOf('spark-2') === result.lastIndexOf('spark-2'));
    assert(result.indexOf('spark-3') === result.lastIndexOf('spark-3'));
  });
});

describe('spark-test parse-tpl', () => {
  it('should parseTpl test-1.nj', () => {
    const test1Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-1.nj')).toString();
    const parsetTplRes1 = parseTpl.parseTpl(test1Str);
    assert(parsetTplRes1.blockHeader !== null);
    assert(parsetTplRes1.blockContent !== null);
  });
  it('should parseTpl test-1-error.nj', () => {
    const test1Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-1-error.nj')).toString();
    try {
      parseTpl.parseTpl(test1Str);
    } catch (e) {
      assert(e.message.indexOf('页面标志必须按照 spark:start spark:end  的顺序进行配置。') >= 0);
    }
  });
  it('should parseTpl test-1-error-2.nj', () => {
    const test1Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-1-error-2.nj')).toString();
    try {
      parseTpl.parseTpl(test1Str);
    } catch (e) {
      assert(e.message.indexOf('的结束标志没有找到，请检查模板标志是否正确') >= 0);
    }
  });
  it('should parseTpl test-2.nj', () => {
    const test2Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-2.nj')).toString();
    const parsetTplRes2 = parseTpl.parseTpl(test2Str);
    assert(parsetTplRes2['spark-1'] !== null);
    assert(parsetTplRes2['spark-2'] !== null);
    assert(parsetTplRes2['spark-3'] !== null);
  });
  it('should getNthBlockHtml test-2.nj 0', () => {
    const test2Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-2.nj')).toString();
    const parseTplRes2 = parseTpl.getNthBlockHtml(test2Str, [/<!--\s*?spark:split\s*?-->/, /<!--\s*?spark:spli\s*?-->/], 0);
    assert(parseTplRes2.includes('head'));
  });
  it('should getNthBlockHtml test-2.nj 1', () => {
    const test2Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-2.nj')).toString();
    const parseTplRes2 = parseTpl.getNthBlockHtml(test2Str, [/<!--\s*?spark:split\s*?-->/, /<!--\s*?spark:spli\s*?-->/], 1);
    assert(parseTplRes2.includes('data-spm="customize"'));
  });
  it('should getNthBlockHtml test-2.nj 2', () => {
    const test2Str = fs.readFileSync(path.resolve(__dirname, './fixtures/parse-tpl/test-2.nj')).toString();
    const parseTplRes2 = parseTpl.getNthBlockHtml(test2Str, [/<!--\s*?spark:split\s*?-->/, /<!--\s*?spark:spli\s*?-->/], 2);
    assert(parseTplRes2.includes('<div class="content">'));
  });
});
