🚗 **B&S Autos – Plataforma de Venta y Compra de Automóviles**

B&S Autos es una **Single Page Application (SPA)** moderna y estilizada, desarrollada con **HTML**, **CSS** y **JavaScript**. Pensada como proyecto académico para la materia **Plataforma de Desarrollo** (turma **ACN4AP**), simula el flujo completo de una concesionaria digital en Argentina:

> Registro y autenticación de usuarios, roles diferenciados (admin/user), gestión de usuarios, catálogo interactivo de vehículos y formularios de compra/contacto con validaciones avanzadas y formateo automático de teléfonos por país.

---

🚀 **Funcionalidades principales**  
- **Registro & Login**:  
  - Campos de **usuario**, **email** (+ confirmación) y **contraseña** (+ confirmación).  
  - Botón “Registrarse” deshabilitado hasta que todo coincida y sea válido.  
- **Roles de usuario**:  
  - _Admin_ puede **agregar**, **eliminar** y **cambiar rol** de otros usuarios.  
  - _User_ solo navega el catálogo y compra.  
- **Catálogo de Autos**:  
  - Tarjetas con “card-reveal” para detalles de marca, modelo, año, km y color.  
  - Precios y botón “Comprar”.  
- **Formulario de Compra**:  
  - Validaciones en tiempo real (nombre, edad, dirección).  
  - **intl-tel-input** formatea el teléfono según el país (Argentina, Brasil, EE. UU., etc.) y bloquea letras.  
- **Formulario de Contacto**:  
  - Envío de interés con nombre, teléfono formateado e email.  
- **CTA Bancarios**:  
  - Sección “Tengo interés” y mención de créditos con **BBVA, Santander, Galicia y HSBC**.  
- **Persistencia en _localStorage_**:  
  - Usuarios y sesión guardados para no perder login al recargar.

---

🛠 **Tecnologías utilizadas**  
- **HTML5**, **CSS3**, **JavaScript (Vanilla)**  
- **Materialize CSS** para diseño responsive y componentes (cards, botones, toasts)  
- **intl-tel-input** para formateo/validación de teléfonos internacionales  
- **localStorage** para manejo de usuarios y sesión  
- **Font Awesome** para íconos sociales

---

💡 **Objetivo**  
Cumplir con la consigna de **Plataforma de Desarrollo** aplicando:  
- Arquitectura de SPA sin backend,  
- Separación en componentes (renderizado por hash),  
- Gestión de estado en frontend,  
- Validaciones avanzadas y UX mejorada.

Este proyecto es ideal para entender cómo construir interfaces interactivas puramente en frontend, con buenas prácticas de separación de código y usabilidad.  
