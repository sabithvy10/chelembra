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
  const [eventDate, setEventDate] = React.useState('2026 MAY 23-24 CHELEMBRA');
  const [homeBg, setHomeBg] = React.useState(localStorage.getItem('sahityotsav_home_bg') || '');

  React.useEffect(() => {

    db.getSetting('event_date').then(val => { if (val) setEventDate(val); });
    db.getSetting('home_bg').then(val => { 
      if (val) {
        setHomeBg(val); 
        localStorage.setItem('sahityotsav_home_bg', val);
      } else {
        setHomeBg(''); 
        localStorage.removeItem('sahityotsav_home_bg');
      }
    });
  }, []);

  return (
    <div className="pt-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: homeBg ? `url(${homeBg})` : 'none',
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
            className="flex items-center justify-center relative z-30 mb-16 md:mb-24"
          >
            <Link 
              to="/results" 
              className="bg-[#facc15] hover:bg-[#eab308] text-black font-bold text-lg md:text-xl px-10 py-3 md:py-4 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-transform hover:scale-105"
            >
              Get Results
            </Link>
          </motion.div>
        </div>
      {/* SVG Jagged Border */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[100px]">
          <path d="M0,120 L0,70 L80,60 L200,90 L350,20 L500,80 L700,30 L900,90 L1050,40 L1200,70 L1200,120 Z" fill="#000000" />
          <path d="M0,70 L80,60 L200,90 L350,20 L500,80 L700,30 L900,90 L1050,40 L1200,70" fill="none" stroke="#facc15" strokeWidth="4" />
        </svg>
      </div>
      </section>

      {/* About Preview */}
      <section className="bg-black pt-10 pb-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Typography Graphic */}
          <div className="flex justify-center md:justify-end pr-0 md:pr-8">
            <div className="flex flex-col items-start font-serif text-[70px] md:text-[100px] font-bold leading-[0.85] tracking-tight">
              <div className="bg-[#facc15] text-black px-4 pt-4 pb-2">/ðɛn</div>
              <div className="bg-[#facc15] text-black px-4 pt-2 pb-2">ænd</div>
              <div className="bg-[#facc15] text-black px-4 pt-2 pb-4">stɪl/</div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-white/80 space-y-6 text-sm md:text-base leading-relaxed pl-0 md:pl-8">
            <p>
              Incepted 33 years ago in 1993, it has its commencement from the grassroot level -that is a family Sahityotsav. Crossing the levels of units,sectors, divisions,districts and 26 states in the country, it finds its actualization in the national level each year.
            </p>
            <p>
              As a prime aim,Sahityotsav is focusing on the embellishment of the creativity of thousands and more students across the country, and now it became one of the towering figures in the realm Of cultural festivals of India.
            </p>
            <p>
              Sahityotsav has its assets of thousands of young vibrant studentdom who have came forward to meet the need of the time in its various aspects. They are ready to question all the anti social hullabaloos using their talents like writing, drawing, criticizing... etc.
            </p>
            <button className="border border-[#facc15] text-[#facc15] px-8 py-3 mt-4 text-sm font-bold tracking-wider hover:bg-[#facc15] hover:text-black transition-colors uppercase">
              Read More
            </button>
          </div>

        </div>
      </section>

      {/* Tenderness of Signs Section */}
      <section className="bg-black pb-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl">
          
          {/* Image Side */}
          <div className="w-full md:w-2/3 bg-white">
            <img src="/tenderness.png" alt="The Tenderness of Signs" className="w-full h-full object-cover" />
          </div>

          {/* Yellow Text Box Side */}
          <div className="w-full md:w-1/3 bg-[#facc15] p-8 md:p-12 flex flex-col justify-center text-black">
            <p className="font-semibold text-base md:text-lg leading-relaxed mb-8">
              As a perennial journey of creativity Sahityotsav is now turning to its 32nd edition which is to be held at the capital city of state from August for 4-10 with multitudes of social cultural literary and artistic manifestations.
            </p>
            <Link 
              to="/about" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="border-2 border-black text-black px-6 py-3 font-bold tracking-wider hover:bg-black hover:text-[#facc15] transition-colors uppercase w-fit text-sm text-center"
            >
              Read More
            </Link>
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

    room.on('presence', { event: 'sync' }, () => {
      const newState = room.presenceState();
      let count = 0;
      for (const key in newState) {
        count += newState[key].length;
      }
      localStorage.setItem('sahityotsav_live_viewers', count.toString());
      window.dispatchEvent(new Event('viewersUpdated'));
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
