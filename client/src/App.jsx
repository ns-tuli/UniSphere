import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./components/Landing";
import BusSchedule from "./components/BusSchedule";
import CafeteriaMenu from "./components/CafeteriaMenu";
import EventCalendar from "./components/EventCalendar";
import ClassSchedule from "./components/ClassSchedule";
import CampusNavigation from "./components/CampusNavigation";
import HomePage from "./components/Homepage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import BusManagement from "./components/Admin/BusManagement";
import CafeteriaManagement from "./components/Admin/CafeteriaManagement";
import Notes from "./pages/Notes";
import Roadmap from "./pages/Roadmap";
import Chatbot from "./components/Chatbot";
import UploadNotes from "./components/UploadNotes";
import FacultyContact from "./components/FacultyContact";
import Auth from "./components/Auth";
import StudentProfile from "./components/StudentProfile";
import FacultyEntry from "./components/Admin/FacultyEntry";
import ClassManagement from "./components/Admin/ClassManagement";
import Alert from "./components/Alert";

function App() {
  return (
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
          <Route path="/Roadmap" element={<Roadmap />} />
          <Route path="/Chatbot" element={<Chatbot />} />
          <Route path="/uploadNotes" element={<UploadNotes />} />
          <Route path="/Alert" element={<Alert />} />
          <Route path="/FacultyContact" element={<FacultyContact />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
