import React, { useState } from 'react'
import styled from 'styled-components'
import MenuSort from '../components/MenuSort';
import TicketsList from '../components/TicketsList';
//@ts-ignore
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import MenuSearch from 'components/MenuSearch';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2%;
  background-color: #dedede5b;
  h1{
    font-size: 44px;
    font-weight: 700;
    line-height: 48px;
    color:#f47403;
    text-align: center;
    margin-bottom: 50px;
  }
`
const MainWrapper = styled.div`
    display: flex;
    gap:5%;
    justify-content: center;
    overflow: hidden;
    width:100%;
    height:100%;
    @media (max-width:768px) {
      flex-direction: column;
      padding-top: 0;
      gap:15px;
    }
`
const ListPage = () => {
      const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
      const [activeCurrencies,setActiveCurrencies] = useState<number>(1);
      const [departure,setDeparture] = useState('');
      const [arrive,setArrive] = useState('');
      const [date,setDate] = useState('');

  return (
    <Wrapper>
      <h1>Тут покупают лучшие авибилеты</h1>
        <MenuSearch     
          departure={departure}
          arrive={arrive}
          date={date}
          setDeparture={setDeparture}
          setArrive={setArrive}
          setDate={setDate}
        />
        <MainWrapper>
          <MenuSort 
            checkedList={checkedList} 
            setCheckedList={setCheckedList} 
            activeCurrencies={activeCurrencies} 
            setActiveCurrencies={setActiveCurrencies}
          />
          <TicketsList 
            checkedList={checkedList} 
            activeCurrencies={activeCurrencies}
            departure={departure}
            arrive={arrive}
            date={date}
          />
        </MainWrapper>
    </Wrapper>
  )
}

export default ListPage
