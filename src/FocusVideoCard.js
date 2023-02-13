import React from "react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const videoData = {
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    title: "Test",
    description: "This is a test description. The dragons are breathing fire."
};

function FocusVideoCard() {
    const [videoState, setVideoState] = React.useState({
        videoStart: 0,
        videoEnd: 100,
        startThumb: 0,
        endThumb: 100
    });

    const videoElement = React.createRef();
    const rangeSlider = React.createRef();

    React.useEffect(() => {
        videoElement.current.currentTime = videoState.startThumb;
    });

    const handleLoadedMetadata = () => {
        if ( !videoElement ) {
            return;
        }

        if ( videoElement.current.duration > 30 ) {
            setVideoState({
                ...videoState,
                videoEnd: videoElement.current.duration,
                endThumb: 30
            });

            rangeSlider.current.value.max = 30;
        } else {
            setVideoState({
                ...videoState,
                videoEnd: videoElement.current.duration,
                endThumb: videoElement.current.duration
            });

            rangeSlider.current.value.max = videoElement.current.duration;
        };
    };

    const handleRangeSlider = () => {
        let thumbDiff = rangeSlider.current.value.max - rangeSlider.current.value.min;
        let endThumbSet = ( videoState.endThumb === rangeSlider.current.value.max ) ? false : true;
        let rangeModifier = Math.round( thumbDiff - 30);

        if ( endThumbSet ) {
            setVideoState({
                ...videoState,
                startThumb: ( rangeSlider.current.value.min + rangeModifier ),
                endThumb: rangeSlider.current.value.max
            });

            rangeSlider.current.value.min = rangeSlider.current.value.min + rangeModifier;
        } else {
            setVideoState({
                ...videoState,
                startThumb: rangeSlider.current.value.min,
                endThumb: ( rangeSlider.current.value.max - rangeModifier )
            });

            rangeSlider.current.value.max = rangeSlider.current.value.max - rangeModifier;
        };
    };

    return(
        <div className="col">
            <div className="card shadow">
                <video 
                    className="card-img-top" 
                    src={ videoData.url } 
                    controls 
                    playsInline 
                    preload="metadata" 
                    onLoadedMetadata={ handleLoadedMetadata }
                    ref={ videoElement }
                />
                <div className="card-body">
                    <h5 className="card-title">{ videoData.title }</h5>
                    <p className="card-text">{ videoData.description }</p>
                    <button className="btn btn-primary mb-3">Find Similar Videos</button>
                    <RangeSlider
                        className="mb-3"
                        min={ videoState.videoStart } 
                        max={ videoState.videoEnd }
                        defaultValue={ [videoState.startThumb, videoState.endThumb] }
                        onThumbDragEnd={ handleRangeSlider }
                        onRangeDragEnd={ handleRangeSlider }
                        ref={ rangeSlider }
                    />
                    <p className="card-text text-center">
                        Start: { Math.round(videoState.startThumb) } seconds <br/>
                        End: { Math.round(videoState.endThumb) } seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FocusVideoCard;
