export async function getVideos (api_url, index_id, api_key) {
    const  videos_url = `${api_url}/indexes/${index_id}/videos`;

    const options = {
        method: "GET",
        headers: {
            "x-api-key": api_key
        }
    };

    const response = await fetch(videos_url, options);
    return await response.json();
};