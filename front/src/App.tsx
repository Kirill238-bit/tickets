import React from 'react';
import styled from 'styled-components';
import AppRouter from './components/AppRouter';
import { ConfigProvider } from 'antd';

const Wrapper = styled.div`
 /* display: flex;
  gap:5%;
  justify-content: center;
  overflow: hidden;
  min-height: 100vh;
  padding-top: 10%;
  width:100%;
  height:100%;
  background-color: #dedede5b;
  @media (max-width:768px) {
    flex-direction: column;
    padding-top: 0;
    gap:15px;
  }*/
`

export const defaultPath = 'http://localhost:7070/api/'

function App() {
  return (
    <ConfigProvider
      theme={{ token: {colorPrimary: `#f47403`} }}
    >
      <Wrapper>
        <AppRouter/>
      </Wrapper>
      </ConfigProvider>
  );
}

export default App;
