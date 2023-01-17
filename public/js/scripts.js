document.addEventListener("DOMContentLoaded", ()=> {
    getRedditData();
    getNews();
    getWeather();
})

// Updates Menu section
function MenuScrape() {
    fetch('/menu')
    .then(response => response.json())
    .then(result => {
        for (const element of [0, 1, 2]) {
            var generated_html = 
            `<li>${result[element][0]}</li>
             <li>${result[element][1]}</li>
             <li>${result[element][2]}</li>
            `;
            document.getElementById(`${element}`).innerHTML = generated_html;
        }
    })
    .catch(error => console.error(error))
}

// Updates Reddit section
function getRedditData(){
    fetch('https://www.reddit.com/r/berkeley/hot/.json')
    .then(response => response.json())
    .then(result => {
        for (var i=0;i<3;i++){
            var calculated_time = new Date(result.data.children[i+2].data.created_utc*1000);
            calculated_time = Math.round((new Date() - calculated_time) / 3600000);
            document.getElementsByClassName("redditHr")[i].innerText = calculated_time + " hours ago";
            document.getElementsByClassName("redditUps")[i].innerText = result.data.children[i+2].data.ups + " ups";
            document.getElementsByClassName("redditFlair")[i].innerText = result.data.children[i+2].data.link_flair_text;
            document.getElementsByClassName("redditTitle")[i].innerHTML = `<a href="https://reddit.com${result.data.children[i+2].data.permalink}" target="_blank">${result.data.children[i+2].data.title}</a>`;
        }
    })
    .catch(error => console.error(error))
}

// Updates News section
function getNews(){
    fetch('/news')
    .then(response => response.json())
    .then(result => {
        var actual_data = result.articles;
        for (var i=0;i<Math.min(3, actual_data.length);i++){
            document.getElementsByClassName("newsTitle")[i].innerHTML = `<a href="${actual_data[i]['url']} target='_blank'">${actual_data[i]['title']}</a>`;
        }
    })
    .catch(error => console.log(error))
}

// Updates Weather section
function getWeather() {
    fetch('/weather')
    .then(response => response.json())
    .then(result => {
        for (var i=0;i<8;i++) {
            document.getElementsByName("weatherDate")[i].innerText = result.data[i].date.substring(10, result.data[i].date.length - 3);
            document.getElementsByName("weatherTemp")[i].innerText = result.data[i].temp;
            document.getElementsByName("weatherStatus")[i].innerText = result.data[i].status;
        }
    })
}