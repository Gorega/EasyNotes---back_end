import {Outlet} from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./AppContext";


function ProtectedRoutes(){
    const {signedUser} = useContext(AppContext);
    return signedUser ? <Outlet /> : window.location.replace("/login")
}

export default ProtectedRoutes;