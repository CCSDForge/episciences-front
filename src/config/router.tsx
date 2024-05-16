import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import Articles from "../app/pages/Articles/Articles";
import Boards from "../app/pages/Boards/Boards";
import Search from "../app/pages/Search/Search";

const basicRoute = (path: string, Component: () => JSX.Element): RouteObject => ({
  path,
  element: <Component />
})

const crumbedRoute = (path: string, Component: () => JSX.Element, handle?: { parent: { path: string; label: string }; crumb: string }): RouteObject => ({
  path,
  element: <Component />,
  handle
})

const redirectedRoute = (path: string, to: string): RouteObject => ({
  path,
  element: <Navigate to={to} replace />
})

const router = createBrowserRouter([
  {
    element: MainLayout(),
    children: [
      basicRoute("/", Home),
      crumbedRoute("browse/latest", Articles, { parent: { path: '/', label : 'Home > Content > ' }, crumb: 'Articles'}),
      crumbedRoute("boards", Boards, { parent: { path: '/', label : 'Home > ' }, crumb: 'Boards'}),
      crumbedRoute("search", Search, { parent: { path: '/', label : 'Home > ' }, crumb: 'Search'}),
    ]
  },
  redirectedRoute("*", "/"),
]);

export default router