import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Palette, Music, BookOpen, Award, Users, Search as SearchIcon, Zap, Shield, Sparkles } from 'lucide-react';
import ImageWithFallback from '../components/figma/ImageWithFallback'
import { getCurrentUser } from '../lib/api';
import { motion } from 'motion/react';

// Images
const HERO_IMG = "https://images.unsplash.com/photo-1565841327798-694bc2074762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9uJTIwbGFwdG9wJTIwY29kaW5nfGVufDF8fHx8MTc2OTg4MTU2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const COMMUNITY_IMG = "https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9uJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwdGFsa2luZyUyMGNhbXB1c3xlbnwxfHx8fDE3Njk4ODE1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function Landing() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
        const u = await getCurrentUser();
        setUser(u);
    }
    loadUser();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <motion.div 
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="mt-24 sm:mt-32 lg:mt-16">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-600/20 mb-6">
                Exclusive to SRM AP Students 🚀
              </span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Master new skills with <span className="text-blue-600">SRM Peers</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="mt-6 text-lg leading-8 text-gray-600">
              The exclusive skill exchange platform for SRM University AP. Connect with mentors, find hackathon teammates, and build your portfolio together.
            </motion.p>
            <motion.div variants={fadeIn} className="mt-10 flex items-center gap-x-6">
              {user ? (
                <>
                  <Link to="/search" className="rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105">
                    Find Skills
                  </Link>
                  <Link to="/community" className="text-sm font-semibold leading-6 text-gray-900 flex items-center group">
                    Join Communities <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105">
                    Join Now
                  </Link>
                  <Link to="/search" className="text-sm font-semibold leading-6 text-gray-900 flex items-center group">
                    Explore Skills <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <motion.div 
              className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <ImageWithFallback
                  src={HERO_IMG}
                  alt="App screenshot"
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {[
              { id: 1, name: 'Active Students', value: '500+' },
              { id: 2, name: 'Skills Listed', value: '120+' },
              { id: 3, name: 'Project Collabs', value: '50+' },
            ].map((stat) => (
              <motion.div 
                key={stat.id} 
                className="mx-auto flex max-w-xs flex-col gap-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Supercharge your campus life
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We've built tools specifically designed for SRM students to collaborate, learn, and grow together.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Smart Skill Matching',
                  description: 'Our algorithm connects you with the perfect mentor or mentee based on your skill gaps and year.',
                  icon: Sparkles,
                },
                {
                  name: 'Campus Verified',
                  description: 'Safe environment. Only students with valid @srmap.edu.in email addresses can join.',
                  icon: Shield,
                },
                {
                  name: 'Gamified Growth',
                  description: 'Earn badges like "Mentor", "Contributor", and "Pro" as you help others and complete projects.',
                  icon: Award,
                },
                {
                  name: 'Hackathon Squads',
                  description: 'Find the missing piece for your hackathon team. Backend, Frontend, Design - we have it all.',
                  icon: Code,
                },
                {
                  name: 'Community Circles',
                  description: 'Join interest-based circles like Coding Club, Design Circle, and Music Club to find your tribe.',
                  icon: Users,
                },
                {
                  name: 'Project Showcase',
                  description: 'Showcase your academic and side projects to the entire university network.',
                  icon: Zap,
                },
              ].map((feature, idx) => (
                <motion.div 
                    key={feature.name} 
                    className="flex flex-col bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <ImageWithFallback
          src={COMMUNITY_IMG}
          alt="Community"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-20"
        />
        <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Find your tribe</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Don't study in isolation. Join a vibrant community of peers who share your passion for technology, design, and innovation.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <Link to="/community" className="hover:text-blue-300 transition-colors">Coding Club <span aria-hidden="true">&rarr;</span></Link>
              <Link to="/community" className="hover:text-blue-300 transition-colors">Design Circle <span aria-hidden="true">&rarr;</span></Link>
              <Link to="/community" className="hover:text-blue-300 transition-colors">Startup Network <span aria-hidden="true">&rarr;</span></Link>
              <Link to="/community" className="hover:text-blue-300 transition-colors">Research Group <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to dive in?<br />
              Start your journey today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join hundreds of SRM students who are already learning and building together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                 <Link to="/profile" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Go to Profile
                 </Link>
              ) : (
                <>
                    <Link to="/register" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        Get started
                    </Link>
                    <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                        Log in <span aria-hidden="true">→</span>
                    </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
