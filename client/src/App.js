import AppProvider from "./AppContext";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import ProtectedRoutes from "./lib/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register"
import ActivateAccount from "./pages/ActivateAccount";
import ResetPass from "./pages/ResetPass";
import ResetPassRedirect from "./pages/ResetPassRedirect";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
            <Route path={"/dashboard"} element={<Dashboard />} />
            <Route path={"/settings"} element={<Settings />} />
        </Route>
        <Route path="/activate-account/:token" element={<ActivateAccount />} />
        <Route path="/reset-pass" element={<ResetPass />} />
        <Route path="/reset-pass-redirect/:token" element={<ResetPassRedirect />} />
      </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
