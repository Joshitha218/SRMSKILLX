import React from 'react'
import ImageWithFallback from '../components/figma/ImageWithFallback'
import { Users, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'

const COMMUNITIES = [
  {
    id: 1,
    name: 'Coding Club',
    description: 'For competitive programmers and hackathon enthusiasts.',
    members: 128,
    image:
      'https://images.unsplash.com/photo-1753998943228-73470750c597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    name: 'Design Circle',
    description: 'UI/UX, Graphic Design, and creative arts.',
    members: 85,
    image:
      'https://images.unsplash.com/photo-1718220268527-4477fd170775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 3,
    name: 'Music Club',
    description: 'Jam sessions, theory, and instrument swaps.',
    members: 64,
    image:
      'https://images.unsplash.com/photo-1735713212111-e39b9cbcdbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
]

export default function Community() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Campus Communities
        </motion.h1>

        <motion.p
          className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find your tribe. Join circles to collaborate on specialized projects.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COMMUNITIES.map((community, idx) => (
          <motion.div
            key={community.id}
            className="group flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="h-56 relative overflow-hidden">
              <ImageWithFallback
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold tracking-tight">
                  {community.name}
                </h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-gray-600 mb-4 leading-relaxed">
                {community.description}
              </p>

              <button className="w-full py-2.5 px-4 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl hover:bg-blue-600 hover:text-white hover:border-transparent font-semibold transition-all flex justify-center items-center shadow-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Join Discussion
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
