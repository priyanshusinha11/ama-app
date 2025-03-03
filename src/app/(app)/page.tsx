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
  LucideIcon,
  Clock,
  Heart,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

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

// Story card preview component
const StoryCardPreview: FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative w-full max-w-md mx-auto"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl blur-xl transform-gpu"></div>
    <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm shadow-lg overflow-hidden relative z-10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-2 rounded-full">
              <User className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-gray-300 font-medium">@anonymous</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>23h left</span>
          </div>
        </div>
        <p className="text-gray-200 whitespace-pre-wrap">Just had the most amazing experience today! Sometimes life surprises you in the best ways. Grateful for these moments that remind us why we&apos;re here.</p>
        <div className="text-xs text-gray-500 mt-2">
          Posted 1 hour ago
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm flex items-center gap-1 text-pink-500">
          <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
          <span>24</span>
        </div>
      </CardFooter>
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
                Purr-fectly Anonymous • 24-Hour Stories • Feline Privacy
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200"
            >
              Let Your Curiosity Roam Free
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 mb-8 max-w-2xl mx-auto">Share anonymous messages or post paw-some stories that vanish after 24 hours. Embrace your nine lives of expression in a safe, private environment.</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/messages">
                <GlowButton>
                  Create Your Profile <User className="h-4 w-4 ml-2" />
                </GlowButton>
              </Link>
              <Link href="/feed">
                <Button variant="outline" className="border-gray-700 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white">
                  Explore Stories <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
      </section>

      {/* Stories Preview Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4 py-1 px-3 border-cyan-500 text-cyan-400 bg-cyan-500/10 backdrop-blur-sm">
                MEOW FEATURE
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                Stealthy Stories That Vanish Like a Cat in the Night
              </h2>
              <p className="text-gray-400 mb-6">
                Share your thoughts, purr-sonal secrets, and cat-tastic moments without the fear of permanent digital pawprints. Our stories feature gives you the freedom to express yourself knowing your content will disappear into the shadows after 24 hours.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Shield, text: "Completely anonymous - even your cat won't know who posted" },
                  { icon: Clock, text: "Auto-deletion after 24 hours - gone like catnip in the wind" },
                  { icon: Heart, text: "Like stories and see what's trending in the alley" },
                  { icon: Flame, text: "Browse 'Hot' stories or pounce on the latest in 'New'" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 text-violet-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/feed">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0">
                  Explore Stories <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <StoryCardPreview />
          </div>
        </div>
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
              Why Choose CryptiCat?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Our platform offers purr-fect features designed for the modern feline digital lifestyle
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Paw-sitively Anonymous"
              description="Send messages and share stories without revealing your identity. Your privacy is protected like a cat guarding its territory."
              delay={0.2}
            />
            <FeatureCard
              icon={Clock}
              title="Vanishing Content"
              description="Stories disappear after 24 hours, leaving no trace behind - just like a cat's silent footsteps."
              delay={0.3}
            />
            <FeatureCard
              icon={Flame}
              title="Hot on the Prowl"
              description="Discover what's trending with our hot stories feature, showing the most liked content in the neighborhood."
              delay={0.4}
            />
            <FeatureCard
              icon={User}
              title="Purr-sonal Profiles"
              description="Create your unique profile link to share with friends and receive anonymous messages in your territory."
              delay={0.5}
            />
            <FeatureCard
              icon={Sparkles}
              title="Curious Community"
              description="Join a community of cool cats sharing thoughts, experiences, and moments with feline discretion."
              delay={0.6}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Message Grooming"
              description="Easily organize, filter, and respond to the messages in your inbox - keep it as tidy as a well-groomed cat."
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
              <AnimatedCounter value={25000} label="Stories Shared" delay={0.3} />
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
              quote="The 24-hour stories feature is paw-some! I can share my thoughts freely knowing they'll disappear like a cat in the night. It's purr-fectly liberating!"
              author="Alex K."
              position="Curious Content Creator"
              delay={0.2}
            />
            <Testimonial
              quote="I love prowling through the stories feed to see what others are thinking. The anonymity creates such authentic content, it's the cat's meow!"
              author="Jamie T."
              position="Privacy Paw-vocate"
              delay={0.3}
            />
            <Testimonial
              quote="The purr-fect balance of anonymous messaging and temporary stories. It's like catnip for my thoughts - addictive and so satisfying!"
              author="Morgan L."
              position="Social Media Cat-fluencer"
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
              Ready to Let Your Curiosity Out of the Bag?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Create your account now to send anonymous messages and share stories that vanish like a cat in the night after 24 hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/messages">
                <GlowButton className="text-lg px-8 py-4">
                  Create Your Profile <User className="h-5 w-5 ml-2" />
                </GlowButton>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="text-lg px-8 py-4 border-gray-700 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
                >
                  Browse Stories <Sparkles className="h-5 w-5 ml-2" />
                </Button>
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
              <div className="flex items-center">
                <Image
                  src="/bg-free-cat.png"
                  alt="CryptiCat Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 mr-2"
                />
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">CryptiCat</h3>
              </div>
              <p className="text-gray-500 mt-2">Anonymous messaging & 24-hour stories</p>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 CryptiCat. All rights reserved <br />
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