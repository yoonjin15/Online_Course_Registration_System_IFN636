import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CourseList = ({ courses, setCourses, setEditingCourse, isAdmin = false }) => {
  const { user } = useAuth();

  const handleDelete = async (courseId) => {
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      alert('Failed to delete course.');
    }
  };

  const handleRegister = async (courseId) => {
    try {
      await axiosInstance.post(
        '/api/enrollments',
        { courseId },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert('Course registered successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register course.');
    }
  };

  return (
    <div>
      {courses.map((course) => (
        <div key={course._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-lg">{course.courseName}</h2>
          <p>Course ID: {course.courseId}</p>
          <p>Credits: {course.credits}</p>
          <p>Teacher: {course.teacherName}</p>
          <p>Capacity: {course.capacity}</p>
          <p>Seats Left: {course.seatsLeft}</p>

          <div className="mt-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setEditingCourse(course)}
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => handleRegister(course._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Register
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;