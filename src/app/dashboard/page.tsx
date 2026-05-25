import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Calendar, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [totalCars, totalUsers, totalBookings, revenue] = await Promise.all([
    prisma.car.count(),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "ACTIVE", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
  ]);

  const stats = [
    { label: "Total Cars", value: totalCars, icon: Car },
    { label: "Customers", value: totalUsers, icon: Users },
    { label: "Bookings", value: totalBookings, icon: Calendar },
    {
      label: "Revenue",
      value: `$${(revenue._sum.totalPrice ?? 0).toFixed(0)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
