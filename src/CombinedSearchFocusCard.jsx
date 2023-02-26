import React from "react";
import ReactPlayer from "react-player";
import { getQueryVideos } from "./Api";

const API_URL = process.env.REACT_APP_TWELVE_LABS_API_URL;
const API_KEY = process.env.REACT_APP_TWELVE_LABS_API_KEY;

function CombinedSearchFocusCard({ focusVideo, setFocusVideo, focusVideoState, setFocusVideoState, videoData, url, apiVideos, setApiVideos, indexVideos, selectedIndex }) {
    const [searchButtonDisabled, setSearchButtonDisabled] =  React.useState(false);
    const [query1, setQuery1] = React.useState();
    const [query1Option, setQuery1Option] = React.useState("visual");
    const [query2, setQuery2] = React.useState();
    const [query2Option, setQuery2Option] = React.useState("visual");
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
        
        const reponse = getQueryVideos(API_URL, API_KEY, selectedIndex, query1, query1Option, query2, query2Option, queryOperator, queryProximity, queryTimeRelation);

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
        let clips = [...focusVideo.clips].sort((a, b) => a.start - b.start);

        let currentClip = 0;
        for (let i=0; i<=Math.ceil(focusVideo.metadata.duration); i++) {
            let timelineItem = <div 
                                className="timeline-item" 
                                key={ i } 
                                data-time={ i } />

            if (clips[currentClip]) {
                let clip = clips[currentClip];

                if (i === clip.start) {
                    let hoverString = `Start: ${clip.start}s\nEnd: ${clip.end}s\nDuration: ${clip.end - clip.start}s\nScore: ${clip.score}\nconfidence: ${clip.confidence}\n`;

                    timelineItem = <div 
                                    className="timeline-item timeline-marker" 
                                    key={ i } 
                                    data-time={ i } 
                                    title={ hoverString }
                                    style={{ flex: `${2 + clip.end - clip.start}` }}
                                    onClick={(event) => videoElement.current.seekTo(event.target.getAttribute("data-time"))} />

                    currentClip++;
                };
            };

            timeline.push(timelineItem);
        };

        return <div className="timeline">{ timeline }</div>;
    };

    let searchSpinner;
    let queryControls;
    let timeRelationControls;
    let promximityControls = <input className="form-control" type="number" value={ queryProximity } onChange={event => setQueryProximity(event.target.value) }/>
    let timeline;

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
                            <div className="col justify-content-center">
                                { searchSpinner }
                            </div>
                        </div>
    } else {
        searchSpinner = <button className="btn btn-primary m-3" type="button"onClick={ handleSearchForMoments } title="Only First 50 Results By Score Returned">
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
                                    <label className="form-label">Query Option</label>
                                    <select className="form-select" 
                                        aria-label="Default select example" 
                                        value={ query1Option }
                                        onChange={(event) => setQuery1Option(event.target.value)}>
                                            <option value="visual">Visual</option>
                                            <option value="conversation">Conversation</option>
                                            <option value="text_in_video">Text</option>
                                    </select>
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
                                    <label className="form-label">Query Option</label>
                                    <select className="form-select" 
                                        aria-label="Default select example" 
                                        value={ query2Option }
                                        onChange={(event) => setQuery2Option(event.target.value)}>
                                            <option value="visual">Visual</option>
                                            <option value="conversation">Conversation</option>
                                            <option value="text_in_video">Text</option>
                                    </select>
                                </div>
                            </div>
                            </form>
    }; 

    if (focusVideo.clips) {
        timeline = renderTimeline();
    };

    return(
        <> 
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-text">Combined Query Controls</h5>
                </div>
                { queryControls }
            </div>
            <div className="card shadow mt-1">
                <div className="ratio ratio-21x9">
                    <ReactPlayer
                        className="card-img-top" 
                        url={ url }
                        muted={ true }
                        controls={ true }
                        playsinline={ true }
                        playing={ true }
                        height="100%"
                        width="100%"
                        light={ true }
                        ref={ videoElement }
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{ `${videoData.metadata.filename.split("-")[0]}` }</h5>
                    { timeline }
                </div>
            </div>
        </>
    );
};

export default CombinedSearchFocusCard;
