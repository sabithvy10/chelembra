import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Trophy, Video, Image as ImageIcon, Newspaper, Info, Shield, Lock, Instagram, Facebook, Youtube } from 'lucide-react';

import Results from './pages/Results';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import News from './pages/News';
import About from './pages/About';
import { db } from './lib/db';
import { supabase } from './lib/supabase';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null; // Hide navbar on admin page
  
  const links = [
    { name: 'Home', path: '/', icon: <Trophy className="w-4 h-4 mr-2" /> },
    { name: 'Results', path: '/results', icon: <Trophy className="w-4 h-4 mr-2" /> },
    { name: 'Videos', path: '/videos', icon: <Video className="w-4 h-4 mr-2" /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon className="w-4 h-4 mr-2" /> },
    { name: 'News', path: '/news', icon: <Newspaper className="w-4 h-4 mr-2" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Admin', path: '/admin', icon: <Shield className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Sahityotsav" className="h-8 md:h-10 w-auto transition-all" style={{ filter: 'var(--logo-filter)' }} />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground/80 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/80 hover:text-primary hover:bg-accent block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-card border-t border-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="mb-4 w-full max-w-[200px] md:max-w-[250px]">
          <img 
            src="/ssf_logo.png" 
            alt="SSF Kerala Students' Centre" 
            className="w-full h-auto object-contain hover:brightness-110 transition-all" 
            style={{ filter: 'var(--logo-filter)' }}
          />
        </div>
        <p className="text-foreground/60 text-center max-w-md mb-8">
          Chelembra Sector Literary and Cultural Festival. Celebrating creativity, literature, and unity.
        </p>
        <div className="flex space-x-6 mb-8">
          <Link to="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link>
          <Link to="/results" className="text-foreground/60 hover:text-primary transition-colors">Results</Link>
          <Link to="/gallery" className="text-foreground/60 hover:text-primary transition-colors">Gallery</Link>
          <Link to="/about" className="text-foreground/60 hover:text-primary transition-colors">About</Link>
        </div>
        <div className="flex space-x-6 mb-8">
          <a href="https://instagram.com/ssfchelembraeast/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-[#E1306C] transition-colors">
            <Instagram className="w-6 h-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://www.facebook.com/profile.php?id=100077461539352" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-[#1877F2] transition-colors">
            <Facebook className="w-6 h-6" />
            <span className="sr-only">Facebook</span>
          </a>
          <a href="https://www.youtube.com/@ssfchelembrasector" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-[#FF0000] transition-colors">
            <Youtube className="w-6 h-6" />
            <span className="sr-only">YouTube</span>
          </a>
        </div>

        <p className="text-foreground/40 text-sm">
          &copy; {new Date().getFullYear()} Sahityotsav. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const Home = () => {
  const [teams, setTeams] = React.useState<any[]>([]);
  const [myTeamId, setMyTeamId] = React.useState<number | null>(null);
  const [eventDate, setEventDate] = React.useState('2026 MAY 23-24 CHELEMBRA');
  const [aboutData, setAboutData] = React.useState<any>({});

  React.useEffect(() => {
    db.get('teams').then(t => setTeams(t.sort((a: any, b: any) => (b.points || 0) - (a.points || 0))));
    const saved = localStorage.getItem('sahityotsav_my_team');
    if (saved) setMyTeamId(parseInt(saved));
    db.getSetting('event_date').then(val => { if (val) setEventDate(val); });
    db.getSetting('about_data').then(val => { if (val) { try { setAboutData(JSON.parse(val)); } catch {} } });
  }, []);

  const handleSelectTeam = (id: number) => {
    setMyTeamId(id);
    localStorage.setItem('sahityotsav_my_team', id.toString());
  };

  const maxPoints = Math.max(...teams.map(t => parseInt(t.points) || 0), 10);

  return (
    <div className="pt-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        {/* Fades & Overlays */}
        <div className="absolute inset-0 z-0 bg-black/50"></div> {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div> {/* Seamless fade into the next section */}
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <img 
              src="/logo.png" 
              alt="Sahityotsav" 
              className="w-full max-w-[300px] md:max-w-[500px] lg:max-w-[600px] h-auto mb-4 transition-all object-contain" 
              style={{ filter: 'var(--logo-filter)', imageRendering: '-webkit-optimize-contrast' }} 
            />
            <img 
              src="/title.png" 
              alt="Chelembra Sector" 
              className="w-full max-w-[250px] md:max-w-[400px] h-auto mb-8 transition-all object-contain" 
              style={{ filter: 'var(--logo-filter)', imageRendering: '-webkit-optimize-contrast' }}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3 font-bebas text-3xl md:text-5xl tracking-widest mb-12"
          >
            <span className="text-primary hidden md:inline">❖</span>
            {eventDate.split(' ').map((part, i) => (
              <span key={i} className={
                i === 1 ? "text-red-500" : 
                i === 3 ? "text-yellow-500" : 
                "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              }>
                {part}
              </span>
            ))}
            <span className="text-secondary hidden md:inline">❖</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/results" className="btn-primary flex items-center gap-2">
              <Trophy className="w-5 h-5" /> Get Results
            </Link>
            <Link to="/gallery" className="btn-secondary flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> View Gallery
            </Link>
            <Link to="/videos" className="btn-secondary flex items-center gap-2">
              <Video className="w-5 h-5" /> Watch Videos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Standings Preview */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Current Standings</h2>
          <p className="text-foreground/60 text-lg">Live updates from the festival grounds.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.slice(0, 4).map((team) => (
            <motion.div 
              key={team.id}
              whileHover={{ y: -5 }}
              className={`glass-card p-6 text-center relative overflow-hidden ${myTeamId === team.id ? 'border-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]' : ''}`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${team.color || 'from-primary to-secondary'}`}></div>
              {myTeamId === team.id && <div className="absolute top-2 right-2 text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">YOUR TEAM</div>}
              <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
              <p className="text-5xl font-serif font-bold text-primary mb-4">{team.points}</p>
              <span className="text-sm uppercase tracking-wider text-foreground/60 font-semibold">Points</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-8">What is Sahityotsav?</h2>
          <p className="text-xl text-foreground/80 leading-relaxed mb-12">
            {aboutData.homeDesc || "Sahityotsav is a grand literary and cultural festival representing the Chelembra sector. It is a platform that promotes creativity, literature, speech, performance, and teamwork. Through various competitions and events, it builds a spirit of talent, discipline, and unity among the youth."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{aboutData.homeStat1 || "50+"}</p>
              <p className="text-foreground/60">{aboutData.homeStat1Label || "Programs"}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">{aboutData.homeStat2 || "4"}</p>
              <p className="text-foreground/60">{aboutData.homeStat2Label || "Teams"}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{aboutData.homeStat3 || "400+"}</p>
              <p className="text-foreground/60">{aboutData.homeStat3Label || "Participants"}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">{aboutData.homeStat4 || "100%"}</p>
              <p className="text-foreground/60">{aboutData.homeStat4Label || "Spirit"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Performance Graph & Allegiance */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Live Performance</h2>
          <p className="text-foreground/60 text-lg">Watch the race to the championship.</p>
        </div>
        
        <div className="glass-card p-8 rounded-2xl border border-border/50 overflow-x-auto mb-16">
          <div className="h-[400px] flex items-end gap-4 md:gap-12 justify-around pt-10 border-b-2 border-l-2 border-border/50 pb-2 pl-8 relative min-w-[500px]">
            {/* Y axis */}
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs font-bold text-foreground/40 pb-2">
              <span>{maxPoints}</span>
              <span>{Math.floor(maxPoints * 0.75)}</span>
              <span>{Math.floor(maxPoints * 0.5)}</span>
              <span>{Math.floor(maxPoints * 0.25)}</span>
              <span>0</span>
            </div>

            {teams.slice(0, 4).map((team) => {
              const heightPct = ((parseInt(team.points) || 0) / maxPoints) * 100;
              const isMyTeam = myTeamId === team.id;
              return (
                <div key={team.id} className="w-full max-w-[150px] md:max-w-[200px] flex flex-col justify-end items-center group h-full relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-black/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg text-sm whitespace-nowrap z-10 font-bold shadow-xl">
                    {team.points} pts
                  </div>
                  {isMyTeam && (
                    <div className="absolute -top-10 animate-bounce bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                      You
                    </div>
                  )}
                  <div 
                    className={`w-[80px] md:w-[120px] rounded-t-lg bg-gradient-to-t ${team.color || 'from-primary to-secondary'} transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer relative overflow-hidden ${isMyTeam ? 'border-x-2 border-t-2 border-white' : ''}`}
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
                  </div>
                  <span className="mt-4 font-bold text-sm md:text-lg text-center whitespace-normal break-words w-full px-1">
                    {team.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Team Selector */}
        <div className="glass-card p-10 rounded-2xl border border-border/50 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-secondary left-0"></div>
          <h3 className="text-3xl font-serif font-bold mb-4">Choose Your Allegiance</h3>
          <p className="text-foreground/60 mb-8 text-lg">Select your team to highlight their performance across the dashboard!</p>
          <div className="flex flex-wrap justify-center gap-4">
            {teams.map(team => (
              <button 
                key={team.id}
                onClick={() => handleSelectTeam(team.id)}
                className={`px-8 py-4 rounded-xl font-bold transition-all border-2 flex items-center gap-2 ${myTeamId === team.id ? 'border-primary bg-primary/20 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105' : 'border-border/50 hover:border-primary/50 text-foreground/60 hover:text-white hover:bg-card'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${team.color || 'from-primary to-secondary'}`}></div>
                {team.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AdminLogin = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('sahityotsav_admin_auth') === 'true'
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'chelembrasahityotsav@gmail.com' && password === 'chelembra@786') {
      localStorage.setItem('sahityotsav_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">Admin Login</h2>
          <p className="text-foreground/60">Enter your credentials to access the dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground/60">Username</label>
            <input 
              required
              type="text" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-border rounded-lg p-3 focus:border-primary outline-none transition-colors text-white" 
              placeholder="admin@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground/60">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-border rounded-lg p-3 focus:border-primary outline-none transition-colors text-white" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-6">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  React.useEffect(() => {
    // Global Theme logic from Database
    db.getSetting('theme').then((themeVal) => {
      const theme = themeVal || 'default';
      if (theme !== 'default') {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });

    // Real Live Viewers Tracker (Supabase Presence)
    const sessionId = Math.random().toString(36).substring(2, 15);
    const room = supabase.channel('online-users', {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    room.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await room.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      supabase.removeChannel(room);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/*" element={
              <AdminLogin>
                <Admin />
              </AdminLogin>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
