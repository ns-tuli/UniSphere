import BusSchedule from "./components/BusSchedule";
import CafeteriaMenu from "./components/CafeteriaMenu";
import Landing from "./components/Landing";
import EventCalendar from "./components/EventCalendar";
import ClassSchedule from "./components/ClassSchedule";
import CampusNavigation from "./components/CampusNavigation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage";
import Notes from "./pages/Notes";

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
          <Route path="/Notes" element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
