const { initTRPC } = require('@trpc/server');

const t = initTRPC.create();
const router = t.router;
module.exports = { t, router };
