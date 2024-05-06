import { RouteObject, createBrowserRouter, redirect } from "react-router-dom";

import store, { RootState } from "../store";
import Home from "../app/pages/Home/Home";
import Profile from "../app/pages/Profile/Profile";
import Login from "../app/pages/Login/Login";
import NotFound from "../app/pages/NotFound/NotFound";

const publicRoute = (path: string, Component: () => JSX.Element): RouteObject => ({ path, Component })

const protectedRoute = (path: string, Component: () => JSX.Element): RouteObject => ({
  path,
  Component,
  loader: () => {
    const token = (store.getState() as RootState).authReducer.token

    if (!token) {
      return redirect("/login");
    }
    
    return null;
  }
})

const router = createBrowserRouter([
  protectedRoute("/", Home),
  protectedRoute("/profile", Profile),
  publicRoute("/login", Login),
  publicRoute("*", NotFound)
]);

export default router