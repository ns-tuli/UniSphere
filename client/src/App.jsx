import BusSchedule from "./components/BusSchedule";
import CafeteriaMenu from "./components/CafeteriaMenu";
import Landing from "./components/Landing";
import EventCalendar from "./components/EventCalendar";
import ClassSchedule from "./components/ClassSchedule";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
