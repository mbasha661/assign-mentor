const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Mentor = require('../models/mentor');

// Create a student
router.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Assign or change a mentor for a student
router.put('/students/:studentId/mentor', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const mentor = await Mentor.findById(req.body.mentorId);
        if (!mentor) {
            return res.status(404).send({ error: 'Mentor not found' });
        }

        if (student.mentor) {
            const previousMentor = await Mentor.findById(student.mentor);
            previousMentor.students.pull(student._id);
            await previousMentor.save();
        }

        student.mentor = mentor._id;
        mentor.students.push(student._id);

        await student.save();
        await mentor.save();

        res.send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get the previous mentor for a particular student
router.get('/students/:studentId/previous-mentor', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('mentor');
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send(student.mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all students who do not have a mentor
router.get('/students/unassigned', async (req, res) => {
    try {
        const students = await Student.find({ mentor: null });
        res.send(students);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
