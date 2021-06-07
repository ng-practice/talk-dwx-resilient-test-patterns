import jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(`${__dirname}/assets/db.json`);
const middlewares = jsonServer.defaults();
const rewrites = jsonServer.rewriter({
  '/todos?query=all': '/todos',
  '/todos?query=active': '/todos?isDone=false',
  '/todos?query=complete': '/todos?isDone=true',
});

server.use(middlewares);
server.use(rewrites);
server.use(router);
server.listen(3333, () =>
  console.log('JSON Server is running at http://localhost:3333')
);
