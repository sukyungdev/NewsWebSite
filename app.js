let news = [];
let url = null;
let totalPages = null;
let page = 1;

const menuTopic = document.querySelectorAll(".menubar a");
const inputArea = document.querySelector("#input-form input");
const inputBtn = document.querySelector("#input-form button");

menuTopic.forEach((item) => {
  item.addEventListener("click", (event)=>{findNewsByMenuTopic(event)});
});
inputBtn.addEventListener("click", (event)=>{searchByUserInput(event)});


// menu toggle
const inputForm = document.querySelector("#input-form");
const menuOnBtn = document.querySelector(".menuOn");
const menuOffBtn = document.querySelector(".menuOff");
const menu = document.querySelector(".menu-box");

menuOnBtn.addEventListener("click", () => { menu.classList.add("active");});
menuOffBtn.addEventListener("click", () => { menu.classList.remove("active");});


// function creation

//request news data
async function requestNewsData() {
  let header = new Headers({'x-api-key' : 'JRooEsxKAGjRMOqYE3x9GWgV8WCzSB6AGQ2uODlNlgE'});
  url.searchParams.set("page", page);
  console.log(url);
  let requestNews = await fetch(url, {headers : header});
  let receiveNews = await requestNews.json();
  console.log(receiveNews);
  news = receiveNews.articles;
  totalPages = receiveNews.total_pages;
  page = receiveNews.page
  renderNews();
  paginationMaker();
};

// receive news
const latestHeadLineNews = () => {
  url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=6');
  requestNewsData();
};


// search by menu topic
const findNewsByMenuTopic = async(event) => {
  let topic = event.target.textContent;
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=6`);
  requestNewsData();
};

// search by user input
const searchByUserInput = async() => {
  let userInput = inputArea.value.toLowerCase();
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${userInput}&countries=KR&page_size=6`);
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

// make pagination
const paginationMaker = () => {
  let pageGroup = Math.ceil(page / 5);
  let lastPageInGroup = (pageGroup * 5);
  let firstPageInGroup = lastPageInGroup - 4 <= 0 ? firstPageInGroup = 1 : lastPageInGroup - 4;

  if(lastPageInGroup > totalPages){
    lastPageInGroup = totalPages
  };

  // render pagination
  let paginationRenderHtml = "";

  if(firstPageInGroup >= 6){
    paginationRenderHtml = `
    <li class="page-item">
      <a class="page-link" href="#" onclick="movePage(${1})" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item">
    <a class="page-link" href="#" onclick="movePage(${page - 1})" aria-label="Previous">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;
  }

  for(let i = firstPageInGroup; i <= lastPageInGroup; i++){
    paginationRenderHtml += `<li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="movePage(${i})">${i}</a></li>`;
  };

  if (lastPageInGroup < totalPages){
    paginationRenderHtml += ` 
  <li class="page-item">
    <a class="page-link" href="#" onclick="movePage(${page + 1})" aria-label="Previous">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
  <li class="page-item">
  <a class="page-link" href="#" onclick="movePage(${totalPages})" aria-label="Previous">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationRenderHtml;
};

const movePage = (NowPageNum) => {
  page = NowPageNum;
  console.log(page);
  requestNewsData();
};


// function call
latestHeadLineNews();

