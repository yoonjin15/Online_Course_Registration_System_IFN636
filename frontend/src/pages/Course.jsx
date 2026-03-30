import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import CourseForm from '../components/CourseForm';
import CourseList from '../components/CourseList';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setCourses(response.data);
      } catch (error) {
        alert('Failed to fetch courses.');
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto p-6">
      {isAdmin && (
        <CourseForm
          courses={courses}
          setCourses={setCourses}
          editingCourse={editingCourse}
          setEditingCourse={setEditingCourse}
        />
      )}

      <CourseList
        courses={courses}
        setCourses={setCourses}
        setEditingCourse={setEditingCourse}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Courses;