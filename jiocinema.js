const axios = require('axios');

let headersList = {
    "Accept": "*/*",
    "User-Agent": "Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded"
}

let bodyContent = "number=+918287309355";

let reqOptions = {
    url: "https://prod.media.jio.com/apis/common/v3/login/sendotp",
    method: "POST",
    headers: headersList,
    body: bodyContent,
}

axios.request(reqOptions).then(function(response) {
    console.log(response.data);
})