const urlParams = new URLSearchParams(window.location.search);
const categoryId = parseInt(urlParams.get('categoryId')) || 1; // 기본 카테고리ID는 1

// 페이지당 표시할 개수
const pageSize = 10;
let currentPage = 1;
console.log("board.js 진입");

document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('mousedown', function () {
        this._wasChecked = this.checked;
    });
    radio.addEventListener('click', function () {
        if (this._wasChecked) this.checked = false;
    });
});

// 25개의 mock 포스트 생성 함수
function generatePosts(prefix, authorPrefix) {
    return Array.from({length: 25}, (_, i) => ({
        id: i + 1,
        title: `${prefix} ${i + 1}`,
        author: `${authorPrefix}${i + 1}`,
        views: (i + 1) * 10,
        createdDate: `2023-05-${String(i + 1).padStart(2, '0')}`
    }));
}

// 카테고리ID별 mock 데이터 (각 25개)
const mockData = {
    1: generatePosts('식단 샘플 게시글', '작성자'),
    2: generatePosts('운동 샘플 게시글', '운동러'),
    3: generatePosts('자유 샘플 게시글', '유저')
};

// 현재 카테고리ID에 해당하는 mock 포스트 반환
function getMockPosts() {
    return mockData[categoryId] || [];
}

// 페이지 렌더링
function renderPage(page) {
    const posts = getMockPosts();
    console.log(posts);
    const start = (page - 1) * pageSize;
    const pagePosts = posts.slice(start, start + pageSize);
    const list = document.querySelector('.board-list');
    console.log(list);
    list.innerHTML = '';

    pagePosts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'board-list';
        item.innerHTML = `
      <div class="board-title"><a href="/board/meal/${post.id}?categoryId=${categoryId}">${post.title}</a></div>
      <div class="board-author">${post.author}</div>
      <div class="board-views">${post.views}</div>
      <div class="board-date">${post.createdDate.substring(2).replace(/-/g, '.')}</div>
    `;
        list.appendChild(item);
    });

    renderPagination(page, posts.length);
}

// 페이지네이션 렌더링
function renderPagination(page, totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = document.querySelector('.board-pagination');
    pagination.innerHTML = '';

    if (page > 1) {
        pagination.innerHTML += `<button onclick="goPage(1)">&lt;&lt;</button><button onclick="goPage(${page - 1})">&lt;</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<button class="${i === page ? 'current' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    if (page < totalPages) {
        pagination.innerHTML += `<button onclick="goPage(${page + 1})">&gt;</button><button onclick="goPage(${totalPages})">&gt;&gt;</button>`;
    }
}

// 페이지 이동
function goPage(page) {
    currentPage = page;
    renderPage(page);
}

// 초기 렌더링
document.addEventListener('DOMContentLoaded', () => renderPage(currentPage));