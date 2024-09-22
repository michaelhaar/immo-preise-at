import { createTRPCContext } from '@/lib/trpc/init';
import { appRouter } from '@/trpc-routers/app/app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta(_opts) {
      return {
        headers: new Headers([['cache-control', `s-maxage=${secondsUntilNext5AmUtc()}, must-revalidate`]]),
      };
    },
  });

export { handler as GET, handler as POST };

function secondsUntilNext5AmUtc() {
  const now = new Date();
  const target = new Date(now);

  target.setUTCHours(5, 0, 0, 0);

  if (now.getUTCHours() >= 5) {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
  return diffSeconds;
}
