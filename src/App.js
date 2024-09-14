import React from "react"
import WorldMap from "./components/WorldMap";

function App() {
  return (
    <div style={{ display: 'flex' }}>
    <div style={{ flex: 1 ,position: "static"}}>
      <WorldMap  />
    </div>
    
  </div>
  );
}

export default App;
