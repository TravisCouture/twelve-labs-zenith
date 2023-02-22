import React from "react";
import ReactPlayer from "react-player";
import { getQueryVideos } from "./Api";

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;

function CombinedSearchFocusCard({ focusVideo, setFocusVideo, focusVideoState, setFocusVideoState, videoData, url, apiVideos, setApiVideos, indexVideos, selectedIndex }) {
    const [searchButtonDisabled, setSearchButtonDisabled] =  React.useState(false);
    const [query1, setQuery1] = React.useState();
    const [query2, setQuery2] = React.useState();
    const [queryOperator, setQueryOperator] = React.useState("AND");
    const [queryTimeRelation, setQueryTimeRelation] = React.useState("WITHIN");
    const [queryProximity, setQueryProximity] = React.useState(30);
    const videoElement = React.createRef();

    const updateQueryResults = (data) => {
        let foundVideos = indexVideos.filter(video => {
            return data.some(clip => { 
                return clip.video_id === video._id
            });
        });

        let mergedVideos = [];

        for(let i=0; i<foundVideos.length; i++) {
            let clips = data.filter((clip) => {
                if (clip.video_id === foundVideos[i]._id) {
                    return clip
                }
            });

            mergedVideos.push({
                ...foundVideos[i], 
                "clips": clips,
            });
        }
        setSearchButtonDisabled(false);
        setApiVideos(mergedVideos);
        setFocusVideo(mergedVideos[0]);
    };

    const handleSearchForMoments = () => {
        setSearchButtonDisabled(true);
        
        const reponse = getQueryVideos(API_URL, API_KEY, selectedIndex, query1, query2, queryOperator, queryProximity, queryTimeRelation);

        reponse.then((json) => { updateQueryResults(json.data) });
    };

    const updateOperator = (event) => {
        setQueryOperator(event.target.value);
        if (event.target.value === "AND" ) {
            setQueryTimeRelation("WITHIN");
        } else if (event.target.value === "THEN" && queryTimeRelation === "WITHIN") {
            setQueryTimeRelation("AFTER");
        };
    };

    const renderTimeline = () => {
        let timeline = [];
        let markers

        if (focusVideo.clips) {
            markers = focusVideo.clips.map(clip => { return clip.start });
        }

        for (let i=0; i<=Math.ceil(focusVideo.metadata.duration); i++) {
            let timelineItem;

            if (markers && markers.includes(i)) {
                timelineItem = <div className="timeline-item timeline-marker" key={ i } data-time={ i } onClick={(event) => videoElement.current.seekTo(event.target.getAttribute("data-time"))} />
            } else {
                timelineItem = <div className="timeline-item" key={ i } data-time={ i } onClick={(event) => videoElement.current.seekTo(event.target.getAttribute("data-time"))} />
            };

            timeline.push(timelineItem);
        };

        return <div className="timeline">{ timeline }</div>;
    };

    let searchSpinner;
    let queryControls;
    let timeRelationControls;
    let promximityControls = <input className="form-control" type="number" value={ queryProximity } onChange={event => setQueryProximity(event.target.value) }/>

    if (queryOperator === "THEN") {
        timeRelationControls = <select className="form-select" 
                                    aria-label="Default select example" 
                                    value={ queryTimeRelation } 
                                    onChange={(event) => setQueryTimeRelation(event.target.value)}>
                                        <option value="BEFORE">BEFORE</option>
                                        <option value="AFTER">AFTER</option>
                                </select>
    } else if (queryOperator === "AND") {
        timeRelationControls = <select className="form-select" 
                                    aria-label="Default select example" 
                                    value={ queryTimeRelation } 
                                    disabled>
                                        <option value="WITHIN">WITHIN</option>
                                </select>
    } else {
        timeRelationControls = <select className="form-select" aria-label="Default select example" disabled />
        promximityControls = <input className="form-control" type="number" disabled value="" />
    };

    if (searchButtonDisabled) {
        searchSpinner = <button className="btn btn-primary m-3" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Searching...
                        </button>

        queryControls = <div className="row">
                            <div className="col d-flex justify-content-center">
                                { searchSpinner }
                            </div>
                        </div>
    } else {
        searchSpinner = <button className="btn btn-primary m-3" type="button"onClick={ handleSearchForMoments } title="Only First Page Of Results Returned">
                            Search For Moments
                        </button>

        queryControls = <form>
                            <div className="row m-1">
                                <div className="col">
                                    <label className="form-label">Query 1</label>
                                    <textarea className="form-control" 
                                        placeholder="Mr. Beast gives away cash"
                                        value={ query1 } 
                                        onChange={event => setQuery1(event.target.value)}>
                                            { query1 }
                                    </textarea>
                                </div>
                                <div className="col">
                                    <label className="form-label">Operator</label>
                                    <select className="form-select" 
                                        aria-label="Default select example" 
                                        value={ queryOperator }
                                        onChange={(event) => updateOperator(event)}>
                                            <option value="OR">OR</option>
                                            <option value="AND">AND</option>
                                            <option value="THEN">THEN</option>
                                    </select>
                                    <label className="form-label mt-1">Relation</label>
                                    { timeRelationControls }
                                    <label className="form-label mt-1">Proximity (Seconds)</label>
                                    { promximityControls }
                                    <div className="row">
                                        <div className="col d-flex justify-content-center">
                                            { searchSpinner }
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <label className="form-label">Query 2</label>
                                    <textarea className="form-control" 
                                        placeholder="Someone is on stage"
                                        value={ query2 } 
                                        onChange={event => setQuery2(event.target.value)}>
                                            { query2 }
                                    </textarea>
                                </div>
                            </div>
                            </form>
    }; 

    return(
        <div className="col">
            <div className="row d-flex">
                <div className="card shadow flex-fill">
                    <div className="card-body">
                        <p className="card-text"><strong>Combined Query Controls</strong></p>
                    </div>
                    { queryControls }
                </div>
            </div>
            <div className="row d-flex mt-1">
                <div className="card shadow p-0">
                    <ReactPlayer
                        className="card-img-top focus-video" 
                        url={ url }
                        muted={ true }
                        controls={ true }
                        playsinline={ true }
                        playing={ true }
                        height="30vmin"
                        width="auto"
                        light={ true }
                        ref={ videoElement }
                    />
                    <div className="card-body">
                        <h5 className="card-title">{ `${videoData.metadata.filename.split("-")[0]}` }</h5>
                        <p className="card-text">{ `${Math.round(videoData.metadata.duration / 60)} minutes` }</p>
                        { renderTimeline() }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CombinedSearchFocusCard;
