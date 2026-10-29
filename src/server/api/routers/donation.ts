import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CampaignStatus } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function generateMockPixPayload(
  pixKey: string,
  amount: number,
  donationId: string,
): string {
  const cleanKey = pixKey.replace(/[^a-zA-Z0-9@.-]/g, "");
  const formattedAmount = amount.toFixed(2);
  const txId = donationId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase();

  return `00020126580014br.gov.bcb.pix0136${cleanKey}520400005303986540${formattedAmount}5802BR5920GUARDIOES DA FAUNA6009SAO PAULO62140510${txId}6304ABCD`;
}

export const donationRouter = createTRPCRouter({
  getCampaigns: publicProcedure
    .input(
      z
        .object({
          status: z.nativeEnum(CampaignStatus).optional(),
          ngoId: z.string().optional(),
          rescueCaseId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const filters = input ?? {};

      return ctx.db.campaign.findMany({
        where: {
          status: filters.status ?? CampaignStatus.ACTIVE,
          ...(filters.ngoId ? { ngoId: filters.ngoId } : {}),
          ...(filters.rescueCaseId
            ? { rescueCaseId: filters.rescueCaseId }
            : {}),
        },
        include: {
          ngo: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              pixKey: true,
              city: true,
              state: true,
            },
          },
          rescueCase: {
            select: {
              id: true,
              title: true,
              photos: true,
              species: true,
              urgency: true,
              status: true,
            },
          },
          _count: {
            select: {
              donations: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  registerDonation: publicProcedure
    .input(
      z.object({
        campaignId: z.string().min(1, "ID da campanha é obrigatório"),
        amount: z.number().positive("O valor da doação deve ser maior que zero"),
        donorName: z.string().optional(),
        donorEmail: z.string().email("E-mail inválido").optional(),
        paymentMethod: z.enum(["PIX", "CREDIT_CARD"]).default("PIX"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.campaign.findUnique({
        where: { id: input.campaignId },
        include: {
          ngo: {
            select: {
              id: true,
              name: true,
              pixKey: true,
            },
          },
        },
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campanha de arrecadação não encontrada.",
        });
      }

      let donorUserId = ctx.session?.user?.id ?? null;

      if (!donorUserId && input.donorEmail) {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.donorEmail },
        });
        if (existingUser) {
          donorUserId = existingUser.id;
        }
      }

      // 1. Cria o registro da doação
      const donation = await ctx.db.donation.create({
        data: {
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          paymentStatus: "PENDING",
          campaignId: input.campaignId,
          userId: donorUserId,
        },
      });

      // 2. Incrementa o currentAmount da campanha
      const updatedCampaign = await ctx.db.campaign.update({
        where: { id: input.campaignId },
        data: {
          currentAmount: {
            increment: input.amount,
          },
        },
      });

      // 3. Monta os dados de pagamento PIX para a POC
      const effectivePixKey =
        campaign.ngo.pixKey ?? "contato@guardioesdafauna.org.br";
      const pixPayload = generateMockPixPayload(
        effectivePixKey,
        input.amount,
        donation.id,
      );
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        pixPayload,
      )}`;

      return {
        donationId: donation.id,
        amount: donation.amount,
        paymentMethod: donation.paymentMethod,
        paymentStatus: donation.paymentStatus,
        campaign: {
          id: updatedCampaign.id,
          title: updatedCampaign.title,
          currentAmount: updatedCampaign.currentAmount,
          goalAmount: updatedCampaign.goalAmount,
          ngoName: campaign.ngo.name,
        },
        pix: {
          pixKey: effectivePixKey,
          payload: pixPayload,
          qrCodeUrl,
          expiresInMinutes: 30,
        },
      };
    }),
});
