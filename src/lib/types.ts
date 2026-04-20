export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'signature' | 'page-break';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface LogicRule {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface FormPage {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  helpText?: string;
  validation?: ValidationRules;
  points?: number; // Scoring for quizzes
  correctOption?: string; // Correct answer for quizzes
  logic?: LogicRule[]; // For conditional visibility
}

export type FormTheme = 'technical' | 'minimalist' | 'corporate' | 'playful' | 'mimo' | 'duo' | 'glass' | 'clay' | 'lumina' | 'custom';

export interface CustomThemeConfig {
  primary: string;   // Accent color
  background: string; // Main background
  card: string;       // Form wrapper background
  text: string;       // Primary text
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
  pages: FormPage[];
  theme: FormTheme;
  customTheme?: CustomThemeConfig;
  accentColor?: string;
  submitButtonText?: string;
}
