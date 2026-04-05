import { useNavigate } from 'react-router-dom';

const CourseList = ({ courses = [] }) => {
  const navigate = useNavigate();

  return (
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
            <th className="py-3 px-3 text-center">Detail</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500">
                No courses found.
              </td>
            </tr>
          ) : (
            courses.map((course, index) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3">{index + 1}</td>
                <td className="py-3 px-3">{course.courseId}</td>
                <td className="py-3 px-3">{course.courseName}</td>
                <td className="py-3 px-3">{course.credits}</td>
                <td className="py-3 px-3">{course.teacherName}</td>
                <td className="py-3 px-3">{course.seatsLeft}</td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-1.5 rounded text-xs"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;