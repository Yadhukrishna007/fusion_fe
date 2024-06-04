import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import { useEffect, useState } from "react";
import { SocketContext } from "./components/context";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ThemeContext } from "./components/context";

//socket io
const socket = io(process.env.REACT_APP_SERVER_ENDPOINT);

function App() {
  const { token } = useSelector((store) => store.user.user);

  const [mode, setMode] = useState(localStorage.theme || "light");

  const handleThemeChange = () => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <div>
      <SocketContext.Provider value={socket}>
        <ThemeContext.Provider value={{ mode, setMode }}>
          <Router>
            <Routes>
              <Route
                exact
                path="/register"
                element={!token ? <Register /> : <Navigate to="/" />}
              ></Route>
              <Route
                exact
                path="/login"
                element={!token ? <Login /> : <Navigate to="/" />}
              ></Route>
              <Route
                exact
                path="/"
                element={token ? <Home /> : <Navigate to="/login" />}
              ></Route>
            </Routes>
          </Router>
        </ThemeContext.Provider>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
