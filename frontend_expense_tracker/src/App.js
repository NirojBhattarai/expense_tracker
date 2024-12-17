import "./App.css";
import Layout from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext.js";
import PrivateRoute from "./Router/PrivateRoute.js";

function App() {
  return (
    <AuthProvider>
      <div>
        {" "}
        <Routes>
          {" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/register" element={<Register />} />{" "}
          <Route path="/*" element={<PrivateRoute><Layout /></PrivateRoute>}/>
        </Routes>{" "}
      </div>
     </AuthProvider>
  );
}
export default App;
