let googleNewsAPI = require("google-news-json");
googleNewsAPI.getNews(googleNewsAPI.SEARCH, "India covid", "en-GB", (err, response) => {
    console.log(response);
    // for (i=0;i<5;i++){
    //     console.log(response['items'][i]['title'])
    // }
});