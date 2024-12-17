import "./App.css";
import Layout from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext.js";
// import { UserProvider } from "./context/UserContext.js";
import PrivateRoute from "./Router/PrivateRoute.js";

function App() {
  return (
    <AuthProvider>
      {/* <UserProvider> */}
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/register" element={<Register />} />{" "}
          <Route path="/*" element={<PrivateRoute><Layout /></PrivateRoute>}/>
        </Routes>
      </div>
      {/* </UserProvider> */}
     </AuthProvider>
  );
}
export default App;
