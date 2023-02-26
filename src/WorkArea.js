import React from "react";
import VideoCard from "./VideoCard";
import V2VFocusCard from "./V2VFocusCard";
import CombinedSearchFocusCard from "./CombinedSearchFocusCard";
import video_to_youtube_data from './video_to_youtube.json';

function WorkArea({ selectedMode, indexVideos, selectedIndex }) {
    const [focusVideoState, setFocusVideoState] = React.useState();
    const [focusVideo, setFocusVideo] = React.useState();
    const [apiVideos, setApiVideos] = React.useState();
    const [videoUrlData, setVideoUrlData] = React.useState();

    React.useEffect(() => {
        if (selectedMode === "video-to-video") {
            setFocusVideoState({
                focusVideoStart: 0,
                focusVideoEnd: 0,
                startThumb: 0,
                endThumb: 0
            });
        } else if (selectedMode === "combined-search") {
            setFocusVideo();
        };

        if (selectedIndex === process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX) {
            setVideoUrlData(video_to_youtube_data);
        };

        setFocusVideo(indexVideos[0]);
        setApiVideos(indexVideos);
    }, [indexVideos, videoUrlData, selectedMode, selectedIndex]);

    const makeVideoLibrary = () => {
        let videoLibrary = apiVideos.map((video, index) => 
                            <VideoCard setFocusVideo={ setFocusVideo } 
                                videoData={ video } 
                                key={ index } 
                                url={ videoUrlData[video._id].youtube_url } 
                            />);

        return videoLibrary;
    };

    const makeV2VFocusCard = () => {
        let focusCard = <V2VFocusCard 
                            focusVideoState={ focusVideoState }
                            setFocusVideoState={ setFocusVideoState } 
                            videoData={ focusVideo } 
                            url={ videoUrlData[focusVideo._id].youtube_url }
                            apiVideos={ apiVideos }
                            setApiVideos={ setApiVideos }
                            indexVideos={ indexVideos }
                            selectedMode={ selectedMode }
                        />;

        return focusCard;
    };

    let videoLibrary;
    let focusCard;

    if (!apiVideos || !focusVideo || !videoUrlData) {
        return;
    };

    videoLibrary = makeVideoLibrary();

    if (selectedMode === "video-to-video") {
        focusCard = makeV2VFocusCard();
    } else if (selectedMode === "combined-search") {
        focusCard = <CombinedSearchFocusCard
                        focusVideo={ focusVideo }
                        setFocusVideo={ setFocusVideo }
                        focusVideoState={ focusVideoState } 
                        setFocusVideoState={ setFocusVideoState } 
                        videoData={ focusVideo } 
                        url={ videoUrlData[focusVideo._id].youtube_url }
                        apiVideos={ apiVideos }
                        setApiVideos={ setApiVideos }
                        indexVideos={ indexVideos }
                        selectedMode={ selectedMode }
                        selectedIndex={ selectedIndex }
                    />;
    };

    return (
        <div className="WorkArea mx-5">
            <div className="container-fluid">
                <div className="row row-cols-xl-2 row-cols-lg-2 row-cols-m-2 row-cols-s-1 row-cols-xs-1">
                    <div className="col-auto scroll-col">
                        { focusCard }
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
