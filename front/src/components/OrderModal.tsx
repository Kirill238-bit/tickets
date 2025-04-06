import { WarningOutlined } from '@ant-design/icons'
import { Form, Input, Result } from 'antd'
import { useContext, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components'
import { Context } from './Context';

export const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
`;

const Wrapper = styled.div<{shake:boolean}>`
    .error{
        color:red;
        animation: ${(props) => (props.shake ? css`${shake} 0.5s` : "none")};
        transition: 0.3s ease-in-out;
        position:relative;
    }
`

type IProps = {
    name:string
    email:string
    setName: React.Dispatch<React.SetStateAction<string>>
    setEmail: React.Dispatch<React.SetStateAction<string>>
    result:{
        bool: null | boolean;
        status: null | string;
    }
    shake:boolean
    save:()=>void
}
const OrderModal = ({name,email,setName,setEmail,result,shake,save}:IProps) => {
    const {isAuth} = useContext(Context)

    useEffect(()=>{
        if(isAuth){
            save()
        }
    },[isAuth])
    
  return (
    <Wrapper shake={shake}>
        {!isAuth ? 
            <Result
                status="warning"
                title="Пожалуйста авторизуйтесь"
            />
        : 
            <Result
                status="success"
                title="Билет успешно забронирован!"
            />
        }
    </Wrapper>
  )
}

export default OrderModal
