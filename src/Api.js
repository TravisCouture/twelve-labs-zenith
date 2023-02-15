export async function getVideos (api_url, index_id, api_key) {
    const  videos_url = `${api_url}/indexes/${index_id}/videos?page_limit=50`;

    const options = {
        method: "GET",
        headers: {
            "x-api-key": api_key
        }
    };

    const response = await fetch(videos_url, options);
    return await response.json();
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

    const response = await fetch(v2v_search_url, options);
    return await response.json();
};
