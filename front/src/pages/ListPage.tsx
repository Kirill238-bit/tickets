import React, { useState } from 'react'
import styled from 'styled-components'
import MenuSort from '../components/MenuSort';
import TicketsList from '../components/TicketsList';
//@ts-ignore
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
const ListPage = () => {
      const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
      const [activeCurrencies,setActiveCurrencies] = useState<number>(1);
      
  return (
    <Wrapper>
        <MenuSort checkedList={checkedList} setCheckedList={setCheckedList} activeCurrencies={activeCurrencies} setActiveCurrencies ={setActiveCurrencies}/>
        <TicketsList checkedList={checkedList} activeCurrencies={activeCurrencies}/>
    </Wrapper>
  )
}

export default ListPage
