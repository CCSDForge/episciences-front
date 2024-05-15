import { RouteObject, createBrowserRouter } from "react-router-dom";

import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import Boards from "../app/pages/Boards/Boards";
import NotFound from "../app/pages/NotFound/NotFound";

const publicRoute = (path: string, Component: () => JSX.Element): RouteObject => ({ path, Component })

const router = createBrowserRouter([
  {
    element: MainLayout(),
    children: [
      publicRoute("/", Home),
      publicRoute("/boards", Boards),
      publicRoute("*", NotFound)
    ]
  }
]);

export default router