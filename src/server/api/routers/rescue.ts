import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { RescueStatus, UrgencyLevel } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const rescueRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          species: z.string().optional(),
          status: z.nativeEnum(RescueStatus).optional(),
          urgency: z.nativeEnum(UrgencyLevel).optional(),
          city: z.string().optional(),
          limit: z.number().min(1).max(100).default(50).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const filters = input ?? {};

      return ctx.db.rescueCase.findMany({
        where: {
          ...(filters.species
            ? { species: { equals: filters.species, mode: "insensitive" } }
            : {}),
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.urgency ? { urgency: filters.urgency } : {}),
          ...(filters.city
            ? { city: { contains: filters.city, mode: "insensitive" } }
            : {}),
        },
        include: {
          reportedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          assignedNgo: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          campaign: {
            select: {
              id: true,
              title: true,
              goalAmount: true,
              currentAmount: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: filters.limit ?? 50,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const rescue = await ctx.db.rescueCase.findUnique({
        where: { id: input.id },
        include: {
          reportedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
          assignedNgo: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              phone: true,
              email: true,
              pixKey: true,
              city: true,
              state: true,
            },
          },
          campaign: {
            include: {
              donations: {
                select: {
                  id: true,
                  amount: true,
                  paymentMethod: true,
                  paymentStatus: true,
                  createdAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 10,
              },
            },
          },
        },
      });

      if (!rescue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Caso de resgate não encontrado.",
        });
      }

      return rescue;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
        description: z
          .string()
          .min(10, "A descrição deve ter no mínimo 10 caracteres"),
        species: z.string().min(2, "Informe a espécie do animal"),
        urgency: z.nativeEnum(UrgencyLevel).default(UrgencyLevel.MEDIUM),
        city: z.string().min(2, "A cidade é obrigatória"),
        state: z.string().min(2, "O estado é obrigatório (UF)"),
        address: z.string().optional(),
        photos: z.array(z.string().url("URL de foto inválida")).default([]),
        assignedNgoId: z.string().optional(),
        reportedById: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let reporterId = ctx.session?.user?.id ?? input.reportedById;

      if (!reporterId) {
        const fallbackUser = await ctx.db.user.findFirst();
        if (fallbackUser) {
          reporterId = fallbackUser.id;
        } else {
          const defaultCitizen = await ctx.db.user.create({
            data: {
              name: "Cidadão Anônimo",
              email: "cidadao@guardioesdafauna.org",
            },
          });
          reporterId = defaultCitizen.id;
        }
      }

      return ctx.db.rescueCase.create({
        data: {
          title: input.title,
          description: input.description,
          species: input.species,
          urgency: input.urgency,
          status: RescueStatus.REPORTED,
          city: input.city,
          state: input.state,
          address: input.address,
          photos: input.photos,
          reportedById: reporterId,
          assignedNgoId: input.assignedNgoId,
        },
        include: {
          reportedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          assignedNgo: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      });
    }),
});
