import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    border-radius: 8px;
    background-color: #dedede5b;
    gap:16px;
    padding: 10px 5%;
    .cart_icon{
        display: inline-block;
        width:30px;
        height:30px;
    }
    .cart_icon:before{
        display: inline-block;
        width:30px;
        height:30px;
        content: url("data:image/svg+xml;charset=UTF-8,%3c?xml version='1.0' ?%3e%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M21.5,15a3,3,0,0,0-1.9-2.78l1.87-7a1,1,0,0,0-.18-.87A1,1,0,0,0,20.5,4H6.8L6.47,2.74A1,1,0,0,0,5.5,2h-2V4H4.73l2.48,9.26a1,1,0,0,0,1,.74H18.5a1,1,0,0,1,0,2H5.5a1,1,0,0,0,0,2H6.68a3,3,0,1,0,5.64,0h2.36a3,3,0,1,0,5.82,1,2.94,2.94,0,0,0-.4-1.47A3,3,0,0,0,21.5,15Zm-3.91-3H9L7.34,6H19.2ZM9.5,20a1,1,0,1,1,1-1A1,1,0,0,1,9.5,20Zm8,0a1,1,0,1,1,1-1A1,1,0,0,1,17.5,20Z' fill='%23f47403'/%3e%3c/svg%3e");
    }
    .number{
        background-color: #f47403;
        color:#fff;  
        font-size:15px;
        height: 16px;
        width:16px;
        text-align: center;
        padding: 2px 2px;
        border-radius: 50%;
        position: absolute;
        top:0;
        right:0;
        transform: translate3d(12px, -5px, 0);
    }

    .user_icon{
        display: inline-block;
        width:30px;
        height:30px;
    }
    .user_icon:before{
        display: inline-block;
        width:30px;
        height:30px;
        content: url("data:image/svg+xml;charset=UTF-8,%3c?xml version='1.0' ?%3e%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z' fill='%23f47403'/%3e%3c/svg%3e");
    }

` 
type IProps={
    bookedLength:number
}
const Header = ({bookedLength}:IProps) => {
    const navigate = useNavigate()
  return (
    <Wrapper>
        <div className='user_icon' onClick={()=> navigate('/UserPage')}/>
        <div onClick={()=> navigate('/CartPage')} style={{position:'relative',cursor:'pointer'}}>
            <div className='cart_icon'/>
            {bookedLength ? <div className='number'>{bookedLength}</div> : <></>}
        </div>
    </Wrapper>
  )
}

export default Header
