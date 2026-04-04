import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    credits: '',
    teacherName: '',
    capacity: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFormData({
          courseId: response.data.courseId || '',
          courseName: response.data.courseName || '',
          credits: response.data.credits || '',
          teacherName: response.data.teacherName || '',
          capacity: response.data.capacity || '',
        });
      } catch (error) {
        alert('Failed to fetch course.');
      }
    };

    if (user) {
      fetchCourse();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`/api/courses/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Course updated successfully.');
      navigate(`/courses/${id}`);
    } catch (error) {
      alert('Failed to update course.');
    }
  };

  return (
    <div className="w-full px-6 pb-10">
      <div className="bg-slate-100 rounded-b-xl p-6 shadow-sm">
        <h2 className="text-3xl font-medium mb-6">Edit Course</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 text-gray-700 hover:text-black"
          >
            ← Back
          </button>

          <div className="space-y-4">
            <input
              type="text"
              value={formData.courseId}
              disabled
              className="w-full border rounded px-4 py-3 bg-gray-100"
            />
            <input
              type="text"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full border rounded px-4 py-3"
              placeholder="Course name"
            />
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              className="w-full border rounded px-4 py-3"
              placeholder="Credits"
            />
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full border rounded px-4 py-3"
              placeholder="Teacher name"
            />
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full border rounded px-4 py-3"
              placeholder="Capacity"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit;