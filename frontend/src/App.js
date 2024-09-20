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
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import news1 from "./news1.png";
import news2 from "./news2.png";
import news3 from "./news3.png";
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
                <br></br>

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
                <br></br>
                <Card body style={{ borderColor: "white" }}>
                  <span>
                    <h4>
                      <b>Top Stories</b>
                    </h4>
                  </span>
                </Card>
                <Card style={{ width: "19rem" }}>
                  <a
                    target="_blank"
                    href="https://www.metoffice.gov.uk/about-us/news-and-media/media-centre/weather-and-climate-news/2024/thunderstorm-warnings"
                  >
                    <Card.Img variant="top" src={news1} />
                  </a>
                </Card>
                <br></br>
                <Card style={{ width: "19rem" }}>
                  <a target="_blank" href="https://youtu.be/lrPS2HiYVp8">
                    <Card.Img variant="top" src={news2} />
                  </a>
                </Card>
                <br></br>
                <Card style={{ width: "19rem" }}>
                  <Card.Img variant="top" src={news3} />
                  <Card.Body>
                    <a
                      target="_blank"
                      href="https://www.youtube.com/watch?v=KWbakMx0kxA"
                    >
                      More heavy rain across Alabama at times Sunday. Limited
                      ...
                    </a>
                  </Card.Body>
                </Card>
              </Col>
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
