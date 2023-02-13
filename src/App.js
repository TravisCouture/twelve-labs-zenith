import './App.css';
import VideoLibrary from './VideoLibrary';

const LOGO = "https://twelvelabs.io/logo.png";

const videoData = {
  url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  title: "For Bigger Blazes",
  description: "This is a test description. The dragons are breathing fire."
};

function App() {
  return (
    <div className="App">
      <nav className="navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={ LOGO } alt="Logo" className="d-inline-block align-text-top" />
          </a>
        </div>
      </nav>
      <VideoLibrary />
    </div>
  );
}

export default App;
