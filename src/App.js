import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from "./pages/home/Home";
import CartGeneral from "./pages/cart/CartGeneral";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
      <Router>
          <Navbar />
          <main style={{ paddingTop: '120px' }}>
              {/* 홈 화면 내용 들어가는 부분 */}
              <>
                  <Routes>
                      <Route path="/" element={<Home/>}/>
                      <Route path="/cart" element={<CartGeneral/>}/>
                  </Routes>
              </>
          </main>
          <Footer/>
      </Router>
  );
}

export default App;
