import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ngoRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          city: z.string().optional(),
          state: z.string().optional(),
          verifiedOnly: z.boolean().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const filters = input ?? {};

      return ctx.db.ngo.findMany({
        where: {
          ...(filters.verifiedOnly ? { isVerified: true } : {}),
          ...(filters.city
            ? { city: { contains: filters.city, mode: "insensitive" } }
            : {}),
          ...(filters.state
            ? { state: { equals: filters.state, mode: "insensitive" } }
            : {}),
          ...(filters.search
            ? {
                OR: [
                  { name: { contains: filters.search, mode: "insensitive" } },
                  {
                    description: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          _count: {
            select: {
              rescues: true,
              campaigns: true,
              members: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ngo = await ctx.db.ngo.findUnique({
        where: { slug: input.slug },
        include: {
          campaigns: {
            orderBy: {
              createdAt: "desc",
            },
          },
          rescues: {
            include: {
              reportedBy: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 12,
          },
          members: {
            select: {
              id: true,
              name: true,
              role: true,
              image: true,
            },
          },
          _count: {
            select: {
              rescues: true,
              campaigns: true,
              members: true,
            },
          },
        },
      });

      if (!ngo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ONG parceira não encontrada.",
        });
      }

      return ngo;
    }),
});
