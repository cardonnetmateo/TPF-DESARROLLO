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

El backend utiliza JWT para autenticar usuarios.

Al iniciar sesión se genera un token que debe enviarse en cada petición protegida mediante el encabezado:

```
Authorization: Bearer <token>
```

---

## Verificación de Email

Al registrarse un usuario se envía un correo electrónico mediante Resend con un enlace de verificación.

Hasta que el correo no sea verificado, el usuario no puede acceder a las funcionalidades protegidas.

---

## Roles

La aplicación implementa autorización mediante roles utilizando:

* Decoradores personalizados (`@Roles`)
* `JwtAuthGuard`
* `RolesGuard`

Esto permite restringir el acceso a determinados endpoints según el rol del usuario.

---

## Autores

Trabajo desarrollado por:

* Mateo Cardonnet

Como Trabajo Práctico Final para la materia Desarrollo de Software.
