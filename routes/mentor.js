const express = require('express');
const router = express.Router();
const Mentor = require('../models/mentor');
const Student = require('../models/student');

// Create a mentor
router.post('/mentors', async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Assign a student to a mentor
router.post('/mentors/:mentorId/students', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).send({ error: 'Mentor not found' });
        }

        const students = await Student.find({ _id: { $in: req.body.studentIds } });
        students.forEach(student => {
            if (!student.mentor) {
                student.mentor = mentor._id;
                mentor.students.push(student._id);
            }
        });

        await Promise.all(students.map(student => student.save()));
        await mentor.save();

        res.send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all students for a particular mentor
router.get('/mentors/:mentorId/students', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId).populate('students');
        if (!mentor) {
            return res.status(404).send({ error: 'Mentor not found' });
        }
        res.send(mentor.students);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
