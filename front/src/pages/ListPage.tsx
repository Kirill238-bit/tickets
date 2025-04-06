import React, { useState } from 'react'
import styled from 'styled-components'
import MenuSort from '../components/MenuSort';
import TicketsList from '../components/TicketsList';
//@ts-ignore
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import MenuSearch from 'components/MenuSearch';
import HotTickets from 'components/HotTickets';
import { Modal } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 5px 30px;
  display: flex;
  gap:16px;
  align-items: stretch;
  width: 10%;
  margin: 2% auto;
  color:#e13a4e;
  border:1px solid #e13a4e;
  cursor:pointer;
`
const ListPage = () => {
      const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
      const [departure,setDeparture] = useState('');
      const [arrive,setArrive] = useState('');
      const [date,setDate] = useState('');
      const [modal,setModal] = useState(false);

  return (
    <Wrapper>
      <Modal title="Горячие предложения" 
        open={modal} 
        destroyOnClose={true}
        footer={null}
        onCancel={()=>setModal(false)}
        width={'50%'}
        height={300}
      >
        <HotTickets/>
      </Modal>
        <h1>Тут покупают лучшие авибилеты</h1>
        <MenuSearch     
          departure={departure}
          arrive={arrive}
          date={date}
          setDeparture={setDeparture}
          setArrive={setArrive}
          setDate={setDate}
        />
        <CardWrapper onClick={()=> setModal(true)}>
          <FireOutlined  style={{color : '#e13a4e',fontSize:'20px'}} /><h4>Горячие предложения</h4>
        </CardWrapper>
        <MainWrapper>
          <MenuSort 
            checkedList={checkedList} 
            setCheckedList={setCheckedList} 
          />
          <TicketsList 
            checkedList={checkedList} 
            departure={departure}
            arrive={arrive}
            date={date}
          />
        </MainWrapper>
    </Wrapper>
  )
}

export default ListPage
