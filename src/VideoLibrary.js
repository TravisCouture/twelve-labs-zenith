import React from "react";
import VideoCard from "./VideoCard";
import FocusVideoCard from "./FocusVideoCard";
import { getVideos } from "./Api";

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;
const VIDEO_TO_VIDEO_INDEX = process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX;

const videoData = {
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "For Bigger Blazes",
    description: "This is a test description. The dragons are breathing fire."
  };

class VideoLibrary extends React.Component {
    constructor( props ) {
        super( props );
        this.focusVideo = React.createRef();
        this.selectedVideo = React.createRef();

        this.state = {
            videos: null,
            focusVideo: null
        };
    };

    componentDidMount() {
        const response = getVideos(API_URL, VIDEO_TO_VIDEO_INDEX, API_KEY);
        response.then((json) => this.setState({
                videos: json.data,
                focusVideo: json.data[0]
            }
        ));
    };

    componentDidUpdate() {
    };

    render () {
        if (this.state.videos !== null) {
            return (
                <div className="VideoLibrary">
                    <div className="container-fluid">
                        <div className="row row-cols-2 justify-content-center scroll-row">
                            <div className="col-5 justify-content-center ">
                                <FocusVideoCard videoData={ this.state.focusVideo } />
                            </div>
                            
                            <div className="col scroll-col">
                                <div className="row row-cols-2">
                                    {this.state.videos.map(video => <VideoCard videoData={ video }/>)}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        };
    };
};

export default VideoLibrary;
