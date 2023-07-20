
if (location.search.substring(1).split('&')[0].split('=')[0] == "channel") {
    let channelInUrl = location.search.substring(1).split('&')[0].split('=')[1].toLowerCase();

    if (location.search.substring(1).split('&')[1].split('=')[0] == "data") {
        let data = location.search.substring(1).split('&')[1].split('=')[1];
        console.log(location);

        localStorage.setItem("HgltCt-messagesSave-" + channelInUrl, decodeURIComponent(data));
        console.log(decodeURIComponent(data));

        console.log("data saved");

        // window.location.href = `./?channel=${channelInUrl}`;
    }
}

// marche pas y a trop de caractere dans l'url. 