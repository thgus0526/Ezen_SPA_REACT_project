import './App.css';
import Menu from './components/Menu';
import { Route, Routes } from 'react-router-dom';
import Contents from './components/Contents';
import PostList from './components/provide/PostList';
function App() {
  return (
    <div>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Menu />
                <Contents />
              </>
            }
          />
          <Route
            path="/:category"
            element={
              <>
                <Menu />
                <Contents />
              </>
            }
          />
          <Route
            path="/:category/:sideBarMenu"
            element={
              <>
                <Menu />
                <Contents />
              </>
            }
          />
          <Route
            path="/Provide"
            element={
              <>
                <PostList />
              </>
            }
          />
        </Routes>
      </>
    </div>
  );
}

export default App;
