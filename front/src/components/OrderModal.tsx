import { WarningOutlined } from '@ant-design/icons'
import { Form, Input, Result } from 'antd'
import styled, { css, keyframes } from 'styled-components'

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
}
const OrderModal = ({name,email,setName,setEmail,result,shake}:IProps) => {

    
  return (
    <Wrapper shake={shake}>
        {!result.bool ? 
            <>
                <Form.Item label="Имя">
                    <Input value={name} onChange={e=>setName(e.target.value)}/>
                </Form.Item>
                <Form.Item label="email">
                    <Input value={email} onChange={e=>setEmail(e.target.value)}/>
                </Form.Item>
               {result.bool === false ?  <div className="error"><WarningOutlined /> {result.status?.slice(6)}</div>  : ''}
            </>
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
