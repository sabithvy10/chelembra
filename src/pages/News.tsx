import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, X } from 'lucide-react';
import { db } from '../lib/db';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [expandedNews, setExpandedNews] = useState<any | null>(null);

  useEffect(() => {
    db.get('news').then(setNews);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen relative">
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
        {news.length === 0 && <p className="text-foreground/50 text-center">No news published yet.</p>}
        {news.map((item, idx) => (
          <motion.article 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-8 md:p-10 relative overflow-hidden group ${item.featured ? 'border-l-4 border-l-secondary' : ''} flex flex-col md:flex-row gap-8`}
          >
            {item.featured && (
              <div className="absolute top-0 right-0 bg-secondary text-black text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                FEATURED ANNOUNCEMENT
              </div>
            )}
            
            {item.image && (
              <div className="md:w-1/3 shrink-0 rounded-xl overflow-hidden aspect-video md:aspect-square">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Clock className="w-4 h-4" /> {item.date || new Date(item.created_at).toLocaleDateString()}
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
              <p className="text-foreground/70 text-lg leading-relaxed mb-6 line-clamp-3">{item.content}</p>
              <button onClick={() => setExpandedNews(item)} className="text-foreground font-bold hover:text-primary flex items-center gap-2 transition-colors w-fit">
                Read Full Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {expandedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-3xl max-h-[90vh] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                <h3 className="font-bold text-lg text-primary truncate pr-4">{expandedNews.title}</h3>
                <button onClick={() => setExpandedNews(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {expandedNews.image && (
                  <img src={expandedNews.image} alt={expandedNews.title} className="w-full max-h-[400px] object-cover rounded-xl mb-8" />
                )}
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-6">
                  <Clock className="w-4 h-4" /> {expandedNews.date || new Date(expandedNews.created_at).toLocaleDateString()}
                </div>
                <h2 className="text-3xl font-serif font-bold mb-6">{expandedNews.title}</h2>
                <div className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap break-words w-full overflow-hidden">
                  {expandedNews.content}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
