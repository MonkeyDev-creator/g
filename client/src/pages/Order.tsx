import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Order() {
  return (
    <div className="min-h-screen bg-[#0a0c10] pt-32 pb-20 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#101218] border border-zinc-800 rounded-[42px] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-tight">
            Order via Discord
          </h1>
          
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
            To ensure the best quality and communication, all GFX orders are now handled exclusively through our Discord server.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="h-16 px-10 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black uppercase tracking-wider text-lg shadow-xl shadow-[#5865F2]/20 w-full sm:w-auto">
              Open Discord
            </Button>
            <Link href="/">
              <Button variant="ghost" className="h-16 px-8 rounded-2xl text-zinc-500 hover:text-white font-bold uppercase tracking-tight gap-2">
                <ArrowLeft className="w-5 h-5" /> Go Back
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-12 border-t border-zinc-800/50">
            <div className="flex items-center justify-center gap-2 text-zinc-600 uppercase tracking-[0.2em] text-xs font-black">
              <ShieldAlert className="w-4 h-4" /> Secure Order Verification System
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
