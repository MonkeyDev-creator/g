import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
              Next Level GFX Design
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Level Up Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 text-glow">
                Visual Identity
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium graphics for Roblox, Discord, and content creators. 
              High-quality thumbnails, icons, and ads delivered with speed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/order">
                <Button size="lg" className="rounded-full text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                  Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="outline" size="lg" className="rounded-full text-lg px-8 h-14 border-white/10 hover:bg-white/5 hover:text-white transition-all">
                  Track Order
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Fast Delivery"
              description="Get your high-quality GFX delivered within 24-48 hours. Speed meets quality."
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-primary" />}
              title="Premium Quality"
              description="4K resolution, professional lighting, and stunning post-processing effects."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Secure Orders"
              description="Track your order status in real-time. Transparent process from start to finish."
            />
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Latest Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Check out some of our recent commissions. From game thumbnails to profile icons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Using colored divs as placeholders instead of stock images for GFX */}
            <PortfolioItem color="from-purple-600 to-blue-600" title="Game Thumbnail" category="Roblox" />
            <PortfolioItem color="from-orange-500 to-red-600" title="Profile Icon" category="Discord" />
            <PortfolioItem color="from-green-500 to-emerald-700" title="Group Ad" category="Advertisement" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Ready to transform your look?</h2>
          <Link href="/order">
            <Button size="lg" className="rounded-full text-lg px-10 h-16 bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold">
              Start Your Order
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors duration-300 group">
      <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function PortfolioItem({ color, title, category }: { color: string, title: string, category: string }) {
  return (
    <div className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
        <div className="text-center">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-white" />
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <p className="text-sm text-white/80">{category}</p>
        </div>
      </div>
    </div>
  );
}
