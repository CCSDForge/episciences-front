import { RouteObject, createBrowserRouter } from "react-router-dom";

import Home from "../app/pages/Home/Home";
import NotFound from "../app/pages/NotFound/NotFound";

const publicRoute = (path: string, Component: () => JSX.Element): RouteObject => ({ path, Component })

const router = createBrowserRouter([
  publicRoute("/", Home),
  publicRoute("*", NotFound)
]);

export default router