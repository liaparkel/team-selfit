document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(location.search);
    const categoryId = parseInt(urlParams.get('categoryId')) || 1;
    const pageSize = 10;
    let currentPage = 1;
    let currentSort = 'recent';
    let currentKeyword = '';

    console.log("board.js 진입");

    const sortMap = {
        '최신순': 'recent',
        '조회순': 'views',
    };

    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('click', function () {
            const selectedSort = sortMap[this.value] || 'recent';

            // 정렬 기준이 바뀐 경우만 fetch
            if (currentSort !== selectedSort) {
                currentSort = selectedSort;
                fetchAndRender(currentPage);
            }
            // 동일한 정렬일 경우 아무 동작하지 않음
        });
    });

    async function fetchAndRender(page) {
        try {
            const res = await axios.get('/api/board/list', {
                params: {
                    page: page,
                    categoryId: categoryId,
                    keyword: currentKeyword,
                    sortOrder: currentSort
                }
            });

            const boards = res.data;
            console.log(boards.sortOrder);

            const titleElement = document.querySelector('.board-title p');
            if (titleElement && boards.length > 0) {
                titleElement.textContent = boards[0].categoryName;
            }
            renderPage(boards, page);
        } catch (err) {
            console.error('데이터 불러오기 실패', err);
        }
    }


    // 페이지 렌더링
    function renderPage(boards, page) {
        const list = document.querySelector('.board-list');
        list.innerHTML = '';

        const slice = boards.slice(0, pageSize);
        slice.forEach(board => {
            const item = document.createElement('div');
            item.className = 'board-list';
            item.innerHTML = `
                <div class="board-title">
                    <a href="/board/detail/${board.boardId}">
                     ${board.boardTitle}
                    </a>
                </div>
                <div class="board-author">${board.nickName}</div>
                <div class="board-views">${board.viewCount}</div>
                <div class="board-date">${board.createdDate?.substring(2).replace(/-/g, '.')}</div>
            `;
            list.appendChild(item);
        });

        renderPagination(page, boards.length);
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

    window.goPage = function (page) {
        currentPage = page;
        fetchAndRender(page);
    };

    // // 페이지 이동
    // function goPage(page) {
    //     currentPage = page;
    //     renderPage(page);
    // }

    // 초기 실행
    fetchAndRender(currentPage);
});