import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import JournalHook from "../hooks/journal";
import ScrollToAnchor from "../hooks/scrollToAnchor";
import ScrollToTop from "../hooks/scrollToTop";
import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import About from "../app/pages/About/About";
import Articles from "../app/pages/Articles/Articles";
import Authors from "../app/pages/Authors/Authors";
import Boards from "../app/pages/Boards/Boards";
import News from "../app/pages/News/News";
import Search from "../app/pages/Search/Search";
import Sections from "../app/pages/Sections/Sections";
import Statistics from "../app/pages/Statistics/Statistics";
import VolumeDetails from "../app/pages/VolumeDetails/VolumeDetails";
import Volumes from "../app/pages/Volumes/Volumes";
import { PATHS, PathKeys } from "./paths";

const basicRoute = (path: PathKeys, Component: () => JSX.Element): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <ScrollToTop />
      <ScrollToAnchor />
      <JournalHook />
      <Component />
    </>
  )
})

const crumbedRoute = (path: PathKeys, Component: () => JSX.Element, handle?: { parent: { path: PathKeys; label: string }; crumb: string | ((id: string) => string) }): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <ScrollToTop />
      <ScrollToAnchor />
      <JournalHook />
      <Component />
    </>
  ),
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
      crumbedRoute("volumes", Volumes, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Volumes'}),
      crumbedRoute("volumeDetails", VolumeDetails, { parent: { path: 'home', label : 'Home > Content > Volume > ' }, crumb: (id: string) => `Volume ${id}`}),
      crumbedRoute("sections", Sections, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Sections'}),
      crumbedRoute("about", About, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'The journal'}),
      crumbedRoute("news", News, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'News'}),
      crumbedRoute("statistics", Statistics, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'Statistics'}),
    ]
  },
  redirectedRoute("home"),
]);

export default router