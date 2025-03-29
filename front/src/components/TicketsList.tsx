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
      height:80vh;
      overflow: auto;
      @media (max-width:768px) {
        padding: 0 16px 16px 16px;
      }
`

type IProps = {
  checkedList:CheckboxValueType[],
  activeCurrencies:number,
  departure: string;
  arrive: string;
  date: string;
}

const cachedTickets:{[key: string]: ITicket[]} ={}

const TicketsList = ({
  checkedList,
  activeCurrencies,
  departure,
  arrive,
  date,
}:IProps) =>{
    const [data, setData] = useState<ITicket[]>([]);

    useEffect(() => {
      const params = new URLSearchParams();
      if (checkedList.length > 0) {
        params.append('transfers', checkedList.join(';'));
      }
      if (activeCurrencies !== undefined) {
        params.append('currency', activeCurrencies.toString());
      }
      if (departure && arrive && date) {
        params.append('departure', departure);
        params.append('arrive', arrive);
        params.append('date_from', date);
      }
  
      const filter = params.toString() ? `?${params.toString()}` : '';
      const url = `${defaultPath}tickets${filter}`;

      if (cachedTickets[url]) {
        setData(cachedTickets[url]);
      } else {
        fetch(url)
          .then(response => response.json())
          .then(data => {
            setData(data.tickets);
            cachedTickets[url] = data.tickets;
          })
          .catch(error => console.error(error));
      }
      
    }, [activeCurrencies, checkedList, departure, arrive, date]);

  return (
    <Wrapper>
      {!data.length && <h2>К сожалению ничего не найдено{"("}</h2>}
      {data.map((item)=> <TicketCard data={item} activeCurrencies={activeCurrencies}/>)}
    </Wrapper>
  )
}

export default TicketsList