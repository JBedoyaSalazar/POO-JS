# Curso de Programación Orientada a Objetos en JavaScript (POO JS)

Este proyecto es una práctica basada en el curso de **Programación Orientada a Objetos (POO) en JavaScript** de Platzi. El objetivo principal es simular la lógica de negocio de una plataforma de educación en línea (similar a Platzi), aplicando los cuatro pilares fundamentales de la POO.

## 🚀 Conceptos Aplicados

El código fuente (principalmente en `main.js`) ejemplifica los siguientes conceptos:

1. **Abstracción y Clases**: 
   - Creación de moldes (clases) para `Student`, `Course`, `LearningPath`, `Lesson`, y `Comment`.
   - Uso de clases base (`BaseContent`) para agrupar lógica común.

2. **Encapsulamiento**:
   - Uso de propiedades privadas con la sintaxis de campos privados de JS (`#`).
   - Implementación de métodos accesores (`getters` y `setters`) para controlar y validar la manipulación y lectura de los datos (ej. validar el nombre o que la duración de una clase sea válida).

3. **Herencia**:
   - Uso de la palabra reservada `extends` y `super()`.
   - Clases como `PlatziClass` y `Lesson` heredan de `BaseContent`.
   - Creación de distintos roles de usuario (`FreeStudent`, `BasicStudent`, `ExpertStudent`, `TeacherStudent`) que heredan de la clase base `Student`.

4. **Polimorfismo**:
   - Sobrescritura de métodos según el tipo de estudiante. Por ejemplo, el método `inscribirCurso(course)` tiene validaciones diferentes dependiendo de si el estudiante es `Free` (solo cursos gratis), `Basic` (sin inglés) o `Expert` (acceso total).

5. **Delegación e Interacción entre Objetos**:
   - Clases de utilidad como `VideoService` para emular un comportamiento externo.
   - Creación de instancias dentro de métodos (ej. instanciación de `Comment` al momento de que un alumno publica un comentario).

## 📁 Estructura del Proyecto

- `index.html`: Punto de entrada básico para la ejecución en el navegador. Incluye una interfaz minimalista.
- `main.js`: Contiene toda la lógica de dominio (Clases, instancias y pruebas de ejecución por consola).
- `module.mjs`: Archivo de práctica para explorar la importación/exportación de módulos nativos de ECMAScript.
- `package.json`: Archivo de configuración básica de Node.

## 🛠️ Cómo Ejecutar el Proyecto

Puedes probar este proyecto de dos maneras distintas:

### 1. Desde el Navegador
1. Abre el archivo `index.html` en tu navegador de preferencia.
2. Abre la **Consola para Desarrolladores** (`F12` o `Ctrl+Shift+I` / `Cmd+Option+I`).
3. Podrás observar los logs que demuestran la creación de estudiantes, inscripciones exitosas o fallidas (debido al polimorfismo) y reproducción de video.

### 2. Desde la Terminal (Node.js)
Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu equipo.
1. Abre la terminal en el directorio del proyecto.
2. Ejecuta el archivo principal usando:
   ```bash
   node main.js
   ```
3. Verás la salida de los flujos de inscripción, comentarios y reproducción directamente en tu consola.

## 📝 Notas
- El código se ha escrito utilizando sintaxis moderna de ECMAScript (ES6+), por lo que si se corre en entornos muy antiguos, podría no soportar los campos privados (`#`).
- Se ignoraron carpetas de entorno de desarrollo (como `node_modules`) mediante un archivo estándar de `.gitignore`.
