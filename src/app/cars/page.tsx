import { CarCard } from "@/components/CarCard";
import { getAvailableCars } from "@/lib/notion";
import { Car } from "lucide-react";

export const revalidate = 60;

export default async function CarsPage() {
  const cars = await getAvailableCars();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Our Fleet</h1>
        <p className="text-muted-foreground text-lg">
          {cars.length} vehicles available for your Curaçao adventure
        </p>
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <Car className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-semibold mb-2">No Cars Available</h2>
          <p>Please check back later or contact us directly.</p>
        </div>
      )}
    </div>
  );
}
