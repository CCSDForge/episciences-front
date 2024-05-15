import { RouteObject, createBrowserRouter } from "react-router-dom";

import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import Boards from "../app/pages/Boards/Boards";
import NotFound from "../app/pages/NotFound/NotFound";

const publicRoute = (path: string, Component: () => JSX.Element, handle?: { parent: { path: string; label: string }; crumb: string }): RouteObject => ({ path, Component, handle })

const router = createBrowserRouter([
  {
    element: MainLayout(),
    children: [
      publicRoute("/", Home),
      publicRoute("/boards", Boards, { parent: { path: '/', label : 'Home > ' }, crumb: 'Boards'}),
      publicRoute("*", NotFound)
    ]
  }
]);

export default router