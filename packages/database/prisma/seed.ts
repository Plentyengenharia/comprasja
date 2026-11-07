import { PrismaClient, OrganizationType, MembershipRole, PlanCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ComprasJa!Demo1', 12);

  const plans = [
    {
      code: PlanCode.PUBLIC_FREE,
      name: 'Público gratuito',
      description: 'Consulta a informações públicas e cadastro básico.',
      monthlyPrice: 0,
      featuresJson: { transparency: true, opportunities: 'limited' },
    },
    {
      code: PlanCode.START,
      name: 'Start',
      description: 'Para fornecedores iniciantes.',
      monthlyPrice: 149.9,
      featuresJson: { proposals: 10, alerts: true },
    },
    {
      code: PlanCode.PRO,
      name: 'Pro',
      description: 'Operação completa para equipes comerciais.',
      monthlyPrice: 399.9,
      featuresJson: { proposals: 100, vault: true, analytics: true },
    },
    {
      code: PlanCode.BUSINESS,
      name: 'Business',
      description: 'Multi-CNPJ e colaboração avançada.',
      monthlyPrice: 899.9,
      featuresJson: { multiCnpj: true, sso: false, api: true },
    },
    {
      code: PlanCode.ENTERPRISE,
      name: 'Enterprise',
      description: 'Contrato corporativo, SLA e integrações dedicadas.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      featuresJson: { custom: true, sla: true, dedicatedSupport: true },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice ?? null,
        featuresJson: plan.featuresJson,
      },
      create: plan,
    });
  }

  const flags = [
    { key: 'official_bidding', description: 'Certames oficiais (bloqueado até homologação)', enabled: false },
    { key: 'pncp_publish', description: 'Publicação oficial PNCP', enabled: false },
    { key: 'mfa', description: 'Autenticação multifator', enabled: true },
    { key: 'dark_mode', description: 'Tema escuro', enabled: true },
    { key: 'ai_assistant', description: 'Compras Já Intelligence', enabled: false },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    });
  }

  const platform = await prisma.organization.upsert({
    where: { taxId_type: { taxId: '00000000000000', type: OrganizationType.PLATFORM } },
    update: {},
    create: {
      type: OrganizationType.PLATFORM,
      legalName: 'Compras Já Tecnologia Ltda',
      tradeName: 'Compras Já',
      taxId: '00000000000000',
      email: 'plataforma@comprasja.local',
      city: 'Brasília',
      state: 'DF',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@comprasja.local' },
    update: {},
    create: {
      name: 'Administrador Compras Já',
      email: 'admin@comprasja.local',
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: platform.id, userId: admin.id },
    },
    update: { role: MembershipRole.GLOBAL_ADMIN, status: 'ACTIVE' },
    create: {
      organizationId: platform.id,
      userId: admin.id,
      role: MembershipRole.GLOBAL_ADMIN,
      status: 'ACTIVE',
    },
  });

  const supplier = await prisma.organization.upsert({
    where: { taxId_type: { taxId: '12ABC34501DE35', type: OrganizationType.SUPPLIER } },
    update: {},
    create: {
      type: OrganizationType.SUPPLIER,
      legalName: 'Fornecedor Demonstração LTDA',
      tradeName: 'Fornecedor Demo',
      taxId: '12ABC34501DE35',
      email: 'fornecedor@demo.local',
      city: 'São Paulo',
      state: 'SP',
      cnae: '6201-5/01',
    },
  });

  const supplierUser = await prisma.user.upsert({
    where: { email: 'fornecedor@demo.local' },
    update: {},
    create: {
      name: 'Usuário Fornecedor Demo',
      email: 'fornecedor@demo.local',
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: supplier.id, userId: supplierUser.id },
    },
    update: {},
    create: {
      organizationId: supplier.id,
      userId: supplierUser.id,
      role: MembershipRole.SUPPLIER_ADMIN,
      status: 'ACTIVE',
    },
  });

  const publicBody = await prisma.organization.upsert({
    where: { taxId_type: { taxId: '00000000000191', type: OrganizationType.PUBLIC_BODY } },
    update: {},
    create: {
      type: OrganizationType.PUBLIC_BODY,
      legalName: 'Órgão Público Demonstração',
      tradeName: 'Órgão Demo',
      taxId: '00000000000191',
      email: 'orgao@demo.local',
      city: 'Brasília',
      state: 'DF',
    },
  });

  const publicUser = await prisma.user.upsert({
    where: { email: 'orgao@demo.local' },
    update: {},
    create: {
      name: 'Agente de Contratação Demo',
      email: 'orgao@demo.local',
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: publicBody.id, userId: publicUser.id },
    },
    update: {},
    create: {
      organizationId: publicBody.id,
      userId: publicUser.id,
      role: MembershipRole.ORG_ADMIN,
      status: 'ACTIVE',
    },
  });

  await prisma.integrationConnection.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: { status: 'DISABLED' },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      provider: 'PNCP_PUBLISH',
      status: 'DISABLED',
      configJson: { note: 'Publicação oficial desativada até credenciamento' },
    },
  });

  // Processo demonstrativo público (transparência) — ambiente demo apenas
  const existing = await prisma.procurementProcess.findFirst({
    where: { organizationId: publicBody.id, processNumber: '001/2026' },
  });

  if (!existing) {
    await prisma.procurementProcess.create({
      data: {
        organizationId: publicBody.id,
        processNumber: '001/2026',
        fiscalYear: 2026,
        objectTitle: 'Aquisição de equipamentos de TI — demonstração',
        objectDescription:
          'Processo demonstrativo do ambiente Compras Já. Não constitui certame oficial.',
        modality: 'Pregão Eletrônico',
        status: 'PUBLISHED',
        estimatedValue: 250000,
        publishedAt: new Date(),
        isPublicTransparency: true,
        proposalDeadlineAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        lots: {
          create: {
            lotNumber: 1,
            title: 'Lote único',
            description: 'Notebooks e monitores',
            estimatedValue: 250000,
            items: {
              create: [
                {
                  itemNumber: 1,
                  description: 'Notebook corporativo',
                  unit: 'UN',
                  quantity: 50,
                  unitPrice: 4500,
                },
                {
                  itemNumber: 2,
                  description: 'Monitor 27 polegadas',
                  unit: 'UN',
                  quantity: 50,
                  unitPrice: 1200,
                },
              ],
            },
          },
        },
      },
    });
  }

  console.log('Seed Compras Já concluído (ambiente demonstrativo).');
  console.log('Contas demo (somente development): admin@ / fornecedor@ / orgao@comprasja.local|demo.local');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
