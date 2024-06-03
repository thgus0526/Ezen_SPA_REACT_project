import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TrafficListItem from './TrafficListItem';
import { useParams } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';
import SideBar from './SideBar';

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
  const [initialData, setInitialData] = useState([]); // 초기 API에서 받아온 데이터 추가 용도
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 추가용도
  const [chartData, setChartData] = useState([]); // 차트 데이터
  const { category, sideBarMenu } = useParams();
  const [pagination, setPagination] = useState({
    pageList: 10,
    page: 1,
    totalPage: 0,
    pageNum: [],
    pageGroup: 1,
    pageListGroup: 10,
  });

  const [chooseButton, setChooseButton] = useState(false);

  const [showTodayData, setShowTodayData] = useState(false); // 오늘 데이터

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://openapi.its.go.kr:9443/eventInfo?apiKey=7fe8774ef8a0410e8c73592ab023f079&type=all&eventType=all&getType=json'
        );
        // API에서 받아온 데이터를 날짜순으로 정렬하기위함
        const sortedData = response.data.body.items.sort((a, b) => {
          const parseDate = (dateStr) => {
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6);
            const day = dateStr.slice(6, 8);
            const hour = dateStr.slice(8, 10);
            const minute = dateStr.slice(10, 12);
            const second = dateStr.slice(12, 14);
            return new Date(
              `${year}-${month}-${day}T${hour}:${minute}:${second}`
            );
          };
          return parseDate(b.startDate) - parseDate(a.startDate);
        });
        setInitialData(sortedData);
        setFilteredData(sortedData); // 초기데이터설정
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalPage: Math.ceil(sortedData.length / prevPagination.pageList),
          pageNum: Array.from(
            { length: Math.ceil(sortedData.length / prevPagination.pageList) },
            (_, i) => i + 1
          ),
        }));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 카테고리 사이드바 오늘의데이터 버튼 클릭시
  // 리렌더링없이 사용하기위함?
  // item.type, item.eventType 은 한글인데 category, sideBarMenu는 영어로 나와서 URL변경함
  const filteredTrafficData = useMemo(() => {
    let data = initialData;
    if (category && category !== '전체') {
      data = data.filter((item) => item.type === category);
    }
    if (sideBarMenu && sideBarMenu !== '전체보기') {
      data = data.filter((item) => item.eventType === sideBarMenu);
    }
    if (showTodayData) {
      const today = new Date();
      const todayString = `${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      data = data.filter((item) => item.startDate.startsWith(todayString));
    }
    return data;
  }, [initialData, category, sideBarMenu, showTodayData]);

  // 페이지네이션
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
    }));
    updateChartData(filteredTrafficData);
    // 페이지 초기화
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: 1,
    }));
  }, [filteredTrafficData]);

  // 검색 핸들러
  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      item.roadName.includes(search)
    );
    console.log(filteredData);
    setPagination((prevPagination) => ({
      ...prevPagination,
      totalPage: Math.ceil(filteredData.length / prevPagination.pageList),
      totalPageBtn: Math.ceil(
        Math.ceil(filteredData.length / prevPagination.pageList) /
          prevPagination.pageListBtn
      ),
    }));
    setFilteredData(filteredData); // 검색결과로 데이터 업데이트
    setInitialData(filteredData);
    updateChartData(filteredData);
    setSearch('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 페이지 번호 클릭
  const handlePageClick = (page) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
    }));
  };

  // 페이지 이전 버튼
  const handlePrevGroup = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageGroup: Math.max(prevPagination.pageGroup - 1, 1),
      page: (prevPagination.pageGroup - 2) * prevPagination.pageListGroup + 1,
    }));
  };

  // 페이지 다음 버튼
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
  if (loading) {
    return (
      <TrafficListBlock>
        <Buffering>
          <BiLoader size={50} />
        </Buffering>
      </TrafficListBlock>
    );
  }

  if (!filteredTrafficData) {
    return null;
  }

  const handleTodayButtonClick = () => {
    setShowTodayData(!showTodayData);
    setChooseButton(!chooseButton);
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: 1,
    }));
  };

  // 차트에 데이터를 보내기위한 가공
  const updateChartData = (data) => {
    const newChartData = data.reduce((acc, item) => {
      const category = item.eventType;
      const existingCategory = acc.find((data) => data.subject === category);
      if (existingCategory) {
        existingCategory.A += 1;
      } else {
        acc.push({ subject: category, A: 1, fullMark: 150 });
      }
      return acc;
    }, []);
    setChartData(newChartData);
  };

  return (
    <>
      <TrafficListBlock>
        <SearchDiv>
          {chooseButton ? (
            <button className="todayData" onClick={handleTodayButtonClick}>
              전체 데이터
            </button>
          ) : (
            <button className="todayData" onClick={handleTodayButtonClick}>
              오늘의 데이터
            </button>
          )}
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
        {/* <SideBar data={chartData} /> */}
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
