import { motion } from 'framer-motion';
import { Play, Calendar, Eye } from 'lucide-react';

export default function Videos() {
  const videos = [
    { id: 1, title: 'Sahityotsav 2026 Promo Trailer', views: '2.4k', date: '2 days ago', thumb: 'https://source.unsplash.com/random/600x400?cinema,1' },
    { id: 2, title: 'Opening Ceremony Highlights', views: '1.8k', date: '1 day ago', thumb: 'https://source.unsplash.com/random/600x400?stage,2' },
    { id: 3, title: 'Elocution Finals - Best Speeches', views: '950', date: '5 hours ago', thumb: 'https://source.unsplash.com/random/600x400?speech,3' },
    { id: 4, title: 'Cultural Dance Performance', views: '3.1k', date: '1 week ago', thumb: 'https://source.unsplash.com/random/600x400?dance,4' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-4"
        >
          Festival <span className="text-primary">Videos</span>
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {videos.map((vid, idx) => (
          <motion.div 
            key={vid.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group cursor-pointer overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-90 group-hover:scale-110 shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300">
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{vid.title}</h3>
              <div className="flex items-center gap-4 text-sm text-foreground/60 font-medium">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4"/> {vid.views} views</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {vid.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
