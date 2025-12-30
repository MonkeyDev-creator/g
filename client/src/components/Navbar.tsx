import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Order Now", path: "/order" },
    { name: "Track Order", path: "/tracking" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
            MONKEY<span className="text-primary">STUDIO</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
