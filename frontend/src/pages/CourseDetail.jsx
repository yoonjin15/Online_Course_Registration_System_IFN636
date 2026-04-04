import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const courseRes = await axiosInstance.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourse(courseRes.data);

        if (user.role !== 'admin') {
          const enrollmentRes = await axiosInstance.get('/api/enrollments/my-courses', {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          const matched = enrollmentRes.data.find((item) => item.course?._id === id);
          if (matched) {
            setEnrollmentId(matched._id);
          } else {
            setEnrollmentId(null);
          }
        }
      } catch (error) {
        alert('Failed to fetch course detail.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

  const handleRegister = async () => {
    try {
      const res = await axiosInstance.post(
        '/api/enrollments',
        { courseId: id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setEnrollmentId(res.data._id);
      setCourse((prev) => ({
        ...prev,
        seatsLeft: Math.max((prev?.seatsLeft || 1) - 1, 0),
      }));

      alert('Course registered successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register course.');
    }
  };

  const handleDrop = async () => {
    try {
      await axiosInstance.delete(`/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setEnrollmentId(null);
      setCourse((prev) => ({
        ...prev,
        seatsLeft: (prev?.seatsLeft || 0) + 1,
      }));

      alert('Course dropped successfully.');
    } catch (error) {
      alert('Failed to drop course.');
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('Are you sure you want to delete this course?');
    if (!ok) return;

    try {
      await axiosInstance.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Course deleted successfully.');
      navigate('/courses');
    } catch (error) {
      alert('Failed to delete course.');
    }
  };

  if (loading) {
    return <div className="w-full px-6 py-10">Loading...</div>;
  }

  if (!course) {
    return <div className="w-full px-6 py-10">Course not found.</div>;
  }

  return (
    <div className="w-full px-6 pb-10">
      <div className="bg-slate-100 rounded-b-xl p-6 shadow-sm">
        <h2 className="text-3xl font-medium mb-6">Course Information</h2>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-gray-700 hover:text-black"
          >
            ← Back
          </button>

          <h3 className="text-2xl font-semibold text-center mb-8">
            {course.courseName}
          </h3>

          <div className="space-y-4 text-lg">
            <p><span className="font-semibold">Course ID:</span> {course.courseId}</p>
            <p><span className="font-semibold">Credits:</span> {course.credits}</p>
            <p><span className="font-semibold">Teacher:</span> {course.teacherName}</p>
            <p><span className="font-semibold">Seats Left:</span> {course.seatsLeft}</p>
            <p><span className="font-semibold">Capacity:</span> {course.capacity}</p>
          </div>

          <div className="mt-10 flex justify-end gap-3">
            {user.role === 'admin' ? (
              <>
                <button
                  onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                >
                  Delete
                </button>
              </>
            ) : enrollmentId ? (
              <button
                onClick={handleDrop}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
              >
                Drop
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;