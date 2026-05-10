import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

export default function News() {
  const news = [
    { id: 1, title: 'Final Program Schedule Announced', excerpt: 'The complete timeline for all 50+ competitions has been officially released. Participants are requested to verify their time slots.', date: 'Today, 10:00 AM', featured: true },
    { id: 2, title: 'Guidelines for Digital Poster Making', excerpt: 'A new set of rules has been published for the digital arts categories. Make sure to read before submitting.', date: 'Yesterday', featured: false },
    { id: 3, title: 'Guest of Honor Revealed', excerpt: 'Renowned author and cultural icon will be inaugurating the closing ceremony this Sunday.', date: 'May 8, 2026', featured: false },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-4"
        >
          Latest <span className="text-primary">News</span>
        </motion.h1>
      </div>

      <div className="space-y-8">
        {news.map((item, idx) => (
          <motion.article 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-8 md:p-10 relative overflow-hidden group ${item.featured ? 'border-l-4 border-l-secondary' : ''}`}
          >
            {item.featured && (
              <div className="absolute top-0 right-0 bg-secondary text-black text-xs font-bold px-4 py-1 rounded-bl-xl">
                FEATURED ANNOUNCEMENT
              </div>
            )}
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
              <Clock className="w-4 h-4" /> {item.date}
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">{item.excerpt}</p>
            <button className="text-foreground font-bold hover:text-primary flex items-center gap-2 transition-colors">
              Read Full Article <ArrowRight className="w-4 h-4" />
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
