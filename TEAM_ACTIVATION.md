# Team activation checklist for Clandestino

The module is deployed with studio_team_settings.enabled=false. No invitation has been sent. The Site is still owner-private. Do not enable invitations before the prerequisites below are complete.

1. Configure a transactional SMTP provider in Supabase > Authentication > Email > SMTP. The default Supabase mailer only delivers to authorized project-team addresses. Enter credentials in Supabase, never in the chat or source code.
2. Set the Auth Site URL to https://YOUR_APP.example.com/ and allow the exact activation redirect https://YOUR_APP.example.com/?activation=1. Keep email confirmation enabled. Confirm an invite can finish on another browser without the owner's ChatGPT session.
3. Obtain the owner's explicit decision on external access. The current Site access policy only admits the owner. A public login screen is one option; application data still requires Supabase authentication and server authorization. Alternatively, move the frontend to the owner's external hosting. Do not silently change the Site audience.
4. After configuration and authorized end-to-end testing, enable the server-controlled flag via the Supabase administrator connection. Retain failure reporting; provider acceptance is not proof of inbox delivery.

Direction chooses brandAccess in Colaboradores. CRM team reassignment adds/removes corresponding collaborators' permissions. Legacy records without brandAccess derive it from their CRM team assignments. Suspended/deleted collaborators are rejected on every server request.

The studio-team Edge Function verifies each JWT with Supabase getUser. It returns a filtered content projection; it never exposes the full studio_state row, other clients' records, financial ledgers, client contact details, or client-review email. Member writes can change validated content for assigned brands only, with revision checks. Workflow advancement is limited to the user's production role. Direct table and Storage grants remain Direction-only.

The function uses the built-in service key solely in the server environment. The gateway verify_jwt flag is false because the function validates JWTs itself; this supports current asymmetric JWTs and unauthenticated OPTIONS preflight. Missing/invalid authentication returns 401.

Member-account finance summaries and arbitrary extra dashboard permissions are not enabled by this module. Their UI remains limited to Contenido and a basic Mi cuenta profile until separate scoped implementations are added.
