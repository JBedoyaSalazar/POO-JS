class
class Course{
    constructor({
        name,
        classes = []
    }){
        this.name = name;
        this.classes = classes;
    }
    
    addClasses(newClasses){
        this.classes.push(newClasses);
    }
}

class LearningPath {
    constructor({name, courses = []}) {
        this.name = name;
        this.courses = courses;
    }

    addCourses(curso) {
        this.courses.push(curso);
    }
}

const programacionEnJava = new LearningPath({name: "Programacion en Java", courses: [
    "1. Introduccion a la programacion orientada a objetos",
    "2. Manejo de excepciones",
    "3. Programacion orientada a objetos",
]});

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

    aprobarCurso(curso) {
        this.coursesApproved.push(curso);

        this.coursesInProgress = this.coursesInProgress.filter(c => c !== curso);
    }

    inscribirCurso(curso) {
        this.coursesInProgress.push(curso);
    }

    addLearningPath(learningPath) {
        if (learningPath instanceof LearningPath) {
            this.learningPaths.push(learningPath);
        } else {
            console.warn("No es un LearningPath válido"); 
        }
    }
}