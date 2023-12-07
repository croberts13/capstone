import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Appointments from "./components/Appointments";
import Patients from "./components/Patients";

const Root = () => {
  return <Outlet />;
};

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // dashboard
      { path: "/dashboard", element: <Dashboard /> },
      // appointments
      { path: "/appointments", element: <Appointments /> },
      // profile
      { path: "/profile", element: <Profile /> },
      // patients
      { path: "/patients", element: <Patients /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <Navigate to="/login" /> },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
