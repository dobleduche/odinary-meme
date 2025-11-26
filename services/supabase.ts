import { createClient } from '@supabase/supabase-js';

// These variables are expected to be set in your deployment environment.
// For local development, you might use a .env file, but ensure it's not checked into git.
// IMPORTANT: Use the ANONYMOUS KEY, not the service role key, for client-side code.
const supabaseUrl = 'https://hpmyensqgkwyjtrzklym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbXllbnNxZ2t3eWp0cnprbHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDczNTMsImV4cCI6MjA3MTY4MzM1M30.3k63BqSwu5KdmD6GhROFFcS4QrW98IE6GL3brIw7z-o';

if (!supabaseUrl || !supabaseAnonKey) {
  // A friendly error for the developer if keys are missing.
  // This will be visible in the browser console.
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;padding:1rem;background:red;color:white;font-family:sans-serif;z-index:1000;text-align:center;';
  errorDiv.textContent = 'Configuration Error: Supabase URL and Anon Key are not set. Please check your environment variables.';
  document.body.prepend(errorDiv);
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);