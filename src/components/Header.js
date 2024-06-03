import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const categories = [
  {
    name: 'all',
    text: '전체',
  },
  {
    name: 'ex',
    text: '고속도로',
  },
  {
    name: 'its',
    text: '국도',
  },
  {
    name: 'loc',
    text: '지방도',
  },
  {
    name: 'etc',
    text: '시군도',
  },
];

const CategoriesBlock = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
  position: fixed;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: #dddddd;
  }
`;

const Category = styled(NavLink)`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;
  margin-left: 50px;
  margin-right: 100px;

  &:hover {
    color: #dddddd;
  }

  &.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }

  & + & {
    margin-left: 1rem;
  }
`;

const Header = () => {
  const { category, sideBarMenu } = useParams();
  const navigate = useNavigate();
  const onCLickLogo = () => {
    navigate('/');
    window.location.reload();
  };
  return (
    <CategoriesBlock>
      <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Logo onClick={onCLickLogo}>교통 돌발상황 현황</Logo>
      </NavLink>
      {categories.map((c) => (
        <Category
          key={c.text}
          to={
            category !== c.text
              ? `/${c.text}/전체보기`
              : `/${c.text}/${sideBarMenu}`
          }
          className={
            c.text === '전체' && sideBarMenu === undefined ? 'active' : ''
          }
        >
          {c.text}
        </Category>
      ))}
    </CategoriesBlock>
  );
};

export default Header;
