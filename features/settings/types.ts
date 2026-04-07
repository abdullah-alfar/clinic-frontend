export interface TenantSettings {
  // General
  clinic_name: string;
  subdomain: string;
  timezone: string;
  language: string;

  // Theme
  theme: 'light' | 'dark' | 'system';
  primary_color: string;
  secondary_color: string;

  // Notifications
  email_enabled: boolean;
  whatsapp_enabled: boolean;

  // AI
  ai_enabled: boolean;
  ai_provider: 'none' | 'openai' | 'gemini' | 'log';
  ai_api_key_is_set: boolean;

  // WhatsApp integration
  whatsapp_provider: 'twilio' | 'meta' | 'log';
  whatsapp_webhook_secret_is_set: boolean;

  // Email integration
  email_provider: 'smtp' | 'resend' | 'sendgrid' | 'log';
  email_from: string;
}

export interface UpdateSettingsRequest {
  // General
  clinic_name: string;
  subdomain: string;
  timezone: string;
  language: string;

  // Theme
  theme: string;
  primary_color: string;
  secondary_color: string;

  // Notifications
  email_enabled: boolean;
  whatsapp_enabled: boolean;

  // AI
  ai_enabled: boolean;
  ai_provider: string;
  ai_api_key?: string;

  // WhatsApp integration
  whatsapp_provider: string;
  whatsapp_webhook_secret?: string;

  // Email integration
  email_provider: string;
  email_from: string;
}

export interface TestAIResponse {
  response: string;
  provider: string;
}
