const axios = require('axios');

const getartist = async(body) => {
    try {
        const data = await axios({
            method: 'GET',
            url: `https://www.jiosaavn.com/api.php?__call=artist.getArtistPageDetails&artistId=${body.id}&type=songs&n_song=${body.limit}&category=&sort_order=&ctx=web6dot0&api_version=4&_format=json&_marker=0`
        })
        return data.data

    } catch (err) {
        return {
            "error": "invalid Id! "
        }
    }



}

// getartist({
//     id: "4878402",
//     limit: 5
// }).then(result => {
//     console.log(result)
// })

const topsearch = async() => {
    const data = await axios({
        method: 'GET',
        url: `https://www.jiosaavn.com/api.php?__call=content.getTopSearches&ctx=web6dot0&api_version=4&_format=json&_marker=0`
    })
    return data.data
}

// topsearch().then(result => {
//     console.log(result)
// })

const getSongById = async(id) => {
    const data = await axios({
        method: 'Get',
        url: `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`
    })
    return data.data[id]

}

// getSongById("CDa795cA").then(result => {
//     console.log(result)
// })

const playById = async(id) => {
    const data = await axios({
        method: 'GET',
        url: `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`
    })
    const x = data.data[id]
    const token = x.encrypted_media_path
    console.log(token)
    const data1 = await axios({
        method: 'GET',
        url: `https://www.jiosaavn.com/api.php?__call=song.generateAuthToken&url=${token}&bitrate=320&api_version=4&_format=json&ctx=web6dot0&_marker=0`
    })
    const y = {
        ...x,
        "streamurl": data1.data
    }
    console.log(y)
}

playById("0TA8viDp").then(result => {
    console.log(result)
})