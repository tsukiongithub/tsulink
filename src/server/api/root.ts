import { createTRPCRouter } from "@/server/api/trpc";

import { exampleRouter } from "@/server/api/routers/example";
import { usersRouter } from "./routers/users";
import { linksRouter } from "./routers/links";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: usersRouter,
  links: linksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
