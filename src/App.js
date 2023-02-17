import WorkArea from './WorkArea';
import './App.css';
import React from "react";
import { getVideos } from "./Api";

const LOGO = "https://twelvelabs.io/logo.png";
const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;

function App() {
  const [selectedMode, setSelectedMode] = React.useState("video-to-video");
  const [selectedIndex, setSelectedIndex] = React.useState(process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX);
  const [indexVideos, setIndexVideos] = React.useState();

  React.useEffect(() => {
    const response = getVideos(API_URL, selectedIndex, API_KEY);
    response.then((json) => {
        setIndexVideos(json.data);
    });
  }, [selectedIndex]);

  const makeNavBar = () => {
    let navBar = <nav className="navbar navbar-expand-lg navbar-light">
                  <div className="container-fluid">
                      <a className="navbar-brand pb-3 ps-4" href="/twelve-labs-zenith">
                        <img src={ LOGO } alt="Logo" width="300px"/>
                      </a>
                    <button className="navbar-toggler" 
                      type="button" data-bs-toggle="collapse" 
                      data-bs-target="#navbarNav" 
                      aria-controls="navbarNav" 
                      aria-expanded="false" 
                      aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse pt-2" id="navbarNav">
                      <ul className="navbar-nav me-auto my-2 my-lg-0">
                        <li className="nav-item btn text-underlined" 
                            onClick={() => setSelectedMode("video-to-video")}>
                              Video-To-Video Search
                        </li>
                        <li className="nav-item btn"
                            onClick={() => setSelectedMode("combined-search")}>
                              Combined Search
                        </li>
                        <li className="nav-item btn"
                            onClick={() => setSelectedMode("content-classification")}>
                              Content Classification
                        </li>
                        <li className="nav-item dropdown">
                          <a class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Active Index
                          </a>
                          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                              <a class="dropdown-item active" role="button" onClick={() => setSelectedIndex(process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX)}>
                                Mr. Beast
                              </a>
                            </li>
                            <li><a className="dropdown-item" role="button">Tik Tok</a></li>
                            <li><a className="dropdown-item" role="button">GARM</a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

    return navBar
  };

  let navBar = makeNavBar();
  let workArea;

  if (indexVideos) {
    workArea = <WorkArea selectedMode={ selectedMode } indexVideos={ indexVideos }/>
  };

  return (
    <div className="App">
      { navBar }
      { workArea }
    </div>
  );
}

export default App;
