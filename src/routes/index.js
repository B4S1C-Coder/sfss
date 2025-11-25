const { buildRoutes } = require('../utils/decorators');
const logger = require('../config/logger');
const glob = require('glob');
const path = require('path');

// function listExpressRoutes(app) {
//   console.log("\nRegistered Express Routes:");
//   const routes = [];

//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Single route directly on app
//       const method = Object.keys(middleware.route.methods)[0].toUpperCase();
//       routes.push(`${method} ${middleware.route.path}`);
//     } else if (middleware.name === "router" && middleware.handle.stack) {
//       // Router mounted: inspect internals
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           const method = Object.keys(handler.route.methods)[0].toUpperCase();
//           routes.push(`${method} ${handler.route.path}`);
//         }
//       });
//     }
//   });

//   // routes.forEach((r) => console.log("  -", r));
//   routes.forEach((r) => logger.info("  -", r));
//   console.log("End of routes\n");
// }


function setupRoutes(app, container) {
  logger.info("SETTING UP ROUTES")
  // Load all controllers to trigger decorators
  const controllerFiles = glob.sync(path.join(__dirname, '../controllers/**/*Controller.js'));
  controllerFiles.forEach(file => {
    require(file);
  });

  // Build routes from decorated controllers
  const apiRouter = buildRoutes(container);
  
  app.use('/api', apiRouter);

  // listExpressRoutes(app);
  
  logger.info('Routes auto-registered successfully');
}

module.exports = setupRoutes;