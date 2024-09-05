import { Outlet } from "react-router-dom";
import NavBar from "../component/NavBar";

export default function BaseLayout() {
    return (
        <>
        <NavBar/>
        <Outlet/>
        </>
    )
}