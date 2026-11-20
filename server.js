
const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

// In-memory student array
let students = [];
let nextId = 1;

// 1. POST - Add student
app.post("/api/students", (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === "") {
        return res.status(400).json({ message: "Missing data" });
    }

    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({ message: "Name already exists" });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age: Number(age)
    };

    students.push(student);

    res.status(201).json(student);
});

// 2. GET - All students
app.get("/api/students", (req, res) => {
    let result = students;

    if (req.query.course) {
        result = students.filter(
            s => s.course.toLowerCase() === req.query.course.toLowerCase()
        );
    }

    res.status(200).json(result);
});

// 3. GET - Student by ID
app.get("/api/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

// 4. PUT - Update student
app.put("/api/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === "") {
        return res.status(400).json({ message: "Missing data" });
    }

    const exists = students.find(
        s => s.id !== student.id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({ message: "Name already exists" });
    }

    student.name = name.trim();
    student.course = course.trim();
    student.age = Number(age);

    res.status(200).json(student);
});

// 5. DELETE - Delete student
app.delete("/api/students/:id", (req, res) => {
    const index = students.findIndex(
        s => s.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deleted = students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted",
        student: deleted[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
