import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Share2, AlertTriangle, Download, X } from 'lucide-react';
import { db } from '../lib/db';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  useEffect(() => {
    db.get('results').then(setResults);
    db.get('teams').then(setTeams);
    db.get('categories').then(setCategories);
  }, []);

  const handleReport = (result: any) => {
    const reason = window.prompt(`Report issue with ${result.title}:\nPlease describe the problem:`);
    if (reason) {
      db.insert('notifications', {
        title: `Issue with: ${result.title}`,
        by: 'Public User',
        date: new Date().toLocaleDateString(),
        status: 'pending',
        type: 'result',
        result_id: result.id
      });
      alert('Report submitted successfully. Admins will review it soon.');
    }
  };

  const handleShare = (result: any) => {
    if (!result.posters || result.posters.length === 0) {
      alert('There is no poster attached to this result.');
      return;
    }
    setSelectedPoster(result.posters[0]);
  };

  const handleDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sahityotsav-result-poster.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredResults = results.filter(r => {
    if (r.is_hidden) return false;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.title || '').toLowerCase().includes(searchLower) ||
      (r.category || '').toLowerCase().includes(searchLower) ||
      (r.winners || []).some((w: any) => 
        (w.name || '').toLowerCase().includes(searchLower) || 
        (w.team || '').toLowerCase().includes(searchLower)
      );
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-4"
        >
          Competition <span className="text-primary">Results</span>
        </motion.h1>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
          Live standings and official results for all programs across the Chelembra sector.
        </p>
      </div>

      {/* Standings Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Trophy className="text-secondary w-8 h-8" /> Current Standings
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.sort((a,b) => b.points - a.points).map((team, idx) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 relative overflow-hidden ${idx === 0 ? 'border-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]' : ''}`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-secondary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  CHAMPION
                </div>
              )}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${team.color || 'from-primary to-secondary'}`}></div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{team.name}</h3>
                <span className="text-4xl font-black text-foreground/20">#{idx + 1}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-serif font-bold text-primary">{team.points}</span>
                <span className="text-sm text-foreground/60 mb-2 uppercase font-semibold">Points</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Results Explorer */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-serif font-bold">Latest Results</h2>
          
          <div className="flex w-full md:w-auto gap-4 flex-col sm:flex-row">
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search programs..." 
                className="w-full bg-card border border-border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-card border border-border rounded-full py-2 px-4 focus:outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl">
              <p className="text-foreground/60 text-lg">No results found matching your criteria.</p>
            </div>
          ) : (
            filteredResults.map((result, idx) => (
              <motion.div 
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div className="bg-accent/50 p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">
                        Published
                      </span>
                      <span className="text-xs text-foreground/60 uppercase tracking-wider">
                        {result.category || 'Universal'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{result.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare(result)} className="p-2 text-foreground/60 hover:text-primary transition-colors rounded-full hover:bg-card" title="Share Poster">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleShare(result)} className="p-2 text-foreground/60 hover:text-green-500 transition-colors rounded-full hover:bg-card" title="Download Poster">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleReport(result)} className="p-2 text-foreground/60 hover:text-red-500 transition-colors rounded-full hover:bg-card" title="Report Issue">
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {(!result.winners || result.winners.length === 0) ? (
                    <div className="text-center py-4 text-foreground/60">
                      <p>No winners recorded for this program yet.</p>
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        const top3 = result.winners.filter((w: any) => w.place >= 1 && w.place <= 3).sort((a: any, b: any) => a.place - b.place);
                        const others = result.winners.filter((w: any) => !w.place || w.place > 3);
                        
                        return (
                          <>
                            {top3.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {top3.map((winner: any, i: number) => (
                                  <div 
                                    key={i} 
                                    className={`relative p-4 rounded-xl border ${
                                      winner.place === 1 ? 'bg-secondary/10 border-secondary/30' : 
                                      winner.place === 2 ? 'bg-gray-400/10 border-gray-400/30' : 
                                      'bg-orange-800/10 border-orange-800/30'
                                    }`}
                                  >
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black shadow-lg"
                                         style={{ backgroundColor: winner.place === 1 ? '#eab308' : winner.place === 2 ? '#9ca3af' : '#b45309' }}>
                                      #{winner.place}
                                    </div>
                                    <h4 className="font-bold text-lg mb-1">{winner.name}</h4>
                                    <p className="text-sm font-semibold mb-3 text-foreground/80">{winner.team}</p>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="px-2 py-1 rounded bg-background/50 border border-border">Grade: {winner.grade || 'N/A'}</span>
                                      <span className="font-bold text-primary">{winner.points} Pts</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {others.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest border-b border-border/50 pb-2 mb-3">Other Positions & Grades</h4>
                                {others.map((winner: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-black/20 hover:bg-black/40 transition-colors">
                                    <div>
                                      <h4 className="font-bold text-sm md:text-base">{winner.name}</h4>
                                      <p className="text-xs text-foreground/60">{winner.team}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {winner.place && winner.place > 3 && <span className="text-xs px-2 py-1 bg-card rounded border border-border">#{winner.place}</span>}
                                      {winner.grade && <span className="text-xs px-2 py-1 bg-card rounded border border-border">{winner.grade} Grade</span>}
                                      {winner.points > 0 && <span className="font-bold text-primary text-sm">{winner.points} Pts</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                <h3 className="font-bold text-lg text-primary">Result Poster</h3>
                <button onClick={() => setSelectedPoster(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 bg-black/40 flex flex-col items-center">
                <div className="w-full aspect-[4/3] bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                  <img src={selectedPoster} alt="Result Poster" className="w-full h-full object-contain" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleDownload(selectedPoster)} className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                    <Download className="w-5 h-5" /> Download Poster
                  </button>
                  <button onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Sahityotsav Result', text: 'Check out this result!', url: window.location.href });
                    } else {
                      alert('Sharing is not supported on this device/browser.');
                    }
                  }} className="flex items-center gap-2 bg-secondary text-black font-bold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
