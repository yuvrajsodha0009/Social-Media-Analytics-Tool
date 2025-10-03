import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import GoogleLoginSuccess from "./components/GoogleLoginSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/google-success" element={<GoogleLoginSuccess />} />
    </Routes>
  );
}

export default App;
