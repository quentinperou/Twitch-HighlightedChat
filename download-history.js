// get the reference of the button
const link_json = document.getElementById('download-history-json');
const link_txt = document.getElementById('download-history-txt');

// current channel
const channelInUrl = location.search.substring(1).split('&')[0].split('=')[1].toLowerCase();
// console.log(channelInUrl);


link_json.addEventListener('click', function (e) {
    //get local storage data
    const content = localStorage.getItem("HgltCt-messagesSave-" + channelInUrl);
    // console.log(content);

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([content], { type: 'text/plain' });

    // Create a URL for the blog object and insert it into an anchor element
    const link = document.createElement("a");

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = "HightlightChat-history-" + channelInUrl + ".json";

    link.click();
    URL.revokeObjectURL(link.href);
});

link_txt.addEventListener('click', function (e) {
    //get local storage data
    const content = localStorage.getItem("HgltCt-messagesSave-" + channelInUrl);

    const data = JSON.parse(content);

    const result = data.map((item) => { return item.date + " ▶ \t" + item.user + " ▶ \t " + item.message; }).join('\n');

    // Create a blog object with the file content which you want to add to the file
    const file2 = new Blob([result], { type: 'text/plain' });

    // Create a URL for the blog object and insert it into an anchor element
    const link = document.createElement("a");

    // Add file content in the object URL
    link.href = URL.createObjectURL(file2);

    // Add file name
    link.download = "HightlightChat-history-" + channelInUrl + ".txt";

    link.click();
    URL.revokeObjectURL(link.href);
});

