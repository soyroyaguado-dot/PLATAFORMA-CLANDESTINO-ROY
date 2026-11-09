# Clandestino Studio — Panel de control

Plataforma web de operación de un estudio creativo: CRM, igualas, proyectos, colaboradores, nómina, contenido mensual y finanzas.

Este proyecto contiene el código y la documentación para colaborar en el desarrollo. No incluye los registros guardados en Supabase.

## Empezar en desarrollo

Requisitos: Node.js 22 o posterior y npm. Crea un proyecto Supabase de desarrollo independiente de producción.

```bash
npm ci
cp .env.example .env
```

Completa .env con la URL y la clave publicable del proyecto de desarrollo, y la dirección del frontend. La clave publicable se usa en el navegador. Nunca uses service_role ni una clave secreta en el frontend.

```bash
npm run build
npm run check
npm run dev
```

Abre http://127.0.0.1:4173/. El servidor local sirve únicamente dist. La configuración y el paquete de Supabase se generan con npm run build; no se incluyen valores de producción en el repositorio.

## Configurar Supabase

1. Revisa los archivos SQL de database y aplícalos en tu proyecto de desarrollo en su orden lógico: studio_direction_persistence.sql y después studio_team_invites.sql. Sustituye direccion@example.com por el correo administrador que controles.
2. Crea el primer usuario en Supabase Authentication con ese correo y tu propia contraseña.
3. Despliega supabase/functions/studio-team con sus dos archivos. Configura STUDIO_APP_ORIGIN con el origen exacto del frontend. La función usa las variables de servidor proporcionadas por Supabase; no copies la clave de servicio al código.
4. Revisa database/TEAM_ACTIVATION.md antes de habilitar invitaciones. La configuración debe completarse y probarse antes de marcar el envío como activo.

No ejecutes scripts de prueba ni importes fixtures sobre una base de producción. El sitio actual sigue teniendo su propio control de acceso y proceso de publicación.

## Documentación

- docs/ESTADO.md: funciones actuales, pendientes y límites de verificación.
- docs/ARQUITECTURA.md: estructura y reglas de acceso.
- CONTRIBUTING.md: ramas, revisiones y trabajo en paralelo.
- database/TEAM_ACTIVATION.md: activación por correo y acceso externo.

## Estructura

- dist/: interfaz y recursos visuales.
- src/: entrada del cliente Supabase.
- supabase/functions/: servicio de invitaciones y permisos por marca.
- database/: estructura inicial y documentación de configuración.
- tests/: pruebas de colaboradores y aislamiento por marcas.
- scripts/: construcción y servidor local.

GitHub guarda y permite revisar el código. Supabase guarda los datos. Publicar este repositorio no publica automáticamente la aplicación ni los datos de sus usuarios.
