import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { differenceInDays } from "date-fns";
import { z } from "zod";

const schema = z.object({
  carId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Please sign in to book." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes } =
      schema.parse(body);

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car || !car.available) {
      return NextResponse.json({ message: "Car not available." }, { status: 400 });
    }

    const days = differenceInDays(new Date(endDate), new Date(startDate));
    if (days < 1) {
      return NextResponse.json({ message: "Invalid date range." }, { status: 400 });
    }

    const totalPrice = car.pricePerDay * days;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${car.name} — ${days} day${days > 1 ? "s" : ""}`,
              description: `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/bookings?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cars/${carId}?cancelled=true`,
      metadata: {
        userId: session.user.id,
        carId,
        startDate,
        endDate,
        totalPrice: totalPrice.toString(),
      },
    });

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: "PENDING",
        stripeSessionId: stripeSession.id,
        pickupLocation,
        dropoffLocation,
        notes,
      },
    });

    return NextResponse.json({ url: stripeSession.url, bookingId: booking.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }
    return NextResponse.json({ message: "Booking failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
