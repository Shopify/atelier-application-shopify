import 'isomorphic-fetch';
import Koa from 'koa';
import next from 'next';
import dotenv from 'dotenv';
import session from 'koa-session';
import createShopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
import graphQLProxy, {ApiVersion} from '@shopify/koa-shopify-graphql-proxy';

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const {SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  // HACK to make Shopify oauth redirection work with Codesandbox
  server.use(async (ctx, next) => {
    if (HOST != null) {
      Object.defineProperty(ctx, 'host', {
        get: () => HOST,
        configurable: true,
      });
    }

    await next();
    return;
  });

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products'],
      afterAuth(ctx) {
        const {shop, accessToken} = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {httpOnly: false});
        ctx.redirect('/');
      },
    }),
  );

  server.use(graphQLProxy({version: ApiVersion.October19}));
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
