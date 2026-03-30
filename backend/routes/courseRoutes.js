const express = require('express');
const {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCourses)
    .post(protect, addCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;