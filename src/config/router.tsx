import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import JournalHook from "../hooks/journal";
import LastVolumeHook from "../hooks/lastVolume";
import ScrollManager from "../hooks/scrollManager";
import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import About from "../app/pages/About/About";
import Articles from "../app/pages/Articles/Articles";
import ArticleDetails from "../app/pages/ArticleDetails/ArticleDetails";
import Authors from "../app/pages/Authors/Authors";
import Boards from "../app/pages/Boards/Boards";
import Credits from "../app/pages/Credits/Credits";
import ForAuthors from "../app/pages/ForAuthors/ForAuthors";
import News from "../app/pages/News/News";
import Search from "../app/pages/Search/Search";
import Sections from "../app/pages/Sections/Sections";
import SectionDetails from "../app/pages/SectionDetails/SectionDetails";
import Statistics from "../app/pages/Statistics/Statistics";
import VolumeDetails from "../app/pages/VolumeDetails/VolumeDetails";
import Volumes from "../app/pages/Volumes/Volumes";
import { PATHS, PathKeys } from "./paths";

const basicRoute = (path: PathKeys, Component: () => JSX.Element): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <ScrollManager />
      <JournalHook />
      <LastVolumeHook />
      <Component />
    </>
  )
})

const crumbedRoute = (path: PathKeys, Component: () => JSX.Element, handle?: { parent: { path: PathKeys; label: string }; crumb: string | ((id: string) => string) }): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <ScrollManager />
      <JournalHook />
      <LastVolumeHook />
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
      crumbedRoute("forAuthors", ForAuthors, { parent: { path: 'home', label : 'Home > ' }, crumb: 'For authors'}),
      crumbedRoute("credits", Credits, { parent: { path: 'home', label : 'Home > ' }, crumb: 'Credits'}),
      crumbedRoute("search", Search, { parent: { path: 'home', label : 'Home > ' }, crumb: 'Search'}),
      crumbedRoute("articles", Articles, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Articles'}),
      crumbedRoute("articleDetails", ArticleDetails, { parent: { path: 'home', label : 'Home > Content > Article > ' }, crumb: (id: string) => `Article ${id}`}),
      crumbedRoute("authors", Authors, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Authors'}),
      crumbedRoute("volumes", Volumes, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Volumes'}),
      crumbedRoute("volumeDetails", VolumeDetails, { parent: { path: 'home', label : 'Home > Content > Volume > ' }, crumb: (id: string) => `Volume ${id}`}),
      crumbedRoute("sections", Sections, { parent: { path: 'home', label : 'Home > Content > ' }, crumb: 'Sections'}),
      crumbedRoute("sectionDetails", SectionDetails, { parent: { path: 'home', label : 'Home > Content > Section > ' }, crumb: (id: string) => `Section ${id}`}),
      crumbedRoute("about", About, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'The journal'}),
      crumbedRoute("news", News, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'News'}),
      crumbedRoute("statistics", Statistics, { parent: { path: 'home', label : 'Home > About > ' }, crumb: 'Statistics'}),
    ]
  },
  redirectedRoute("home"),
]);

export default router