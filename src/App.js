import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
      <>
          <Navbar />
          <main style={{ paddingTop: '120px' }}>
              {/* 홈 화면 내용 들어가는 부분 */}
              <Router>
                  <Routes>
                      <Route path="/" element={<Home/>}/>
                  </Routes>
              </Router>
          </main>
          <Footer/>
      </>
  );
}

export default App;
