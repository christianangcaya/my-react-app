import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Eligibility from "./components/Eligibility";
import Notice from "./components/Notice";
import Documents from "./components/Documents";
import Buttons from "./components/Button";
import AboutUs from "./AboutUs";
import FAQsPage from "./FAQsPage";
import "./App.css";
import Registration from "./Registration";
import FinalReqPage from "./FinalReqPage";

const Home = () => {
  return (
    <>
      <Header/>
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
    </>
  );
};

const About = () => {
  return(
    <>
      <Header />
      <AboutUs />
    </>
  );
};

const Faqs = () => {
  return(
    <>
      <Header />
      <FAQsPage />
    </>
  );
};

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/finalreq" element={<FinalReqPage/>}></Route>
          <Route
            path="/user"
            element={<div>User Profile Page Coming Soon</div>}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};
export default App;
