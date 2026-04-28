function videoPlay(id) {
    const secretUrl = `https://patziultrasecretomasquelanasa.com/${id}`;
    console.log(`Video Reproduciendose desde ${secretUrl}`);
}

function videoPause(id) {
    const secretUrl = `https://patziultrasecretomasquelanasa.com/${id}`;
    console.log(`Video Pausado: ${secretUrl}`);
}

/**
 * Base class to handle common properties like name with validation.
 */
class BaseContent {
    #name;

    constructor({ name }) {
        this.name = name; // Uses setter for validation
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        if (typeof newName !== "string" || newName.trim().length < 3) {
            console.warn(`El nombre "${newName}" no es válido. Debe tener al menos 3 caracteres.`);
            return;
        }
        this.#name = newName.trim();
    }
}

export class PlatziClass extends BaseContent {
    #videoID;

    constructor({ name, videoID }) {
        super({ name });
        this.#videoID = videoID;
    }

    get videoID() {
        return this.#videoID;
    }

    set videoID(newID) {
        this.#videoID = newID;
    }

    play() {
        videoPlay(this.#videoID);
    }

    pause() {
        videoPause(this.#videoID);
    }
}

class Lesson extends PlatziClass {
    #durationInMinutes;

    constructor({ name, videoID, durationInMinutes }) {
        super({ name, videoID });
        this.#durationInMinutes = durationInMinutes;
    }

    get durationInMinutes() {
        return this.#durationInMinutes;
    }

    set durationInMinutes(newDuration) {
        if (newDuration > 0) {
            this.#durationInMinutes = newDuration;
        } else {
            console.warn("La duración debe ser mayor a 0");
        }
    }
}

class Course extends BaseContent {
    #classes;
    #isFree;
    #lang;

    constructor({ name, classes = [], isFree = false, lang = "spanish" }) {
        super({ name });
        this.#classes = [];
        this.#isFree = isFree;
        this.#lang = lang;
        classes.forEach(c => this.addLesson(c));
    }

    get classes() {
        return [...this.#classes];
    }

    get isFree() {
        return this.#isFree;
    }

    get lang() {
        return this.#lang;
    }

    addLesson(lesson) {
        if (lesson instanceof Lesson) {
            this.#classes.push(lesson);
        } else {
            console.warn(`Solo puedes agregar instancias de Lesson a "${this.name}"`);
        }
    }
}

class LearningPath extends BaseContent {
    #courses;

    constructor({ name, courses = [] }) {
        super({ name });
        this.#courses = [];
        courses.forEach(c => this.addCourse(c));
    }

    get courses() {
        return [...this.#courses];
    }

    addCourse(course) {
        if (course instanceof Course) {
            this.#courses.push(course);
        } else {
            console.warn(`Solo puedes agregar instancias de Course a "${this.name}"`);
        }
    }
}

class Student extends BaseContent {
    #age;
    #email;
    #city;
    #learningPaths;
    #coursesApproved;
    #coursesInProgress;

    constructor({
        name,
        age,
        email,
        city,
        learningPaths = []
    }) {
        super({ name });
        this.#age = age;
        this.#email = email;
        this.#city = city;
        this.#coursesApproved = [];
        this.#coursesInProgress = [];
        this.#learningPaths = [];

        learningPaths.forEach(lp => this.addLearningPath(lp));
    }

    // Getters
    get age() { return this.#age; }
    get email() { return this.#email; }
    get city() { return this.#city; }
    get learningPaths() { return [...this.#learningPaths]; }
    get coursesApproved() { return [...this.#coursesApproved]; }
    get coursesInProgress() { return [...this.#coursesInProgress]; }

    // Setters
    set age(newAge) { this.#age = newAge; }
    set email(newEmail) { this.#email = newEmail; }
    set city(newCity) { this.#city = newCity; }

    inscribirCurso(course) {
        if (!(course instanceof Course)) {
            console.warn("Debe ser un Course válido");
            return;
        }

        const pertenece = this.#learningPaths.some(lp =>
            lp.courses.includes(course)
        );

        if (!pertenece) {
            console.warn(`El curso "${course.name}" no pertenece a ningún LearningPath de ${this.name}`);
            return;
        }

        if (!this.#coursesInProgress.includes(course)) {
            this.#coursesInProgress.push(course);
            console.log(`${this.name} se ha inscrito en el curso: ${course.name}`);
        }
    }

    aprobarCurso(course) {
        if (!this.#coursesInProgress.includes(course)) {
            console.warn("No puedes aprobar un curso que no estás cursando");
            return;
        }

        this.#coursesApproved.push(course);
        this.#coursesInProgress = this.#coursesInProgress.filter(c => c !== course);
        console.log(`¡Felicidades ${this.name}! Has aprobado el curso: ${course.name}`);
    }

    addLearningPath(lp) {
        if (lp instanceof LearningPath) {
            this.#learningPaths.push(lp);
        } else {
            console.warn("No es un LearningPath válido");
        }
    }
}

class FreeStudent extends Student {
    constructor(props) {
        super(props);
    }

    inscribirCurso(course) {
        if (course.isFree) {
            super.inscribirCurso(course);
        } else {
            console.warn(`Lo sentimos, ${this.name}, solo puedes inscribirte en cursos gratuitos.`);
        }
    }
}

class BasicStudent extends Student {
    constructor(props) {
        super(props);
    }

    inscribirCurso(course) {
        if (course.lang !== "english") {
            super.inscribirCurso(course);
        } else {
            console.warn(`Lo sentimos, ${this.name}, tu suscripción Basic no incluye cursos en inglés.`);
        }
    }
}

class ExpertStudent extends Student {
    constructor(props) {
        super(props);
    }

    inscribirCurso(course) {
        super.inscribirCurso(course);
    }
}

// Pruebas
const l1 = new Lesson({ name: "Intro OOP", videoID: "oop-101", durationInMinutes: 30 });
const l2 = new Lesson({ name: "Encapsulamiento", videoID: "enc-202", durationInMinutes: 40 });

const cursoPOO = new Course({
    name: "POO en Java",
    classes: [l1, l2],
    lang: "spanish"
});

const cursoIngles = new Course({
    name: "English for IT",
    classes: [],
    lang: "english"
});

const javaPath = new LearningPath({
    name: "Programación en Java",
    courses: [cursoPOO, cursoIngles]
});

const luisa = new FreeStudent({
    name: "Luisa",
    age: 25,
    city: "Madrid",
    email: "luisa@email.com",
    learningPaths: [javaPath]
});

const pedro = new BasicStudent({
    name: "Pedro",
    age: 30,
    city: "Bogotá",
    email: "pedro@email.com",
    learningPaths: [javaPath]
});

const ana = new ExpertStudent({
    name: "Ana",
    age: 28,
    city: "CDMX",
    email: "ana@email.com",
    learningPaths: [javaPath]
});

console.log("--- Registro de Luisa (Free) ---");
luisa.inscribirCurso(cursoPOO); // Fallará porque no es gratuito

console.log("\n--- Registro de Pedro (Basic) ---");
pedro.inscribirCurso(cursoPOO); // Éxito (español)
pedro.inscribirCurso(cursoIngles); // Fallará (inglés)

console.log("\n--- Registro de Ana (Expert) ---");
ana.inscribirCurso(cursoPOO); // Éxito
ana.inscribirCurso(cursoIngles); // Éxito
