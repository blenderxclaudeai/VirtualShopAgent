// extension/config.js

export const SUPABASE_URL = "https://yidfawmlhjltclnzfyuz.supabase.co";
export const SUPABASE_FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;
export const SUPABASE_REST_BASE = `${SUPABASE_URL}/rest/v1`;
export const SUPABASE_STORAGE_BASE = `${SUPABASE_URL}/storage/v1`;
export const SUPABASE_AUTH_BASE = `${SUPABASE_URL}/auth/v1`;

// Public anon key (OK to embed for MVP; later you can move to pairing/login)
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZGZhd21saGpsdGNsbnpmeXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjgxMjYsImV4cCI6MjA4NzgwNDEyNn0.YzcuMk2uDqtxI_rSb3CjPfKJ8AtD9krlIIKW0N7Pus0";

export const TRYON_FUNCTION = "tryon-request";
