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

    // --- 게시글 추가 (Add) – AJAX POST 처리 ----
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1) 폼 필드 값 가져오기
            const titleInput = postForm.querySelector('input[name="postTitle"]');
            const contentInput = postForm.querySelector('textarea[name="postContents"]');
            const selectEl = postForm.querySelector('select[name="categoryId"]');

            const payload = {
                boardTitle: titleInput.value.trim(),
                boardContent: contentInput.value.trim(),
                categoryId: parseInt(selectEl.value)
            };

            // Validation: 제목/내용/카테고리가 비어있으면 요청 중단
            if (!payload.boardTitle) {
                alert('제목을 입력해주세요.');
                return;
            }
            if (!payload.boardContent) {
                alert('내용을 입력해주세요.');
                return;
            }
            if (!payload.categoryId) {
                alert('카테고리를 선택해주세요.');
                return;
            }

            try {
                // 2) POST 요청
                const res = await axios.post('/api/board/add', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // 3) 성공 시 알림 및 리다이렉트(원하는 페이지로 변경 가능)
                alert('게시글 등록 성공');
                window.location.href = `/board/list?categoryId=${payload.categoryId}`;
            } catch (err) {
                console.error('게시글 등록 실패', err);
                if (err.response) {
                    alert('등록 실패: ' + err.response.status);
                } else {
                    alert('등록 중 네트워크 오류가 발생했습니다.');
                }
            }
        });
    }


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