export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'longtext' 
  | 'number' 
  | 'dropdown' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'time'
  | 'file' 
  | 'heading' 
  | 'paragraph' 
  | 'divider' 
  | 'section' 
  | 'step'
  | 'company'
  | 'website'
  | 'address'
  | 'country'
  | 'multiselect'
  | 'button';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FormFieldOption[];
  width?: 'full' | 'half' | 'third';
  defaultValue?: string;
}

export type FormStatus = 'Published' | 'Draft' | 'Paused' | 'Archived';

export interface Form {
  id: string;
  name: string;
  status: FormStatus;
  lastUpdated: string;
  views: number;
  starts: number;
  submissions: number;
  tags: string[];
  department: string;
  owner: string;
  starred: boolean;
  description?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
  title: string;
  intro: string;
  usageCount: number;
  tags: string[];
  complexity: 'Simple' | 'Medium' | 'Advanced';
  thumbnailColor: string;
  state?: 'Published' | 'Draft' | 'Unpublished' | 'Archived';
  owner?: string;
  department?: string;
  lastUpdated?: string;
}

export type SubmissionStatus = 'Completed' | 'Duplicate Flagged' | 'Processing Failed';

export interface Submission {
  id: string;
  formId: string;
  formName: string;
  submittedAt: string;
  status: SubmissionStatus;
  respondent: string;
  email: string;
  responsePreview: string;
  createdOutcome: string;
  duplicateFlag: boolean;
  answers?: Record<string, any>;
  metadata?: Record<string, string>;
}

export interface LogicRule {
  id: string;
  target: string;
  trigger: string;
  condition: 'is' | 'is_not' | 'contains' | 'filled' | 'empty';
  comparison: string;
  action: 'Show field' | 'Hide field' | 'Require field' | 'Skip to section';
  active: boolean;
}

export interface FormStyles {
  primaryColor: string;
  radius: string;
  theme: string;
  fontFamily: string;
  pageBg: string;
  formBg: string;
  inputBg: string;
  buttonStyle: 'Solid' | 'Outline' | 'Soft';
  fieldSpacing: 'Compact' | 'Comfortable' | 'Spacious';
  formPadding: 'Compact' | 'Comfortable' | 'Spacious';
  formWidth: 'Small' | 'Medium' | 'Large' | 'Full';
  cardStyle: boolean;
  containerShadow: 'None' | 'Small' | 'Medium' | 'Large';
  successAlignment: 'Left' | 'Center';
  successShowIcon: boolean;
}

export interface FieldMapping {
  object: string;
  field: string;
  action: string;
}

export interface SubmitConfig {
  successMode: 'message' | 'redirect' | 'message_cta' | 'message_redirect';
  successTitle: string;
  successBody: string;
  successCtaLabel: string;
  successCtaUrl: string;
  redirectUrl: string;
  redirectDelay: string;
  primaryOutcome: string;
  linkedOutcomes: string[];
  duplicateStrategy: 'always_new' | 'new_flag' | 'link_existing' | 'admin_rule';
  owner: string;
  team: string;
  tags: string[];
  fieldMappings: Record<string, FieldMapping>;
}

export interface AppliedFilters {
  status: string | null;
  owner: string | null;
  department: string | null;
  tag: string | null;
  dateRange: 'all' | 'week' | 'month';
}
