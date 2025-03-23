import { useEffect, useState } from 'react'
import TicketCard from './TicketCard';
import styled from 'styled-components';//@ts-ignore
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ITicket } from '../consts/dataType';
import React from 'react';
import { defaultPath } from '../App';

const Wrapper = styled.div`
      display: flex;
      flex-direction: column;
      gap:18px;

      @media (max-width:768px) {
        padding: 0 16px 16px 16px;
      }
`

type IProps = {
  checkedList:CheckboxValueType[],
  activeCurrencies:number
}

const TicketsList = ({checkedList,activeCurrencies}:IProps) =>{
    const [data, setData] = useState<ITicket[]>([]);

    useEffect(() => {
      const params = new URLSearchParams();
      if (checkedList.length > 0) {
        params.append('transfers', checkedList.join(';'));
      }
      if (activeCurrencies !== undefined) {
        params.append('currency', activeCurrencies.toString());
      }
  
      const filter = params.toString() ? `?${params.toString()}` : '';
      fetch(`${defaultPath}tickets${filter}`)
        .then(response => response.json())
        .then(data => setData(data.tickets))
        .catch(error => console.error(error));
    }, [activeCurrencies, checkedList]);

  return (
    <Wrapper>
      {data.map((item)=> <TicketCard data={item} activeCurrencies={activeCurrencies}/>)}
    </Wrapper>
  )
}

export default TicketsList