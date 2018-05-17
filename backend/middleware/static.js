const send = require('koa-send');
const logger = require('../util/logger');
const {acceptsHtml} = require('../util/helper');
module.exports = (root = '') => {
  return async function serve(ctx, next) {
    let done = false;
    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      try {
        // // 当希望收到html时，推送额外资源。
        // if (/(\.html|\/[\w-]*)$/.test(ctx.path)) {
        //   logger.info('Send Path', ctx.path);
        //   depTree.currentKey = ctx.path;
        //   // server push
        //   for (const file of depTree.getDep()) {
        //     // server push must before response!
        //     // https://huangxuan.me/2017/07/12/upgrading-eleme-to-pwa/#fast-skeleton-painting-with-settimeout-hack
        //     push(ctx.res.stream, file);
        //   }
        // }
        done = await send(ctx, ctx.path, {root});
      } catch (err) {
        if (err.status !== 404) {
          logger.error(err);
          throw err;
        }
      }
    }
    if (!done) {
      await next();
    }
  };
};
