import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { defaultPath } from 'App';
import OrderModal from 'components/OrderModal';
import { ITicket } from 'consts/dataType';
import { signs } from 'consts/menu';
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatDate } from 'utils/formatDate';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap:5%;
  height:100%;
  margin: 15%;
  background-color: #dedede5b;
  padding:15px 45px;
  border-radius: 12px;
`
const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap:8px;

  h2{
    font-size: 17px;
    line-height: 22px;
    font-weight: 700;
  }
`
const Right = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 30%;
  height:30%;
  background-color: #fff;
  border-radius:8px;
  padding:15px 30px;

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
  }
  h3{
    font-size: 19px;
    line-height: 25px;
    font-weight: 700;
  }
`

const Time = styled.div`
    font-size: 15px;
    line-height: 19px;
    font-weight: 600;
`
const Place = styled.div`
    padding:10px 0;
    font-size: 15px;
    line-height: 19px;
    font-weight: 600;

`
const Date = styled.div`
  font-size: 13px;
  line-height: 17px;
  font-weight: 400;
`

const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 15px 30px;
  align-items: stretch;

 .item{
    display: flex;
    flex-direction: row;
    padding-left: 44px;
    position: relative;
 }
 .item:before{
    border: 4px solid #9ea9b7;
    border-radius: 50%;
    box-sizing: content-box;
    content: "";
    height: 6px;
    left: 10px;
    position: absolute;
    top: 3px;
    width: 6px;
    z-index: 1;
 }
  .item:nth-child(2):before{
    top:17px
  }

 .item:nth-child(1):after{
    background-color: #cdd4de;
    content: "";
    height: 100%;
    left: 16px;
    position: absolute;
    top: 17px;
    width: 2px;
 }
 .item:nth-child(2):after{
    top: -12px;
 }
`

const TicketPage = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const [params] = useSearchParams();
  const [data,setData] = useState({}as ITicket)
  const [orderModal,setOrderModal] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] =useState('')
  const [result,setResult] = useState<{bool:null | boolean,status:null | string}>({bool:null,status:null})
  const [isLoading,setIsLoading] = useState(false)
  const [isShaking,setIsShaking] = useState(false)

  useEffect(() => {
        fetch(`${defaultPath}tickets/${id}?currency=${params.get('currency')}`)
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => console.error(error));
      }, []);

      const save = async() => {
        setIsLoading(true)
        const body = {
            email:email,
            ticketId:id,
            username:name
        }
        try {
          if(!email || !name) throw new Error('Вы не заполнили поля')
          
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
            setResult({bool:true,status:''})
            setTimeout(()=>setOrderModal(false),1000)
          } catch (error:any) {
            setIsShaking(true)
            console.log('Error:', error);
            setResult({bool:false,status:error.toString()})
            setTimeout(()=>setIsShaking(false),500)
          }
          setIsLoading(false)
    }

    const close = () =>{
      setOrderModal(false)
      setIsLoading(false)
      setResult({bool:null,status:''})
      setName('')
      setEmail('')
    }
  
  return (
    data.id &&
    <Wrapper>
      <Modal title="Оплата" 
        okText={'Отправить'} 
        loading={isLoading} 
        confirmLoading={isLoading}
        cancelText={'Отмена'} 
        open={orderModal} 
        onOk={!result.bool ? save : ()=>{}} 
        onCancel={close}
        destroyOnClose={true}
      >
        <OrderModal shake={isShaking} name={name} setName={setName} setEmail={setEmail} email={email} result={result}/>
      </Modal>
      <Left>
        <CardWrapper>
          <h2>{data.stops ? 'Дёшевый тариф' : 'Дорогой тариф'}</h2>
          Количеств пересадок: {data.stops}
        </CardWrapper>
        <br/><br/>
        <CardWrapper>
          <WarningOutlined style={{color : '#faad14',fontSize:'20px'}} /> На дешевом тарифе надо доехать до другого аэропорта
        </CardWrapper>
        <CardWrapper>
        <InfoCircleOutlined  style={{color : '#1677ff',fontSize:'20px'}} /> На дешевом тарифе будет повторная регистрация
        </CardWrapper>
        <h2>{data.origin_name} - {data.destination_name}</h2>
        <CardWrapper>
          <div className='item'>
            <div style={{marginRight:'30px'}}>
              <Time>{data.departure_time}</Time>
              <Date>{formatDate(data.departure_date)}</Date>
            </div>
            <Place>{data.origin_name}</Place>
          </div>
          <div className='item'>
            <div style={{marginRight:'30px'}}>
              <Time>{data.arrival_time}</Time>
              <Date>{formatDate(data.arrival_date)}</Date>
            </div>
            <Place>{data.destination_name}</Place>
          </div>
        </CardWrapper>
      </Left>
      <Right>
        <h3>{data.price} {signs.filter((item:any,index:number)=> Number(params.get('currency')) === index+1 )}</h3>
        <button onClick={()=>setOrderModal(true)}>Купить</button>
      </Right>
    </Wrapper>
    
  )
}

export default TicketPage
