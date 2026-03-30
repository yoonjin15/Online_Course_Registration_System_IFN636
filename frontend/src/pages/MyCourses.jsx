import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/enrollments/my-courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setEnrollments(response.data);
      } catch (error) {
        alert('Failed to fetch enrolled courses.');
      }
    };

    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const handleDrop = async (enrollmentId) => {
    try {
      await axiosInstance.delete(`/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setEnrollments(enrollments.filter((item) => item._id !== enrollmentId));
    } catch (error) {
      alert('Failed to drop course.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {enrollments.length === 0 ? (
        <p>No enrolled courses found.</p>
      ) : (
        enrollments.map((item) => (
          <div key={item._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="font-bold text-lg">{item.course.courseName}</h2>
            <p>Course ID: {item.course.courseId}</p>
            <p>Credits: {item.course.credits}</p>
            <p>Teacher: {item.course.teacherName}</p>
            <p>Enrollment Date: {new Date(item.enrollmentDate).toLocaleDateString()}</p>

            <button
              onClick={() => handleDrop(item._id)}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
            >
              Drop Course
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCourses;