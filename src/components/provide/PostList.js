import React, { useState } from 'react';
import PostForm from './PostForm';

const PostList = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '출퇴근 시간대 교통 체증 심화',
      content:
        '최근 출퇴근 시간대에 주요 도로에서 교통 체증이 심화되고 있는 상황을 제보드립니다. 특히, 7시에서 9시 사이와 17시에서 19시 사이에 교통량이 급증하여 차량이 거의 움직이지 못하는 경우가 빈번하게 발생하고 있습니다. 이로 인해 많은 시민들이 출퇴근 시간에 큰 불편을 겪고 있습니다.',
      date: new Date().toLocaleString(),
    },
    {
      id: 2,
      title: '도로 공사중',
      content: '멘홀 교체',
      date: new Date().toLocaleString(),
    },
  ]);

  const [editing, setEditing] = useState({ id: null, title: '', content: '' });

  // 새로운 게시물 추가 함수
  const addPost = (title, content) => {
    const newId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.id)) + 1 : 1;
    const newPost = {
      id: newId,
      title,
      content,
      date: new Date().toLocaleString(),
    };
    setPosts([...posts, newPost]);
  };

  // 게시물 삭제
  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  // 게시물 수정 시작
  const startEditing = (post) => {
    setEditing({ id: post.id, title: post.title, content: post.content });
  };

  // 게시물 수정 저장
  const savePost = () => {
    const updatedPosts = posts.map((post) => {
      if (post.id === editing.id) {
        return { ...post, title: editing.title, content: editing.content };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditing({ id: null, title: '', content: '' }); // 수정 상태 초기화
  };

  // 게시물 수정 시 입력값 처리
  const handleEditChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="gap">
        <PostForm addPost={addPost} />
        {posts.map((post, index) => (
          <Post
            key={post.id}
            post={post}
            index={index + 1} // 게시물 번호를 위한 인덱스
            onDelete={() => deletePost(post.id)}
            onEdit={() => startEditing(post)}
            editing={editing}
            handleEditChange={handleEditChange}
            savePost={savePost}
          />
        ))}
      </div>
    </div>
  );
};

const Post = ({
  post,
  index,
  onDelete,
  onEdit,
  editing,
  handleEditChange,
  savePost,
}) => {
  return (
    <div className="post">
      {editing.id === post.id ? (
        <>
          <input
            name="title"
            value={editing.title}
            onChange={handleEditChange}
          />
          <textarea
            name="content"
            value={editing.content}
            onChange={handleEditChange}
          />
          <button onClick={savePost}>저장하기</button>
        </>
      ) : (
        <>
          <h2>
            {index}. 제목: {post.title}
          </h2>
          <p>{post.content}</p>
          <p align="right">⌚작성시간: {post.date}</p>
          <div className="find-btn">
            {' '}
            <button onClick={onDelete}>삭제하기</button>
            <button onClick={onEdit}>수정하기</button>{' '}
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
