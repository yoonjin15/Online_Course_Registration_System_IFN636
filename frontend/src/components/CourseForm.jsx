import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CourseForm = ({ courses, setCourses, editingCourse, setEditingCourse }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    credits: '',
    teacherName: '',
    capacity: '',
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseId: editingCourse.courseId,
        courseName: editingCourse.courseName,
        credits: editingCourse.credits,
        teacherName: editingCourse.teacherName,
        capacity: editingCourse.capacity,
      });
    } else {
      setFormData({
        courseId: '',
        courseName: '',
        credits: '',
        teacherName: '',
        capacity: '',
      });
    }
  }, [editingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        const response = await axiosInstance.put(
          `/api/courses/${editingCourse._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setCourses(
          courses.map((course) =>
            course._id === response.data._id ? response.data : course
          )
        );
      } else {
        const response = await axiosInstance.post('/api/courses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setCourses([...courses, response.data]);
      }

      setEditingCourse(null);
      setFormData({
        courseId: '',
        courseName: '',
        credits: '',
        teacherName: '',
        capacity: '',
      });
    } catch (error) {
      alert('Failed to save course.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingCourse ? 'Edit Course' : 'Add Course'}
      </h1>

      <input
        type="text"
        placeholder="Course ID"
        value={formData.courseId}
        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={!!editingCourse}
      />

      <input
        type="text"
        placeholder="Course Name"
        value={formData.courseName}
        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Credits"
        value={formData.credits}
        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Teacher Name"
        value={formData.teacherName}
        onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingCourse ? 'Update Course' : 'Add Course'}
      </button>
    </form>
  );
};

export default CourseForm;