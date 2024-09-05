import {
    createBrowserRouter,
  } from "react-router-dom";
import MangaList from "../views/MangaList";
import BaseLayout from "../Layout/BaseLayout";

const router = createBrowserRouter([
    {
        element: <BaseLayout/>,
        loader: () => {
            return null
        },
        children: [
            {
                path: '/',
                element: <MangaList/>
            }
        ]
    },
    {
        path: '/login',
        element: <>hola</>
    }
])

export default router