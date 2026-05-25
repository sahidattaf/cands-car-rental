import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Settings, Fuel } from "lucide-react";
import type { CarListing } from "@/types";

interface Props {
  car: CarListing;
}

export function CarCard({ car }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {car.imageUrl ? (
          <Image
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No image
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs">{car.category}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.brand} {car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">${car.pricePerDay}</p>
            <p className="text-xs text-muted-foreground">/ day</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats}</span>
          <span className="flex items-center gap-1"><Settings className="w-3 h-3" />{car.transmission}</span>
          <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={!car.available}>
          <Link href={`/cars/${car.id}`}>
            {car.available ? "Book Now" : "Unavailable"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
