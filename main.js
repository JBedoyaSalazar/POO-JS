/**
 * VIDEO UTILITIES
 * Encapsulating external video logic.
 */
class VideoService {
    static #BASE_URL = "https://patziultrasecretomasquelanasa.com/";

    static play(videoID) {
        console.log(`[VideoService] Reproduciendo: ${this.#BASE_URL}${videoID}`);
    }

    static pause(videoID) {
        console.log(`[VideoService] Pausado: ${this.#BASE_URL}${videoID}`);
    }
}

/**
 * BASE CLASS: BaseContent
 * Implements Abstraction and Encapsulation for any content with a name.
 */
class BaseContent {
    #name;

    constructor({ name }) {
        this.name = name; // Uses setter
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        if (!this.#isValidName(newName)) {
            console.warn(`Nombre no válido: "${newName}". Debe ser un string de al menos 3 caracteres.`);
            return;
        }
        this.#name = newName.trim();
    }

    #isValidName(name) {
        return typeof name === "string" && name.trim().length >= 3;
    }
}

/**
 * MEDIA CLASS: PlatziClass
 * Inherits from BaseContent. Handles video logic via delegation to VideoService.
 */
class PlatziClass extends BaseContent {
    #videoID;

    constructor({ name, videoID }) {
        super({ name });
        this.#videoID = videoID;
    }

