// create trpc crud endpoints router for appointments and export it using module.exports
const { appRouter } = require('./trpc/router.cjs');


module.exports = appRouter;
