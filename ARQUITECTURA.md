# Arquitectura

Frontend HTML/CSS/JavaScript en dist, sin framework. Supabase JS se empaqueta con esbuild desde src. dist/config.js es generado a partir de variables de entorno.

La cuenta de la plataforma utiliza Supabase Auth. El servidor controla el acceso de Dirección con studio_operators. studio_state guarda una instantánea JSON versionada; los cambios simultáneos incompatibles se rechazan. No usar el filtrado visual como autorización.

Archivos en el bucket privado studio-private. La Edge Function studio-team valida la identidad, la invitación, el estado del colaborador y sus marcas antes de entregar contenido o permitir cambios. La clave de servicio se obtiene únicamente del entorno del servidor.

Al seleccionar marcas en Colaboradores se guarda brandAccess. Los registros anteriores sin este campo derivan su acceso del equipo asignado en Clientes. Al reasignar el equipo de un cliente se sincronizan los accesos explícitos correspondientes.

No dar a colaboradores acceso directo a studio_state. Contiene datos financieros y de otras marcas. No cambiar sus políticas para solucionar problemas del frontend. Desplegar las funciones de servidor y revisar sus controles de acceso.

El alojamiento actual de Sites y el repositorio GitHub no se sincronizan automáticamente. Los cambios deben validarse, revisarse y publicarse por el responsable del despliegue. La visibilidad pública del repositorio no cambia quién puede entrar al panel ni a Supabase.
