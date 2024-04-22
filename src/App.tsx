import React, { useState } from 'react';
import './App.css';
import TicketsList from './components/TicketsList';
import MenuSort from './components/MenuSort';
import styled from 'styled-components';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const Wrapper = styled.div`
  display: flex;
  gap:10px;
  justify-content: center;
  padding-top: 10%;
  min-height: 100vh;
  width:100%;
  height:100%;
  background-color: #b4adad5b;
`

function App() {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [activeCurrencies,setActiveCurrencies] = useState<number>(0);

  return (
      <Wrapper>
        <MenuSort checkedList={checkedList} setCheckedList={setCheckedList} activeCurrencies={activeCurrencies} setActiveCurrencies ={setActiveCurrencies}/>
        <TicketsList checkedList={checkedList} activeCurrencies={activeCurrencies}/>
      </Wrapper>
  );
}

export default App;
