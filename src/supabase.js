import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fkpajoynjurfifbapwbo.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcGFqb3luanVyZmlmYmFwd2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjcyMTksImV4cCI6MjA3OTIwMzIxOX0.FsF-1z-ci9ejzA6wSaOKG1Qy-CGZJtgoHWtGvMemtMo" // Dashboard > Project Settings > API sekmesinde bulabilirsin

export const supabase = createClient(supabaseUrl, supabaseKey ,{
    auth: {
        persistSession: true,   // ✅ olmalı
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});