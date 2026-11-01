import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dnrvbprefpqyugclcvuj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucnZicHJlZnBxeXVnY2xjdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDY2ODYsImV4cCI6MjEwOTEyMjY4Nn0.TDDq3RKt0yFmygFfqJ6TgRSLpA03l1uH7EvTS_xnc6k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
