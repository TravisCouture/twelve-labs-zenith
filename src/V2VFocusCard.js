import React from "react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import ReactPlayer from "react-player/youtube";
import { getSimilarVideos } from "./Api";

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;
const VIDEO_TO_VIDEO_INDEX = process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX;

function V2VFocusCard( { focusVideoState, setFocusVideoState, videoData, url, apiVideos, setApiVideos, indexVideos }) {
    const videoElement = React.createRef();
    const rangeSlider = React.createRef();

    const [searchButtonDisabled, setSearchButtonDisabled] =  React.useState(false);

    React.useEffect(() => {
        setSearchButtonDisabled(false);
    }, [apiVideos]);

    const updateSimilarVideos = (data) => {
        const topClips = data.map((video) => {
            return (video.clips[0])
        });
        const foundVideos = topClips.filter((clip) => {
            return indexVideos.some((video) => {
                return clip.video_id === video._id
            });
        });

        let mergedVideos = [];

        for(let i=0; i<foundVideos.length; i++) {
            mergedVideos.push({
             ...foundVideos[i], 
             ...(indexVideos.find((video) => video._id === foundVideos[i].video_id))}
            );
        }

        setApiVideos(mergedVideos);
    };

    const handleFindSimilarVideos = () => {
        setSearchButtonDisabled(true);

        const response = getSimilarVideos(API_URL, API_KEY, VIDEO_TO_VIDEO_INDEX, videoData._id, focusVideoState.startThumb, focusVideoState.endThumb);

        response.then((json) => {
            updateSimilarVideos(json.data)
        });
    }

    const handleLoadedMetadata = (duration) => {
        if ( !videoElement ) {
            return;
        }

        if ( duration > 30 ) {
            setFocusVideoState({
                focusVideoStart: 0,
                focusVideoEnd: Math.round(duration),
                startThumb: 0,
                endThumb: 30
            });

            rangeSlider.current.value.max = 30;
        } else {
            setFocusVideoState({
                focusVideoStart: 0,
                focusVideoEnd: Math.round(duration),
                startThumb: 0,
                endThumb: Math.round(duration)
            });

            rangeSlider.current.value.max = duration;
        };

        rangeSlider.current.value.min = 0;
    };

    const handleRangeSlider = () => {
        let thumbDiff = rangeSlider.current.value.max - rangeSlider.current.value.min;
        let endThumbSet = ( focusVideoState.endThumb === rangeSlider.current.value.max ) ? false : true;
        let rangeModifier = Math.max(Math.round( thumbDiff - 30), 0);

        if ( endThumbSet ) {
            setFocusVideoState({
                ...focusVideoState,
                startThumb: ( rangeSlider.current.value.min + rangeModifier ),
                endThumb: rangeSlider.current.value.max
            });

            rangeSlider.current.value.min = rangeSlider.current.value.min + rangeModifier;
        } else {
            setFocusVideoState({
                ...focusVideoState,
                startThumb: rangeSlider.current.value.min,
                endThumb: ( rangeSlider.current.value.max - rangeModifier )
            });

            rangeSlider.current.value.max = rangeSlider.current.value.max - rangeModifier;
        };

        videoElement.current.seekTo(rangeSlider.current.value.min, 'seconds');
    };

    const handleOnSeek = () => {
        let thumbDiff = rangeSlider.current.value.max - videoElement.current.getCurrentTime();

        if (thumbDiff < 0) {
            let rangeModifier = Math.max(Math.round( (thumbDiff * -1) - 30), 0);

            setFocusVideoState({
                ...focusVideoState,
                startThumb: ( rangeSlider.current.value.max + rangeModifier ),
                endThumb: videoElement.current.getCurrentTime()
            });
        } else {
            let rangeModifier = Math.max(Math.round( thumbDiff - 30), 0);

            setFocusVideoState({
                ...focusVideoState,
                startThumb: videoElement.current.getCurrentTime(),
                endThumb: ( rangeSlider.current.value.max - rangeModifier ) 
            });
        };
    };
    
    const makeV2VCardControls = () => {
        let cardControls; 
        let searchSpinner;

        if (searchButtonDisabled) {
            searchSpinner = <button className="btn btn-primary mb-3 mx-1" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Searching...
                            </button>
        };

        cardControls = <div className="card-body">
                            <h5 className="card-title">{ `${videoData.metadata.filename.split("-")[0]}` }</h5>
                            <p className="card-text">{ `${Math.round(videoData.metadata.duration / 60)} minutes` }</p>
                            <button className={searchButtonDisabled ? "btn btn-primary mb-3 mx-1 disabled" : "btn btn-primary mb-3 mx-1"} onClick={ handleFindSimilarVideos }>
                                Find Similar Videos
                            </button>
                            { searchSpinner }
                            <RangeSlider
                                className="mb-3"
                                min={ focusVideoState.focusVideoStart } 
                                max={ focusVideoState.focusVideoEnd }
                                defaultValue={ [focusVideoState.startThumb, focusVideoState.endThumb] }
                                onThumbDragEnd={ handleRangeSlider }
                                onRangeDragEnd={ handleRangeSlider }
                                ref={ rangeSlider }
                            />
                            <p className="card-text text-center">
                                <button className="btn btn-primary m-1" onClick={() => { videoElement.current.seekTo(focusVideoState.startThumb)}}>
                                    Start: { Math.round(focusVideoState.startThumb) } seconds
                                </button>
                                <button className="btn btn-primary m-1" onClick={() => { videoElement.current.seekTo(focusVideoState.endThumb)}}>
                                    End: { Math.round(focusVideoState.endThumb) } seconds
                                </button>
                            </p>
                        </div>

        return cardControls;
    };

    let cardControls = makeV2VCardControls();

    return(
        <div className="col d-flex">
            <div className="card shadow flex-fill">
                <ReactPlayer
                    className="card-img-top focus-video" 
                    url={ url }
                    muted={ true }
                    controls={ true }
                    playsinline={ true }
                    playing={ true }
                    onDuration={ handleLoadedMetadata }
                    onSeek={ handleOnSeek }
                    ref={ videoElement }
                    height="60vmin"
                    width="100%"
                    light={ true }
                />
                { cardControls }
            </div>
        </div>
    );
};

export default V2VFocusCard;
