import prisma from "../src/app/prisma/client.js";

async function main() {
  console.log("🌱 Seeding a test order...");

  // 1. Get the first Business Owner user
  const user = await prisma.user.findFirst({
    where: { role: "BUSINESS_OWNER" },
  });

  if (!user) {
    console.error("❌ No BUSINESS_OWNER user found. Please run regular seed first.");
    return;
  }
  console.log(`Found Business Owner: ${user.email} (ID: ${user.id})`);

  // 2. Get the Business for the Business Owner
  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
  });

  if (!business) {
    console.error("❌ No Business found for this user. Please run regular seed first.");
    return;
  }
  console.log(`Found Business: ${business.name} (ID: ${business.id})`);

  // 3. Create or find some menu items
  const itemsData = [
    { name: "Burger", category: "Fast Food", unit: "pcs", price: 12.99 },
    { name: "French Fries", category: "Sides", unit: "pcs", price: 4.99 },
    { name: "Soft Drink", category: "Beverages", unit: "can", price: 2.50 }
  ];

  const items = [];
  for (const itemData of itemsData) {
    let item = await prisma.item.findFirst({
      where: { businessId: business.id, name: itemData.name }
    });
    if (!item) {
      item = await prisma.item.create({
        data: {
          businessId: business.id,
          ...itemData
        }
      });
      console.log(`✅ Created Item: ${item.name}`);
    } else {
      console.log(`Found Item: ${item.name}`);
    }
    items.push(item);
  }

  // 4. Create a Call
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 45000); // 45 seconds call
  const call = await prisma.call.create({
    data: {
      businessId: business.id,
      userId: user.id,
      customerNumber: "+8801712345678",
      duration: 45,
      startTime: startTime,
      endTime: endTime,
      type: "ai_call",
      status: "completed",
      vapiCallId: `vapi-call-${Date.now()}`,
    }
  });
  console.log(`✅ Created Call: ${call.id}`);

  // 5. Create a Call Summary
  const callSummary = await prisma.callSummary.create({
    data: {
      callId: call.id,
      summary: "Customer ordered a Burger and French Fries. Call completed successfully.",
      transcript: "AI: Hello, welcome! What would you like to order today?\nCustomer: I'd like to order a Burger and French Fries.\nAI: Sure! Anything to drink?\nCustomer: No, thank you.\nAI: Okay, your order is placed.",
      pdfUrl: "https://example.com/mock-receipt.pdf"
    }
  });
  console.log(`✅ Created Call Summary for Call ID: ${call.id}`);

  // 6. Create Order and OrderItems
  const orderItemsData = [
    { itemId: items[0].id, quantity: 1, unitPrice: items[0].price }, // Burger
    { itemId: items[1].id, quantity: 1, unitPrice: items[1].price }  // Fries
  ];

  const totalPrice = orderItemsData.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  // We also have an `items` JSON field in Order schema. Let's populate it.
  const itemsJson = orderItemsData.map(oi => {
    const matchedItem = items.find(i => i.id === oi.itemId);
    return {
      name: matchedItem.name,
      quantity: oi.quantity,
      price: oi.unitPrice
    };
  });

  const order = await prisma.order.create({
    data: {
      businessId: business.id,
      callId: call.id,
      customerName: "Fahad Rahman",
      customerEmail: "fahad@example.com",
      totalPrice: totalPrice,
      items: itemsJson,
      orderType: "DELIVERY",
      deliveryAddress: "123 Main St, Sector 4, Uttara, Dhaka",
      orderItems: {
        create: orderItemsData.map(oi => ({
          itemId: oi.itemId,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          subtotal: oi.quantity * oi.unitPrice
        }))
      }
    },
    include: {
      orderItems: {
        include: {
          item: true
        }
      }
    }
  });

  console.log(`✅ Created Order ID: ${order.id} with Total Price: $${order.totalPrice}`);
  console.log("🚀 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding order:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
