import { Button, Input, message } from 'antd'
import Form from 'antd/es/form/Form'
import { defaultPath } from 'App'
import { Context } from 'components/Context'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

const Wrapper =styled.div`
    display: flex;
    flex-direction: column;
    gap:16px;
    height:95vh;
    overflow: auto;
    max-width: 50vw;
    margin: 35px 30px;
`
const UserPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [userData, setUserData] = useState<any>();
    const {setIsAuth} = useContext(Context)

    useEffect(() => {
      const storedUserData = localStorage.getItem('userData');
       if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setEmail(parsedData.email)
        setNumber(parsedData.phone_number)
        setName(parsedData.username)
      } 
    }, []);
  
    const createUser = () => {
      const url = `${defaultPath}users/create`;
      const userrData = { username:name, email, phone_number:number };
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userrData),
      })
        .then(response => response.json())
        .then(data => {
            if(data.error) throw new Error('bla')
          console.log('User created:', data);
          localStorage.setItem('userData', JSON.stringify(data.user));
          setUserData(data.user)
          message.success('Пользователь успешно добавлен')
          setIsAuth(true)
        })
        .catch(error =>{ 
          console.error('Error creating user:', error)
          message.error('Произошла ошибка')
        });
    };
  
    const updateUser = () => {
      const url = `${defaultPath}users/update`;

      const userrData = { user_id:userData.id,username:name, email, phone_number:number };
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userrData),
      })
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
        .then(data => {
          console.log('User updated:', data);
          localStorage.setItem('userData', JSON.stringify(userrData));
          message.success('Пользователь успешно изменен')
          setIsAuth(true)
        })
        .catch(error => {
          console.error('Error updating user:', error)
          message.error('Произошла ошибка')
        });
    };
  
    return (
      <Wrapper>
        <Form>
                <Input value={name} onChange={(e) => setName(e.target.value)} addonBefore="Имя" /><br/><br/>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} addonBefore="Email" /><br/><br/>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} addonBefore="Номер телефона" /><br/><br/>
        </Form>
        <Button type='primary'  onClick={userData ? () => updateUser() : () => createUser()}>Сохранить</Button>
      </Wrapper>
    );
  };
  
  export default UserPage;
