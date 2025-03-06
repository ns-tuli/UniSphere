import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import BusManagement from './components/Admin/BusManagement';
import CafeteriaManagement from './components/Admin/CafeteriaManagement';
import ClassManagement from './components/Admin/ClassManagement';
import ClubManagement from './components/Admin/ClubManagement';
import FacultyEntry from './components/Admin/FacultyEntry';
import Alert from './components/Alert';
import Auth from './components/Auth';
import BusSchedule from './components/BusSchedule';
import CafeteriaMenu from './components/CafeteriaMenu';
import CampusNavigation from './components/CampusNavigation';
import Chatbot from './components/Chatbot';
import ClassSchedule from './components/ClassSchedule';
import EventCalendar from './components/EventCalendar';
import FacultyContact from './components/FacultyContact';
import HomePage from './components/Homepage';
import Landing from './components/Landing';
import Layout from './components/Layout';
import NewsPortal from './components/NewsPortal'; // Adjust the path as necessary
import StudentProfile from './components/StudentProfile';
import UploadNotes from './components/UploadNotes';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Classroom from './pages/Classroom';
import Lobby from './pages/Lobby';
import Notes from './pages/Notes';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public routes that don't need the header */}
            <Route path="/" element={<Landing />} />

            {/* Protected routes with header */}
            <Route element={<Layout />}>
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/BusSchedule" element={<BusSchedule />} />
              <Route path="/CafeteriaMenu" element={<CafeteriaMenu />} />
              <Route path="/EventCalendar" element={<EventCalendar />} />
              <Route path="/ClassSchedule" element={<ClassSchedule />} />
              <Route path="/CampusNavigation" element={<CampusNavigation />} />
              <Route path="/Admin">
                <Route index element={<AdminDashboard />} />
                <Route
                  path="CafeteriaManagement"
                  element={<CafeteriaManagement />}
                />
                <Route path="BusManagement" element={<BusManagement />} />
                <Route path="FacultyEntry" element={<FacultyEntry />} />
                <Route path="ClassManagement" element={<ClassManagement />} />
              </Route>
              <Route path="/Notes" element={<Notes />} />
              <Route path="/Classroom/:id" element={<Classroom />} />
              <Route path="/Roadmap" element={<Roadmap />} />
              <Route path="/Chatbot" element={<Chatbot />} />
              <Route path="/uploadNotes" element={<UploadNotes />} />
              <Route path="/Alert" element={<Alert />} />
              <Route path="/FacultyContact" element={<FacultyContact />} />
              <Route path="/Auth" element={<Auth />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/readArticle" element={<NewsPortal />} />
              <Route path="/Admin/Events" element={<ClubManagement />} />
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