    get videoID() { return this.#videoID; }

    play() {
        VideoService.play(this.#videoID);
    }

    pause() {
        VideoService.pause(this.#videoID);
    }
}

/**
 * DOMAIN CLASS: Lesson
 * Specialized MediaContent with duration.
 */
class Lesson extends PlatziClass {
    #durationInMinutes;

    constructor({ name, videoID, durationInMinutes }) {
        super({ name, videoID });
        this.durationInMinutes = durationInMinutes;
    }

    get durationInMinutes() { return this.#durationInMinutes; }

    set durationInMinutes(newDuration) {
        if (newDuration > 0) {
            this.#durationInMinutes = newDuration;
        } else {
            console.warn("La duración debe ser un número positivo.");
        }
    }
}

/**
 * DOMAIN CLASS: Course
 * Collection of lessons. Implements encapsulation for the lesson list.
 */
class Course extends BaseContent {
    #lessons = [];
    #isFree;
    #language;

    constructor({ name, lessons = [], isFree = false, language = "spanish" }) {
        super({ name });
        this.#isFree = isFree;
        this.#language = language;
        lessons.forEach(lesson => this.addLesson(lesson));
    }

    get lessons() { return [...this.#lessons]; }
    get isFree() { return this.#isFree; }
    get language() { return this.#language; }

    addLesson(lesson) {
        if (lesson instanceof Lesson) {
            this.#lessons.push(lesson);
        } else {
            console.warn(`Objeto inválido: Solo se pueden agregar instancias de Lesson a "${this.name}".`);
        }
    }
}

/**
 * DOMAIN CLASS: LearningPath
 * Grouping of courses.
 */
class LearningPath extends BaseContent {
    #courses = [];

    constructor({ name, courses = [] }) {
        super({ name });
        courses.forEach(course => this.addCourse(course));
    }

    get courses() { return [...this.#courses]; }

    addCourse(course) {
        if (course instanceof Course) {
            this.#courses.push(course);
        } else {
            console.warn(`Objeto inválido: Solo se pueden agregar instancias de Course a "${this.name}".`);
        }
    }
}

/**
 * BASE CLASS: Student
 * Core student logic. Implements Polymorphism through subclasses.
 */
class Student extends BaseContent {
    #age;
    #email;
    #city;
    #learningPaths = [];
    #approvedCourses = [];
    #inProgressCourses = [];

    constructor({ name, age, email, city, learningPaths = [] }) {
        super({ name });
        this.#age = age;
        this.#email = email;
        this.#city = city;
        learningPaths.forEach(lp => this.addLearningPath(lp));
    }

    // Getters
    get age() { return this.#age; }
    get email() { return this.#email; }
    get city() { return this.#city; }
    get learningPaths() { return [...this.#learningPaths]; }
    get approvedCourses() { return [...this.#approvedCourses]; }
    get inProgressCourses() { return [...this.#inProgressCourses]; }

    // Logic Methods
    inscribirCurso(course) {
        if (!this.#canEnroll(course)) return;

        if (!this.#inProgressCourses.includes(course)) {
            this.#inProgressCourses.push(course);
            console.log(`[Registro] ${this.name} se ha inscrito exitosamente en: ${course.name}`);
        }
    }

    #canEnroll(course) {
        if (!(course instanceof Course)) {
            console.warn("Error: Debe ser un curso válido.");
            return false;
        }

        const isIncludedInPaths = this.#learningPaths.some(lp => lp.courses.includes(course));
        if (!isIncludedInPaths) {
            console.warn(`Error: El curso "${course.name}" no pertenece a tus Rutas de Aprendizaje.`);
            return false;
        }

        return true;
    }

    aprobarCurso(course) {
        const courseIndex = this.#inProgressCourses.indexOf(course);
        if (courseIndex === -1) {
            console.warn(`Error: No puedes aprobar "${course.name}" porque no lo estás cursando.`);
            return;
        }

        this.#inProgressCourses.splice(courseIndex, 1);
        this.#approvedCourses.push(course);
        console.log(`[Logro] ¡Felicidades ${this.name}! Has completado el curso: ${course.name}`);
    }

    addLearningPath(lp) {
        if (lp instanceof LearningPath) {
            this.#learningPaths.push(lp);
        } else {
            console.warn("Error: Solo puedes agregar Rutas de Aprendizaje válidas.");
        }
    }

    publicarComentario(content) {
        const comment = new Comment({
            content,
            authorName: this.name,
            authorRole: this.constructor.name // Polymorphism: dynamic role based on class
        });
        comment.publish();
    }
}

/**
 * SUBCLASS: FreeStudent
 * Restricted access to paid content.
 */
class FreeStudent extends Student {
    inscribirCurso(course) {
        if (course.isFree) {
            super.inscribirCurso(course);
        } else {
            console.warn(`[Restricción] ${this.name}, tu suscripción Free solo permite cursos gratuitos.`);
        }
    }
}

/**
 * SUBCLASS: BasicStudent
 * Restricted access to English content.
 */
class BasicStudent extends Student {
    inscribirCurso(course) {
        if (course.language !== "english") {
            super.inscribirCurso(course);
        } else {
            console.warn(`[Restricción] ${this.name}, la suscripción Basic no incluye cursos en inglés.`);
        }
    }
}

/**
 * SUBCLASS: ExpertStudent
 * Full access.
 */
class ExpertStudent extends Student {
    inscribirCurso(course) {
        super.inscribirCurso(course);
    }
}

/**
 * SUBCLASS: TeacherStudent
 * Special role for platform instructors.
 */
class TeacherStudent extends Student {
    constructor(props) {
        super(props);
    }

    inscribirCurso(course) {
        // Teachers might have access even if not in their LearningPath for auditing
        super.inscribirCurso(course);
    }

    eliminarComentario(comment) {
        console.log(`[Moderación] El profesor ${this.name} ha eliminado un comentario.`);
    }
}

/**
 * AUXILIARY CLASS: Comment
 * Demonstrates interaction between objects.
 */
class Comment {
    #content;
    #authorName;
    #authorRole;

    constructor({ content, authorName, authorRole }) {
        this.#content = content;
        this.#authorName = authorName;
        this.#authorRole = authorRole;
    }

    publish() {
        console.log(`[Comentario] ${this.#authorName} (${this.#authorRole}): ${this.#content}`);
    }
}

// --- INITIALIZATION AND TESTING ---

// 1. Define Lessons
const introOOP = new Lesson({ name: "Introducción a POO", videoID: "vid-001", durationInMinutes: 15 });
const encapsulation = new Lesson({ name: "Encapsulamiento profundo", videoID: "vid-002", durationInMinutes: 25 });

// 2. Define Courses
const courseJS = new Course({
    name: "JavaScript Profesional",
    lessons: [introOOP, encapsulation],
    isFree: false,
    language: "spanish"
});

const courseEnglish = new Course({
    name: "Advanced English for Devs",
    lessons: [],
    isFree: false,
    language: "english"
});

const courseGit = new Course({
    name: "Git y GitHub Gratuito",
    lessons: [],
    isFree: true,
    language: "spanish"
});

// 3. Define Learning Paths
const webDevelopment = new LearningPath({
    name: "Escuela de Desarrollo Web",
    courses: [courseJS, courseEnglish, courseGit]
});

// 4. Create Students (Polymorphism)
const userFree = new FreeStudent({
    name: "Carlos",
    age: 20,
    city: "Lima",
    email: "carlos@mail.com",
    learningPaths: [webDevelopment]
});

const userBasic = new BasicStudent({
    name: "Beatriz",
    age: 24,
    city: "Santiago",
    email: "beatriz@mail.com",
    learningPaths: [webDevelopment]
});

const userExpert = new ExpertStudent({
    name: "Esteban",
    age: 30,
    city: "Medellín",
    email: "esteban@mail.com",
    learningPaths: [webDevelopment]
});

const proTeacher = new TeacherStudent({
    name: "Freddy Vega",
    age: 35,
    city: "Bogotá",
    email: "freddy@platzi.com",
    learningPaths: [webDevelopment]
});

// 5. Execution Logic
console.log("=== PRUEBAS DE ENCAPSULACIÓN Y POLIMORFISMO ===");

console.log("\n--- Carlos (Free Student) ---");
userFree.inscribirCurso(courseGit); // Éxito
userFree.inscribirCurso(courseJS);  // Fallo (No es gratis)

console.log("\n--- Beatriz (Basic Student) ---");
userBasic.inscribirCurso(courseJS);      // Éxito
userBasic.inscribirCurso(courseEnglish); // Fallo (Es en inglés)

console.log("\n--- Esteban (Expert Student) ---");
userExpert.inscribirCurso(courseEnglish); // Éxito

console.log("\n--- Interacción Social ---");
userExpert.publicarComentario("¡Excelente clase de encapsulamiento!");
proTeacher.publicarComentario("¡Gracias Esteban! Sigue así.");
proTeacher.eliminarComentario();

console.log("\n--- Video Playback ---");
encapsulation.play();
encapsulation.pause();
