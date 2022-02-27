import { BrowserRouter, Routes , Route } from "react-router-dom";
import EditablePage from "./components/editablePage";
import Dashboard from "./components/Dashboard.jsx";
import Events from "./components/Events"
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/notes' element={<EditablePage />}></Route>
          <Route exact path='/events' element={<Events />}></Route>
          <Route exact path='/' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
