import React from "react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import ReactPlayer from "react-player/youtube";
import { getSimilarVideos } from "./Api";

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;
const VIDEO_TO_VIDEO_INDEX = process.env.REACT_APP_TWELVE_LABS_VIDEO_VIDEO_INDEX;

function FocusVideoCard( { focusVideoState, setFocusVideoState, videoData, url }) {
    const videoElement = React.createRef();;
    const rangeSlider = React.createRef();

    React.useEffect(() => {
        videoElement.current.seekTo(focusVideoState.startThumb, 'seconds');
    }, [focusVideoState.startThumb, focusVideoState.endThumb]);

    const handleFindSimilarVideos = () => {
        getSimilarVideos(API_URL, API_KEY, VIDEO_TO_VIDEO_INDEX, videoData._id, focusVideoState.startThumb, focusVideoState.endThumb);
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
    };

    const handleOnSeek = () => {
        let thumbDiff = rangeSlider.current.value.max - videoElement.current.getCurrentTime();
        console.log(thumbDiff);

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
                    config={{ youtube: { playerVars: { origin: 'http://localhost:3000/', enablejsapi: 1 } } }}
                />
                <div className="card-body">
                    <h5 className="card-title">{ `${videoData.metadata.filename.split("-")[0]}` }</h5>
                    <p className="card-text">{ `${Math.round(videoData.metadata.duration / 60)} minutes` }</p>
                    <button className="btn btn-primary mb-3" onClick={ handleFindSimilarVideos }>
                        Find Similar Videos
                    </button>
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
            </div>
        </div>
    );
};

export default FocusVideoCard;
