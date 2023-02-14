import React from "react";
import VideoCard from "./VideoCard";
import FocusVideoCard from "./FocusVideoCard";
import { getVideos } from "./Api";
import video_to_youtube_data from './video_to_youtube.json';

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;
const VIDEO_TO_VIDEO_INDEX = process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX;

function VideoLibrary() {
    const [focusVideoState, setFocusVideoState] = React.useState({
        focusVideoStart: 0,
        focusVideoEnd: 0,
        startThumb: 0,
        endThumb: 0
    });

    const [focusVideo, setFocusVideo] = React.useState();

    const [indexVideos, setIndexVideos] = React.useState();

    const [searchVideos, setSearchVideos] = React.useState();

    React.useEffect(() => {
        const response = getVideos(API_URL, VIDEO_TO_VIDEO_INDEX, API_KEY);
        response.then((json) => {
            setIndexVideos(json.data);
            setFocusVideo(json.data[0]);
            setSearchVideos(json.data.length)
        });
    }, []);

    if (indexVideos) {
        return (
            <div className="VideoLibrary">
                <div className="container-fluid">
                    <div className="row row-cols-2 justify-content-center scroll-row">

                        <div className="col-4">
                            <FocusVideoCard 
                                focusVideoState={ focusVideoState } 
                                setFocusVideoState={ setFocusVideoState } 
                                videoData={ focusVideo } 
                                url={ video_to_youtube_data[focusVideo._id].youtube_url }
                            />
                        </div>
                        
                        <div className="col scroll-col">
                            <div className="row row-cols-3">
                                { 
                                    indexVideos.map((video, index) => 
                                        <VideoCard setFocusVideo={ setFocusVideo } 
                                        videoData={ video } 
                                        key={ index } 
                                        url={ video_to_youtube_data[video._id].youtube_url } 
                                    />) 
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };
};

export default VideoLibrary;
