import { Context } from 'components/Context'
import TicketCard from 'components/TicketCard'
import { ITicket } from 'consts/dataType'
import React, { useContext } from 'react'
import styled from 'styled-components'

const Wrapper =styled.div`
    display: flex;
    flex-direction: column;
    gap:16px;
    height:95vh;
    overflow: auto;
`
const CartPage = () => {
     const {bookedMas} = useContext(Context)
  return (
    <Wrapper>
     {bookedMas.map((item:ITicket)=> <TicketCard key={item.id} cart={true} data={item}/>)}
    </Wrapper>
  )
}

export default CartPage
