import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';

const PostForm = ({ addPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      addPost(title, content);
      setTitle('');
      setContent('');
    }
  };
  const onClickHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="title">
        <h1>제보하기</h1>
      </div>
      <div className="home-btn">
        <button className="home" onClick={onClickHome}>
          X
        </button>
      </div>
      <input
        type="text"
        placeholder="제목을 입력하세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        type="text"
        placeholder="내용을 입력하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="submit-btn">
        <button type="submit">입력 완료</button>
      </div>
    </form>
  );
};

export default PostForm;
