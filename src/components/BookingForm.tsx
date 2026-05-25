"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { differenceInDays } from "date-fns";
import type { CarListing } from "@/types";

interface Props {
  car: CarListing;
}

export function BookingForm({ car }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days =
    form.startDate && form.endDate
      ? Math.max(0, differenceInDays(new Date(form.endDate), new Date(form.startDate)))
      : 0;
  const total = days * car.pricePerDay;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/cars/${car.id}`);
      return;
    }
    if (days < 1) {
      setError("Please select at least 1 day.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId: car.id, ...form }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Booking failed.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Car</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Pick-up Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Return Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                min={form.startDate || new Date().toISOString().split("T")[0]}
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <Input
              id="pickupLocation"
              name="pickupLocation"
              placeholder="e.g. Airport, Hotel name..."
              value={form.pickupLocation}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffLocation">Drop-off Location</Label>
            <Input
              id="dropoffLocation"
              name="dropoffLocation"
              placeholder="Same as pickup or different..."
              value={form.dropoffLocation}
              onChange={handleChange}
            />
          </div>

          {days > 0 && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">${car.pricePerDay}/day × {days} days</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !car.available}>
            {loading ? "Processing..." : session ? "Proceed to Payment" : "Sign In to Book"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment powered by Stripe. Free cancellation up to 24h before pickup.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
