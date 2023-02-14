import React from "react";
import ReactPlayer from "react-player/youtube";

function VideoCard({ setFocusVideo, videoData, url }) {
    return (
        <div className="col">
            <div className="card shadow mb-2 video-library-card">
                <ReactPlayer 
                    className="card-img-top"
                    url={ url }
                    muted={ true }
                    controls={ true }
                    playsinline={ true }
                    height={ videoData.metadata.height }
                    width="auto"
                    light={ true }
                    config={{ youtube: { playerVars: { origin: 'http://localhost:3000/', enablejsapi: 1 } } }}
                />
                <div className="card-body">
                    <h5 className="card-title">{ `${videoData.metadata.filename.split("-")[0]}` }</h5>
                    <p className="card-text">{ `${Math.round(videoData.metadata.duration / 60)} minutes` }</p>
                    <button className="btn btn-primary" onClick={ () => setFocusVideo(videoData)}>Select</button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
