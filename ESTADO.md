# Estado de la plataforma

Código exportado del panel de Clandestino Studio, versión de origen `54eb018c863278829d1edb1cf8c1a5331014b383`.

- Dirección: login por correo y contraseña, datos en Supabase, guardado con revisión para evitar sobrescrituras, archivos privados.
- Módulos: clientes, igualas, proyectos, colaboradores, contenido, gastos, flujo, finanzas y calendario.
- Colaboradores: edición, cambio de puesto, baja reversible, selección de marcas y pantalla de invitación.
- Invitaciones: código y función de servidor preparados; envío deshabilitado. Faltan SMTP, URL de activación y decisión sobre acceso externo al frontend. No se ha comprobado entrega de correo ni activación completa con un colaborador real.
- Acceso del colaborador: proyección filtrada por marca y servidor con comprobaciones de acceso. La interfaz incluye Contenido y un perfil básico de Mi cuenta. Otras pestañas y el resumen financiero individual no están habilitados para colaboradores.
- Google Calendar: apertura manual de un borrador. No hay sincronización automática.
- Revisión de clientes: demostración, todavía sin portal externo autenticado.

El repositorio no contiene una exportación de la base de datos, registros de clientes, pagos reales, contraseñas, claves privadas ni historial Git del repositorio interno. Las pruebas usan datos de ejemplo anonimizados. No importar automáticamente estas pruebas a producción.
