import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.css"; // Import custom CSS
import Footer from "./components/Footer/Footer";
import RainfallChart from "./RainfallChart";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header with Tabs */}

        <Header />
        {/* Page Content */}
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<RainfallChart/>}/>
            <Route path="/help" />
          </Routes>
        </div>

        {/* Footer */}
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
