import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye } from 'lucide-react';
import { db } from '../lib/db';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    db.get('videos').then(setVideos);
  }, []);

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
      } else if (urlObj.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed${urlObj.pathname}`;
      }
    } catch (e) {}
    return url;
  };

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
        {videos.length === 0 && <p className="text-foreground/50 col-span-full text-center">No videos uploaded yet.</p>}
        {videos.map((vid, idx) => (
          <motion.div 
            key={vid.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              {vid.url ? (
                <iframe
                  src={getYoutubeEmbedUrl(vid.url)}
                  title={vid.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/50">Invalid Video URL</div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-primary">{vid.title}</h3>
              <p className="text-foreground/80 mb-4">{vid.description}</p>
              <div className="flex items-center gap-4 text-sm text-foreground/60 font-medium">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4"/> {vid.views || '0'} views</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {vid.date || new Date(vid.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
