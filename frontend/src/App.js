import React,{useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.css"; // Import custom CSS
import Footer from "./components/Footer/Footer";
import RainfallChart from "./RainfallChart";
import MapWithMarkers from "./MapWithMarkers";



  

function App() {
  const [selectedRegion, setSelectedRegion] = useState({
    name: "Birmingham",  // Default to Birmingham
    coordinates: [52.48049047465328, -1.8978672581749725],
  });
  return (
    <Router>
      <div className="App">
        {/* Header with Tabs */}

        <Header />
        {/* Page Content */}
        <div className="content">
        <MapWithMarkers onRegionSelect={setSelectedRegion} />
        <br/>
          <Routes>
            <Route path="/dashboard" element={<RainfallChart selectedRegion={selectedRegion}/>}/>
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
