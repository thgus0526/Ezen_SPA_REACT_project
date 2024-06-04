import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TrafficListItem from './TrafficListItem';
import { useParams, useLocation } from 'react-router-dom'; // useLocation 추가
import { BiLoader } from 'react-icons/bi';
import SideBar from './SideBar';
import config from './Api';
// 스타일 컴포넌트 정의
const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 180px;

  ul {
    list-style: none;
    display: flex;
    padding: 0;
  }

  li {
    margin: 0 5px;
  }

  button {
    padding: 5px 10px;
    border: none;
    background-color: #ccc;
    cursor: pointer;

    &.on {
      background-color: #22b8cf;
      color: white;
    }
  }

  .prev {
    height: 28px;
    font-size: 15px;
  }
  .next {
    height: 28px;
    font-size: 15px;
    margin-left: 10px;
  }
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 800px;
  padding-bottom: 30px;
  align-items: center;

  .search {
    padding-right: 80px;
    display: flex;
    align-items: center;
  }

  .todayData {
    width: 160px;
    margin-right: 20px;
  }

  input {
    padding: 0 10px;
    width: 200px;
    height: 35px;
    border: 2px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  button {
    width: 100px;
    padding: 0 15px;
    height: 35px;
    border: 2px solid #4cc9f0;
    border-radius: 5px;
    background-color: #22b8cf;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #4cc9f0;
    }
  }
`;

const NameList = styled.ul`
  width: 700px;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding: 0px 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NameListItem = styled.li`
  width: 25%;
  text-align: center;
`;

const TrafficListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 50%;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const Buffering = styled.div`
  margin-left: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 600px;
  animation: spin 0.7s infinite linear;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
`;

const EmptyItem = styled.div`
  margin-top: 100px;
  width: 720px;
  text-align: center;
  font-size: 20px;
`;

const TrafficList = () => {
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { category, sideBarMenu } = useParams();
  const location = useLocation();
  const [pagination, setPagination] = useState({
    pageList: 10,
    page: 1,
    totalPage: 0,
    pageNum: [],
    pageGroup: 1,
    pageListGroup: 10,
  });
  const [chooseButton, setChooseButton] = useState(false);
  const [showTodayData, setShowTodayData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://openapi.its.go.kr:9443/eventInfo?apiKey=${config.Traffic_API_KEY}&type=all&eventType=all&getType=json`
        );
        const sortedData = response.data.body.items.sort((a, b) => {
          const parseDate = (dateStr) =>
            new Date(
              `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(
                6,
                8
              )}T${dateStr.slice(8, 10)}:${dateStr.slice(
                10,
                12
              )}:${dateStr.slice(12, 14)}`
            );
          return parseDate(b.startDate) - parseDate(a.startDate);
        });
        setInitialData(sortedData);
        setFilteredData(sortedData);
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalPage: Math.ceil(sortedData.length / prevPagination.pageList),
          pageNum: Array.from(
            { length: Math.ceil(sortedData.length / prevPagination.pageList) },
            (_, i) => i + 1
          ),
        }));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // URL 변경 시 필터 초기화
  useEffect(() => {
    setFilteredData(initialData);
    setPagination((prevPagination) => ({
      ...prevPagination,
      totalPage: Math.ceil(initialData.length / prevPagination.pageList),
      pageNum: Array.from(
        { length: Math.ceil(initialData.length / prevPagination.pageList) },
        (_, i) => i + 1
      ),
      page: 1,
    }));
  }, [location, initialData]);

  const filteredTrafficData = useMemo(() => {
    let data = filteredData;
    if (category && category !== '전체')
      data = data.filter((item) => item.type === category);
    if (sideBarMenu && sideBarMenu !== '전체보기')
      data = data.filter((item) => item.eventType === sideBarMenu);
    if (showTodayData) {
      const todayString = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      data = data.filter((item) => item.startDate.startsWith(todayString));
    }
    return data;
  }, [filteredData, category, sideBarMenu, showTodayData]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      totalPage: Math.ceil(
        filteredTrafficData.length / prevPagination.pageList
      ),
      pageNum: Array.from(
        {
          length: Math.ceil(
            filteredTrafficData.length / prevPagination.pageList
          ),
        },
        (_, i) => i + 1
      ),
      page: 1,
    }));
    updateChartData(filteredTrafficData);
  }, [filteredTrafficData]);

  const handleSearch = () => {
    const filtered = initialData.filter((item) =>
      item.roadName.includes(search)
    );
    setFilteredData(filtered);
    setSearch('');
    setPagination((prevPagination) => ({
      ...prevPagination,
      totalPage: Math.ceil(filtered.length / prevPagination.pageList),
      pageNum: Array.from(
        { length: Math.ceil(filtered.length / prevPagination.pageList) },
        (_, i) => i + 1
      ),
      page: 1,
    }));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handlePageClick = (page) => {
    setPagination((prevPagination) => ({ ...prevPagination, page }));
  };

  const handlePrevGroup = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageGroup: Math.max(prevPagination.pageGroup - 1, 1),
      page: (prevPagination.pageGroup - 2) * prevPagination.pageListGroup + 1,
    }));
  };

  const handleNextGroup = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageGroup: prevPagination.pageGroup + 1,
      page: prevPagination.pageGroup * prevPagination.pageListGroup + 1,
    }));
  };

  const startPage = (pagination.pageGroup - 1) * pagination.pageListGroup + 1;
  const endPage = Math.min(
    startPage + pagination.pageListGroup - 1,
    pagination.totalPage
  );

  const handleTodayButtonClick = () => {
    setShowTodayData(!showTodayData);
    setChooseButton(!chooseButton);
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const updateChartData = (data) => {
    const newChartData = data.reduce((acc, item) => {
      const category = item.eventType;
      const existingCategory = acc.find((data) => data.subject === category);
      if (existingCategory) existingCategory.A += 1;
      else acc.push({ subject: category, A: 1, fullMark: 150 });
      return acc;
    }, []);
    setChartData(newChartData);
  };

  if (loading) {
    return (
      <TrafficListBlock>
        <Buffering>
          <BiLoader size={50} />
        </Buffering>
      </TrafficListBlock>
    );
  }

  return (
    <>
      <TrafficListBlock>
        <SearchDiv>
          <button className="todayData" onClick={handleTodayButtonClick}>
            {chooseButton ? '전체 데이터' : '오늘의 데이터'}
          </button>
          <div className="search">
            <input
              placeholder="도로명"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        </SearchDiv>
        <NameList>
          <NameListItem>도로명</NameListItem>
          <NameListItem>돌발구분</NameListItem>
          <NameListItem>돌발상세</NameListItem>
          <NameListItem>날짜</NameListItem>
        </NameList>
        {filteredTrafficData.length > 0 ? (
          filteredTrafficData
            .slice(
              (pagination.page - 1) * pagination.pageList,
              pagination.page * pagination.pageList
            )
            .map((item, index) => <TrafficListItem key={index} item={item} />)
        ) : (
          <EmptyItem>데이터가 존재하지 않습니다.</EmptyItem>
        )}
        <SideBar data={chartData} />
      </TrafficListBlock>
      <PaginationBox>
        <button
          className="prev"
          onClick={handlePrevGroup}
          disabled={pagination.pageGroup === 1}
        >
          이전
        </button>
        <ul>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((item, idx) => (
            <li key={idx}>
              <button
                className={pagination.page === item ? 'on' : ''}
                onClick={() => handlePageClick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="next"
          onClick={handleNextGroup}
          disabled={endPage === pagination.totalPage}
        >
          다음
        </button>
      </PaginationBox>
    </>
  );
};

export default TrafficList;
