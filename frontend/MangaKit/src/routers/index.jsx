import { createBrowserRouter, redirect } from "react-router-dom";
import MangaList from "../views/MangaList";
import BaseLayout from "../views/BaseLayout"
import LoginPage from "../views/LoginPage";
import MangaDetail from "../views/MangaDetail";
import ReadManga from "../views/ReadManga";
import YourProfile from "../views/YourProfile";
import RegisterPage from "../views/RegisterPage";

const url = "https://mangakit.daseas.cloud";

const router = createBrowserRouter([
  {
    element: <BaseLayout url={url} />,
    loader: () => {
      return null;
    },
    children: [
      {
        path: "/",
        element: <MangaList />,
      },
    ],
  },
  {
    element: <BaseLayout url={url} />,
    loader: () => {
      if (!localStorage.getItem("access_token")) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: ":id",
        element: <MangaDetail url={url} />,
      },
      {
        path: "/chapter/:id",
        element: <ReadManga url={url} />,
      },
      {
        path: "/profile/me",
        element: <YourProfile url={url} />,
      },
    ],
  },
  {
    element: <BaseLayout url={url} />,
    loader: () => {
      if (localStorage.getItem("access_token")) {
        return redirect("/");
      }
      return null;
    },
    children: [
      {
        path: "/login",
        element: <LoginPage url={url} />,
      },
      {
        path: "/register",
        element: <RegisterPage url={url} />,
      },
    ],
  },
]);

export default router;
