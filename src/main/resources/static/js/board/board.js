document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(location.search);
    const categoryId = parseInt(urlParams.get('categoryId')) || 1;
    const pageSize = 10;
    let currentPage = 1;

    console.log("board.js 진입");

    // 현재 카테고리ID에 해당하는 mock 포스트 반환
    function getBoardsByCategory() {
        return allBoards.filter(b => b.categoryId === categoryId);
    }


    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('mousedown', function () {
            this._wasChecked = this.checked;
        });
        radio.addEventListener('click', function () {
            if (this._wasChecked) this.checked = false;
        });
    });


    // 페이지 렌더링
    function renderPage(page) {
        const list = document.querySelector('.board-list');
        list.innerHTML = '';
        const boards = getBoardsByCategory();
        const slice = boards.slice((page - 1) * pageSize, page * pageSize);
        console.log(boards);
        console.log(list);

        slice.forEach(board => {
            const item = document.createElement('div');
            item.className = 'board-list';
            item.innerHTML = `
            <div class="board-title">
                <a href="/board/detail/${board.id}">
                 ${board.title}
                </a>
            </div>
          <div class="board-author">${board.author}</div>
          <div class="board-views">${board.views}</div>
          <div class="board-date">${board.createdDate.substring(2).replace(/-/g, '.')}</div>
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

    // 페이지 이동 헬퍼
    window.goPage = function (page) {
        currentPage = page;
        renderPage(page);
    };

    // // 페이지 이동
    // function goPage(page) {
    //     currentPage = page;
    //     renderPage(page);
    // }

    // 초기 실행
    renderPage(currentPage);
});