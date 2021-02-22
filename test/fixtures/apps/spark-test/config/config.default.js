'use strict';

module.exports = () => {
  return {
    keys: '123213',
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.nj': 'nunjucks',
      },
    },
    proxy: {
      envVersion: {
        havanassohsf: '1.0.0',
      },
    },
  };
};
