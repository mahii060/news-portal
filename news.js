let fetchedData = [];
const fetchCategories = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => { showCategories(data.data.news_category) })
};
const showCategories = (categories) => {
    console.log(categories)
    const categoriesContainer = document.getElementById('categories-container');
    categories.forEach((singleCategory) => {
        // console.log(singleCategory)
        const { category_id, category_name } = singleCategory;
        categoriesContainer.innerHTML += `
        <a class="nav-link text-primary" href="#" onclick="fetchAllCategoryNews('${category_id}','${category_name}')">${category_name}</a>
        `;
    });
};
const fetchAllCategoryNews = (category_id, category_name) => {
    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
    // console.log(url)
    fetch(url)
        .then(res => res.json())
        .then(data => {
            fetchedData = data.data;
            showAllCategoryNews(data.data, category_name)
        })
};
const showAllCategoryNews = (categoryAllNews, category_name) => {
    console.log(categoryAllNews);
    document.getElementById('news-count').innerHTML = categoryAllNews.length;
    document.getElementById('category-name').innerHTML = category_name;
    const allNewsContainer = document.getElementById('all-news');
    allNewsContainer.innerHTML = "";
    categoryAllNews.forEach((categorySingleNews) => {
        const { author, details, image_url, others_info, rating, title, total_view, _id } = categorySingleNews;
        allNewsContainer.innerHTML += `
        <div class="card mb-3 p-2">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${image_url}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8 d-flex flex-column">
                    <div class="card-body">
                        <h5 class="card-title">${title} <span class="badge text-bg-danger">${others_info.is_trending ? "Trending" : ""}</span></h5>
                        <p class="card-text">${details.slice(0, 200)}...</p>
                    </div>
                    <div class="d-flex justify-content-between card-footer border-0 bg-body">
                        <div class="d-flex gap-2 align-items-center justify-content-center">
                            <div>
                                <img src="${author.img}" class="img-fluid rounded-circle" alt="..." height="40" width="40">
                            </div>
                            <div>
                                <p>Author Name: <span class="text-primary">${author.name ? author.name : "Not Available"}</span></p>
                                <p>${(() => {
                const publishedDate = new Date(author.published_date);

                if (!isNaN(publishedDate)) {
                    const options = {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                    };
                    return publishedDate.toLocaleString('en-GB', options);
                } else {
                    return 'Invalid date format for author.published_date';
                }
            })()}
                                </p>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div>
                                <i class="fa-solid fa-eye fa-xl"></i>
                            </div>
                            <div>
                                <p>${total_view ? total_view : "N/A"}</p>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div>
                            ${generateStars(rating.number)}
                            </div>
                            <div>
                                <p>${rating.number}</p>
                            </div>
                        </div>
                        <div>
                        <i class="fa-solid fa-circle-arrow-right fa-2xl text-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick=fetchNewsDetails('${_id}')></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    });
};
const generateStars = (rating) => {
    let ratingHtml = "";
    for (let i = 1; i <= Math.floor(rating); i++) {
        ratingHtml += `<i class="fa-solid fa-star fa-xl" style="color: #FFD43B;"></i>`;
    };
    if (rating - Math.floor(rating) > 0) {
        ratingHtml += `<i class="fa-solid fa-star-half-stroke fa-xl" style="color: #FFD43B;"></i>`;
    };
    return ratingHtml;
};
const fetchNewsDetails = (news_id) => {
    const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => showNewsDetails(data.data[0]))
};
const showNewsDetails = (newsDetail) => {
    // console.log(newsDetail)
    const { author, image_url, others_info, rating, title, total_view, details } = newsDetail;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
    <div class="card mb-3 p-2">
            <div class="row g-0">
                <div class="col-md-12">
                    <img src="${image_url}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-12 d-flex flex-column">
                    <div class="card-body">
                        <h5 class="card-title">${title} <span class="badge text-bg-danger">${others_info.is_trending ? "Trending" : ""}</span></h5>
                        <p class="card-text">${details}</p>
                    </div>
                    <div class="d-flex justify-content-between card-footer border-0 bg-body">
                        <div class="d-flex gap-2 align-items-center justify-content-center">
                            <div>
                                <img src="${author.img}" class="img-fluid rounded-circle" alt="..." height="40" width="40">
                            </div>
                            <div>
                                <p>${author.name ? author.name : "Not Available"}</p>
                                <p>${author.published_date}</p>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div>
                                <i class="fa-solid fa-eye fa-xl"></i>
                            </div>
                            <div>
                                <p>${total_view}</p>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div>
                                ${generateStars(rating.number)}
                            </div>
                            <div>
                                <p>${rating.number}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    `;
};

const showTrending = () => {
    const trendingNews = fetchedData.filter(singleData => singleData.others_info.is_trending === true);
    const category_name = document.getElementById('category-name').innerText;
    showAllCategoryNews(trendingNews, category_name);
};
const showTodaysPick = () => {
    const todaysPick = fetchedData.filter(singleData => singleData.others_info.is_todays_pick === true);
    const category_name = document.getElementById('category-name').innerText;
    showAllCategoryNews(todaysPick, category_name);
};



