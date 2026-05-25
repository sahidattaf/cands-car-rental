import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ message: "No signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ message: "Webhook verification failed." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const { carId, startDate, endDate } = session.metadata ?? {};

    await prisma.booking.updateMany({
      where: { stripeSessionId: session.id },
      data: {
        status: "CONFIRMED",
        stripePaymentId: session.payment_intent as string,
      },
    });
  }

  return NextResponse.json({ received: true });
}
