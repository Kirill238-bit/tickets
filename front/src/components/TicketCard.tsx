import { FC, useContext, useEffect, useState } from 'react'
import { formatDate } from '../utils/formatDate'
import { formatStops } from '../utils/formatStops'
import styled from 'styled-components'
import { formatPrice } from '../utils/formatPrice'
import { signs } from '../consts/menu'
import { ITicket } from '../consts/dataType'
import OrderModal from './OrderModal'
import { message, Modal } from 'antd'
import { defaultPath } from 'App'
import { Context } from './Context'
import { FireOutlined } from '@ant-design/icons'

interface IProps{
    data:ITicket,
    cart:boolean,
    border?:boolean,
    buy?:boolean,
    getTickets?:(user:any)=>void
}

const Wrapper = styled.div<{active:boolean,border?:boolean}>`
    background-color: #fff;
    position: relative;
    display: flex;
    border-radius: 10px;
    justify-content: center;
    @media (max-width:768px) {
        flex-direction: column;
    }
    border:${props => props.border ? '1px solid #e13a4e' : ''};

    .heart_icon:before{
        display: inline-block;
        position:absolute;
        cursor:pointer;
        top:0;
        right:0;
        transform: translate3d(-10px, 10px, 0);
        width:30px;
        height:30px;
        content: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M20.16,5A6.29,6.29,0,0,0,12,4.36a6.27,6.27,0,0,0-8.16,9.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Zm-1.41,7.46-6.21,6.21a.76.76,0,0,1-1.08,0L5.25,12.43a4.29,4.29,0,0,1,0-6,4.27,4.27,0,0,1,6,0,1,1,0,0,0,1.42,0,4.27,4.27,0,0,1,6,0A4.29,4.29,0,0,1,18.75,12.43Z' fill='%23${props => !props.active ? '000000' : 'f47403'}'/%3e%3c/svg%3e");
    }
`

const LeftSide = styled.div`
    display: flex;
    flex-direction: column;
    padding:5px 20px 5px 0;
    button{
        border: none;
        color:#fff;
        background-color: #f47403;
        padding: 15px 30px;
        border-radius: 12px;
        cursor:pointer;
        font-size: 15px;
        line-height: 19px;
        font-weight: 600;
        &:hover {
            background-color: #ffa455;
            transition: 0ms.5;
        }
    }

    @media (max-width:768px) {
        padding:6px;
        align-items:center;
        button{
            text-wrap:nowrap;
            padding:8px 14px;
        }
    }
`

const RightSide = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding:20px 10px;
    gap: 10px;
    @media (max-width:768px) {
        padding:6px;
        justify-content:center;
    }
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
    justify-content: center;
`
const Time = styled.div`
    font-size: 24px;

    @media (max-width:768px) {
        font-size: 24px;
    }
`
const Place = styled.div`
    font-size: 15px;
        @media (max-width:768px) {
        font-size: 13px;
    }
`
const Datee = styled.div`
    font-size: 14px;
    font-weight: 300;
    @media (max-width:768px) {
        font-size: 13px;
    }
`
const Line = styled.div`
    display: flex;
    .hor{
        margin-top: 14px;
        height: 1px;
        min-width:80px;
        background: black;
        @media (max-width:768px) {
            min-width:20px;
        }
    }
    span{
        margin-top: 5px;
        height: 20px;
    }
