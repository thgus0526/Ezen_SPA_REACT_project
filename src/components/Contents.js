import React from 'react';
import TrafficList from './TrafficList';
import styled from 'styled-components';
import Detail from './Detail';

const ContentsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh; /* 화면 높이를 전체로 설정 */
  box-sizing: border-box;
`;

const TrafficListWrapper = styled.div`
  margin-left: 70px;
  width: 60%;
  padding: 20px; /* 여백 추가 */
  box-sizing: border-box;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  margin-top: 50px;
`;

const RightContentsWrapper = styled.div`
  position: relative;
  width: 40%;
  height: 100vh;
  padding: 20px; /* 여백 추가 */
  box-sizing: border-box;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  border-left: 1px solid #ddd; /* 구분선 추가 */
  margin-top: 50px;
`;

const Contents = () => {
  return (
    <ContentsWrapper>
      <TrafficListWrapper>
        <TrafficList />
      </TrafficListWrapper>
      <RightContentsWrapper>
        <Detail />
      </RightContentsWrapper>
    </ContentsWrapper>
  );
};

export default Contents;
