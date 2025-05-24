import { Button, Form, Input, Result } from 'antd'
import { defaultPath } from 'App'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  gap:5%;
  height:100vh;
  background-color: #dedede5b;
  padding:45px 15%;
  border-radius: 12px;
`

const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 15px 30px;
  align-items: stretch;
  h2{
    text-align: center;
    font-size: 22px;
    line-height: 22px;
    font-weight: 700;
    color:#f47403;
  }
  h3{
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
  }
`
const CancelPage = () => {
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const [step,setStep] = useState(1)
    const [status,setStatus] = useState<boolean | null>(null)
    const [email,setEmail] = useState('')

    const cancelHandler = async ( ) => {
        setStep(2)
        if(!email || !id) return setStatus(false)
        try{
            const response = await fetch(`${defaultPath}tickets/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, ticketId:id}),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`${JSON.parse(errorText).error}`);
            }else{
                setStatus(true)
            }
            
        }
        catch{
            setStatus(false)
        }
    }

    console.log(status)
  return (
    <Wrapper>
        {step === 1 ? 
            <CardWrapper>
                <h2>Возврат авиа-билета</h2>
                <h3>Пожалуйста введите свой email</h3>
                <Form.Item label="email">
                    <Input value={email} onChange={e=>setEmail(e.target.value)}/>
                </Form.Item>
                <Button disabled={!email} type="primary" onClick={cancelHandler}>Далее</Button>
            </CardWrapper>
        : step === 2 && status ?
            <Result
                status="success"
                title="Билет отменен!"
                subTitle="Закройте данную страницу"
            />
        :
            <Result
                status="error"
                title="Произошла ошибка"
                subTitle='Попробуйте заново немного позже'
            />
        }
    </Wrapper>
  )
}

export default CancelPage
