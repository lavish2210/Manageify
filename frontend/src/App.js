import './App.css';
import { BrowserRouter, Routes , Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
