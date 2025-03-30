
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:100vh;
`;

const Title = styled.h1`
    font-size: 44px;
    font-weight: 700;
    line-height: 48px;
    color:#f47403;
    text-align: center;
    margin-bottom: 50px;
`;

const Button = styled.button`
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
`;

const TitlePage = () => {
    const navigate = useNavigate();
  return (
    <Container>
      <Title>Здесь покупают лучшие авиабилеты</Title>
      <Button onClick={()=> navigate("/ListPage")}>Найти билеты</Button>
    </Container>
  );
};

export default TitlePage;