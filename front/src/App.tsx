import React from 'react';
import styled from 'styled-components';
import AppRouter from './components/AppRouter';
import { ConfigProvider } from 'antd';
import ruRU from "antd/lib/locale/ru_RU";
const Wrapper = styled.div`
  max-height:100vh;
  overflow: hidden;
`

export const defaultPath = 'http://localhost:7070/api/'

function App() {
  return (
    <ConfigProvider
      theme={{ token: {colorPrimary: `#f47403`} }}
      locale={{...ruRU}}
    >
      <Wrapper>
        <AppRouter/>
      </Wrapper>
      </ConfigProvider>
  );
}

export default App;
