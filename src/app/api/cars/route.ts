import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cars = await prisma.car.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cars);
  } catch {
    return NextResponse.json({ message: "Failed to fetch cars." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const car = await prisma.car.create({ data: body });
    return NextResponse.json(car, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create car." }, { status: 500 });
  }
}
