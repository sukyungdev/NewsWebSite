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
  try {
    // setting header url
    let header = new Headers({'x-api-key' : 'JRooEsxKAGjRMOqYE3x9GWgV8WCzSB6AGQ2uODlNlgE'});
    url.searchParams.set("page", page);
    console.log(url);
    // request data
    let requestNews = await fetch(url, {headers : header});
    let receiveNews = await requestNews.json();
    console.log(requestNews);
    // state ok
    if(requestNews.status == 200) {
      if(receiveNews.total_hits == 0){
        throw new Error("No matches for your search.")
      }
      console.log("받은 데이터는", receiveNews);
      news = receiveNews.articles;
      
      totalPages = receiveNews.total_pages;
      page = receiveNews.page
      renderNews();
      paginationMaker();
    } else {
      throw new Error(receiveNews.message);
    }

  }catch(error){
    console.log("에러는", error.message);
    errorRender(error.message);
  }

  
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
const searchByUserInput = async(event) => {
  event.preventDefault();
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
      <a href="${news[i].link}" target="_blank">
          <div class="news-content">
              <img
                  src="${news[i].media || 'https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?b=1&k=20&m=1128826884&s=170667a&w=0&h=7tmZDF3-85_rT_7luTYWkXydcRF4ZQ0UWIbW4IwX32E='}"
                  alt="news-img"
              />
              <h2 class="news-title">${news[i].title}</h2>
              <p>
              ${news[i].summary == null || news[i].summary == "" ? "내용없음" 
              : news[i].summary.length > 150 ? news[i].summary.substring(0, 150) + "..." 
              : news[i].summary}
              </p>
              <span>${moment(news[i].published_date).fromNow()} - ${news[i].rights || "no rights info"}</span>
          </div>
        </a>
      </div>`;
    };
    
  };

  document.querySelector(".news .row").innerHTML = renderNewsHTML;
};

//error render
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-primary text-center" role="alert">
  ${message}
</div>`;
  document.querySelector(".news .row").innerHTML = errorHTML;
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

