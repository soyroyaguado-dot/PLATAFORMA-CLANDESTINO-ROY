import {existsSync,writeFileSync} from 'node:fs';
import {build} from 'esbuild';
if(existsSync('.env'))process.loadEnvFile('.env');
const supabaseUrl=process.env.SUPABASE_URL,publishableKey=process.env.SUPABASE_PUBLISHABLE_KEY,appOrigin=process.env.APP_ORIGIN;
if(!supabaseUrl||!publishableKey||!appOrigin)throw Error('Completa SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY y APP_ORIGIN en .env');
if(new URL(supabaseUrl).protocol!=='https:')throw Error('SUPABASE_URL requiere HTTPS');
writeFileSync('dist/config.js','window.studioConfig='+JSON.stringify({supabaseUrl,publishableKey,appOrigin})+';\n');
await build({entryPoints:['src/supabase-client.js'],bundle:true,minify:true,format:'iife',outfile:'dist/supabase-client.js'});
