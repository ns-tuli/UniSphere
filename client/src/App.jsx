import BusSchedule from "./components/BusSchedule";
import CafeteriaMenu from "./components/CafeteriaMenu";
import Landing from "./components/Landing";
import EventCalendar from "./components/EventCalendar";
import ClassSchedule from "./components/ClassSchedule";
import CampusNavigation from "./components/CampusNavigation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage";
import AdminDashboard from "./components/Admin/AdminDashboard"
import BusManagement from "./components/Admin/BusManagement"
import CafeteriaManagement from "./components/Admin/CafeteriaManagement"
import Notes from "./pages/Notes";
import Roadmap from "./pages/Roadmap";
import Chatbot from "./components/Chatbot"; // Import your chatbot page component
import UploadNotes from "./components/UploadNotes"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />

          <Route path="/BusSchedule" element={<BusSchedule />} />
          <Route path="/CafeteriaMenu" element={<CafeteriaMenu />} />
          <Route path="/EventCalendar" element={<EventCalendar />} />
          <Route path="/ClassSchedule" element={<ClassSchedule />} />
          <Route path="/CampusNavigation" element={<CampusNavigation />} />
          <Route path="/HomePage" element={<HomePage />} />

          <Route path="/Admin">
            <Route index element={<AdminDashboard />} />
            <Route path="CafeteriaManagement" element={<CafeteriaManagement />} />
            <Route path="BusManagement" element={<BusManagement />} />
          </Route>

          <Route path="/Notes" element={<Notes />} />
        <Route path="/Roadmap" element={<Roadmap />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/uploadNotes" element={<UploadNotes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
