import React from "react";
import VideoCard from "./VideoCard";
import V2VFocusCard from "./V2VFocusCard";
import video_to_youtube_data from './video_to_youtube.json';

function WorkArea({ selectedMode, indexVideos }) {
    const [focusVideoState, setFocusVideoState] = React.useState({
        focusVideoStart: 0,
        focusVideoEnd: 0,
        startThumb: 0,
        endThumb: 0
    });

    const [focusVideo, setFocusVideo] = React.useState();
    const [apiVideos, setApiVideos] = React.useState();
    const [videoUrlData, setVideoUrlData] = React.useState();

    React.useEffect(() => {
        if (selectedMode === "video-to-video") {
            setVideoUrlData(video_to_youtube_data);
        };

        setFocusVideo(indexVideos[0]);
    }, [indexVideos, videoUrlData, selectedMode]);

    const makeVideoLibrary = () => {
        let videoLibrary;

        if (apiVideos) {
            videoLibrary = apiVideos.map((video, index) => 
                <VideoCard setFocusVideo={ setFocusVideo } 
                    videoData={ video } 
                    key={ index } 
                    url={ videoUrlData[video.video_id].youtube_url } 
                />);

            return videoLibrary;
        } else if (indexVideos) {
            videoLibrary = indexVideos.map((video, index) => 
                <VideoCard setFocusVideo={ setFocusVideo } 
                    videoData={ video } 
                    key={ index } 
                    url={ videoUrlData[video._id].youtube_url } 
                />);
        };

        return videoLibrary;
    };

    const makeFocusCard = () => {
        let focusCard = <V2VFocusCard 
                            focusVideoState={ focusVideoState } 
                            setFocusVideoState={ setFocusVideoState } 
                            videoData={ focusVideo } 
                            url={ videoUrlData[focusVideo._id].youtube_url }
                            apiVideos={ apiVideos }
                            setApiVideos={ setApiVideos }
                            indexVideos={ indexVideos }
                            selectedMode={ selectedMode }
                        />

        return focusCard;
    };

    let videoLibrary;
    let focusCard;

    if (indexVideos && focusVideo) {
        videoLibrary = makeVideoLibrary();
        focusCard = makeFocusCard();
    };

    return (
        <div className="WorkArea mx-5">
            <div className="container-fluid">
                <div className="row row-cols-2 justify-content-center scroll-row">
                    <div className="col">
                        <div className="row">
                            { focusCard }
                        </div>
                    </div>
                    <div className="col scroll-col">
                        <div className="row row-cols-xl-3 row-cols-lg-2 row-cols-m-1 row-cols-s-1 row-cols-xs-1">
                            {videoLibrary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkArea;
