import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

export const usersRouter = createTRPCRouter({
  getUserByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      const user = clerkClient.users.getUserList({
        username: [input.username],
        limit: 1,
      });

      return user;
    }),
  updateUser: protectedProcedure
    .input(z.object({ pronouns: z.string() }))
    .mutation(({ input, ctx }) => {
      return clerkClient.users.updateUser(ctx.user.id, {
        publicMetadata: { pronouns: input.pronouns },
      });
    }),
});
