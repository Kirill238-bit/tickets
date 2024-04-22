import { FC } from 'react'
import { formatDate } from '../utils/formatDate'
import { formatStops } from '../utils/formatStops'
import styled from 'styled-components'
import { formatPrice } from '../utils/formatPrice'
import { signs } from '../consts/menu'
import { ITicket } from '../consts/dataType'

interface IProps{
    data:ITicket
    activeCurrencies:number
}

const Wrapper = styled.div`
    background-color: #fff;
    display: flex;
    border-radius: 10px;
`

const LeftSide = styled.div`
    display: flex;
    flex-direction: column;
    border-right: 0.5px solid #c6c3c3;
    padding:20px;
    button{
        border: none;
        background-color: #f47403;
        padding: 12px 24px;
        border-radius: 5px;

    }
`

const RightSide = styled.div`
    display: flex;
    padding:20px;
    gap: 10px;
`

const Departure = styled.div`
    display: flex;
    flex-direction: column;
    gap:4px;
`
const Arrival = Departure

const Center = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Time = styled.div`
    font-size: 44px;
`
const Place = styled.div`
    font-size: 15px;
`
const Date = styled.div`
    font-size: 14px;
    font-weight: 300;
`
const Line = styled.div`
    display: flex;
    .hor{
        margin-top: 14px;
        height: 1px;
        min-width:80px;
        background: black;
    }
    svg{
        margin-top: 5px;
        height: 20px;
    }
`

const TicketCard:FC<IProps> = ({data,activeCurrencies}) => {
  return (
    <Wrapper>
        <LeftSide>
            <img
                src='/logo.png'
                alt='логотип компании'
                width='120px'
            />
            <button>Купить за {formatPrice(data.price)} {signs.filter((item:any,index:number)=> activeCurrencies === index )}</button>
        </LeftSide>
        <RightSide>
            <Departure>
                <Time>{data.departure_time}</Time>
                <Place>{data.origin},{data.origin_name}</Place>
                <Date>{formatDate(data.departure_date)}</Date>
            </Departure>
            <Center>
                <Date>{formatStops(data.stops)}</Date>
                <Line>
                    <div className='hor'></div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg>
                </Line>
            </Center>
            <Arrival>
                <Time>{data.arrival_time}</Time>
                <Place>{data.destination_name},{data.destination}</Place>
                <Date>{formatDate(data.arrival_date)}</Date>
            </Arrival>
        </RightSide>
    </Wrapper>
  )
}

export default TicketCard