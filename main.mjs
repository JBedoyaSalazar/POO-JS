function videoPlay(id){
    const secretUrl = `https://patziultrasecretomasquelanasa.com/${id}`
    console.log(`Video Reproduciendose desde ${secretUrl}`);
}

function videoPause(id){
    const secretUrl = `https://patziultrasecretomasquelanasa.com/${id}`
    console.log(`Video Pausado: ${secretUrl}`);
}

export class PlatziClass{
    constructor({
        name,
        videoID
    }){
        this.name = name;
        this.videoID = videoID;
    }

    play(){
        videoPlay(this.videoID);
    }

    pause(){
        videoPause(this.videoID);
    }
}

class Lesson {
    constructor({ name, durationInMinutes }) {
        this.name = name;
        this.durationInMinutes = durationInMinutes;
    }
}

class Course {
    constructor({ name, classes = [] }) {
        this._name= name;
        this.classes = classes.filter(c => c instanceof Lesson);
    }

    addLesson(lesson) {
        if (lesson instanceof Lesson) {
            this.classes.push(lesson);
        } else {
            console.warn("Solo puedes agregar instancias de Lesson");
        }
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        if (newName.length < 5) {
            console.warn("El nombre debe tener al menos 5 caracteres");
            return;
        }
        if (newName.length > 50) {
            console.warn("El nombre debe tener menos de 50 caracteres");
            return;
        }

        if (newName.trim() === "") {
            console.warn("El nombre no puede estar vacío");
            return;
        }

        this._name = newName
    }
}

class LearningPath {
    constructor({ name, courses = [] }) {
        this.name = name;
        this.courses = courses.filter(c => c instanceof Course);
    }

    addCourse(course) {
        if (course instanceof Course) {
            this.courses.push(course);
        } else {
            console.warn("Solo puedes agregar instancias de Course");
        }
    }
}

class Student {
    constructor({
        name,
        age,
        email,
        city,
        learningPaths = []
    }) {
        this.name = name;
        this.age = age;
        this.city = city;
        this.email = email;

        this.coursesApproved = [];
        this.coursesInProgress = [];
        this.learningPaths = learningPaths.filter(lp => lp instanceof LearningPath);
    }

    inscribirCurso(course) {
        if (!(course instanceof Course)) {
            console.warn("Debe ser un Course válido");
            return;
        }

        const pertenece = this.learningPaths.some(lp =>
            lp.courses.includes(course)
        );

        if (!pertenece) {
            console.warn("El curso no pertenece a ningún LearningPath del estudiante");
            return;
        }

        if (!this.coursesInProgress.includes(course)) {
            this.coursesInProgress.push(course);
        }
    }

    aprobarCurso(course) {
        if (!this.coursesInProgress.includes(course)) {
            console.warn("No puedes aprobar un curso que no estás cursando");
            return;
        }

        this.coursesApproved.push(course);

        this.coursesInProgress = this.coursesInProgress.filter(c => c !== course);
    }

    addLearningPath(lp) {
        if (lp instanceof LearningPath) {
            this.learningPaths.push(lp);
        } else {
            console.warn("No es un LearningPath válido");
        }
    }
}

const l1 = new Lesson({ name: "Intro OOP", durationInMinutes: 30 });
const l2 = new Lesson({ name: "Encapsulamiento", durationInMinutes: 40 });

const cursoPOO = new Course({
    name: "POO en Java",
    classes: [l1, l2]
});

const javaPath = new LearningPath({
    name: "Programación en Java",
    courses: [cursoPOO]
});

const estudiante = new Student({
    name: "Luisa",
    age: 25,
    city: "Madrid",
    email: "luisa@email.com",
    learningPaths: [javaPath]
});

estudiante.inscribirCurso(cursoPOO);
estudiante.aprobarCurso(cursoPOO);