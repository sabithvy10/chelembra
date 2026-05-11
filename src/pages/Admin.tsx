import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Bell, Trophy, Calendar, Newspaper, 
  Image as ImageIcon, Video, Settings, Users, LogOut,
  Plus, Trash2, Edit2, CheckCircle, UploadCloud, List, Medal, X, Eye, EyeOff
} from 'lucide-react';
import { db } from '../lib/db';

const TABS = ['Dashboard', 'Notifications', 'Results', 'Programs', 'Categories', 'News', 'Gallery', 'Videos', 'Teams', 'About', 'Settings'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [editingResultId, setEditingResultId] = useState<number | null>(null);

  const handleNavigateToResultEdit = async (resultId: number, notifId: number) => {
    await db.update('notifications', notifId, { status: 'resolved' });
    setActiveTab('Results');
    setEditingResultId(resultId);
  };

  const handleLogout = () => {
    localStorage.removeItem('sahityotsav_admin_auth');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header */}
      <header className="border-b border-border bg-card/50 p-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <LogOut className="w-4 h-4" /> 
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Horizontal Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-border/50 pb-4 mb-8 scrollbar-hide">
          {TABS.map((tab) => {
            const icons: any = {
              'Dashboard': <LayoutDashboard className="w-4 h-4" />,
              'Notifications': <Bell className="w-4 h-4" />,
              'Results': <Trophy className="w-4 h-4" />,
              'Programs': <Calendar className="w-4 h-4" />,
              'Categories': <List className="w-4 h-4" />,
              'News': <Newspaper className="w-4 h-4" />,
              'Gallery': <ImageIcon className="w-4 h-4" />,
              'Videos': <Video className="w-4 h-4" />,
              'Teams': <Users className="w-4 h-4" />,
              'About': <List className="w-4 h-4" />,
              'Settings': <Settings className="w-4 h-4" />
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-semibold ${
                  activeTab === tab 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-foreground/70 hover:bg-card hover:text-foreground border border-transparent'
                }`}
              >
                {icons[tab]} {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Dashboard' && <DashboardTab />}
          {activeTab === 'Notifications' && <NotificationsTab onNavigateToResult={handleNavigateToResultEdit} />}
          {activeTab === 'News' && <NewsTab />}
          {activeTab === 'Gallery' && <GalleryTab />}
          {activeTab === 'Videos' && <VideosTab />}
          {activeTab === 'Results' && <ResultsTab externalEditingId={editingResultId} setExternalEditingId={setEditingResultId} />}
          {activeTab === 'Teams' && <TeamsTab />}
          {activeTab === 'About' && <AboutTab />}
          {/* Use generic layouts for the rest for now */}
          {['Programs', 'Categories'].includes(activeTab) && (
            <GenericCrudTab table={activeTab.toLowerCase()} />
          )}
          {activeTab === 'Settings' && <SettingsTab />}
        </motion.div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// TAB COMPONENTS
// -------------------------------------------------------------

function AboutTab() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const defaultData = {
    mission1: "Sahityotsav is the premier literary and cultural festival for the Chelembra sector.",
    mission2: "Every year, hundreds of participants gather to showcase their talents.",
    stat1: "May 15-20, 2026", stat1Label: "Festival Dates",
    stat2: "Chelembra HQ", stat2Label: "Main Venue",
    stat3: "400+", stat3Label: "Participants",
    stat4: "54", stat4Label: "Competitions",
    homeDesc: "Sahityotsav is a grand literary and cultural festival representing the Chelembra sector.",
    homeStat1: "50+", homeStat1Label: "Programs",
    homeStat2: "4", homeStat2Label: "Teams",
    homeStat3: "400+", homeStat3Label: "Participants",
    homeStat4: "100%", homeStat4Label: "Spirit"
  };

  useEffect(() => {
    db.getSetting('about_data').then(val => {
      if (val) { try { setData(JSON.parse(val)); } catch { setData(defaultData); } }
      else setData(defaultData);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    await db.setSetting('about_data', JSON.stringify(data));
    alert('Details saved successfully!');
  };

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value });

  if (loading) return <div className="text-center py-20 text-foreground/50">Loading...</div>;

  const renderInput = (label: string, name: string) => (
    <div>
      <label className="block text-sm mb-2 text-foreground/80">{label}</label>
      <input name={name} value={data[name]} onChange={handleChange} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" />
    </div>
  );

  const renderTextarea = (label: string, name: string) => (
    <div>
      <label className="block text-sm mb-2 text-foreground/80">{label}</label>
      <textarea name={name} value={data[name]} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 text-primary">About Page Configuration</h3>
        <div className="space-y-4">
          {renderTextarea("Mission Paragraph 1", "mission1")}
          {renderTextarea("Mission Paragraph 2", "mission2")}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="space-y-2">{renderInput("Card 1 Value", "stat1")}{renderInput("Card 1 Label", "stat1Label")}</div>
            <div className="space-y-2">{renderInput("Card 2 Value", "stat2")}{renderInput("Card 2 Label", "stat2Label")}</div>
            <div className="space-y-2">{renderInput("Card 3 Value", "stat3")}{renderInput("Card 3 Label", "stat3Label")}</div>
            <div className="space-y-2">{renderInput("Card 4 Value", "stat4")}{renderInput("Card 4 Label", "stat4Label")}</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 text-secondary">Home Page 'What is Sahityotsav?' Section</h3>
        <div className="space-y-4">
          {renderTextarea("Description", "homeDesc")}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="space-y-2">{renderInput("Stat 1 Value", "homeStat1")}{renderInput("Stat 1 Label", "homeStat1Label")}</div>
            <div className="space-y-2">{renderInput("Stat 2 Value", "homeStat2")}{renderInput("Stat 2 Label", "homeStat2Label")}</div>
            <div className="space-y-2">{renderInput("Stat 3 Value", "homeStat3")}{renderInput("Stat 3 Label", "homeStat3Label")}</div>
            <div className="space-y-2">{renderInput("Stat 4 Value", "homeStat4")}{renderInput("Stat 4 Label", "homeStat4Label")}</div>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors shadow-lg">
        Save All Changes
      </button>
    </form>
  );
}

function DashboardTab() {
  const [teams, setTeams] = useState<any[]>([]);
  useEffect(() => { db.get('teams').then(setTeams); }, []);

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 border border-border/50 rounded-2xl">
        <h2 className="text-3xl font-bold text-primary">Hello, Admin! 👋</h2>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary"/> Team Points Overview</h3>
        <div className="space-y-3">
          {teams.sort((a,b) => b.points - a.points).map((team, index) => (
            <div key={team.id} className="bg-black/30 p-5 rounded-xl border border-border/30 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center text-sm font-bold text-foreground/60">{index + 1}</div>
                <span className="font-bold text-lg">{team.name}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span className="font-bold text-2xl">{team.points}</span>
                <span className="text-sm text-foreground/60">points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ onNavigateToResult }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => { db.get('notifications').then(setNotifications); }, []);

  const handleStatus = async (id: number, status: string) => {
    if (status === 'deleted') {
      await db.delete('notifications', id);
    } else {
      await db.update('notifications', id, { status });
    }
    db.get('notifications').then(setNotifications);
  };

  const pending = notifications.filter(n => n.status === 'pending').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Bell className="w-6 h-6"/> Notifications</h2>
      <div className="flex border-b border-border mb-6">
        <button className="px-6 py-3 border-b-2 border-transparent text-foreground/60">Result Requests (0)</button>
        <button className="px-6 py-3 border-b-2 border-primary text-primary font-bold bg-primary/5">Reports ({pending})</button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && <p className="text-foreground/50">No notifications.</p>}
        {notifications.map((notif: any) => (
          <div key={notif.id} className={`glass-card p-6 border ${notif.status === 'pending' ? 'border-red-500/30' : 'border-green-500/30'} rounded-xl flex justify-between items-start`}>
            <div>
              <h3 className="font-bold text-lg mb-1">{notif.title}</h3>
              <p className="text-sm text-foreground/60 mb-2">Reported by: {notif.by}</p>
              <p className="text-sm text-foreground/40 mb-2">{notif.date}</p>
              <p className="text-sm">Status: <span className={notif.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>{notif.status}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleStatus(notif.id, 'deleted')} className="px-4 py-2 border border-border rounded hover:bg-accent text-sm flex items-center gap-2"><X className="w-4 h-4"/> Dismiss</button>
              {notif.status === 'pending' && notif.type === 'result' && notif.resultId ? (
                <button onClick={() => onNavigateToResult(notif.resultId, notif.id)} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm flex items-center gap-2"><Edit2 className="w-4 h-4"/> Resolve & Edit Result</button>
              ) : notif.status === 'pending' ? (
                <button onClick={() => handleStatus(notif.id, 'resolved')} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Resolve</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab() {
  const [news, setNews] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '', image: '' });

  useEffect(() => { db.get('news').then(setNews); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    await db.insert('news', { ...formData, date: new Date().toLocaleDateString() });
    db.get('news').then(setNews);
    setFormData({ title: '', content: '', image: '' });
  };

  const handleDelete = async (id: number) => {
    await db.delete('news', id);
    db.get('news').then(setNews);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-6 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add News Update</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Title *</label>
            <input 
              required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
              placeholder="Enter news title" 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Content *</label>
            <textarea 
              required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none min-h-[150px]" 
              placeholder="Enter news content" 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Image Source Method (Optional)</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-primary"><input type="radio" name="img" defaultChecked className="accent-primary" /> Upload File</label>
              <label className="flex items-center gap-2"><input type="radio" name="img" className="accent-primary" /> Paste URL</label>
            </div>
            <div className="relative w-full bg-black/40 border border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="text-foreground/60 text-sm">Choose File <span className="text-xs ml-2">{formData.image ? 'Image Selected' : 'No file chosen'}</span></p>
            </div>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-colors">
            Add News
          </button>
        </form>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-border/50 h-[600px] flex flex-col">
        <h3 className="text-xl font-bold mb-6">Recent News</h3>
        <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
          {news.length === 0 ? <p className="text-foreground/50">No news added yet.</p> : null}
          {news.map((item: any) => (
            <div key={item.id} className="bg-black/30 border border-border/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-primary uppercase">{item.title}</h4>
                <div className="flex gap-2">
                  <button className="text-yellow-500 hover:bg-yellow-500/20 p-1 rounded"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-500/20 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{item.content}</p>
              <p className="text-xs text-foreground/40">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideosTab() {
  const [videos, setVideos] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });

  useEffect(() => { db.get('videos').then(setVideos); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    await db.insert('videos', formData);
    db.get('videos').then(setVideos);
    setFormData({ title: '', url: '', description: '' });
  };

  const handleDelete = async (id: number) => {
    await db.delete('videos', id);
    db.get('videos').then(setVideos);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Video</h3>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Title *</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Festival Highlights 2024" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Video URL * (YouTube, Vimeo, etc.)</label>
            <input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="https://youtube.com/embed/..." />
            <p className="text-xs text-foreground/50 mt-1">For YouTube: Use embed URL</p>
          </div>
          <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-lg transition-colors">
            Add Video
          </button>
        </form>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6">Manage Videos ({videos.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <div key={v.id} className="bg-black/30 border border-border/50 rounded-xl overflow-hidden">
              <div className="aspect-video bg-accent/30 relative">
                <Video className="w-10 h-10 absolute inset-0 m-auto text-foreground/20" />
              </div>
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-bold line-clamp-1">{v.title}</h4>
                  <p className="text-xs text-foreground/50 truncate mt-1">{v.url}</p>
                </div>
                <button onClick={() => handleDelete(v.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryTab() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => { db.get('gallery').then(setImages); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await db.insert('gallery', { url: reader.result as string });
        db.get('gallery').then(setImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSyncDrive = async () => {
    await db.insert('gallery', { url: `https://source.unsplash.com/random/400x400?festival,culture,${Date.now()}` });
    db.get('gallery').then(setImages);
    alert('Simulated syncing 1 image from Google Drive!');
  };

  const handleDelete = async (id: number) => {
    await db.delete('gallery', id);
    db.get('gallery').then(setImages);
  };

  return (
    <div className="space-y-8">
      {/* Sync Section */}
      <div className="glass-card p-6 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><UploadCloud className="w-5 h-5"/> Sync from Google Drive</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Google Drive Folder URL</label>
            <input className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="https://drive.google.com/drive/folders/..." />
            <p className="text-xs text-foreground/50 mt-1">Paste a shared Google Drive folder link. All images will be automatically uploaded.</p>
          </div>
          <button onClick={handleSyncDrive} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-colors opacity-80">
            Sync from Google Drive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl border border-border/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UploadCloud className="w-5 h-5"/> Add Gallery Image</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-foreground/80">Image Source Method *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-primary"><input type="radio" name="gimg" defaultChecked className="accent-primary" /> Upload File</label>
                <label className="flex items-center gap-2"><input type="radio" name="gimg" className="accent-primary" /> Paste URL</label>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground/80">Upload Images *</label>
              <div className="relative w-full bg-black/40 border border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <p className="text-foreground/60 text-sm">Choose File <span className="text-xs ml-2">No file chosen</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-border/50 h-[500px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Gallery Images</h3>
          <div className="overflow-y-auto pr-2 grid grid-cols-2 gap-4 flex-1 custom-scrollbar">
            {images.map(img => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-border/50">
                <img src={img.url} className="absolute inset-0 w-full h-full object-cover" alt="Gallery" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <p className="text-xs truncate">IMG_{img.id.toString().slice(-4)}</p>
                  <button onClick={() => handleDelete(img.id)} className="self-end bg-red-500 p-1.5 rounded text-white"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsTab() {
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', points: '', color: 'from-primary to-secondary' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const loadedTeams = await db.get('teams');
    setTeams(loadedTeams);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await db.update('teams', editingId, { ...formData, points: parseInt(formData.points) || 0 });
      setEditingId(null);
    } else {
      await db.insert('teams', { ...formData, points: parseInt(formData.points) || 0 });
    }
    setFormData({ name: '', points: '', color: 'from-primary to-secondary' });
    fetchData();
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setFormData({ 
      name: team.name || '', 
      points: String(team.points || 0), 
      color: team.color || 'from-primary to-secondary' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if(confirm('Delete this team?')) {
      await db.delete('teams', id);
      fetchData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="glass-card p-6 rounded-2xl border border-border/50 lg:col-span-1 h-fit">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {editingId ? <Edit2 className="w-5 h-5"/> : <Plus className="w-5 h-5"/>} 
          {editingId ? 'Edit Team' : 'Add New Team'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Team Name *</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="e.g. NASHEEDA" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Starting Points</label>
            <input type="number" required value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground/80">Team Color Theme</label>
            <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none">
              <option value="from-primary to-secondary">Orange / Gold</option>
              <option value="from-blue-500 to-cyan-400">Blue / Cyan</option>
              <option value="from-green-500 to-emerald-400">Green / Emerald</option>
              <option value="from-purple-500 to-pink-500">Purple / Pink</option>
              <option value="from-red-500 to-rose-400">Red / Rose</option>
              <option value="from-slate-400 to-gray-200">Silver / Gray</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
            {editingId ? 'Update Team' : 'Add Team'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setEditingId(null); setFormData({name: '', points: '', color: 'from-primary to-secondary'})}} className="w-full bg-transparent border border-border text-foreground font-bold py-3 rounded-lg mt-2 hover:bg-card">
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-border/50 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5"/> Manage Teams</h3>
        </div>
        
        <div className="space-y-3">
          {teams.length === 0 && <p className="text-foreground/50">No teams added yet.</p>}
          {teams.sort((a,b) => b.points - a.points).map((team, index) => (
            <div key={team.id} className="bg-black/20 p-4 rounded-xl border border-border/30 flex justify-between items-center hover:bg-black/40 transition-colors relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${team.color || 'from-primary to-secondary'}`}></div>
              <div className="flex items-center gap-4 pl-3">
                <span className="text-foreground/40 font-bold w-6">#{index + 1}</span>
                <div>
                  <span className="font-bold text-lg">{team.name}</span>
                  <p className="text-xs text-foreground/50">{team.points} Total Points</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(team)} className="p-2 text-blue-500 bg-blue-500/10 rounded-lg hover:bg-blue-500/20" title="Edit Team"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(team.id)} className="p-2 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20" title="Delete Team"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [theme, setTheme] = useState(localStorage.getItem('sahityotsav_theme') || 'default');
  const [eventDate, setEventDate] = useState(localStorage.getItem('sahityotsav_event_date') || '2026 MAY 23-24 CHELEMBRA');
  const [teams, setTeams] = useState<any[]>([]);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    db.get('teams').then(setTeams);
    db.getSetting('event_date').then(val => { if (val) setEventDate(val); });
    
    const updateViewers = () => {
      try {
        const activeUsersStr = localStorage.getItem('sahityotsav_active_users');
        if (activeUsersStr) {
          const activeUsers = JSON.parse(activeUsersStr);
          const now = Date.now();
          let count = 0;
          for (const id in activeUsers) {
            if (now - activeUsers[id] <= 10000) count++;
          }
          setViewers(Math.max(count, 1));
        }
      } catch (e) {}
    };

    updateViewers();
    const interval = setInterval(updateViewers, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('sahityotsav_theme', newTheme);
    if (newTheme !== 'default') {
      document.documentElement.setAttribute('data-theme', newTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    window.location.reload();
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setEventDate(val);
    await db.setSetting('event_date', val);
  };

  const maxPoints = Math.max(...teams.map(t => parseInt(t.points) || 0), 10);

  return (
    <div className="space-y-8">
      {/* Viewers & Theme Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="glass-card p-8 rounded-2xl border border-border/50 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
          <div className="absolute top-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <span className="font-bold tracking-widest uppercase text-sm">Live</span>
          </div>
          <h3 className="text-7xl font-black mb-2">{viewers}</h3>
          <p className="text-foreground/60">Current Active Viewers</p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-border/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="w-5 h-5"/> Global Theme</h3>
          <div className="space-y-4">
            <button onClick={() => handleThemeChange('default')} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-colors ${theme === 'default' ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-card'}`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 shadow-md"></div>
                <span className="font-bold">Midnight Orange (Default)</span>
              </div>
              {theme === 'default' && <CheckCircle className="w-5 h-5 text-primary"/>}
            </button>
            <button onClick={() => handleThemeChange('royal-ivory')} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-colors ${theme === 'royal-ivory' ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-card'}`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-800 to-amber-600 shadow-md"></div>
                <span className="font-bold">Royal Ivory & Gold</span>
              </div>
              {theme === 'royal-ivory' && <CheckCircle className="w-5 h-5 text-primary"/>}
            </button>
            <button onClick={() => handleThemeChange('ocean-blue')} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-colors ${theme === 'ocean-blue' ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-card'}`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-md"></div>
                <span className="font-bold">Deep Ocean Blue</span>
              </div>
              {theme === 'ocean-blue' && <CheckCircle className="w-5 h-5 text-primary"/>}
            </button>
          </div>
        </div>
      </div>

      {/* Date Settings */}
      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="w-5 h-5"/> Hero Section Configuration</h3>
        <div>
          <label className="block text-sm mb-2 text-foreground/80 font-bold">Event Date & Location String (4 words recommended)</label>
          <input 
            type="text" 
            value={eventDate} 
            onChange={handleDateChange} 
            className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none font-bebas tracking-widest text-xl" 
            placeholder="e.g. 2026 MAY 23-24 CHELEMBRA" 
          />
          <p className="text-xs text-foreground/50 mt-2">This exactly controls the 4-part stylized string on the Home Page. The 2nd word turns red, the 4th turns yellow.</p>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="glass-card p-8 rounded-2xl border border-border/50 overflow-x-auto">
        <h3 className="text-xl font-bold mb-10 flex items-center gap-2"><Trophy className="w-5 h-5"/> Team Performance Bar Chart</h3>
        <div className="h-[300px] flex items-end gap-4 md:gap-12 justify-around pt-10 border-b-2 border-l-2 border-border/50 pb-2 pl-8 relative min-w-[500px]">
          {/* Y axis labels */}
          <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs font-bold text-foreground/40 pb-2">
            <span>{maxPoints}</span>
            <span>{Math.floor(maxPoints * 0.75)}</span>
            <span>{Math.floor(maxPoints * 0.5)}</span>
            <span>{Math.floor(maxPoints * 0.25)}</span>
            <span>0</span>
          </div>

          {teams.length === 0 && <p className="text-foreground/50 self-center w-full text-center pb-20">No teams available for graph.</p>}
          {teams.map(team => {
            const heightPct = ((parseInt(team.points) || 0) / maxPoints) * 100;
            return (
              <div key={team.id} className="w-full max-w-[120px] md:max-w-[150px] flex flex-col justify-end items-center group h-full relative">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-black/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg text-sm whitespace-nowrap z-10 font-bold shadow-xl">
                  {team.points} pts
                </div>
                <div 
                  className={`w-[60px] md:w-[100px] rounded-t-lg bg-gradient-to-t ${team.color || 'from-primary to-secondary'} transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:brightness-125 cursor-pointer relative overflow-hidden`}
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
                </div>
                <span className="mt-4 font-bold text-sm text-center whitespace-normal break-words w-full px-1">{team.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ADVANCED RESULTS TAB
// -------------------------------------------------------------

const WinnerForm = ({ title, winner, setWinner, teams, isRequired, onRemove }: any) => (
  <div className="flex-1 min-w-[250px] relative">
    {onRemove && (
      <button type="button" onClick={onRemove} className="absolute top-0 right-0 p-1 text-red-500 hover:bg-red-500/10 rounded"><X className="w-4 h-4"/></button>
    )}
    <h5 className="font-bold mb-3">{title} {isRequired ? '(Required)' : '(Optional)'}</h5>
    <div className="space-y-4">
      <div>
        <label className="block text-xs mb-1 text-foreground/60">Participant Name {isRequired && '*'}</label>
        <input required={isRequired} value={winner.name} onChange={e => setWinner({...winner, name: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-white focus:border-primary outline-none" placeholder="Enter name" />
      </div>
      <div>
        <label className="block text-xs mb-1 text-foreground/60">Team {isRequired && '*'}</label>
        <select required={isRequired && winner.name !== ''} value={winner.team} onChange={e => setWinner({...winner, team: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-white focus:border-primary outline-none">
          <option value="">Select team</option>
          {teams.map((t: any) => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs mb-1 text-foreground/60">Grade</label>
          <select value={winner.grade} onChange={e => setWinner({...winner, grade: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-white focus:border-primary outline-none">
            <option>A+</option><option>A</option><option>B</option><option>C</option><option>None</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1 text-foreground/60">Points *</label>
          <input required={isRequired && winner.name !== ''} type="number" value={winner.points} onChange={e => setWinner({...winner, points: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-white focus:border-primary outline-none" />
        </div>
      </div>
    </div>
  </div>
);

function ResultsTab({ externalEditingId, setExternalEditingId }: any) {
  const [results, setResults] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({ programId: '', resultNumber: '' });

  const defaultWinner = { name: '', team: '', grade: 'A', points: '' };
  const [first1, setFirst1] = useState({...defaultWinner, points: '10', grade: 'A+'});
  const [first2, setFirst2] = useState({...defaultWinner, points: '10', grade: 'A+'});
  const [second1, setSecond1] = useState({...defaultWinner, points: '6', grade: 'A'});
  const [second2, setSecond2] = useState({...defaultWinner, points: '6', grade: 'A'});
  const [third1, setThird1] = useState({...defaultWinner, points: '2', grade: 'B'});
  const [third2, setThird2] = useState({...defaultWinner, points: '2', grade: 'B'});

  const [additionalGrades, setAdditionalGrades] = useState<any[]>([]);
  const [posters, setPosters] = useState<string[]>([]);

  const fetchData = async () => {
    const progs = await db.get('programs');
    const tms = await db.get('teams');
    const res = await db.get('results');
    setPrograms(progs);
    setTeams(tms);
    setResults(res);
    if (!editingId) {
      const nextNum = res.length > 0 ? Math.max(...res.map((r:any) => parseInt(r.result_number) || 0)) + 1 : 1;
      setFormData((prev: any) => ({...prev, resultNumber: nextNum.toString()}));
    }
  };

  useEffect(() => { fetchData(); }, [editingId]);

  useEffect(() => {
    if (externalEditingId && results.length > 0) {
      const r = results.find(x => x.id === externalEditingId);
      if (r) {
        handleEdit(r);
      }
      setExternalEditingId(null);
    }
  }, [externalEditingId, results]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const program = programs.find(p => p.id.toString() === formData.programId);
    if (!program) return alert('Select a program');

    const winnersToSave: any[] = [];
    const allWinners = [
      { ...first1, place: 1 }, { ...first2, place: 1 },
      { ...second1, place: 2 }, { ...second2, place: 2 },
      { ...third1, place: 3 }, { ...third2, place: 3 },
      ...additionalGrades
    ];

    let currentTeams = [...teams];

    // If editing, reverse the old points first
    if (editingId) {
      const oldResult = results.find(r => r.id === editingId);
      if (oldResult && oldResult.winners) {
        for (const w of oldResult.winners) {
          const tIdx = currentTeams.findIndex(t => t.name === w.team);
          if (tIdx !== -1) {
            currentTeams[tIdx].points = (parseInt(currentTeams[tIdx].points) || 0) - parseInt(w.points);
          }
        }
      }
    }

    for (const w of allWinners) {
      if (w.name && w.team) {
        winnersToSave.push(w);
        const tIdx = currentTeams.findIndex(t => t.name === w.team);
        if (tIdx !== -1) {
          currentTeams[tIdx].points = (parseInt(currentTeams[tIdx].points) || 0) + parseInt(w.points);
        }
      }
    }

    // Save team point updates
    for (const t of currentTeams) {
      await db.update('teams', t.id, { points: t.points });
    }

    const newResult = {
      program_id: program.id,
      title: program.title,
      category: program.category,
      result_number: formData.resultNumber,
      timestamp: new Date().toLocaleString(),
      winners: winnersToSave,
      posters: posters
    };

    if (editingId) {
      await db.update('results', editingId, newResult);
      alert('Result updated successfully!');
    } else {
      await db.insert('results', newResult);
      alert('Result published and team points updated successfully!');
    }
    
    // Reset
    setEditingId(null);
    setFormData({ programId: '', resultNumber: '' });
    setFirst1({...defaultWinner, points: '10', grade: 'A+'});
    setFirst2({...defaultWinner, points: '10', grade: 'A+'});
    setSecond1({...defaultWinner, points: '6', grade: 'A'});
    setSecond2({...defaultWinner, points: '6', grade: 'A'});
    setThird1({...defaultWinner, points: '2', grade: 'B'});
    setThird2({...defaultWinner, points: '2', grade: 'B'});
    setAdditionalGrades([]);
    setPosters([]);
    fetchData();
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setFormData({ programId: r.programId ? r.programId.toString() : '', resultNumber: r.resultNumber });
    
    // reset first
    setFirst1({...defaultWinner, points: '10', grade: 'A+'});
    setFirst2({...defaultWinner, points: '10', grade: 'A+'});
    setSecond1({...defaultWinner, points: '6', grade: 'A'});
    setSecond2({...defaultWinner, points: '6', grade: 'A'});
    setThird1({...defaultWinner, points: '2', grade: 'B'});
    setThird2({...defaultWinner, points: '2', grade: 'B'});
    setAdditionalGrades([]);
    setPosters(r.posters || []);

    const w1 = r.winners?.filter((w:any) => w.place === 1) || [];
    if(w1[0]) setFirst1(w1[0]);
    if(w1[1]) setFirst2(w1[1]);

    const w2 = r.winners?.filter((w:any) => w.place === 2) || [];
    if(w2[0]) setSecond1(w2[0]);
    if(w2[1]) setSecond2(w2[1]);

    const w3 = r.winners?.filter((w:any) => w.place === 3) || [];
    if(w3[0]) setThird1(w3[0]);
    if(w3[1]) setThird2(w3[1]);

    const add = r.winners?.filter((w:any) => w.place === 'Additional') || [];
    setAdditionalGrades(add);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if(confirm('Delete result? This WILL reverse the team points given for this result!')) {
      const oldResult = results.find(r => r.id === id);
      if (oldResult && oldResult.winners) {
        for (const w of oldResult.winners) {
          const teamData = teams.find(t => t.name === w.team);
          if (teamData) {
            await db.update('teams', teamData.id, { points: (parseInt(teamData.points) || 0) - parseInt(w.points) });
          }
        }
      }
      await db.delete('results', id);
      fetchData();
    }
  };

  const handlePostersUpload = (e: any) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosters(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    await db.update('results', id, { is_hidden: !currentStatus });
    fetchData();
  };

  const ResultFormJSX = (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-2 text-foreground/80">Program *</label>
          <select required value={formData.programId} onChange={e => setFormData({...formData, programId: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none">
            <option value="">Select program</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.title} ({p.category})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 text-foreground/80">Result Number</label>
          <input required type="number" value={formData.resultNumber} onChange={e => setFormData({...formData, resultNumber: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" />
          <p className="text-xs text-foreground/50 mt-1">Edit if needed. Next result will be {parseInt(formData.resultNumber) + 1 || ''}.</p>
        </div>
      </div>

      {/* First Place Winners */}
      <div className="border border-orange-500/30 rounded-xl p-6 bg-orange-500/5">
        <h4 className="font-bold text-orange-500 mb-6 flex items-center gap-2"><Medal className="w-5 h-5"/> First Place Winners</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <WinnerForm title="Winner 1" winner={first1} setWinner={setFirst1} teams={teams} isRequired={true} />
          <WinnerForm title="Winner 2" winner={first2} setWinner={setFirst2} teams={teams} isRequired={false} />
        </div>
      </div>
      
      {/* Second Place Winners */}
      <div className="border border-gray-400/30 rounded-xl p-6 bg-gray-400/5">
        <h4 className="font-bold text-gray-400 mb-6 flex items-center gap-2"><Medal className="w-5 h-5"/> Second Place Winners</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <WinnerForm title="Winner 1" winner={second1} setWinner={setSecond1} teams={teams} isRequired={false} />
          <WinnerForm title="Winner 2" winner={second2} setWinner={setSecond2} teams={teams} isRequired={false} />
        </div>
      </div>

      {/* Third Place Winners */}
      <div className="border border-amber-700/30 rounded-xl p-6 bg-amber-700/5">
        <h4 className="font-bold text-amber-600 mb-6 flex items-center gap-2"><Medal className="w-5 h-5"/> Third Place Winners</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <WinnerForm title="Winner 1" winner={third1} setWinner={setThird1} teams={teams} isRequired={false} />
          <WinnerForm title="Winner 2" winner={third2} setWinner={setThird2} teams={teams} isRequired={false} />
        </div>
      </div>

      {/* Additional Grades */}
      <div className="border border-border/50 rounded-xl p-6 bg-black/20">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-foreground/80 flex items-center gap-2"><Trophy className="w-5 h-5"/> Additional Grades (Optional)</h4>
          <button type="button" onClick={() => setAdditionalGrades([...additionalGrades, { id: Date.now(), name: '', team: '', grade: 'A', points: '1', place: 'Additional' }])} className="flex items-center gap-1 text-sm bg-accent px-3 py-1.5 rounded hover:bg-white/10"><Plus className="w-4 h-4"/> Add Grade</button>
        </div>
        <div className="space-y-6">
          {additionalGrades.map((g, index) => (
            <WinnerForm 
              key={g.id} 
              title={`Additional Grade ${index + 1}`} 
              winner={g} 
              setWinner={(newW: any) => setAdditionalGrades(additionalGrades.map(x => x.id === g.id ? newW : x))} 
              teams={teams} 
              isRequired={true}
              onRemove={() => setAdditionalGrades(additionalGrades.filter(x => x.id !== g.id))}
            />
          ))}
        </div>
      </div>

      {/* Result Posters */}
      <div className="border border-border/50 rounded-xl p-6 bg-black/20">
        <h4 className="font-bold text-foreground/80 mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Result Posters (Optional)</h4>
        <div>
          <label className="block text-sm mb-2 text-foreground/60">Upload Posters</label>
          <div className="relative w-full bg-black/40 border border-border rounded-lg p-3 hover:border-primary/50 transition-colors">
            <input type="file" multiple accept="image/*" onChange={handlePostersUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <p className="text-foreground/60 text-sm font-semibold">Choose Files <span className="font-normal text-xs ml-2">{posters.length > 0 ? `${posters.length} file(s) chosen` : 'No file chosen'}</span></p>
          </div>
          <p className="text-xs text-foreground/50 mt-2">You can upload multiple poster images</p>
        </div>
      </div>

      <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-lg transition-colors text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
        {editingId ? 'Update Result' : 'Publish Result & Update Points'}
      </button>
      {editingId && (
         <button type="button" onClick={() => { setEditingId(null); setFormData({programId: '', resultNumber: ''}); setAdditionalGrades([]); setPosters([]); }} className="w-full bg-transparent border border-border hover:bg-card text-foreground font-bold py-4 rounded-lg transition-colors text-lg mt-4">
          Cancel Edit
        </button>
      )}
    </form>
  );

  return (
    <div className="space-y-8">
      {!editingId && (
        <div className="glass-card p-6 border border-border/50 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add Competition Result</h3>
          {ResultFormJSX}
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto pt-10">
          <div className="bg-[#111] border border-border/50 rounded-2xl p-6 md:p-8 w-full max-w-4xl relative shadow-2xl mb-20">
             <button type="button" onClick={() => { setEditingId(null); setFormData({programId: '', resultNumber: ''}); setAdditionalGrades([]); setPosters([]); }} className="absolute top-6 right-6 text-foreground/50 hover:text-white p-2 bg-black/40 rounded-full z-10"><X className="w-6 h-6"/></button>
             <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-primary"><Edit2 className="w-6 h-6"/> Edit Competition Result</h3>
             {ResultFormJSX}
          </div>
        </div>
      )}

      <div className="glass-card p-6 border border-border/50 rounded-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-5 h-5"/> Manage Results</h3>
        <div className="space-y-4">
          {results.length === 0 && <p className="text-foreground/50">No results published yet.</p>}
          {results.map((r) => (
            <div key={r.id} className={`bg-black/30 p-5 rounded-xl border flex flex-col gap-4 ${r.is_hidden ? 'border-red-500/30 opacity-75' : 'border-border/50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className={`font-bold text-lg uppercase ${r.is_hidden ? 'text-foreground/50' : 'text-primary'}`}>{r.title} - Result #{r.result_number}</h4>
                    {r.is_hidden && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">HIDDEN</span>}
                  </div>
                  {r.posters?.length > 0 && <p className="text-xs text-foreground/50 mt-1">{r.posters.length} poster(s) attached</p>}
                </div>
                <div className="flex gap-2">
                  <button title={r.is_hidden ? "Make Visible" : "Hide Result"} onClick={() => handleToggleVisibility(r.id, !!r.is_hidden)} className={`${r.is_hidden ? 'text-gray-400 hover:bg-gray-400/20' : 'text-green-500 hover:bg-green-500/20'} p-2 rounded`}>
                    {r.isHidden ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                  <button title="Edit Result" onClick={() => handleEdit(r)} className="text-blue-500 hover:bg-blue-500/20 p-2 rounded"><Edit2 className="w-4 h-4"/></button>
                  <button title="Delete Result" onClick={() => handleDelete(r.id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-foreground/80 bg-black/20 p-3 rounded-lg border border-border/30">
                {r.winners?.filter((w:any) => w.place === 1).map((w:any, i:number) => (
                  <p key={i}>🥇 First: {w.name} ({w.grade}) - {w.points} pts</p>
                ))}
                {r.winners?.filter((w:any) => w.place === 2).map((w:any, i:number) => (
                  <p key={i}>🥈 Second: {w.name} ({w.grade}) - {w.points} pts</p>
                ))}
                {r.winners?.filter((w:any) => w.place === 3).map((w:any, i:number) => (
                  <p key={i}>🥉 Third: {w.name} ({w.grade}) - {w.points} pts</p>
                ))}
                {r.winners?.filter((w:any) => w.place === 'Additional').length > 0 && (
                  <p className="text-foreground/50 text-xs mt-2 italic">+{r.winners?.filter((w:any) => w.place === 'Additional').length} additional grade(s)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// GENERIC CRUD (For Results, Programs & Categories)
// -------------------------------------------------------------
function GenericCrudTab({ table }: { table: string }) {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {
    const rows = await db.get(table);
    setData(rows);
    if (table !== 'categories') {
      const cats = await db.get('categories');
      setCategories(cats);
    }
  };
  useEffect(() => { fetchData(); }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.insert(table, formData);
    fetchData();
    setFormData({});
  };

  const handleDelete = async (id: number) => {
    if(confirm('Delete?')) { await db.delete(table, id); fetchData(); }
  };

  const columns = table === 'categories' ? ['name'] : ['title', 'category'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="glass-card p-6 rounded-2xl border border-border/50 lg:col-span-1 h-fit">
        <h3 className="text-xl font-bold mb-6 capitalize">Add {table}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.map(col => (
            <div key={col}>
              <label className="block text-sm mb-2 text-foreground/80 capitalize">{col}</label>
              {col === 'category' ? (
                <select 
                  required 
                  value={formData[col] || ''} 
                  onChange={e => setFormData({...formData, [col]: e.target.value})}
                  className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <input 
                  required value={formData[col] || ''} onChange={e => setFormData({...formData, [col]: e.target.value})}
                  className="w-full bg-black/40 border border-border rounded-lg p-3 text-white focus:border-primary outline-none" 
                />
              )}
            </div>
          ))}
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg">Save</button>
        </form>
      </div>
      
      <div className="glass-card p-6 rounded-2xl border border-border/50 lg:col-span-2">
        <h3 className="text-xl font-bold mb-6 capitalize">Manage {table}</h3>
        <div className="space-y-3">
          {data.length === 0 && <p className="text-foreground/50">No records found.</p>}
          {data.map((record) => (
            <div key={record.id} className="bg-black/30 p-4 rounded-xl border border-border/50 flex justify-between items-center">
              <div>
                <p className="font-bold">{record.title || record.name}</p>
                {record.category && <p className="text-sm text-foreground/50">{record.category}</p>}
              </div>
              <button onClick={() => handleDelete(record.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
