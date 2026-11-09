# Clandestino Studio — first Supabase connection

Project: YOUR_SUPABASE_PROJECT_REF. The published Site remains owner-private.

Direction-only persistence uses studio_operators (server-controlled allowlist), studio_state (versioned workspace snapshot), and studio-private (private image/video bucket). No anonymous grants. All authenticated access is restricted by the Direction allowlist; new Auth users receive no workspace permissions by default. No collaborator/client login is enabled yet.

Create the first Auth user direccion@example.com in the Supabase dashboard with a password chosen by the owner. The project dashboard login and the application's Auth user are different accounts. No user is provisioned from SQL and no password is stored in source.

Initial app setup asks explicitly for an empty workspace or demo examples. Existing browser-session changes are not automatically imported. Saving compares revisions to reject conflicting edits from another window. File upload failures block the data write; private files are downloaded under the authenticated user's RLS policy. Old uploaded files are retained to avoid removing a file still referenced by a prior edit.

Google Calendar remains manual; Supabase connection alone does not enable Google OAuth or synchronization.
