a = [{ "name": "[jfdsffk, hbhdfs, kdsjhfks, khhdak]" }, { "id": "[jfdsffk, hbhdfs, kdsjhfks, khhdak]" }, { "gh": "[jfdsffk, hbhdfs, kdsjhfks, khhdak]" }]

d = {
    '-1w1BUQP': {
        id: '-1w1BUQP',
        type: '',
        song: 'Teri Aankhon Mein',
        album: 'Teri Aankhon Mein',
        year: '2020',
        music: '',
        music_id: '',
        primary_artists: 'Darshan Raval, Neha Kakkar, Manan Bhardwaj',
        primary_artists_id: '888127, 464932, 746774',
        featured_artists: '',
        featured_artists_id: '',
        singers: 'Darshan Raval, Neha Kakkar, Manan Bhardwaj',
        starring: '',
        image: 'https://c.saavncdn.com/099/Teri-Aankhon-Mein-Hindi-2020-20201007061000-150x150.jpg',
        label: '',
        albumid: '22915546',
        language: 'hindi',
        origin: 'none',
        play_count: 80693447,
        copyright_text: '℗ 2020 Super Cassettes Industries Private Limited',
        '320kbps': 'true',
        is_dolby_content: false,
        explicit_content: 0,
        has_lyrics: 'true',
        lyrics_snippet: 'meri aankhon mein bhee tuje dikhataa hai kya?',
        encrypted_media_url: 'ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyTZX2ufGzijjJ8YKrar6NWhLdThKGBpksJNVSMDJyDJIUgo8G0sqVPBw7tS9a8Gtq',
        encrypted_media_path: 'NMKyboFo/Fh/IHor2VL1cqNbIDxQ1Ms+aMp79jX48LR1oz1ec2Y0WDM/H2sSUvUb',
        media_preview_url: 'https://preview.saavncdn.com/099/8de95cb53e1dcad466edcd3ce69669fa_96_p.mp4',
        perma_url: 'https://www.jiosaavn.com/song/teri-aankhon-mein/XVkcADZlZmM',
        album_url: 'https://www.jiosaavn.com/album/teri-aankhon-mein/pZhxheznhEs_',
        duration: '261',
        rights: [Object],
        cache_state: 'false',
        starred: 'false',
        artistMap: [Object],
        release_date: '2020-10-07',
        vcode: '010910091185262',
        vlink: 'https://jiotunepreview.jio.com/content/Converted/010910091141867.mp3',
        triller_available: false,
        label_url: '/label/-albums/6DLuXO3VoTo_'
    }
}

// a = d.split()

const { base64encode, base64decode } = require('nodejs-base64');
const jwt = require('jsonwebtoken')


// x = "hi i am rahul"
// for (j = 0; j < 5; j++) {

//     x = base64encode(x);


// }
// console.log(x)

// voot rest api
async function handleRequest(request) {

    var result = await fetch(`https://gwapi.zee5.com/content/details/0-0-movie_1460826290?translation=en&country=IN&version=2`, {
        headers: {
            "x-access-token": await token(),
            'Content-Type': 'application/json'
        }
    })
    var result = await result.json()

    const error_msg = {
        "status": "failed",
        "message": "Invalid URL"
    }

    if (result.title == undefined || result.image_url == undefined) {
        return new Response(JSON.stringify(error_msg), {
            status: 400,
            headers: ({
                "Content-Type": "application/json",
            })
        })
    } else {
        var pass = ({
            title: result.title,
            image: result.image_url,
            description: result.description,
            hls: `https://zee5vodnd.akamaized.net${result.hls[0].replace("drm", "hls")}${await token()}`
        })
        res_data = {
            "title": pass.title,
            "description": pass.description,
            "thumbnail": pass.image,
            "Video_URL": pass.hls
        }
        return new Response(await JSON.stringify(res_data), {
            status: 200,
            headers: ({
                "Content-Type": "application/json",
            })
        })
    }
}

async function token() {
    var token = await fetch('https://useraction.zee5.com/tokennd/')
    var token = await token.json()
    return token.video_token
}


// console.log(d["-1w1BUQP"].id)