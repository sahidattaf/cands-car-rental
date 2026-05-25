import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Booking, Car } from "@prisma/client";

type BookingWithCar = Booking & { car: Car };

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  ACTIVE: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export function BookingCard({ booking }: { booking: BookingWithCar }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{booking.car.name}</h3>
              <Badge variant={statusColors[booking.status] ?? "outline"}>
                {booking.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                {format(new Date(booking.startDate), "MMM d, yyyy")} →{" "}
                {format(new Date(booking.endDate), "MMM d, yyyy")}
              </p>
              {booking.pickupLocation && <p>Pickup: {booking.pickupLocation}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">${booking.totalPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              Booked {format(new Date(booking.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
