import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import About from "../app/pages/About/About";
import Articles from "../app/pages/Articles/Articles";
import Authors from "../app/pages/Authors/Authors";
import Boards from "../app/pages/Boards/Boards";
import Search from "../app/pages/Search/Search";
import { PATHS, PathKeys } from "./paths";

const basicRoute = (path: PathKeys, Component: () => JSX.Element): RouteObject => ({
  path: PATHS[path],
  element: <Component />
})

const crumbedRoute = (path: PathKeys, Component: () => JSX.Element, handle?: { parent: { path: PathKeys; label: string }; crumb: string }): RouteObject => ({
  path: PATHS[path],
  element: <Component />,
  handle: handle ? { ...handle, parent: { ...handle.parent, path: PATHS[handle.parent.path] } } : undefined
})

const redirectedRoute = (to: PathKeys): RouteObject => ({
  path: "*",
  element: <Navigate to={PATHS[to]} replace />
})

const router = createBrowserRouter([
  {
    element: MainLayout(),
    children: [
      basicRoute("home", Home),
      crumbedRoute("boards", Boards, { parent: { path: 'home', label : 'Home > ' }, crumb: 'Boards'}),
      crumbedRoute("search", Search, { parent: { path: 'home', label : 'Home > ' }, crumb: 'Search'}),
      crumbedRoute("articles", Articles, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Articles'}),
      crumbedRoute("authors", Authors, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Authors'}),
      crumbedRoute("about", About, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'The journal'}),
    ]
  },
  redirectedRoute("home"),
]);

export default router