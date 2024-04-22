import { Checkbox, CheckboxProps } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { currency, plainOptions } from '../consts/menu';

interface IProps{
    checkedList: CheckboxValueType[]
    setCheckedList: React.Dispatch<React.SetStateAction<CheckboxValueType[]>>
    activeCurrencies: number
    setActiveCurrencies: React.Dispatch<React.SetStateAction<number>>
}

const CheckboxGroup = Checkbox.Group;

const Title = styled.h4` 
`
const Wrapper = styled.div`
    display:block;
    width:13%;
    padding:15px;
    height:13%;
    background-color: #fff;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
`

const Currencies = styled.div`
    border: 1px solid #1256e8;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
`

const Item = styled.div<{active:boolean}>`
    color:${props => props.active ? '#fff' : '#3c7bf7' };
    background-color: ${props => props.active ? '#3c7bf7' : '#fff' };
    transition: 0.5s;
    width:100%;
    padding:8px;
    text-align:center;
    cursor: pointer;

    &:hover {
        background-color: #cfe2ff;
        color: #3c7bf7;
    }

`
const MenuSort:FC<IProps> = ({checkedList, setCheckedList,activeCurrencies,setActiveCurrencies}) => {

    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setCheckedList(e.target.checked ? plainOptions.map((item)=> item.value) : []);
    };

  return (
    <Wrapper>
        <div>
            <Title>Валюта</Title>
            <Currencies>
                {currency.map((item,index)=>{
                    return (
                        <Item active={Boolean(index === activeCurrencies)} onClick={()=>setActiveCurrencies(index)}>{item}</Item>
                )})}
            </Currencies>
        </div>
        <div>
            <Title>Количество пересадок</Title>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Все
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        </div>
    </Wrapper>
  )
}

export default MenuSort