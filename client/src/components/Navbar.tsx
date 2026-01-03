import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Package, Search, Menu, X, ShieldAlert, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAdminMe } from "@/hooks/use-admin";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { data: admin } = useAdminMe();

  return (
    <nav className="fixed top-0 w-full z-[100] px-4 py-4 pointer-events-none">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl px-6 py-3 flex items-center justify-between pointer-events-auto shadow-2xl shadow-black/40">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                <img src="https://www.figma.com/api/mcp/asset/35f9a014-eca3-4b00-bd99-5732fb376870" alt="M" className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-white tracking-tighter uppercase italic">Monkey Studio</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/" active={location === "/"}>Home</NavLink>
            <NavLink href="/tracking" active={location === "/tracking"}>Track Order</NavLink>
            
            <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
            
            {admin ? (
              <Link href="/admin/dashboard">
                <Button size="sm" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl font-bold uppercase tracking-tight text-xs h-9 px-4 flex items-center gap-2">
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white rounded-xl font-bold uppercase tracking-tight text-xs h-9 px-4">
                  Admin Access
                </Button>
              </Link>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className={`md:hidden absolute top-20 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pointer-events-auto ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col gap-2">
          <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/tracking" onClick={() => setIsOpen(false)}>Track Order</MobileNavLink>
          <div className="h-[1px] bg-zinc-800 my-2" />
          <Link href="/admin">
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-11">Admin Access</Button>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}

function NavLink({ href, children, active }: { href: string, children: React.ReactNode, active: boolean }) {
  return (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={`rounded-xl font-bold uppercase tracking-tight text-xs h-9 px-4 transition-all duration-300 ${active ? 'bg-white/5 text-primary' : 'text-zinc-500 hover:text-white'}`}
      >
        {children}
      </Button>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) {
  return (
    <Link href={href}>
      <div 
        onClick={onClick}
        className="px-4 py-3 text-zinc-400 font-bold uppercase tracking-tight text-sm hover:text-white hover:bg-white/5 rounded-xl cursor-pointer"
      >
        {children}
      </div>
    </Link>
  );
}
