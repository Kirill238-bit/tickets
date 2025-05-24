import { Button, Input, message, Upload, UploadProps } from 'antd'
import Form from 'antd/es/form/Form'
import { defaultPath } from 'App'
import { Context } from 'components/Context'
import TicketCard from 'components/TicketCard'
import { ITicket } from 'consts/dataType'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { saveAs } from 'file-saver';
import { UploadOutlined } from '@ant-design/icons'

const Wrapper =styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:16px;
    height:95vh;
    overflow: auto;
    //max-width: 50vw;
    margin: 35px 30px;
`
const Wrapper2 = styled.div`
   display: flex;
    gap:16px;
    height:400px;
    overflow: auto;
`
const Wrapper3 = styled.div`
   display: flex;
    flex-direction: column;
    gap:16px;
    height: 100%;
    overflow: auto;
    //max-width: 50vw;
    margin-bottom: 60px;
    //margin: 35px 30px;
`
const UserPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [userData, setUserData] = useState<any>();
    const {setIsAuth} = useContext(Context)
    const [data, setData] = useState<ITicket[]>([]);

    useEffect(() => {
      const storedUserData = localStorage.getItem('userData');
       if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        getTickets(parsedData)
        setUserData(parsedData);
        setEmail(parsedData.email)
        setNumber(parsedData.phone_number)
        setName(parsedData.username)
      } 
    }, []);

    const getTickets = (user:any) => {
      console.log(user)
      const url = `${defaultPath}users/${user.user_id}/tickets`;
      fetch(url).then(response => response.json())
      .then(data => {
          setData(data.tickets.sort((a:ITicket,b:ITicket)=> a.price - b.price).slice(0,5));
      })
    }
  
    const createUser = () => {
      const url = `${defaultPath}users/create`;
      const userrData = { username:name, email, phone_number:number };
      if(!email || !name){
         message.error('Вы не заполнили поля')
         return
      }
      if(!email.includes('@')) {
        message.error('Неверный формат email. Email должен содержать @')
        return
      }
      
      if(!number.startsWith('7') || number.length < 11) {
        message.error('Неверный формат номера телефона. Номер должен начинаться с 7 и содержать 11 цифр')
        return
      }
      
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
          message.error(error.error || 'Произошла ошибка')
        });
    };
  
    const updateUser = () => {
      const url = `${defaultPath}users/update`;

      const userrData = { user_id:userData.user_id,username:name, email, phone_number:number };
  
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

    const exportToXML = () => {
      if (data.length === 0) {
        message.warning('Нет билетов для экспорта');
        return;
      }
    
      // Создаем XML структуру
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<tickets>\n';
      
      data.forEach(ticket => {
        xml += '  <ticket>\n';
        xml += `    <id>${ticket.id}</id>\n`;
        xml += `    <origin>${ticket.origin}</origin>\n`;
        xml += `    <origin_name>${ticket.origin_name}</origin_name>\n`;
        xml += `    <destination>${ticket.destination}</destination>\n`;
        xml += `    <destination_name>${ticket.destination_name}</destination_name>\n`;
        xml += `    <departure_date>${ticket.departure_date}</departure_date>\n`;
        xml += `    <departure_time>${ticket.departure_time}</departure_time>\n`;
        xml += `    <arrival_date>${ticket.arrival_date}</arrival_date>\n`;
        xml += `    <arrival_time>${ticket.arrival_time}</arrival_time>\n`;
        xml += `    <carrier>${ticket.carrier}</carrier>\n`;
        xml += `    <stops>${ticket.stops}</stops>\n`;
        xml += `    <price>${ticket.price}</price>\n`;//@ts-ignore
        xml += `    <booking_date>${ticket.booking_date}</booking_date>\n`;
        xml += '  </ticket>\n';
      });
      
      xml += '</tickets>';
    
      // Создаем Blob и скачиваем файл
      const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
      saveAs(blob, `my_tickets_${new Date().toISOString().slice(0, 10)}.xml`);
    };

    const handleImportTicket = async (options: any) => {
      const { file, onSuccess, onError } = options;
      
      // Проверка типа файла на фронтенде
      if (file.type !== 'text/plain') {
          message.error('Разрешены только TXT файлы');
          return;
      }

      // Проверка размера файла
      if (file.size > 1024) {
          message.error('Файл слишком большой (макс. 1KB)');
          return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
          try {
              const content = e.target?.result as string;
              const ticketId = content.trim();
              
              // Проверяем, что файл содержит только один числовой ID
              if (!/^\d+$/.test(ticketId)) {
                  message.error('Файл должен содержать только один числовой ID билета');
                  return
              }

              const formData = new FormData();
              formData.append('ticket_file', file);
              formData.append('user_id', userData.user_id);

              const response = await fetch(`${defaultPath}tickets/import`, {
                  method: 'POST',
                  body: formData,
              });

              const data = await response.json();

              if (!response.ok) {
                message.error(data.error || 'Ошибка импорта билета');
                return
              }

              message.success(data.message);
              getTickets(userData); // Обновляем список билетов
              onSuccess(null, file);
          } catch (error) {//@ts-ignore
              message.error(error.message || 'Ошибка при обработке файла');
              onError(error);
              
          }
      };
      reader.readAsText(file);
  };

  const uploadProps: UploadProps = {
      name: 'ticket_file',
      multiple: false,
      //accept: '.txt',
      customRequest: handleImportTicket,
      showUploadList: false,
      beforeUpload: (file) => {
          const isTxt = file.type === 'text/plain';
          if (!isTxt) {
              message.error('Вы можете загрузить только TXT файл!');
              return Upload.LIST_IGNORE;
          }
          return true;
      },
      onChange(info) {
           if (info.file.status === 'error') {
              message.error(`${info.file.name} - ошибка обработки файла`);
          }
      },
  };
  
    return (
      <Wrapper>
        <Wrapper2>
          <div>
            <Form>
                <Input value={name} onChange={(e) => setName(e.target.value)} addonBefore="Имя" /><br/><br/>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} addonBefore="Email" /><br/><br/>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} addonBefore="Номер телефона" /><br/><br/>
            </Form>
            <Button type='primary'  onClick={userData ? () => updateUser() : () => createUser()}>Сохранить</Button>
          </div>
        <div>
          <h3>Твоя покупка затерялась? Загрузи билет.</h3>
          <p style={{ fontSize: '12px', color: '#888' }}>
              Файл txt должен содержать идендификатор билета только
          </p>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
        </div>
        </Wrapper2>
        <div style={{display:'flex', alignItems:'center',gap:'16px'}}> 
          <h2>Купленные билеты</h2>
          <Button onClick={exportToXML}>Выгрузить билеты</Button>
        </div>
        <Wrapper3>
              {data.map((item)=> <TicketCard key={item.id} cart={false} data={item} buy={false} getTickets={getTickets}/>)}
        </Wrapper3>
      </Wrapper>
    );
  };
  
  export default UserPage;
