// A simple LocalStorage-based mock database

export const db = {
  get: (table: string) => {
    const data = localStorage.getItem(`sahityotsav_${table}`);
    return data ? JSON.parse(data) : [];
  },
  insert: (table: string, item: any) => {
    const data = db.get(table);
    // Use Math.random() to ensure uniqueness even if multiple items are added in the same millisecond
    const newItem = { ...item, id: Date.now() + Math.random() };
    localStorage.setItem(`sahityotsav_${table}`, JSON.stringify([newItem, ...data]));
    return newItem;
  },
  delete: (table: string, id: number) => {
    const data = db.get(table);
    const newData = data.filter((item: any) => item.id !== id);
    localStorage.setItem(`sahityotsav_${table}`, JSON.stringify(newData));
  },
  update: (table: string, id: number, updates: any) => {
    const data = db.get(table);
    const newData = data.map((item: any) => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(`sahityotsav_${table}`, JSON.stringify(newData));
  }
};

// Initialize with some dummy data if empty
if (db.get('teams').length === 0) {
  db.insert('teams', { name: 'Qudus', color: 'from-orange-500 to-orange-700', points: 510 });
  db.insert('teams', { name: 'Undulus', color: 'from-orange-600 to-amber-800', points: 616 });
  db.insert('teams', { name: 'Marakish', color: 'from-gray-300 to-gray-500', points: 647 });
  db.insert('teams', { name: 'Dimashq', color: 'from-yellow-400 to-yellow-600', points: 659 });
}

if (db.get('categories').length === 0) {
  db.insert('categories', { name: 'Universal' });
  db.insert('categories', { name: 'Bachelor' });
  db.insert('categories', { name: 'Kids' });
}

if (db.get('notifications').length === 0) {
  db.insert('notifications', { title: 'Issue with: QAWWALI', by: 'resuk', date: '4/2/2026', status: 'pending' });
}
