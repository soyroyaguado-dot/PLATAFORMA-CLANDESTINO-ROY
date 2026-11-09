# Trabajar en equipo

1. Cada persona crea una rama desde main: feature/nombre-del-cambio o fix/descripcion.
2. Implementa un cambio acotado, actualiza documentación y ejecuta npm run check y npm run build.
3. Abre un Pull Request: problema, solución, pruebas y capturas cuando cambie la interfaz.
4. Otra persona revisa antes de fusionar. Coordinen cambios que toquen simultáneamente dist/app.js o dist/backend.js.
5. El responsable del despliegue publica después de revisar. Un push a GitHub no modifica la app actual.

Usa un proyecto Supabase de desarrollo para pruebas. No conectes bases de producción ni envíes correos reales en CI. No subas .env, contraseñas, tokens, claves service_role/secret ni exportaciones de clientes o pagos.

Las migraciones nuevas deben mantener RLS y los permisos por marca. Antes de cambiar roles o invitaciones, añade una prueba que cubra denegación de acceso a otra marca.

El propietario agrega colaboradores desde los ajustes de acceso del repositorio. Que un repositorio sea público permite leerlo; escribir requiere permisos de GitHub. También se pueden recibir propuestas mediante forks y Pull Requests.
