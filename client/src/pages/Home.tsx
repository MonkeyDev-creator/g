import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Image as ImageIcon, ChevronRight, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const img13131 = "https://www.figma.com/api/mcp/asset/064bf2b7-0250-4b34-9788-b538c68a9a75";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Figma Inspired Background */}
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Next-Gen GFX Solutions</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white mb-8 tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(255,107,0,0.4)]">
              Get GFX with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500">ease,</span> <br />
              <span className="text-zinc-500/50">without any knowledge</span>
            </h1>
            <p className="text-zinc-500 text-xl max-w-md mb-10 font-medium leading-relaxed">
              Elevate your gaming brand with professional-grade graphics and custom templates designed for top-tier creators.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/order">
                <Button size="lg" className="h-16 px-10 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transform hover:-translate-y-1 transition-all">
                  Order Now <ChevronRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="outline" size="lg" className="h-16 px-10 text-xl rounded-2xl border-zinc-800 text-white hover:bg-white/5 font-bold uppercase tracking-tight backdrop-blur-xl">
                  Track Orders / Pay
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[42px] -z-10 animate-pulse" />
             <div className="border-4 border-zinc-800/50 rounded-[42px] overflow-hidden shadow-2xl bg-zinc-900 shadow-primary/20">
               <img src={img13131} alt="Portfolio" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-32 bg-[#0d0f14] relative border-y border-zinc-800/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Past Works</h2>
              <p className="text-zinc-500 max-w-sm">Professional graphics tailored for high-performance studios.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PortfolioItem img="feffr.png" title="Gun Shooter" />
            <PortfolioItem img="untitled(8)" title="Monkey King" />
            <PortfolioItem img="https://www.figma.com/api/mcp/asset/6adbac62-cc97-48a7-bd39-a0ba541ddcc6" title="Neon Night" />
            <PortfolioItem img={img13131} title="Battle Royale" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-b border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="Lightning Fast"
              description="Get your high-quality graphics delivered faster than anyone else in the industry."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Secure Delivery"
              description="All assets are handled through our secure platform and Discord integration."
            />
            <FeatureCard 
              icon={<Star className="w-6 h-6 text-primary" />}
              title="Premium Quality"
              description="Expert-level designs customized perfectly for your brand's unique gaming aesthetic."
            />
          </div>
        </div>
      </section>

      {/* Discord Section */}
      <section className="py-24 bg-gradient-to-b from-[#0d0f14] to-[#0a0c10]">
        <div className="container mx-auto px-6">
          <div className="bg-[#101218] border border-zinc-800 rounded-[42px] p-12 md:p-20 relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[100px] rounded-full" />
             <div className="relative z-10 flex flex-col items-center">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none max-w-2xl">
                 Ordering is handled <br /><span className="text-primary">Exclusively</span> via Discord
               </h2>
               <p className="text-zinc-500 text-xl mb-12 max-w-md">
                 Use our custom bot in the server to place orders and upload assets directly.
               </p>
               <Button className="h-16 px-12 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black uppercase tracking-wider text-lg shadow-xl shadow-[#5865F2]/20 group">
                 Join Monkey Studio Discord <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
               </Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PortfolioItem({ img, title }: { img: string, title: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-primary/50 transition-all duration-300"
    >
      <img src={img} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
        <div>
          <p className="text-primary font-bold uppercase text-xs tracking-[0.2em] mb-1">Featured</p>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-10 rounded-[42px] border border-zinc-900 bg-zinc-900/20 hover:border-primary/20 transition-all hover:bg-zinc-900/30 group">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black italic tracking-tight uppercase mb-4 text-white">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
