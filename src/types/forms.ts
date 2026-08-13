export type FormStatus = 'draft' | 'published' | 'closed';
export type FormFieldType = 'TEXT' | 'NUMBER' | 'PERCENTAGE' | 'DATE' | 'DROPDOWN' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA' | 'FILE_UPLOAD' | 'COURSE_REPEATER' | 'ACADEMIC_DATA' | 'CONFIRMATION' | 'read_only_text' | 'read_only_number' | 'read_only_attendance' | 'read_only_cgpa';
export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'needs_correction' | 'rejected' | 'expired';
export type SubmissionStatus = 'submitted' | 'under_review' | 'approved' | 'needs_correction' | 'rejected';

export interface Form {
  id: string;
  title: string;
  description?: string;
  academic_year_id?: string;
  semester_id?: string;
  deadline?: string;
  deadline_policy?: 'STRICT_BLOCK' | 'ALLOW_LATE';
  allow_resubmission: boolean;
  status: FormStatus;
  created_at: string;
  updated_at: string;
}

export interface FormSection {
  id: string;
  form_id: string;
  title: string;
  description?: string;
  order_index: number;
  repeat_type?: 'none' | 'course';
  created_at: string;
}

export interface FormField {
  id: string;
  section_id: string;
  label: string;
  key_name: string;
  type: FormFieldType;
  is_required: boolean;
  is_editable: boolean;
  options?: any[];
  validation_rules?: any;
  order_index: number;
  created_at: string;
}

export interface FormFieldOption {
  id: string;
  field_id: string;
  label: string;
  value: string;
  display_order: number;
}

export interface FormAssignment {
  id: string;
  form_id: string;
  student_id: string;
  is_mandatory: boolean;
  assignment_status: AssignmentStatus;
  assigned_at: string;
  due_date?: string;
  completed_at?: string;
  is_exempted: boolean;
  exemption_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  student_id: string;
  assignment_id: string;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  reviewer_remarks?: string;
  is_late: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormAnswer {
  id: string;
  submission_id: string;
  field_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_boolean?: boolean;
  answer_date?: string;
  answer_json?: any;
  created_at: string;
  updated_at: string;
}

export interface FormExemption {
  id: string;
  form_id: string;
  student_id: string;
  reason: string;
  admin_id?: string;
  exempted_at: string;
  expiry_date?: string;
}
