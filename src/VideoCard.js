import React from "react";

function VideoCard({ setFocusVideo, videoData }) {
    return (
        <div className="col">
            <div className="card shadow mb-2">
                <video className="card-img-top" src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" controls preload="metadata" playsInline/>
                <div className="card-body">
                    <h5 className="card-title">{ videoData.metadata.filename }</h5>
                    <p className="card-text">{ videoData.metadata.duration }</p>
                    <button className="btn btn-primary" onClick={ () => setFocusVideo(videoData)}>Select</button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
