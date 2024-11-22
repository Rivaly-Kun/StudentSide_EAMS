import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Create from "./pages/Dashboard"


function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Create />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
