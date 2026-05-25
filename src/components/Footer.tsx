import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Car className="w-5 h-5" />
              C&amp;S Car Rental
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Premium car rentals for every adventure in Curaçao. Your journey starts here.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="/cars" className="hover:text-white transition-colors">Our Fleet</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +5999 000-0000</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@cscarrental.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Willemstad, Curaçao</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-xs text-blue-300">
          © {new Date().getFullYear()} C&amp;S Car Rental. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
