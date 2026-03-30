const Course = require('../models/Course');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCourse = async (req, res) => {
    const { courseId, courseName, credits, teacherName, capacity } = req.body;

    try {
        const course = await Course.create({
            courseId,
            courseName,
            credits,
            teacherName,
            capacity,
            seatsLeft: capacity,
            createdBy: req.user.id
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    const { courseName, credits, teacherName, capacity } = req.body;

    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.courseName = courseName || course.courseName;
        course.credits = credits || course.credits;
        course.teacherName = teacherName || course.teacherName;

        if (capacity) {
            const diff = capacity - course.capacity;
            course.capacity = capacity;
            course.seatsLeft += diff;
        }

        const updated = await course.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        await course.deleteOne();
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourses, getCourseById, addCourse, updateCourse, deleteCourse };