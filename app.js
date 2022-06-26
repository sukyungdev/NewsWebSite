let news = [];
let url = null;
const menuTopic = document.querySelectorAll(".menubar a");
const inputArea = document.querySelector("#input-form input");
const inputBtn = document.querySelector("#input-form button");

menuTopic.forEach((item) => {
  item.addEventListener("click", (event)=>{findNewsByMenuTopic(event)});
});
inputBtn.addEventListener("click", (event)=>{searchByUserInput(event)});

// function creation

//request news data
async function requestNewsData() {
  let header = new Headers({'x-api-key' : 'Cjzdcrz9zloEr6VYyhq7JYFd0eBePABU2irDG-3MN0g'});
  let requestNews = await fetch(url, {headers : header});
  let receiveNews = await requestNews.json();
  console.log(receiveNews);
  news = receiveNews.articles;
  renderNews();
}
// receive news
const latestHeadLineNews = () => {
  url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=12');
  requestNewsData();
};


// search by menu topic
const findNewsByMenuTopic = async(event) => {
  let topic = event.target.textContent;
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=12`);
  requestNewsData();
};

// search by user input
const searchByUserInput = async() => {
  let userInput = inputArea.value.toLowerCase();
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${userInput}&countries=KR&page_size=12`);
  requestNewsData();
};


// render news HTML
const renderNews = () => {
  let renderNewsHTML = '';
  for(let i = 0; i < news.length; i++){
    if(news[i].rights == "mk.co.kr") {
      news.splice(i,1);
    } else {
      renderNewsHTML += 
      `<div class="col-12 col-md-6 col-lg-4">
        <div class="news-content">
            <img
                src="${news[i].media}"
                alt="news-img"
            />
            <h2 class="news-title"><a href="${news[i].link}" target="_blank">${news[i].title}</a></h2>
            <p>
            ${news[i].summary == null || news[i].summary == "" ? "내용없음" 
            : news[i].summary.length > 150 ? news[i].summary.substring(0, 150) + "..." 
            : news[i].summary}
            </p>
            <span>${news[i].published_date} - ${news[i].rights}</span>
        </div>
      </div>`;
    };
    
  };

  document.querySelector(".news .row").innerHTML = renderNewsHTML;
};

// function call
latestHeadLineNews();