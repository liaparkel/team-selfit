document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(location.search);
    const categoryId = parseInt(urlParams.get('categoryId')) || 1;
    const pageSize = 10;
    let currentPage = 1;
    let currentSort = 'recent';
    let currentKeyword = '';

    const sortMap = {
        '최신순': 'recent',
        '조회순': 'views',
    };

    // --- 검색창 요소 가져오기 ───────────────────────────────────────
    const searchInput = document.querySelector('.searchTotal');
    if (searchInput) {
        // Enter 키 눌렀을 때 검색어를 currentKeyword에 반영하고 1페이지 다시 로드
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                currentKeyword = searchInput.value.trim();
                currentPage = 1;
                fetchAndRender(currentPage);
                searchInput.value = '';
            }
        });
    }

    // --- 게시글 추가 (Add) – AJAX POST 처리 ----
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titleInput = postForm.querySelector('input[name="postTitle"]');
            const contentInput = postForm.querySelector('textarea[name="postContents"]');
            const selectEl = postForm.querySelector('select[name="categoryId"]');

            const payload = {
                boardTitle: titleInput.value.trim(),
                boardContent: contentInput.value.trim(),
                categoryId: parseInt(selectEl.value)
            };

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
                await axios.post('/api/board/add', payload, {
                    headers: {'Content-Type': 'application/json'}
                });
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

    // 정렬 옵션 변경 시 처리
    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('click', () => {
            const selectedSort = sortMap[radio.value] || 'recent';
            if (currentSort !== selectedSort) {
                currentSort = selectedSort;
                fetchAndRender(currentPage);
            }
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

            const boards = res.data; // List<Board>
            let totalItems = 0;
            if (boards.length > 0) {
                totalItems = boards[0].totalCount || 0;
            }

            const titleElement = document.querySelector('.board-title p');
            if (titleElement && boards.length > 0) {
                titleElement.textContent = boards[0].categoryName;
            }

            renderPage(boards);
            renderPagination(page, totalItems);
        } catch (err) {
            console.error('데이터 불러오기 실패', err);
        }
    }

    function renderPage(boards) {
        const list = document.querySelector('.board-list');
        const noResults = document.querySelector('.no-results-message');
        const pagination = document.querySelector('.board-pagination');
        list.innerHTML = '';

        // 2) 검색 결과가 없으면 빈 메시지 표시하고 리턴
        if (!Array.isArray(boards) || boards.length === 0) {
            noResults.style.display = 'flex';
            // 필요하다면 페이징도 숨김
            // pagination.style.display = 'none';
            return;
        }

        // 3) 결과가 있을 때는 빈 메시지 숨기기
        noResults.style.display = 'none';

        // 4) 실제 게시글 아이템을 렌더링
        boards.forEach(board => {
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
    }

    function renderPagination(page, totalItems) {
        const totalPages = Math.ceil(totalItems / pageSize);
        const pagination = document.querySelector('.board-pagination');
        pagination.innerHTML = '';

        if (page > 1) {
            pagination.innerHTML += `
                <button onclick="goPage(1)">&lt;&lt;</button>
                <button onclick="goPage(${page - 1})">&lt;</button>
            `;
        }
        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
                <button class="${i === page ? 'current' : ''}"
                        onclick="goPage(${i})">${i}</button>
            `;
        }
        if (page < totalPages) {
            pagination.innerHTML += `
                <button onclick="goPage(${page + 1})">&gt;</button>
                <button onclick="goPage(${totalPages})">&gt;&gt;</button>
            `;
        }
    }

    window.goPage = function (page) {
        currentPage = page;
        fetchAndRender(page);
    };

    fetchAndRender(currentPage);
});
