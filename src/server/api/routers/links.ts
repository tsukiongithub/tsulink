import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const linksRouter = createTRPCRouter({
  getLinks: publicProcedure
    .input(z.object({ userId: z.string().nullish() }))
    .query(({ input, ctx }) => {
      const { userId } = input;

      if (!userId) {
        return;
      }

      return ctx.prisma.links.findMany({
        where: {
          user_id: userId,
        },
      });
    }),
  getLink: publicProcedure
    .input(z.object({ linkId: z.string().nullish() }))
    .query(({ input, ctx }) => {
      const { linkId } = input;

      if (!linkId) {
        return;
      }

      return ctx.prisma.links.findFirst({
        where: {
          id: linkId,
        },
      });
    }),
  createLink: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        href: z.string(),
        ageRestricted: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { name, href: rawHref, ageRestricted } = input;

      let href = rawHref;

      const httpsRE = new RegExp("^https?://");

      if (!httpsRE.test(rawHref)) {
        href = `https://${rawHref}`;
      }

      return ctx.prisma.links.create({
        data: {
          name: name,
          href: href,
          age_restriced: ageRestricted,
          user_id: ctx.user.id,
        },
      });
    }),
  editLink: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        href: z.string(),
        ageRestricted: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.links.update({
        where: { id: input.id },
        data: {
          name: input.name,
          href: input.href,
          age_restriced: input.ageRestricted,
        },
      });
    }),
  deleteLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.links.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
