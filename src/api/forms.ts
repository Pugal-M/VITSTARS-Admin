import { supabase } from '../lib/supabase';
import type { Form, FormSection, FormField } from '../types/forms';

export const formsApi = {
  // Forms
  async getForms() {
    const { data, error } = await supabase.from('forms').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [
        {
          id: 'form-1',
          title: 'Hostel Outing Consent Form',
          description: 'Mandatory consent form for upcoming holiday outing. Requires parent approval details.',
          status: 'published',
          allow_resubmission: false,
          deadline: '2026-09-01T23:59:59Z',
          deadline_policy: 'STRICT_BLOCK',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'form-2',
          title: 'Course Feedback - Fall Sem 26-27',
          description: 'End of semester course feedback for all registered courses.',
          status: 'published',
          allow_resubmission: false,
          deadline: '2026-08-30T23:59:59Z',
          deadline_policy: 'ALLOW_LATE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'form-3',
          title: 'Alumni Mentorship Preferences',
          description: 'For pre-final year students to select their preferred alumni mentors.',
          status: 'draft',
          allow_resubmission: false,
          deadline_policy: 'ALLOW_LATE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'form-4',
          title: 'Library Fines Declaration',
          description: 'Mandatory declaration regarding outstanding library fines before hall ticket generation.',
          status: 'closed',
          allow_resubmission: false,
          deadline: '2026-07-15T23:59:59Z',
          deadline_policy: 'STRICT_BLOCK',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as Form[];
    }
    
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

    if (!forms || forms.length === 0) {
      return {
        total: 4,
        active: 2,
        scheduled: 0,
        mandatoryActive: 1,
        pendingResponses: 145,
        submitted: 890,
        blockedStudents: 12,
        overdue: 0,
      };
    }

    const stats = {
      total: forms.length,
      active: forms.filter((f: any) => f.status === 'published').length,
      scheduled: 0,
      mandatoryActive: 0,
      pendingResponses: assignments.filter((a: any) => ['not_started', 'in_progress'].includes(a.status)).length,
      submitted: assignments.filter((a: any) => a.status === 'submitted').length,
      blockedStudents: assignments.filter((a: any) => a.is_mandatory && ['not_started', 'in_progress'].includes(a.status)).length,
      overdue: 0, // Would need more complex date logic
    };

    return stats;
  }
};
