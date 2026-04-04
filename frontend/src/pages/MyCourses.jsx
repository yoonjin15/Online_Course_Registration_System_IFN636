import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/enrollments/my-courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setEnrollments(response.data || []);
      } catch (error) {
        alert('Failed to fetch enrolled courses.');
      }
    };

    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const handleDrop = async (enrollmentId) => {
    const ok = window.confirm('Do you want drop this course?');
    if (!ok) return;

    try {
      await axiosInstance.delete(`/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setEnrollments((prev) => prev.filter((item) => item._id !== enrollmentId));
      alert('Course dropped successfully.');
    } catch (error) {
      alert('Failed to drop course.');
    }
  };

  const filteredEnrollments = enrollments.filter((item) => {
    const keyword = search.toLowerCase();

    const courseId = item.course?.courseId?.toLowerCase() || '';
    const courseName = item.course?.courseName?.toLowerCase() || '';
    const teacherName = item.course?.teacherName?.toLowerCase() || '';

    return (
      courseId.includes(keyword) ||
      courseName.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });

  return (
    <div className="w-full px-6 pb-10">
      <div className="bg-slate-100 rounded-b-xl p-6 shadow-sm">
        <h2 className="text-3xl font-medium mb-6">My Courses</h2>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg shadow-sm"
        />

        <div className="bg-white rounded-xl p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Course ID</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Credits</th>
                <th className="py-3 px-3">Teacher</th>
                <th className="py-3 px-3">Seats Left</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No enrolled courses found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3">{index + 1}</td>
                    <td className="py-3 px-3">{item.course?.courseId}</td>
                    <td className="py-3 px-3">{item.course?.courseName}</td>
                    <td className="py-3 px-3">{item.course?.credits}</td>
                    <td className="py-3 px-3">{item.course?.teacherName}</td>
                    <td className="py-3 px-3">{item.course?.seatsLeft}</td>
                    <td className="py-3 px-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/courses/${item.course?._id}`)}
                          className="bg-gray-300 hover:bg-gray-400 px-4 py-1.5 rounded text-xs"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDrop(item._id)}
                          className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded text-xs"
                        >
                          Drop
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;