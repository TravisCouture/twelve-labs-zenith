export async function getVideos (api_url, index_id, api_key) {
    const  videos_url = `${api_url}/indexes/${index_id}/videos?page_limit=50`;

    const options = {
        method: "GET",
        headers: {
            "x-api-key": api_key
        }
    };

    try {
        const response = await fetch(videos_url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    };
};

export async function getSimilarVideos(api_url, api_key, index_id, video_id, start, end) {
    const v2v_search_url = `${api_url}search/video`;

    const options = {
        method: "POST",
        headers: {
            "x-api-key": api_key,
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "index_id": index_id,
            "page_limit": 50,
            "query": {
                "video_id": video_id,
                "start": start,
                "end": end
            }
        })
    };

    try {
        const response = await fetch(v2v_search_url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    };
};

export async function getQueryVideos(api_url, api_key, index_id, query1, query2, queryOperator, proximity, queryTimeRelation) {
    const search_url = `${api_url}beta/search`;
    let query = {};
    const operatorMap = new Map([
        ["AND", "$and"],
        ["OR", "$or"],
        ["THEN", "$then"]
    ]);

    if (queryTimeRelation === "AFTER") {
        query = {
            "$then": [
                { "text": query1, "option": "visual" },
                { "text": query2, "option": "visual" }
            ],
            "proximity": parseFloat(proximity),
        };
    } else if (queryTimeRelation === "BEFORE") {
        query = {
            "$then": [
                { "text": query2, "option": "visual" },
                { "text": query1, "option": "visual" }
            ],
            "proximity": parseFloat(proximity)
        };
    } else {
        let operatorKey = operatorMap.get(queryOperator);
        query["proximity"] = parseFloat(proximity);
        query[operatorKey] =  [
                { "text": query1, "option": "visual" },
                { "text": query2, "option": "visual" }
            ];
    };

    const options = {
        method: "POST",
        headers: {
            "x-api-key": api_key,
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "index_id": index_id,
            "page_limit": 50,
            "query": query
        })
    };

    try {
        const response = await fetch(search_url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    };
}
