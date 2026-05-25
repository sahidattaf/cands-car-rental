export interface CarListing {
  id: string;
  notionId?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  imageUrl?: string;
  description?: string;
  seats: number;
  transmission: string;
  fuel: string;
  available: boolean;
  features: string[];
}

export interface BookingFormData {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
}
