import { notFound } from "next/navigation";
import Image from "next/image";
import { getCarById } from "@/lib/notion";
import { BookingForm } from "@/components/BookingForm";
import { Badge } from "@/components/ui/badge";
import { Users, Fuel, Settings, Calendar } from "lucide-react";

interface Props {
  params: { id: string };
}

export default async function CarDetailPage({ params }: Props) {
  const car = await getCarById(params.id);

  if (!car) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Car Details */}
        <div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-6">
            {car.imageUrl ? (
              <Image src={car.imageUrl} alt={car.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{car.category}</Badge>
            <Badge variant={car.available ? "default" : "destructive"}>
              {car.available ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">
            ${car.pricePerDay}/day
          </p>

          {car.description && (
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {car.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{car.seats} seats</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="w-4 h-4 text-muted-foreground" />
              <span>{car.fuel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{car.year}</span>
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <Badge key={feature} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Form */}
        <div>
          <div className="sticky top-6">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
