import { supabase } from '../lib/supabase';
import type { Form, FormSection, FormField } from '../types/forms';

export const formsApi = {
  // Forms
  async getForms() {
    const { data, error } = await supabase.from('forms').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Form[];
  },
  
  async getForm(id: string) {
    const { data, error } = await supabase.from('forms').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Form;
  },
  
  async createForm(form: Omit<Form, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('forms').insert(form).select().single();
    if (error) throw error;
    return data as Form;
  },

  async updateForm(id: string, updates: Partial<Form>) {
    const { data, error } = await supabase.from('forms').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Form;
  },

  // Sections
  async getFormSections(formId: string) {
    const { data, error } = await supabase.from('form_sections').select('*').eq('form_id', formId).order('display_order', { ascending: true });
    if (error) throw error;
    return data as FormSection[];
  },

  // Fields
  async getFormFields(formId: string) {
    const { data, error } = await supabase.from('form_fields').select('*').eq('form_id', formId).order('display_order', { ascending: true });
    if (error) throw error;
    return data as FormField[];
  },

  // Analytics & Stats
  async getFormsStats() {
    const { data: forms, error } = await supabase.from('forms').select('id, status');
    if (error) throw error;

    const { data: assignments, error: assignmentsError } = await supabase.from('form_assignments').select('id, status, is_mandatory');
    if (assignmentsError) throw assignmentsError;

    const stats = {
      total: forms.length,
      active: forms.filter(f => f.status === 'published').length,
      scheduled: 0,
      mandatoryActive: 0,
      pendingResponses: assignments.filter(a => ['not_started', 'in_progress'].includes(a.status)).length,
      submitted: assignments.filter(a => a.status === 'submitted').length,
      blockedStudents: assignments.filter(a => a.is_mandatory && ['not_started', 'in_progress'].includes(a.status)).length,
      overdue: 0, // Would need more complex date logic
    };

    return stats;
  }
};
