// Supabase-powered database layer
// All methods are async and sync data across ALL devices
import { supabase } from './supabase';

export const db = {
  get: async (table: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(`[db.get] ${table}:`, error.message); return []; }
    return data || [];
  },

  getResultsList: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('results')
      .select('id, result_number, program_id, title, category, timestamp, is_hidden, winners')
      .order('created_at', { ascending: false });
    if (error) { console.error(`[db.getResultsList]:`, error.message); return []; }
    return data || [];
  },

  getResultById: async (id: number | string): Promise<any | null> => {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error(`[db.getResultById]:`, error.message); return null; }
    return data;
  },

  getResultPosters: async (id: number | string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('results')
      .select('posters')
      .eq('id', id)
      .single();
    if (error || !data) return [];
    return data.posters || [];
  },

  insert: async (table: string, item: any): Promise<any> => {
    const { data, error } = await supabase
      .from(table)
      .insert(item)
      .select()
      .single();
    if (error) { console.error(`[db.insert] ${table}:`, error.message); return null; }
    return data;
  },

  delete: async (table: string, id: number): Promise<void> => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`[db.delete] ${table}:`, error.message);
  },

  update: async (table: string, id: number, updates: any): Promise<any> => {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error(`[db.update] ${table}:`, error.message); return null; }
    return data;
  },

  // Settings helpers — stored in the `settings` table as key/value
  getSetting: async (key: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error || !data) return null;
    return data.value;
  },

  setSetting: async (key: string, value: string): Promise<void> => {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) console.error(`[db.setSetting] ${key}:`, error.message);
  }
};
