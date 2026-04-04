import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import CourseList from '../components/CourseList';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(response.data || []);
      } catch (error) {
        alert('Failed to fetch courses.');
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const filteredCourses = courses.filter((course) => {
    const keyword = search.toLowerCase();

    const courseId = course.courseId?.toLowerCase() || '';
    const courseName = course.courseName?.toLowerCase() || '';
    const teacherName = course.teacherName?.toLowerCase() || '';

    return (
      courseId.includes(keyword) ||
      courseName.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });

  return (
    <div className="w-full px-6 pb-10">
      <div className="bg-slate-100 rounded-b-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-medium">Course List</h2>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/courses/new')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded"
            >
              Add Course
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg shadow-sm"
        />

        <CourseList
          courses={filteredCourses}
          isAdmin={user?.role === 'admin'}
        />
      </div>
    </div>
  );
};

export default Courses;