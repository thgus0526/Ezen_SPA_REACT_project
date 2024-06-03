import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Chart from './Chart';

// 사이드바에 들어갈 메뉴
// text : 화면에보일 한글
// name : 실제 동작할 데이터 영문
const sideBarMenu = [
  {
    name: 'all',
    text: '전체보기',
  },
  {
    name: 'cor', // construct - 공사
    text: '공사',
  },
  {
    name: 'acc', // accident - 사고
    text: '교통사고',
  },
  {
    name: 'wea', // weather - 기상
    text: '기상',
  },
  {
    name: 'dis', // disaster - 재난
    text: '재난',
  },
  {
    name: 'ete', // ete - 기타돌발
    text: '기타돌발',
  },
  {
    name: 'etc', // etc - 기타
    text: '기타',
  },
];

const SideBarMenuBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 250px;
  margin-top: 67px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #f8f9fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;
const Side = styled(NavLink)`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;

  &:hover {
    color: #666666;
  }

  &.active {
    font-weight: 600;
    border-left: 4px solid #22b8cf;
    color: #22b8cf;
    padding-left: 1rem;
    &:hover {
      color: #3bc9db;
    }
  }

  & + & {
    margin-top: 1rem;
  }
`;
const Content = styled.div`
  margin-left: 200px; /* Sidebar width */
  padding: 1rem;
  flex: 1;
`;

const SideBar = ({ data }) => {
  const { category } = useParams();
  return (
    <>
      <SideBarMenuBlock>
        {sideBarMenu.map((s) => (
          <Side
            key={s.text}
            to={
              category === undefined
                ? `/전체/${s.text}`
                : `/${category}/${s.text}`
            }
            className={
              s.text === '전체보기' && category === undefined ? 'active' : ''
            }
          >
            {s.text}
          </Side>
        ))}
        <Chart data={data} />
      </SideBarMenuBlock>
      <Content></Content>
    </>
  );
};

export default SideBar;
