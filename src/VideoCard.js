import React from "react";
import ReactPlayer from "react-player/youtube";

function VideoCard({ setFocusVideo, videoData, url }) {
    let videoCard;

    if (videoData.start) {
        videoCard = <div className="card shadow mb-3 flex-fill">
                        <div className="ratio ratio-16x9">
                            <ReactPlayer 
                                className="card-img-top card-video-top embed-responsive"
                                url={ `${url}?start=${videoData.start}&end=${videoData.end}` }
                                muted={ true }
                                controls={ true }
                                playsinline={ true }
                                height="100%"
                                width="100%"
                                light={ true }
                                config={
                                    { 
                                        youtube: 
                                        { playerVars: 
                                            { 
                                                origin: 'http://localhost:3000/', 
                                                enablejsapi: 1
                                            } 
                                    } 
                                }}
                            />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{ videoData.metadata.filename.split("-")[0] }</h5>
                            <p className="card-text">
                                { `${Math.round(videoData.metadata.duration / 60)} minutes` }<br/>
                            </p>
                            <button className="btn btn-primary" onClick={ () => setFocusVideo(videoData)}>Select</button><br/>
                            <span className="badge bg-primary mt-2 p-2">Confidence: { videoData.confidence }</span>
                            <span className="badge bg-primary mx-1 p-2">Start: { Math.round(videoData.start) }s</span>
                            <span className="badge bg-primary mt-1 p-2">End: { Math.round(videoData.end) }s</span>
                        </div>
                    </div>
    } else if (videoData.clips) {
        videoCard = <div className="card shadow mb-3 flex-fill">
                        <div className="ratio ratio-16x9">
                            <ReactPlayer 
                                className="card-img-top card-video-top embed-responsive"
                                url={ `${url}?start=${videoData.start}&end=${videoData.end}` }
                                muted={ true }
                                controls={ true }
                                playsinline={ true }
                                height="100%"
                                width="100%"
                                light={ true }
                                config={
                                    { 
                                        youtube: 
                                        { playerVars: 
                                            { 
                                                origin: 'http://localhost:3000/', 
                                                enablejsapi: 1
                                            } 
                                    } 
                                }}
                            />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{ videoData.metadata.filename.split("-")[0] }</h5>
                            <p className="card-text">
                                { `${Math.round(videoData.metadata.duration / 60)} minutes` }<br/>
                            </p>
                            <button className="btn btn-primary" onClick={ () => setFocusVideo(videoData)}>Select</button><br/>
                            <span className="badge bg-primary mt-2 p-2">Max Score: { Math.round(videoData.clips[0].score) }</span>
                            <span className="badge bg-primary mx-1 p-2">Total Matches: { videoData.clips.length }</span>
                        </div>
                    </div>
    } else {
        videoCard = <div className="card shadow mb-3 flex-fill">
                        <div className="ratio ratio-16x9">
                            <ReactPlayer 
                                className="card-img-top card-video-top embed-responsive"
                                url={ url }
                                muted={ true }
                                controls={ true }
                                playsinline={ true }
                                height="100%"
                                width="100%"
                                light={ true }
                                config={{ youtube: { playerVars: { origin: 'http://localhost:3000/', enablejsapi: 1 } } }}
                            />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{ videoData.metadata.filename.split("-")[0] }</h5>
                            <p className="card-text">{ `${Math.round(videoData.metadata.duration / 60)} minutes` }</p>
                            <button className="btn btn-primary" onClick={ () => setFocusVideo(videoData)}>Select</button>
                        </div>
                    </div>
    };

    return (
        <div className="col-auto d-flex">
           { videoCard }
        </div>
    );
}

export default VideoCard;
