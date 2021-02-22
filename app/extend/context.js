const Spark = require('../../lib/spark');

module.exports = {
  get spark() {
    return {
      render: (tplPath, pageConfig) => {
        this.type = 'html';
        // tell web server(nginx in general), don't use buffer for this proxyed http request.
        this.set('X-Accel-Buffering', 'no');
        const pipe = new Spark({ ctx: this });
        this.body = pipe;
        return pipe.render(tplPath, pageConfig);
      },
    };
  },
};
