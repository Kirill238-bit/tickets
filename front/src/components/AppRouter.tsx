import { Route, Routes } from "react-router-dom";

import React from "react";
import TicketPage from "../pages/TicketPage";
import ListPage from "../pages/ListPage";


const publicRoutes:any[]=[
    {
        path:"*",
        Component: <ListPage/>
    },
    {
        path:'/TicketPage/:id',
        Component: <TicketPage/>
    },
];
const AppRouter=()=> {
  return (
    <Routes>
      {publicRoutes.map(({path, Component}) =>
        <Route key={path} path={path} element={Component}/>
      )}
      <Route path='*' element={<TicketPage/>} />
    </Routes>
  )
}

export default AppRouter;