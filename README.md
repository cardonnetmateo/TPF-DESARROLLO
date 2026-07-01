# TPF - Desarrollo de Software

Aplicación Full Stack desarrollada como Trabajo Práctico Final utilizando **NestJS** para el backend y **Angular** para el frontend.

## Tecnologías utilizadas

### Backend

* NestJS
* TypeScript
* TypeORM
* SQLite
* JWT (JSON Web Token)
* Passport
* bcrypt
* Resend (envío de correos electrónicos)

### Frontend

* Angular
* TypeScript
* HTML
* CSS

---

## Base de datos

El proyecto utiliza **SQLite** como sistema de base de datos y **TypeORM** como ORM para la gestión de entidades, relaciones y consultas, permitiendo interactuar con la base de datos mediante clases y repositorios.

---

## Funcionalidades

* Registro de usuarios.
* Inicio de sesión mediante JWT.
* Encriptación de contraseñas con bcrypt.
* Verificación de correo electrónico mediante Resend.
* Protección de rutas utilizando Guards.
* Autorización basada en roles.
* Gestión de usuarios.
* Comunicación entre frontend y backend mediante API REST.

---

## Estructura del proyecto

```
/
├── back/      # Backend desarrollado con NestJS
└── front/     # Frontend desarrollado con Angular
```

---

## Autenticación

El backend implementa autenticación mediante **JWT (JSON Web Token)**. Tras iniciar sesión, el servidor genera un token que debe enviarse en las solicitudes a los endpoints protegidos para identificar y autorizar al usuario.

---

## Verificación de correo electrónico

Durante el registro se genera un token de verificación y se envía un correo electrónico utilizando **Resend**. Una vez que el usuario accede al enlace recibido, su cuenta queda marcada como verificada y puede acceder a las funcionalidades que requieren autenticación.

---

## Control de acceso por roles

La aplicación implementa autorización basada en roles mediante:

* Decoradores personalizados (`@Roles`).
* `JwtAuthGuard`.
* `RolesGuard`.

Esto permite restringir el acceso a determinados recursos según el rol asignado al usuario.

---

## Autor

**Mateo Cardonnet**

Trabajo Práctico Final – Desarrollo de Software.
