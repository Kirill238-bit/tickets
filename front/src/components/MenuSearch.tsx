import { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { DatePicker, Input } from 'antd';

interface IProps {
    departure: string;
    arrive: string;
    date: string;
    setDeparture: Dispatch<SetStateAction<string>>;
    setArrive: Dispatch<SetStateAction<string>>;
    setDate: Dispatch<SetStateAction<string>>;
  }

const Wrapper = styled.div`
    display: flex;
    border:5px solid #f47403;
    border-radius: 8px;
    background-color: #dedede5b;
    margin: 0 10%;
`
const MenuSearch:FC<IProps> = ({
    departure,
    arrive,
    date,
    setDeparture,
    setArrive,
    setDate,
}) => {

    const dataFilterHandler =(data:any)=>{
        if(!data){
            setDate('')
            return
        }
        const month = data.$M < 10 ? '0' + (data.$M+1) :data.$M+1
        const day = data.$D < 10 ? '0' + data.$D :data.$D
        let dataFrom = `${data.$y}-${month}-${day}`
        setDate(dataFrom)
      }

  return (
    <Wrapper>
        <Input placeholder="Откуда" value={departure} onChange={e=>setDeparture(e.target.value)}/>
        <Input placeholder="Куда" value={arrive} onChange={e=>setArrive(e.target.value)}/>
       <DatePicker 
            format={'DD/MM/YYYY'} 
            placeholder="Когда"
            size="large"
            style={{minWidth:'150px'}}
            onChange={(e)=>{dataFilterHandler(e)}}
        />
    </Wrapper>
  )
}

export default MenuSearch
