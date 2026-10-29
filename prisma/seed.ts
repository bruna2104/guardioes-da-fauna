import {
  PrismaClient,
  Role,
  RescueStatus,
  UrgencyLevel,
  CampaignStatus,
} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // 1. Limpeza prévia (ordem reversa de dependências)
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.rescueCase.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ngo.deleteMany();

  console.log("🧹 Dados anteriores limpos com sucesso.");

  // 2. Criação das ONGs
  const sosFauna = await prisma.ngo.create({
    data: {
      name: "Instituto SOS Fauna Silvestre",
      slug: "sos-fauna-silvestre",
      cnpj: "12.345.678/0001-90",
      description:
        "Dedicado ao resgate, reabilitação e soltura de animais silvestres vítimas de tráfico, atropelamentos em rodovias e queimadas. Contamos com ambulatório especializado e biólogos capacitados.",
      logo: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      phone: "(19) 98765-4321",
      email: "contato@sosfaunasilvestre.org.br",
      pixKey: "contato@sosfaunasilvestre.org.br",
      city: "Campinas",
      state: "SP",
      isVerified: true,
    },
  });

  const patinhasLivres = await prisma.ngo.create({
    data: {
      name: "Abrigo Patinhas Livres",
      slug: "patinhas-livres",
      cnpj: "98.765.432/0001-10",
      description:
        "Acolhimento, tratamento veterinário, castração e adoção responsável de cães e gatos vítimas de abandono e maus-tratos na Região Metropolitana de São Paulo.",
      logo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
      phone: "(11) 97654-3210",
      email: "ajuda@patinhaslivres.org.br",
      pixKey: "98.765.432/0001-10",
      city: "São Paulo",
      state: "SP",
      isVerified: true,
    },
  });

  console.log("🏢 2 ONGs cadastradas.");

  // 3. Criação dos Usuários
  const mariaUser = await prisma.user.create({
    data: {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(19) 99123-4567",
      city: "Campinas",
      state: "SP",
      role: Role.CITIZEN,
    },
  });

  const lucasUser = await prisma.user.create({
    data: {
      name: "Lucas Oliveira",
      email: "lucas.resgates@email.com",
      phone: "(11) 98877-6655",
      city: "São Paulo",
      state: "SP",
      role: Role.VOLUNTEER,
    },
  });

  const drCarlos = await prisma.user.create({
    data: {
      name: "Dr. Carlos Eduardo",
      email: "carlos@sosfaunasilvestre.org.br",
      phone: "(19) 98765-4322",
      city: "Campinas",
      state: "SP",
      role: Role.NGO_ADMIN,
      ngoId: sosFauna.id,
    },
  });

  const fernandaLima = await prisma.user.create({
    data: {
      name: "Fernanda Lima",
      email: "fernanda@patinhaslivres.org.br",
      phone: "(11) 97654-3211",
      city: "São Paulo",
      state: "SP",
      role: Role.NGO_ADMIN,
      ngoId: patinhasLivres.id,
    },
  });

  console.log("👥 4 Usuários cadastrados (Cidadão, Voluntário e Gestores de ONGs).");

  // 4. Criação dos Casos de Resgate
  const resgateCao = await prisma.rescueCase.create({
    data: {
      title: "Cachorro atropelado na Av. Prestes Maia",
      description:
        "Cão mestiço de porte médio, ferimento visível na pata traseira direita após atropelamento. Está assustado mas dócil, acolhido provisoriamente sob a marquise de uma borracharia.",
      species: "Cão",
      urgency: UrgencyLevel.HIGH,
      status: RescueStatus.IN_PROGRESS,
      city: "Campinas",
      state: "SP",
      address: "Av. Prestes Maia, próx. ao nº 840 - Jardim do Trevo",
      photos: [
        "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      ],
      reportedById: mariaUser.id,
      assignedNgoId: patinhasLivres.id,
    },
  });

  const resgateTucano = await prisma.rescueCase.create({
    data: {
      title: "Tucano-toco com fratura de asa em condomínio",
      description:
        "Tucano jovem encontrado no chão do jardim sem conseguir alçar voo. Asa esquerda caída com aparente fratura fechada. Já resgatado pela equipe veterinária do SOS Fauna.",
      species: "Silvestre",
      urgency: UrgencyLevel.CRITICAL,
      status: RescueStatus.RESCUED,
      city: "Campinas",
      state: "SP",
      address: "Estrada da Barão Geraldo, km 4 - Barão Geraldo",
      photos: [
        "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80",
      ],
      reportedById: lucasUser.id,
      assignedNgoId: sosFauna.id,
    },
  });

  const resgateGatos = await prisma.rescueCase.create({
    data: {
      title: "Ninhada de filhotes de gato em caixa de papelão",
      description:
        "Três gatinhos com aproximadamente 30 dias de vida abandonados sob chuva. Estão com frio, famintos e miando muito. Necessitam de resgate urgente e lar temporário.",
      species: "Gato",
      urgency: UrgencyLevel.MEDIUM,
      status: RescueStatus.REPORTED,
      city: "São Paulo",
      state: "SP",
      address: "Rua Vergueiro, altura do 1500 - Vila Mariana",
      photos: [
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
      ],
      reportedById: mariaUser.id,
    },
  });

  const resgateCoruja = await prisma.rescueCase.create({
    data: {
      title: "Coruja-buraqueira presa em linha de cerol",
      description:
        "Ave encontrada no gramado com linhas de pipa enroscadas nas patas e ponta da asa. Resgatada com ferimentos leves na pele, recebendo hidratação e curativos.",
      species: "Silvestre",
      urgency: UrgencyLevel.HIGH,
      status: RescueStatus.RESCUED,
      city: "São Paulo",
      state: "SP",
      address: "Parque Ibirapuera - Portão 7",
      photos: [
        "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80",
      ],
      reportedById: lucasUser.id,
      assignedNgoId: sosFauna.id,
    },
  });

  const resgateBelinha = await prisma.rescueCase.create({
    data: {
      title: "Belinha: Cadela idosa recuperada pronta para adoção",
      description:
        "Resgatada com quadro de desnutrição severa e sarna, hoje está 100% recuperada, castrada, vacinada e microchipada. Procura uma família amorosa e tranquila.",
      species: "Cão",
      urgency: UrgencyLevel.LOW,
      status: RescueStatus.READY_ADOPTION,
      city: "São Paulo",
      state: "SP",
      address: "Rua Augusta, 2200 - Consolação",
      photos: [
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
      ],
      reportedById: fernandaLima.id,
      assignedNgoId: patinhasLivres.id,
    },
  });

  console.log("🐾 5 Casos de resgate criados com fotos e status variados.");

  // 5. Criação das Campanhas de Doação vinculadas às ONGs e Resgates
  const campanhaTucano = await prisma.campaign.create({
    data: {
      title: "Cirurgia e Reabilitação do Tucano Frederico",
      description:
        "Vaquinha para cobrir os custos de radiografia contrastada, cirurgia ortopédica para colocação de pino na asa do tucano e alimentação especial enriquecida durante o período de quarentena.",
      goalAmount: 2800.0,
      currentAmount: 1450.0,
      status: CampaignStatus.ACTIVE,
      ngoId: sosFauna.id,
      rescueCaseId: resgateTucano.id,
    },
  });

  const campanhaCao = await prisma.campaign.create({
    data: {
      title: "Tratamento Emergencial do Cão Atropelado (Prestes Maia)",
      description:
        "Arrecadação de urgência para custear internação de 48h, exames laboratoriais, sedação, raio-x e imobilização da pata fraturada.",
      goalAmount: 1950.0,
      currentAmount: 620.0,
      status: CampaignStatus.ACTIVE,
      ngoId: patinhasLivres.id,
      rescueCaseId: resgateCao.id,
    },
  });

  const campanhaRacao = await prisma.campaign.create({
    data: {
      title: "Fundo Mensal de Rações Especiais e Vacinas",
      description:
        "Campanha institucional para compra coletiva de 500kg de ração super premium e 100 doses de vacina V10 para os mais de 70 animais sob tutela do abrigo.",
      goalAmount: 5000.0,
      currentAmount: 3400.0,
      status: CampaignStatus.ACTIVE,
      ngoId: patinhasLivres.id,
    },
  });

  console.log("🎯 3 Campanhas de arrecadação criadas.");

  // 6. Doações simuladas
  await prisma.donation.createMany({
    data: [
      {
        amount: 150.0,
        paymentMethod: "PIX",
        paymentStatus: "COMPLETED",
        campaignId: campanhaTucano.id,
        userId: mariaUser.id,
      },
      {
        amount: 300.0,
        paymentMethod: "PIX",
        paymentStatus: "COMPLETED",
        campaignId: campanhaTucano.id,
        userId: null, // doador anônimo
      },
      {
        amount: 1000.0,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        campaignId: campanhaTucano.id,
        userId: lucasUser.id,
      },
      {
        amount: 120.0,
        paymentMethod: "PIX",
        paymentStatus: "COMPLETED",
        campaignId: campanhaCao.id,
        userId: null,
      },
      {
        amount: 500.0,
        paymentMethod: "PIX",
        paymentStatus: "COMPLETED",
        campaignId: campanhaCao.id,
        userId: mariaUser.id,
      },
      {
        amount: 250.0,
        paymentMethod: "PIX",
        paymentStatus: "COMPLETED",
        campaignId: campanhaRacao.id,
        userId: lucasUser.id,
      },
    ],
  });

  console.log("💰 Doações simuladas registradas.");
  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante a execução do seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
