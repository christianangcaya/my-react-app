import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Eligibility from "./components/Eligibility";
import Notice from "./components/Notice";
import Documents from "./components/Documents";
import Buttons from "./components/Button";
import AboutUs from "./AboutUs"; 
import "./App.css";

const Home = () => {
  return (
    <main>
      <Eligibility />
      <div className="left-right">

        <div className="left">
        <Notice />
        </div>

        <div className="right">
        <Documents />
        <Buttons />
        </div>

      </div>
    </main>
  );
};

const App = () => {
  return (
    <div className="app">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faqs" element={<div>FAQs You ka wala pa ini</div>} />
          <Route path="/user" element={<div>User Profile mayo paaaa</div>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
