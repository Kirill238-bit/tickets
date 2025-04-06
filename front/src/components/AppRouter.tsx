import { Route, Routes } from "react-router-dom";

import React from "react";
import ListPage from "../pages/ListPage";
import TitlePage from "pages/TitlePage";
import CartPage from "pages/CartPage";
import UserPage from "pages/UserPage";


const publicRoutes:any[]=[
    {
        path:"*",
        Component: <TitlePage/>
    },
    {
        path:'/ListPage',
        Component:<ListPage/>
    },
    {
      path:'/CartPage',
      Component:<CartPage/>
    },
    {
      path:'/UserPage',
      Component:<UserPage/>
    },
];
const AppRouter=()=> {
  return (
    <Routes>
      {publicRoutes.map(({path, Component}) =>
        <Route key={path} path={path} element={Component}/>
      )}
      <Route path='*' element={<TitlePage/>} />
    </Routes>
  )
}

export default AppRouter;