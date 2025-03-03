'use client';

import { useEffect, useState, FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Shield,
  Lock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User,
  Zap,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Animated gradient background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/90" />
      <div className="absolute -inset-[10px] opacity-30">
        <div className="absolute top-0 left-0 right-0 h-[500px] rounded-full bg-gradient-to-r from-violet-600/30 via-cyan-400/30 to-indigo-500/30 blur-[100px] transform-gpu animate-pulse" />
        <div className="absolute bottom-0 right-0 left-0 h-[500px] rounded-full bg-gradient-to-r from-fuchsia-600/30 via-purple-400/30 to-violet-500/30 blur-[100px] transform-gpu animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
    </div>
  );
};

// Feature card component with proper types
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group"
  >
    <Card className="h-full border-0 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-300">
      <CardContent className="p-6">
        <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-violet-400 transition-colors">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// Testimonial component with proper types
interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  delay?: number;
}

const Testimonial: FC<TestimonialProps> = ({ quote, author, position, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-lg bg-black/40 backdrop-blur-sm p-6 border border-gray-800"
  >
    <div className="mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-yellow-500">★</span>
      ))}
    </div>
    <p className="italic text-gray-300 mb-4">&quot;{quote}&quot;</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
        {author.charAt(0)}
      </div>
      <div className="ml-3">
        <p className="font-medium text-white">{author}</p>
        <p className="text-sm text-gray-400">{position}</p>
      </div>
    </div>
  </motion.div>
);

// Animated counter component with proper types
interface AnimatedCounterProps {
  value: number;
  label: string;
  delay?: number;
}

const AnimatedCounter: FC<AnimatedCounterProps> = ({ value, label, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.floor(value * progress));

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
        {count.toLocaleString()}+
      </p>
      <p className="text-gray-400 mt-2">{label}</p>
    </motion.div>
  );
};

// GlowButton component with proper types
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const GlowButton: FC<GlowButtonProps> = ({ children, className, ...props }) => (
  <Button
    className={cn(
      "relative overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300",
      className
    )}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
  </Button>
);

export default function Home() {
  return (
    <>
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 py-1.5 px-4 border-violet-500 text-violet-400 bg-violet-500/10 backdrop-blur-sm">
                Completely Anonymous • End-to-End Encrypted
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200"
            >
              Step Into the Future of Anonymous Messaging
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 mb-8 max-w-2xl mx-auto">Experience the freedom of anonymous messaging with our platform. Share your thoughts without revealing your identity. It&apos;s time to express yourself freely!</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/sign-up">
                <GlowButton>
                  Get Started <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="border-gray-700 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white">
                  Sign In <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
            >
              Why Choose Whisperly?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Our platform offers cutting-edge features designed for the modern digital age
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Complete Anonymity"
              description="Send messages without revealing your identity. Your privacy is our top priority."
              delay={0.2}
            />
            <FeatureCard
              icon={Lock}
              title="End-to-End Encryption"
              description="All messages are encrypted, ensuring only the intended recipient can read them."
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Our optimized platform delivers messages instantly with minimal latency."
              delay={0.4}
            />
            <FeatureCard
              icon={User}
              title="Custom Profiles"
              description="Create your unique profile link to share with friends and followers."
              delay={0.5}
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Suggestions"
              description="Get intelligent message suggestions when you're not sure what to say."
              delay={0.6}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Message Management"
              description="Easily organize, filter, and respond to the messages you receive."
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedCounter value={50000} label="Active Users" delay={0.1} />
              <AnimatedCounter value={1000000} label="Messages Sent" delay={0.2} />
              <AnimatedCounter value={99.9} label="Uptime Percentage" delay={0.3} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Join thousands of satisfied users who&apos;ve discovered a new way to communicate
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial
              quote="Whisperly has transformed how I receive feedback. It&apos;s anonymous yet constructive!"
              author="Alex K."
              position="Content Creator"
              delay={0.2}
            />
            <Testimonial
              quote="The interface is sleek and the encryption gives me peace of mind. Best anonymous messaging platform I've used."
              author="Jamie T."
              position="Privacy Advocate"
              delay={0.3}
            />
            <Testimonial
              quote="I love how easy it is to share my profile link with my audience. The message suggestions are surprisingly helpful!"
              author="Morgan L."
              position="Social Media Influencer"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
            >
              Ready to Step Into the Future?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Create your account now and experience the next generation of anonymous communication.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/sign-up">
                <GlowButton className="text-lg px-8 py-4">
                  Get Started Now <ArrowRight className="h-5 w-5 ml-2" />
                </GlowButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Whisperly</h3>
              <p className="text-gray-500 mt-2">The future of anonymous messaging</p>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 Whisperly. All rights reserved <br />
              <a
                href="https://github.com/priyanshusinha11"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Designed and developed by @priyanshusinha11
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}