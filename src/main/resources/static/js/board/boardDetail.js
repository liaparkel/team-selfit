document.addEventListener('DOMContentLoaded', () => {
    const parts = window.location.pathname.split('/');
    const boardId = parseInt(parts.filter(p => p).pop(), 10);
    const commentsPerPage = 5;
    let currentCommentPage = 1;
    let boardData = null;

    console.log("게시글 ID:", boardId);

    // 게시글 정보 불러오기
    axios.get(`/api/board/detail/${boardId}`)
        .then(response => {
            boardData = response.data;
            renderBoardDetail(boardData);
            fetchAndRenderComments(currentCommentPage);
        })
        .catch(error => {
            console.error("게시글 데이터를 불러오는 데 실패했습니다.", error);
        });

    // 댓글 가져오기 + 렌더링
    function fetchAndRenderComments(page) {
        axios.get('/api/board/detail', {
            params: {
                boardId: boardId,
                page: page
            }
        })
            .then(response => {
                const comments = response.data;
                renderComments(comments);
                renderCommentPagination(comments.length); // 댓글 수 기준 페이징 렌더링

                console.log("성공" + comments);
            })
            .catch(error => {
                console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
            });
    }

    function renderBoardDetail(board) {
        document.querySelector('.board-category').textContent = board.categoryName || '';
        document.querySelector('.board-title').textContent = board.boardTitle || '';
        document.querySelector('.nickName').textContent = board.nickName || '';
        document.querySelector('.board-body').textContent = board.boardContent || '';
        document.querySelector('.board-image img').setAttribute('src', board.boardImg || '');
        document.querySelector('.board-date').innerHTML = `<i class="bi bi-clock"></i> ${board.createdDate || ''}`;
        document.querySelector('.view-count').innerHTML = `<i class="bi bi-eye"></i> ${board.viewCount || 0}`;
        document.querySelector('.comment-count').innerHTML = `<i class="bi bi-chat-dots"></i> ${board.commentCount || 0}`;
    }

    function renderComments(comments) {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = '';

        comments.forEach(comment => {
            // T 제거해서 날짜 포맷 변경
            const formattedDate = comment.commentDate ? comment.commentDate.replace('T', ' ') : '';

            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `
            <img src="${comment.profileImg}" 
                 onerror="this.onerror=null; this.src='/img/memberImg.png';" 
                 alt="프로필 이미지" class="comment-profile-img">
            <div class="comment-right">
                <div class="comment-nickName-date">
                    <div class="comment-nickName">${comment.nickName || ''}</div>
                    <div class="comment-date">${formattedDate}</div>
                </div>
                <div class="comment-box">
                    <div class="comment-text">${comment.commentContent || ''}</div>
                </div>
            </div>
        `;
            commentList.appendChild(div);
        });
    }

    function renderCommentPagination(totalComments) {
        const totalPages = Math.ceil(totalComments / commentsPerPage);
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        if (currentCommentPage > 1) {
            pagination.innerHTML += `<button onclick="goCommentPage(1)">&lt;&lt;</button>`;
            pagination.innerHTML += `<button onclick="goCommentPage(${currentCommentPage - 1})">&lt;</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `<button class="${i === currentCommentPage ? 'current' : ''}" onclick="goCommentPage(${i})">${i}</button>`;
        }

        if (currentCommentPage < totalPages) {
            pagination.innerHTML += `<button onclick="goCommentPage(${currentCommentPage + 1})">&gt;</button>`;
            pagination.innerHTML += `<button onclick="goCommentPage(${totalPages})">&gt;&gt;</button>`;
        }
    }

    window.goCommentPage = function (page) {
        currentCommentPage = page;
        fetchAndRenderComments(page);
    };
});
