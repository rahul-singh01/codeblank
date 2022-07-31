var axios = require("axios").default;

var options = {
    method: 'GET',
    url: 'https://radio-world-50-000-radios-stations.p.rapidapi.com/v1/radios/searchByCountry',
    params: { query: 'in' },
    headers: {
        'x-rapidapi-host': 'radio-world-50-000-radios-stations.p.rapidapi.com',
        'x-rapidapi-key': '0e0e1ae423msha5a4dc4b93fedb5p1d215fjsn550b1047924a'
    }
};

axios.request(options).then(function(response) {
    console.log(response.data);
}).catch(function(error) {
    console.error(error);
});