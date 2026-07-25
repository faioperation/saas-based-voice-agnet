import prisma from "../src/app/prisma/client.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Create/Update System Owner
  const systemOwner = await prisma.user.upsert({
    where: { email: "system@test.com" },
    update: {
      firstName: "System",
      lastName: "Owner",
      password: hashedPassword,
      role: "SYSTEM_OWNER",
      status: "active",
      isVerified: true,
    },
    create: {
      firstName: "System",
      lastName: "Owner",
      email: "system@test.com",
      password: hashedPassword,
      role: "SYSTEM_OWNER",
      status: "active",
      isVerified: true,
    },
  });
  console.log(`✅ System Owner: ${systemOwner.email}`);

  // 2. Create/Update Business Owner
  const businessOwner = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {
      firstName: "Business",
      lastName: "Owner",
      password: hashedPassword,
      role: "BUSINESS_OWNER",
      status: "active",
      isVerified: true,
    },
    create: {
      firstName: "Business",
      lastName: "Owner",
      email: "user@test.com",
      password: hashedPassword,
      role: "BUSINESS_OWNER",
      status: "active",
      isVerified: true,
    },
  });
  console.log(`✅ Business Owner: ${businessOwner.email}`);

  // 3. Create/Update Business for the Business Owner
  const businessName = "New business";
  const businessAddress = "Dhaka, Banglasesh";

  let business = await prisma.business.findFirst({
    where: { ownerId: businessOwner.id },
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        name: businessName,
        ownerId: businessOwner.id,
        status: "active",
      },
    });
    console.log(`✅ Business created: ${business.name}`);
  } else {
    business = await prisma.business.update({
      where: { id: business.id },
      data: { name: businessName },
    });
    console.log(`✅ Business updated: ${business.name}`);
  }

  // 4. Create/Update Business Settings
  await prisma.businessSetting.upsert({
    where: { businessId: business.id },
    update: {
      businessName: businessName,
      businessAddress: businessAddress,
    },
    create: {
      businessId: business.id,
      businessName: businessName,
      businessAddress: businessAddress,
    },
  });
  console.log(`✅ Business Settings updated`);

  // 5. Create Subscription Plans
  const plans = [
    {
      name: "Free Trial",
      priceMonthly: 0.0,
      priceYearly: 0.0,
      callMinutesLimit: 10,
      callCountLimit: 0,
      messageLimit: 0,
      features: [
        "1 business number",
        "10 minutes total usage",
        "Includes call handling + transfers",
      ],
      stripeMonthlyPriceId: "price_1TX0hQHcy9TCZulnCi69ld7w",
      stripeYearlyPriceId: null,
    },
    {
      name: "Starter",
      priceMonthly: 49.0,
      priceYearly: 590.0, // 2 months free as placeholder
      callMinutesLimit: 200,
      callCountLimit: 130,
      messageLimit: 0,
      features: [
        "1 business number",
        "200 minutes total usage (AI + transfers included)",
        "Basic script setup",
        "24/7 customer support",
        "Approx. 130 calls/month",
      ],
      stripeMonthlyPriceId: "price_1Tq2I8Hcy9TCZulnefpGkYqX",
      stripeYearlyPriceId: "price_starter_yearly_placeholder",
    },
    {
      name: "Growth",
      priceMonthly: 99.0,
      priceYearly: 990.0,
      callMinutesLimit: 800,
      callCountLimit: 260,
      messageLimit: 0,
      features: [
        "1–2 business numbers",
        "800 minutes total usage",
        "Custom script flexibility",
        "24/7 support",
        "Approx. 260 calls/month",
      ],
      stripeMonthlyPriceId: "price_1TX0i0Hcy9TCZulnVSa0ijWg",
      stripeYearlyPriceId: "price_growth_yearly_placeholder",
    },
    {
      name: "Pro",
      priceMonthly: 149.0,
      priceYearly: 1990.0,
      callMinutesLimit: 1000,
      callCountLimit: 730,
      messageLimit: 0,
      features: [
        "Multiple business numbers",
        "1000 minutes total usage",
        "Advanced script control",
        "Call summaries & insights",
        "Priority support",
        "Approx. 730 calls/month",
      ],
      stripeMonthlyPriceId: "price_1Tq3aCHcy9TCZuln0eXIcC4X",
      stripeYearlyPriceId: "price_pro_yearly_placeholder",
    },
    {
      name: "Enterprise",
      priceMonthly: 0.0, // Custom pricing
      priceYearly: 0.0,
      callMinutesLimit: 5000,
      callCountLimit: 0,
      messageLimit: 0,
      features: [
        "5,000+ minutes",
        "Multi-location support",
        "Custom setup and onboarding",
        "Overage Pricing Profits",
      ],
      stripeMonthlyPriceId: null, // No stripe plan
      stripeYearlyPriceId: null,
    },
  ];

  for (const planData of plans) {
    await prisma.plan.upsert({
      where: { name: planData.name },
      update: planData,
      create: planData,
    });
  }
  console.log("✅ Subscription Plans created/updated");

  console.log("🚀 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
