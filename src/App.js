import VideoLibrary from './VideoLibrary';
import './App.css';
import React from "react";

const LOGO = "https://twelvelabs.io/logo.png";

function App() {
  const [selectedMode, setSelectedMode] = React.useState(0);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid mb-3">
            <a className="navbar-brand" href="/twelve-labs-zenith">
              <img src={ LOGO } alt="Logo" className="d-inline-block align-text-top" width="300px"/>
            </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item btn" 
                  aria-current="page" 
                  onClick={(event) => setSelectedMode("v2v-serach")}>
                    Video-To-Video Search
              </li>
              <li className="nav-item btn"
                  aria-current="page" 
                  onClick={(event) => setSelectedMode("combined-search")}>
                    Combined Search
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <VideoLibrary selectedMode={ selectedMode }/>
    </div>
  );
}

export default App;
