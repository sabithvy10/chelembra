import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertTriangle, X } from 'lucide-react';
import { db } from '../lib/db';

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    // If local db has no images, fallback to some default mock array
    const dbImages = db.get('gallery');
    if (dbImages.length > 0) {
      setImages(dbImages);
    } else {
      setImages(Array.from({ length: 6 }, (_, i) => ({
        id: `mock-${i}`,
        url: `https://source.unsplash.com/random/800x${600 + (i % 3) * 100}?event,culture,${i}`,
        title: `Festival Moment ${i + 1}`,
      })));
    }
  }, []);

  const handleReport = (imgId: any) => {
    const reason = window.prompt("Report this image:\nPlease state the issue:");
    if (reason) {
      db.insert('notifications', {
        title: `Image Report (ID: ${imgId})`,
        by: 'Public User',
        date: new Date().toLocaleDateString(),
        status: 'pending'
      });
      alert('Image reported successfully. Admins will review it soon.');
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-4"
        >
          Photo <span className="text-primary">Gallery</span>
        </motion.h1>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
          Captured moments of creativity, passion, and cultural celebration.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded-full text-sm font-bold">All Photos</button>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative group rounded-xl overflow-hidden break-inside-avoid shadow-lg cursor-pointer glass-card p-1"
            onClick={() => setSelectedImg(img.url)}
          >
            <div className="rounded-lg overflow-hidden">
              <img 
                src={img.url} 
                alt={img.title || 'Gallery Image'}
                className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 m-1 rounded-lg">
              <div className="flex justify-end gap-2">
                <button 
                  className="p-2 bg-white/10 hover:bg-primary/80 backdrop-blur-sm rounded-full transition-colors text-white" 
                  title="Download"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 bg-white/10 hover:bg-red-500/80 backdrop-blur-sm rounded-full transition-colors text-white" 
                  title="Report Issue"
                  onClick={(e) => { e.stopPropagation(); handleReport(img.id); }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{img.title || `IMG_${String(img.id).slice(-4)}`}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(249,115,22,0.15)]" 
            alt="Fullscreen Preview" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
