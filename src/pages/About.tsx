import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, Users, Trophy } from 'lucide-react';
import { db } from '../lib/db';

export default function About() {
  const [aboutData, setAboutData] = React.useState<any>({});
  const [dbTeams, setDbTeams] = React.useState<any[]>([]);

  useEffect(() => {
    db.getSetting('about_data').then(val => {
      if (val) {
        try { setAboutData(JSON.parse(val)); } catch {}
      }
    });
    db.get('teams').then(setDbTeams);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-6"
        >
          About <span className="text-primary">Sahityotsav</span>
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            {aboutData.mission1 || "Sahityotsav is the premier literary and cultural festival for the Chelembra sector. Our mission is to foster creativity, celebrate artistic expression, and unite students through a diverse range of competitive and collaborative events."}
          </p>
          <p className="text-foreground/80 text-lg leading-relaxed">
            {aboutData.mission2 || "Every year, hundreds of participants gather to showcase their talents in writing, speech, performance, and visual arts, battling for the prestigious Sector Championship."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-bold text-xl">{aboutData.stat1 || "May 15-20, 2026"}</h3>
            <p className="text-sm text-foreground/60">{aboutData.stat1Label || "Festival Dates"}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <MapPin className="w-10 h-10 text-secondary mb-3" />
            <h3 className="font-bold text-xl">{aboutData.stat2 || "Chelembra HQ"}</h3>
            <p className="text-sm text-foreground/60">{aboutData.stat2Label || "Main Venue"}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <Users className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-bold text-xl">{aboutData.stat3 || "400+"}</h3>
            <p className="text-sm text-foreground/60">{aboutData.stat3Label || "Participants"}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <Trophy className="w-10 h-10 text-secondary mb-3" />
            <h3 className="font-bold text-xl">{aboutData.stat4 || "54"}</h3>
            <p className="text-sm text-foreground/60">{aboutData.stat4Label || "Competitions"}</p>
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-serif font-bold text-center mb-12">The Competing Teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dbTeams.map((team, i) => (
          <motion.div 
            key={team.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 text-center relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${team.color || 'from-primary to-secondary'}`}></div>
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${team.color || 'from-primary to-secondary'} opacity-20 group-hover:opacity-40 transition-opacity mb-4 flex items-center justify-center`}>
              <Users className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
            <p className="text-foreground/70">{team.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
