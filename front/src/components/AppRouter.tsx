import { Route, Routes } from "react-router-dom";

import React from "react";
import ListPage from "../pages/ListPage";


const publicRoutes:any[]=[
    {
        path:"/",
        Component: <ListPage/>
    },
   //{
   //     path:'/TicketPage/:id',
   //     Component: <TicketPage/>
   // },
];
const AppRouter=()=> {
  return (
    <Routes>
      {/*publicRoutes.map(({path, Component}) =>
        <Route key={path} path={path} element={Component}/>
      )*/}
      {//<Route path='/TicketPage/:id' element={<IframeTicketPage />} />
}
      <Route path='*' element={<ListPage/>} />
    </Routes>
  )
}

const IframeTicketPage = () => {
  return (
    <iframe
      src={window.location.origin}
      title="Ticket Page"
      width="100%"
      height="600px"
      style={{ border: 'none' }}
    />
  );
};


export default AppRouter;