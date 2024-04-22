import { useEffect, useState } from 'react'
import TicketCard from './TicketCard';
import styled from 'styled-components';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ITicket } from '../consts/dataType';

const Wrapper = styled.div`
      display: flex;
      flex-direction: column;
      gap:18px;
`

const TicketsList = ({checkedList,activeCurrencies}:{checkedList:CheckboxValueType[],activeCurrencies:number}) =>{
    const [data, setData] = useState<ITicket[]>([]);

  useEffect(() => {
    fetch('tickets.json')
      .then(response => response.json())
      .then(data => setData(data.tickets))
      .catch(error => console.error(error));
  }, []);

  return (
    <Wrapper>
      {!checkedList.length && data.map((item)=>{
          return (
            <TicketCard data={item} activeCurrencies={activeCurrencies}/>
          )
      })}
        {data.filter((item)=> checkedList.includes(item.stops)).map((item)=>{
            return (
                <TicketCard data={item} activeCurrencies={activeCurrencies}/>
            )
        })}
    </Wrapper>
  )
}

export default TicketsList