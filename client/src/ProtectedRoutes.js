import {Outlet} from "react-router-dom";

function ProtectedRoutes(){
return localStorage.getItem("user") ? <Outlet /> : window.location.replace("/login")
}

export default ProtectedRoutes;