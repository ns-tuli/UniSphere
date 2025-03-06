import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AlertManagement from "./components/Admin/AlertManagement";
import BusManagement from "./components/Admin/BusManagement";
import CafeteriaManagement from "./components/Admin/CafeteriaManagement";
import ClassManagement from "./components/Admin/ClassManagement";
import FacultyEntry from "./components/Admin/FacultyEntry";
import LostFoundManagement from "./components/Admin/LostFoundManagement";
import UserManagement from "./components/Admin/UserManagement";
import Alert from "./components/Alert";
import Auth from "./components/Auth";
import BusSchedule from "./components/BusSchedule";
import CafeteriaMenu from "./components/CafeteriaMenu";
import CampusNavigation from "./components/CampusNavigation";
import Chatbot from "./components/Chatbot";
import ClassSchedule from "./components/ClassSchedule";
import Collab from "./components/Collab/Collab";
import EventCalendar from "./components/EventCalendar";
import FacultyContact from "./components/FacultyContact";
import HomePage from "./components/Homepage";
import Landing from "./components/Landing";
import Layout from "./components/Layout";
import LostFound from "./components/LostFound";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import StudentProfile from "./components/StudentProfile";
import TestAuth from "./components/TestAuth";
import UploadNotes from "./components/UploadNotes";
import { AuthProvider } from "./context/AuthContext";
import Notes from "./pages/Notes";
import Roadmap from "./pages/Roadmap";


function App() {
  return (
    <AuthProvider>
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
            <Route path="/Collab" element={<Collab />} />
            <Route path="/Admin">
              <Route
                index
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="CafeteriaManagement"
                element={
                  <ProtectedAdminRoute>
                    <CafeteriaManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="BusManagement"
                element={
                  <ProtectedAdminRoute>
                    <BusManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="FacultyEntry"
                element={
                  <ProtectedAdminRoute>
                    <FacultyEntry />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="ClassManagement"
                element={
                  <ProtectedAdminRoute>
                    <ClassManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="AlertManagement"
                element={
                  <ProtectedAdminRoute>
                    <AlertManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="LostFoundManagement"
                element={
                  <ProtectedAdminRoute>
                    <LostFoundManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="UserManagement"
                element={
                  <ProtectedAdminRoute>
                    <UserManagement />
                  </ProtectedAdminRoute>
                }
              />
            </Route>
            <Route path="/Notes" element={<Notes />} />
            <Route path="/Roadmap" element={<Roadmap />} />
            <Route path="/Chatbot" element={<Chatbot />} />
            <Route path="/uploadNotes" element={<UploadNotes />} />
            <Route path="/Alert" element={<Alert />} />
            <Route path="/FacultyContact" element={<FacultyContact />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/alerts" element={<Alert />} />
            <Route path="/test-auth" element={<TestAuth />} />
            <Route path="/LostFound" element={<LostFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;