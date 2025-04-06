import { defaultPath } from 'App';
import { ITicket } from 'consts/dataType';
import { useEffect, useState } from 'react'
import TicketCard from './TicketCard';
import styled from 'styled-components';

const Wrapper =styled.div`
      display: flex;
      flex-direction: column;
      gap:16px;
      height:70vh;
      overflow: auto;
`

const HotTickets = () => {
        const [data, setData] = useState<ITicket[]>([]);
    
        useEffect(() => {

          const url = `${defaultPath}tickets`;
    
            fetch(url)
              .then(response => response.json())
              .then(data => {
                setData(data.tickets.sort((a:ITicket,b:ITicket)=> a.price - b.price).slice(0,5));
              })
              .catch(error => console.error(error));
          
        }, []);
  return (
    <Wrapper>
      {data.map((item)=> <TicketCard border={true} key={item.id} cart={false} data={item}/>)}
    </Wrapper>
  )
}

export default HotTickets
