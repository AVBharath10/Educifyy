'use client'
import { Sparkles, Zap, Users, TrendingUp, ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatedButton } from '@/components/animated-button'
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <img src="/icon.svg" alt="Educify" className="w-8 h-8" />
            <span>Educify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:text-primary transition-colors">
              Teach
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>
          <AnimatedButton>Get Started</AnimatedButton>
        </div>
      </nav>
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in-up">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm font-medium text-primary">The Future of Education is Here</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance leading-tight tracking-tight animate-fade-in-up delay-100">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Any Skill</span>
            <br />
            <span className="text-foreground">Unleash Potential</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance leading-relaxed animate-fade-in-up delay-200">
            Join the world's most advanced learning ecosystem. Connect with expert mentors, access premium content, and accelerate your career growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in-up delay-300">
            <Link href="/catalog">
              <AnimatedButton size="lg" className="w-full sm:w-auto px-8 py-6 text-lg shadow-lg shadow-primary/25">
                Start Learning Now
                <ArrowRight className="ml-2 inline-block" size={20} />
              </AnimatedButton>
            </Link>
            <Link href="/upload">
              <AnimatedButton size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg backdrop-blur-sm bg-background/50">
                Become an Instructor
              </AnimatedButton>
            </Link>
          </div>


        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Why Choose Educify?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience a revolutionary learning platform designed for modern educators and students
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Modern infrastructure ensures smooth streaming and instant content delivery.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Connect with thousands of learners and educators from around the world.',
              },
              {
                icon: Rocket,
                title: 'Advanced Tools',
                description: 'Upload videos, documents, and multimedia with our intuitive course builder.',
              },
              {
                icon: TrendingUp,
                title: 'Progress Tracking',
                description: 'Monitor your learning journey with detailed analytics and achievements.',
              },
              {
                icon: Sparkles,
                title: 'Personalized',
                description: 'Intelligent recommendations based on your learning history and preferences.',
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Get help from instructors and community members whenever you need it.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card hover-glow group transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent glow-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and instructors already transforming their education on Educify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <AnimatedButton size="lg" className="w-full sm:w-auto">
                Browse Courses
              </AnimatedButton>
            </Link>
            <Link href="/upload">
              <AnimatedButton size="lg" variant="secondary" className="w-full sm:w-auto">
                Create a Course
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-border bg-card/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent glow-blue" />
              <span>Educify</span>
            </div>
            <p className="text-sm text-muted-foreground">Learn, teach, and grow together.</p>
          </div>
          {[
            { title: 'Platform', links: ['Explore', 'Teach', 'Dashboard'] },
            { title: 'Support', links: ['Help Center', 'Contact Us', 'Community'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
          ].map((group, index) => (
            <div key={index}>
              <p className="font-semibold mb-3">{group.title}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Educify. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
