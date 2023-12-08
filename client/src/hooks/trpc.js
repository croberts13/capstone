import { createTRPCReact } from '@trpc/react-query';
// import type { AppRouter } from '../../server/router';
/** @typedef {import('../../../server/trpc/router.cjs').AppRouter} AppRouter */

/** @type {ReturnType<typeof createTRPCReact<AppRouter>>} */
export const trpc = createTRPCReact();
