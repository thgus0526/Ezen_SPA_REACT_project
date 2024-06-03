import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProvideButton = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 50px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: #f0f0f0;
  }

  button {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: #fff;
    border: none;
    border-radius: 25px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #0056b3, #004494);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(1px);
    }
  }
`;

const DetailPage = styled.div`
  padding-top: 120px;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;

  .container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 950px;
    width: 90%;
    margin: 0 auto;
    padding-left: 10px;
    max-height: 500px;

    .content {
      text-align: center;

      .title {
        margin-bottom: 20px;

        h2 {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
      }

      .text {
        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          em {
            font-weight: 500;
            font-size: 14px;
            color: #555;
          }
        }

        .type {
          font-weight: 600;
          font-size: 16px;
          color: #444;
          margin-bottom: 10px;
        }

        .contents {
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }

        .select {
          font-size: 24px;
          margin-top: 20px;
          color: #007bff;
        }
      }

      #map {
        margin-top: 20px;
        width: 600px;
        height: 300px;
      }

      .button_box {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        button {
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background: #007bff;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;

          &:hover {
            background: #0056b3;
          }
        }
      }
    }
  }
`;

export default function Detail() {
  const selector = useSelector((state) => state);
  const navigate = useNavigate();
  const { kakao } = window;

  useEffect(() => {
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(
        parseFloat(selector.DetailPage.isCoordY),
        parseFloat(selector.DetailPage.isCoordX)
      ),
      level: 4,
    };

    var map = new kakao.maps.Map(container, options);
    var markerPosition = new kakao.maps.LatLng(
      parseFloat(selector.DetailPage.isCoordY),
      parseFloat(selector.DetailPage.isCoordX)
    );
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, [selector.DetailPage.isCoordY, selector.DetailPage.isCoordX]);

  const getKoreanDate = (date) => {
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    const time = date.substr(8, 2);
    const minute = date.substr(10, 2);
    const seconds = date.substr(12, 2);
    return `${year}년 ${month}월 ${day}일 ${time}시 ${minute}분 ${seconds}초`;
  };

  const onClickProvide = (e) => {
    e.preventDefault();
    navigate('/Provide');
  };

  return (
    <>
      <ProvideButton>
        <button onClick={onClickProvide}>제보하기</button>
      </ProvideButton>
      <DetailPage>
        <div className="container">
          <div className="content">
            <div className="title">
              <h2>상세 돌발 상황</h2>
            </div>
            <div className="text">
              {selector.DetailPage.isRoad !== '' && (
                <div className="top">
                  <em className="road">{selector.DetailPage.isRoad}</em>
                  <em className="date">
                    {getKoreanDate(selector.DetailPage.isDate)}
                  </em>
                </div>
              )}
              {selector.DetailPage.isType !== '' && (
                <p className="type">({selector.DetailPage.isType})</p>
              )}
              {selector.DetailPage.isMessage !== '' && (
                <p className="contents">{selector.DetailPage.isMessage}</p>
              )}
              {selector.DetailPage.isRoad === '' && (
                <h4 className="select">조회하고 싶은 곳을 클릭하세요.</h4>
              )}
            </div>
            <div id="map" style={{ width: '600px', height: '320px' }}></div>
          </div>
        </div>
      </DetailPage>
    </>
  );
}
