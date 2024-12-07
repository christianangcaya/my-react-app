// components/App.jsx
import React from "react";
import Header from "./components/Header";
import Eligibility from "./components/Eligibility";
import Notice from "./components/Notice";
import Documents from "./components/Documents"
import Buttons from "./components/Button";
import Footer from "./components/Footer";
import "./App.css";


const App = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Eligibility />
        <Notice />
        <Documents />
        <Buttons />
      </main>
      <Footer />
    </div>
  );
};

export default App;
