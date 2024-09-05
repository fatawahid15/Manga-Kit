import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function BaseLayout({ url }) {
  return (
    <>
      <NavBar url={url} />
      <Outlet />
    </>
  );
}
