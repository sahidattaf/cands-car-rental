import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingCard } from "@/components/BookingCard";
import { Calendar } from "lucide-react";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/bookings");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-muted-foreground mb-10">
        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
      </p>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-semibold mb-2">No Bookings Yet</h2>
          <p>Browse our fleet and book your first ride!</p>
        </div>
      )}
    </div>
  );
}
