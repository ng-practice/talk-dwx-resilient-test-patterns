import jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('src/assets/db.json');
const middlewares = jsonServer.defaults();
const rewrites = jsonServer.rewriter({
  '/todos?query=all': '/todos',
  '/todos?query=active': '/todos?isDone=false',
  '/todos?query=complete': '/todos?isDone=true',
});

server.use(middlewares);
server.use(router);
server.use(rewrites);
server.listen(3001, () =>
  console.log('JSON Server is running at http://localhost:3001')
);
