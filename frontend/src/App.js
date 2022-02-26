import { BrowserRouter, Routes , Route } from "react-router-dom";
import EditablePage from "./components/editablePage";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/notes' element={<EditablePage />}></Route>
          <Route exact path='/' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
