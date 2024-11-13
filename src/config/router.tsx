import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import JournalHook from "../hooks/journal";
import LastVolumeHook from "../hooks/lastVolume";
import MathjaxHook from '../hooks/mathjax';
import ScrollManager from "../hooks/scrollManager";
import MainLayout from "../app/layouts/MainLayout/MainLayout";
import Home from "../app/pages/Home/Home";
import About from "../app/pages/About/About";
import Articles from "../app/pages/Articles/Articles";
import ArticleDetails from "../app/pages/ArticleDetails/ArticleDetails";
import ArticleDetailsMetadata from "../app/pages/ArticleDetailsMetadata/ArticleDetailsMetadata";
import ArticleDetailsPreview from "../app/pages/ArticleDetailsPreview/ArticleDetailsPreview";
//import ArticleDetailsNotice from "../app/pages/ArticleDetailsNotice/ArticleDetailsNotice";
import ArticleDetailsDownload from "../app/pages/ArticleDetailsDownload/ArticleDetailsDownload";
import ArticlesAccepted from "../app/pages/ArticlesAccepted/ArticlesAccepted";
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

const rawRoute = (path: PathKeys, Component: () => JSX.Element): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <JournalHook />
      <Component />
    </>
  )
})

const basicRoute = (path: PathKeys, Component: () => JSX.Element): RouteObject => ({
  path: PATHS[path],
  element: (
    <>
      <ScrollManager />
      <JournalHook />
      <LastVolumeHook />
      <MathjaxHook />
      <Component />
    </>
  )
})

const redirectedRoute = (to: PathKeys): RouteObject => ({
  path: "*",
  element: <Navigate to={PATHS[to]} replace />
})

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      basicRoute("home", Home),
      basicRoute("boards", Boards),
      basicRoute("forAuthors", ForAuthors),
      basicRoute("credits", Credits),
      basicRoute("search", Search),
      basicRoute("articles", Articles),
      basicRoute("articleDetails", ArticleDetails),
      basicRoute("articlesAccepted", ArticlesAccepted),
      basicRoute("authors", Authors),
      basicRoute("volumes", Volumes),
      basicRoute("volumeDetails", VolumeDetails),
      basicRoute("sections", Sections),
      basicRoute("sectionDetails", SectionDetails),
      basicRoute("about", About),
      basicRoute("news", News),
      basicRoute("statistics", Statistics),
    ]
  },
  {
    children: [
      rawRoute("articleDetailsMetadata", ArticleDetailsMetadata),
      rawRoute("articleDetailsPreview", ArticleDetailsPreview),
      //rawRoute("articleDetailsNotice", ArticleDetailsNotice),
      rawRoute("articleDetailsDownload", ArticleDetailsDownload),
    ]
  },
  redirectedRoute("home"),
]);

export default router