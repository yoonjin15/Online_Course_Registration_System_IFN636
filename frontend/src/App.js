import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import CourseDetail from './pages/CourseDetail';
import CourseEdit from './pages/CourseEdit';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <AppLayout>
                <Courses />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <CourseDetail />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/courses/:id/edit"
          element={
            <PrivateRoute>
              <AppLayout>
                <CourseEdit />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <PrivateRoute>
              <AppLayout>
                <MyCourses />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;