import React, { useState } from 'react';
import TicketsList from './components/TicketsList';
import MenuSort from './components/MenuSort';
import styled from 'styled-components';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const Wrapper = styled.div`
  display: flex;
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
  }
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
