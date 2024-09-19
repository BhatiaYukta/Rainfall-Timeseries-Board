import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.css"; // Import custom CSS
import Footer from "./components/Footer/Footer";
import RainfallChart from "./components/RainfallChart/RainfallChart";
import MapWithMarkers from "./components/MapWithMarkers.js/MapWithMarkers";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  const [selectedRegion, setSelectedRegion] = useState({
    name: "Birmingham", // Default to Birmingham
    coordinates: [52.48049047465328, -1.8978672581749725],
  });

  return (
    <Router>
      <div className="App">
        {/* Header with Tabs */}
        <Header />

        {/* Page Content */}
        <div className="content">
          <Container>
            <Row>
              <Col sm={8} className="MapChartArea">
                
                <MapWithMarkers onRegionSelect={setSelectedRegion} />
                <br />
                <Routes>
                  {/* Redirect root path to /dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/dashboard"
                    element={<RainfallChart selectedRegion={selectedRegion} />}
                  />
                </Routes>
              </Col>
              <Col sm={1}></Col>
              <Col className="NewsArea" sm={3}>
              <Row></Row>
              <Row></Row>
              sm=4</Col>
            </Row>
          </Container>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
