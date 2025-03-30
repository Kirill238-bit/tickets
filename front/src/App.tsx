import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppRouter from './components/AppRouter';
import { ConfigProvider } from 'antd';
import ruRU from "antd/lib/locale/ru_RU";
import Header from './components/Header'
import { Context } from 'components/Context';
import { ITicket } from 'consts/dataType';

const Wrapper = styled.div`
  max-height:100vh;
  overflow: hidden;
`

export const defaultPath = 'http://localhost:7070/api/'

function App() {
    const [bookedLength,setBookedLength] = useState(0)
    const [bookedMas,setBookedMass] = useState<ITicket[]>([])
    
    useEffect(()=>{
        const storedBookedMas = localStorage.getItem('bookedMas');
        if (storedBookedMas) {
          setBookedLength(JSON.parse(storedBookedMas).length);
          setBookedMass(JSON.parse(storedBookedMas));
        }
    },[])
  return (
    <Context.Provider value={{bookedLength,setBookedLength,bookedMas,setBookedMass}}>
    <ConfigProvider
      theme={{ token: {colorPrimary: `#f47403`} }}
      locale={{...ruRU}}
    >
      <Wrapper>
        <Header bookedLength={bookedLength }/>
        <AppRouter/>
      </Wrapper>
      </ConfigProvider>
      </Context.Provider>
  );
}

export default App;