`

const TicketCard:FC<IProps> = ({data,cart,border,buy,getTickets}) => {
      const [orderModal,setOrderModal] = useState(false)
      const [name,setName] = useState('')
      const [email,setEmail] =useState('')
      const [result,setResult] = useState<{bool:null | boolean,status:null | string}>({bool:null,status:null})
      const [isLoading,setIsLoading] = useState(false)
      const [isShaking,setIsShaking] = useState(false)
      const {setBookedLength,bookedMas,setBookedMass,isAuth} = useContext(Context)
      const [timeLeft, setTimeLeft] = useState<number | null>(null);
      
      useEffect(() => {
        const timerId = setInterval(() => {
            const startTime = localStorage.getItem(`timer-${data.id}`);
            if (startTime) {
                const elapsed = Date.now() - parseInt(startTime, 10);
                const remaining = 15 * 60 * 1000 - elapsed;
                if (remaining <= 0) {
                    setBookedMass((prev:any) => {
                        const updatedBookedMas = prev.filter((ticket: any) => ticket.id !== data.id);
                        localStorage.setItem('bookedMas', JSON.stringify(updatedBookedMas));
                        return updatedBookedMas;
                    });
                    localStorage.removeItem(`timer-${data.id}`);
                    setTimeLeft(null);
                } else {
                    setTimeLeft(remaining);
                }
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [data.id, setBookedMass]);

          const save = async() => {
            setIsLoading(true)
            if (!isAuth) return 

            const parsedData = JSON.parse(localStorage.getItem('userData') || '');

            const body = {
                email:parsedData.email,
                ticketId:data.id,
                username:parsedData.username
            }
            try {
             // if(!email || !name) return message.error('Вы не заполнили поля')
              
                const response = await fetch(`${defaultPath}tickets/book`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body),
                });
    
                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`${JSON.parse(errorText).error}`);
                }
                
            
                await response.json();
                setResult({bool:true,status:''});
                setTimeout(()=>{
                  setResult({bool:null,status:''});
                  setOrderModal(false);
                },1000);
              } catch (error:any) {
                setIsShaking(true);
                console.log('Error:', error);
                setResult({bool:false,status:error.toString()});
                setTimeout(()=>setIsShaking(false),500);
              }
              setIsLoading(false);
        }
    
        const close = () =>{
          setOrderModal(false)
          setIsLoading(false)
          setResult({bool:null,status:''})
          setName('')
          setEmail('')
        }

        const cancelHandler =async () => {
            try {
                await fetch(`${defaultPath}bookings/cancel`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },//@ts-ignore
                    body: JSON.stringify({"booking_id": data.booking_id}),
                  });
                  const parsedData = JSON.parse(localStorage.getItem('userData') || '');//@ts-ignore
                  getTickets(parsedData)
            }catch{
                message.error("Произошла ошибка")
            }
        }

        const handleHeartIconClick = () => {
            setBookedMass((prev:any) => {
                const isAlreadyBooked = prev.some((ticket:any) => ticket.id === data.id);
                const updatedBookedMas = isAlreadyBooked 
                    ? prev.filter((ticket:any) => ticket.id !== data.id) 
                    : [...prev, data];
    
                if (!isAlreadyBooked) {
                    localStorage.setItem(`timer-${data.id}`, Date.now().toString());
                } else {
                    localStorage.removeItem(`timer-${data.id}`);
                }
    
                localStorage.setItem('bookedMas', JSON.stringify(updatedBookedMas));
                setBookedLength(updatedBookedMas.length)
                return updatedBookedMas;
            });
        }
  return (
    <>
    <Modal title="Оплата" 
    //okText={'Отправить'} 
    loading={isLoading} 
    confirmLoading={isLoading}
    //cancelText={'Отмена'} 
    open={orderModal} 
    //onOk={!result.bool ? save : ()=>{}} 
    onCancel={close}
    destroyOnClose={true}
    footer={null}
  >
    <OrderModal save={save} shake={isShaking} name={name} setName={setName} setEmail={setEmail} email={email} result={result}/>
  </Modal>
    <Wrapper active={bookedMas.some((ticket:any) => ticket.id === data.id)} border={border}>
        <LeftSide>
            <img
                src='/logo.png'
                alt='логотип компании'
                width='180px'
            />
            {buy !== false && <button onClick={()=>setOrderModal(true)}>Купить за {formatPrice(data.price)} {signs[10]}</button>}
            {buy === false && <button onClick={cancelHandler}>Отменить</button>}
        </LeftSide>
        <RightSide>
            <Departure>
                <Time>{data.departure_time}</Time>
                <Place>{data.origin},{data.origin_name}</Place>
                <Datee>{formatDate(data.departure_date)}</Datee>
            </Departure>
            <Center>
                <Datee>{formatStops(data.stops)}</Datee>
                <Line>
                    <div className='hor'/>
                    <span>{">"}</span>
                </Line>
            </Center>
            <Arrival>
                <Time>{data.arrival_time}</Time>
                <Place>{data.destination_name},{data.destination}</Place>
                <Datee>{formatDate(data.arrival_date)}</Datee>
            </Arrival>
        </RightSide>
        {buy !== false && <div className='heart_icon' onClick={handleHeartIconClick}/>}
        {cart && timeLeft !== null && (
                <div style={{ position: 'absolute', top: '48px', right: '10px', fontSize: '15px', color: '#f47403' }}>
                    {`Бронь закончиться через: ${Math.floor(timeLeft / 60000)}:${Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0')}`}
                </div>
            )}
        {border &&  (
                <div style={{ position: 'absolute', top: '18px', left: '10px' }}>
                    <FireOutlined  style={{color : '#e13a4e',fontSize:'32px'}} />
                </div>
            )}
    </Wrapper>
    </>
  )
}

export default TicketCard