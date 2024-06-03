import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { DetailPage } from '../reducer/DetailPage';

const BasicList = styled.ul`
  width: 700px;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  border: 1px solid #373f51;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: #f8f9fa;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ListItem = styled.li`
  width: 25%;
  text-align: center;
`;

const TrafficListItem = ({ item }) => {
  const dispatch = useDispatch();
  const {
    roadName,
    eventType,
    eventDetailType,
    startDate,
    message,
    coordY,
    coordX,
  } = item;

  const DetailPageMethod = (item) => {
    const obj = {
      isRoad: item.roadName,
      isDate: item.startDate,
      isType: item.eventType,
      isMessage: item.message,
      isCoordX: item.coordX,
      isCoordY: item.coordY,
    };
    dispatch(DetailPage(obj));
  };

  const onClick = (e) => {
    e.preventDefault();
    DetailPageMethod(item);
    console.log(item);
  };

  const getKoreanDate = (date) => {
    const year = date.substr(2, 2);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    const time = date.substr(8, 2);
    const minute = date.substr(10, 2);
    return `${year}/${month}/${day} ${time}:${minute}`;
  };

  const roadName2 = item.roadName === '' ? `도로명 없음` : item.roadName;
  const eventDetailType2 =
    item.eventDetailType === '' ? `상세정보없음` : item.eventDetailType;
  return (
    <>
      <BasicList onClick={onClick}>
        <ListItem>{roadName2}</ListItem>
        <ListItem>{eventType}</ListItem>
        <ListItem>{eventDetailType2}</ListItem>
        <ListItem>{getKoreanDate(startDate)}</ListItem>
      </BasicList>
    </>
  );
};

export default TrafficListItem;
