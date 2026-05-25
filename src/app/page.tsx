import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/CarCard";
import { getAvailableCars } from "@/lib/notion";
import { Car, MapPin, Shield, Clock } from "lucide-react";

export default async function HomePage() {
  const featuredCars = await getAvailableCars(3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-brand text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-light opacity-90" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Explore Curaçao in Style
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Premium car rentals for every budget. From compact city cars to
            luxury SUVs — your perfect ride is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-accent hover:bg-red-600 text-white border-0">
              <Link href="/cars">Browse All Cars</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/bookings">My Bookings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Free Pickup & Drop-off",
                desc: "We deliver your car to any location in Curaçao.",
              },
              {
                icon: Shield,
                title: "Full Insurance Included",
                desc: "Drive with confidence — all rentals fully covered.",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Our team is available around the clock for any assistance.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Vehicles</h2>
              <p className="text-muted-foreground mt-1">Our most popular rental options</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/cars">View All</Link>
            </Button>
          </div>
          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cars available right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Book your car today and get free airport pickup.
          </p>
          <Button asChild size="lg" className="bg-brand-accent hover:bg-red-600 border-0">
            <Link href="/cars">Find Your Car</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
