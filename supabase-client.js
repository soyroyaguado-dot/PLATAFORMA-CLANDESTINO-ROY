import { createClient } from '@supabase/supabase-js';
window.studioActivationRequested=new URLSearchParams(location.search).get('activation')==='1'||/type=(invite|recovery)/.test(location.hash);
window.studioBackend=createClient(window.studioConfig.supabaseUrl,window.studioConfig.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
