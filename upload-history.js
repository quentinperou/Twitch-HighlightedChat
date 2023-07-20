
// Upload history from json file

const upload_bt = document.getElementById('upload-json');

upload_bt.addEventListener('click', function (e) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.json');
    input.onchange = e => {
        // getting a hold of the file reference
        const file = e.target.files[0];
        // setting up the reader
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            const content = readerEvent.target.result; // this is the content!
            const data = JSON.parse(content);
            console.log(data);
            const channelInUrl = location.search.substring(1).split('&')[0].split('=')[1].toLowerCase();

            //check if channel is the same
            if (channelInUrl != data[0].extra.channel) {
                alert("This file is not for this channel");
                return;
            } else if (localStorage.getItem("HgltCt-messagesSave-" + channelInUrl) != null) {
                if (confirm("Are you sure you want to merge with current history?")) {
                    //get curent history and add new data
                    const curentcontent = localStorage.getItem("HgltCt-messagesSave-" + channelInUrl);
                    const curentData = JSON.parse(curentcontent);
                    const result = curentData.concat(data);
                    //sort by date and remove duplicate, check if message is not empty
                    const unique = result.filter((thing, index, self) => index === self.findIndex((t) => (t.date === thing.date && t.user === thing.user && t.message === thing.message && t.message != "")));
                    unique.sort((a, b) => (a.date > b.date) ? 1 : -1);
                    //save
                    localStorage.setItem("HgltCt-messagesSave-" + channelInUrl, JSON.stringify(unique));
                    window.location.reload();
                }
            } else {
                localStorage.setItem("HgltCt-messagesSave-" + channelInUrl, content);
                window.location.reload();
            }
        }
    }
    input.click();
});

////// test version 1 //////
// const sorted = result.sort((a, b) => a.date - b.date);
// const unique = sorted.filter((v, i, a) => a.findIndex(t => (t.date === v.date)) === i);