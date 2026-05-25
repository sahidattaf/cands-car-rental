"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="w-6 h-6 text-primary" />
          <span>C&amp;S Car Rental</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cars" className="text-sm font-medium hover:text-primary transition-colors">Fleet</Link>
          {session && (
            <Link href="/bookings" className="text-sm font-medium hover:text-primary transition-colors">Bookings</Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/login">Sign In</Link></Button>
              <Button asChild size="sm"><Link href="/register">Get Started</Link></Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link href="/cars" className="block text-sm font-medium" onClick={() => setOpen(false)}>Fleet</Link>
          {session && (
            <Link href="/bookings" className="block text-sm font-medium" onClick={() => setOpen(false)}>Bookings</Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link href="/dashboard" className="block text-sm font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {session ? (
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm"><Link href="/login">Sign In</Link></Button>
                <Button asChild size="sm"><Link href="/register">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
