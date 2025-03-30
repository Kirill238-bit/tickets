import { Route, Routes } from "react-router-dom";

import React from "react";
import TicketPage from "../pages/TicketPage";
import ListPage from "../pages/ListPage";
import TitlePage from "pages/TitlePage";
import CartPage from "pages/CartPage";


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