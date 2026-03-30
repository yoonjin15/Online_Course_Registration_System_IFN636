const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const registerCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.body.courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.seatsLeft <= 0) {
            return res.status(400).json({ message: 'Course full' });
        }

        const existing = await Enrollment.findOne({
            student: req.user.id,
            course: course._id
        });

        if (existing) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: course._id
        });

        course.seatsLeft -= 1;
        await course.save();

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            .populate('course');

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const dropCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const course = await Course.findById(enrollment.course);
        course.seatsLeft += 1;
        await course.save();

        await enrollment.deleteOne();

        res.json({ message: 'Course dropped' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerCourse, getMyCourses, dropCourse };