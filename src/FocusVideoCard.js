import React from "react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import ReactPlayer from "react-player/youtube";

function FocusVideoCard( { focusVideoState, setFocusVideoState, videoData, url }) {
    const videoElement = React.createRef();;
    const rangeSlider = React.createRef();

    React.useEffect(() => {
        videoElement.current.seekTo(focusVideoState.startThumb, 'seconds');
    });

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

    return(
        <div className="col">
            <div className="card shadow">
                <ReactPlayer 
                    className="card-img-top focus-video" 
                    url={ url }
                    muted={ true }
                    controls={ true }
                    playsinline={ true }
                    onDuration={ handleLoadedMetadata }
                    ref={ videoElement }
                    height={ videoData.metadata.height }
                    width="auto"
                    light={ true }
                    playing={ true }
                    config={{ youtube: { playerVars: { origin: 'http://localhost:3000/', enablejsapi: 1 } } }}
                />
                <div className="card-body">
                    <h5 className="card-title">{ videoData.metadata.filename }</h5>
                    <p className="card-text">{ videoData.metadata.duration }</p>
                    <button className="btn btn-primary mb-3">Find Similar Videos</button>
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
                        Start: { Math.round(focusVideoState.startThumb) } seconds <br/>
                        End: { Math.round(focusVideoState.endThumb) } seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FocusVideoCard;
