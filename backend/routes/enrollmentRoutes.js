const express = require('express');
const {
    registerCourse,
    getMyCourses,
    dropCourse
} = require('../controllers/enrollmentController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, registerCourse);
router.get('/my-courses', protect, getMyCourses);
router.delete('/:id', protect, dropCourse);

module.exports = router;