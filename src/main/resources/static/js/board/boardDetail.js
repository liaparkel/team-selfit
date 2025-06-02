document.addEventListener('DOMContentLoaded', () => {
    const parts = window.location.pathname.split('/');
    const boardId = parseInt(parts.filter(p => p).pop(), 10);
    const commentsPerPage = 5;
    let currentCommentPage = 1;

    const commentList = document.querySelector('.comment-list');
    const pagination = document.querySelector('.pagination');
    const commentInput = document.getElementById('comment-input');
    const commentBtn = document.getElementById('comment-btn');
    const elCommentCount = document.querySelector('.comment-count');
    const ownerButtons = document.querySelector('.owner-buttons');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');


    // ─── 게시글 정보 불러오기 ───────────────────────────────────────────
    axios.get(`/api/board/detail/${boardId}`)
        .then(response => {
            const board = response.data.board;
            const currentUserId = response.data.currentUserId;

            // 작성자 ID(board.memberId)와 로그인 사용자 ID 비교
            if (board.memberId === currentUserId) {
                ownerButtons.style.display = 'block';
            }

            editBtn.addEventListener('click', () => {
                window.location.href = `/board/edit/${boardId}`;
            });
            deleteBtn.addEventListener('click', async () => {
                if (!confirm('정말 삭제하시겠습니까?')) return;
                try {
                    await axios.delete(`/api/board/delete/${boardId}`);
                    alert('삭제되었습니다.');
                    window.location.href = `/board/list?categoryId=${board.categoryId}`;
                } catch (err) {
                    console.error('삭제 실패', err);
                    alert('삭제 중 오류가 발생했습니다.');
                }
            });

            renderBoardDetail(board);
            fetchAndRenderComments(currentCommentPage);
        })
        .catch(error => {
            console.error("게시글 데이터를 불러오는 데 실패했습니다.", error);
        });

    // ─── 댓글 가져오기 + 렌더링 ─────────────────────────────────────────
    function fetchAndRenderComments(page) {
        axios.get('/api/board/detail', {
            params: {
                boardId: boardId,
                page: page
            }
        })
            .then(response => {
                const comments = response.data;
                if (comments.length === 0) {
                    renderComments([]);
                    renderCommentPagination(0);
                    return;
                }

                // 전체 댓글 수: 첫 번째 요소의 totalCount 사용
                const totalComments = comments[0].totalCount;

                renderComments(comments);
                renderCommentPagination(totalComments);
                elCommentCount.innerHTML = `<i class="bi bi-chat-dots"></i> ${totalComments}`;

                console.log("댓글 로드 성공:", comments);
            })
            .catch(error => {
                console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
            });
    }

    // ─── 게시글 상세 렌더링 ────────────────────────────────────────────
    function renderBoardDetail(board) {
        document.querySelector('.board-category').textContent = board.categoryName || '';
        document.querySelector('.board-title').textContent = board.boardTitle || '';
        document.querySelector('.nickName').textContent = board.nickName || '';
        document.querySelector('.board-body').textContent = board.boardContent || '';

        // 이미지 처리: board.boardImg가 유효할 때만 src 설정
        const imgEl = document.querySelector('.board-image img');
        if (board.boardImg && board.boardImg !== 'null') {
            imgEl.setAttribute('src', board.boardImg);
        } else {
            imgEl.removeAttribute('src');
        }

        document.querySelector('.board-date').innerHTML =
            `<i class="bi bi-clock"></i> ${board.createdDate || ''}`;
        document.querySelector('.view-count').innerHTML =
            `<i class="bi bi-eye"></i> ${board.viewCount || 0}`;
        document.querySelector('.comment-count').innerHTML =
            `<i class="bi bi-chat-dots"></i> ${board.commentCount || 0}`;
    }

    // ─── 댓글 렌더링 ──────────────────────────────────────────────────
    function renderComments(comments) {
        commentList.innerHTML = '';

        if (!Array.isArray(comments) || comments.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'no-comments';
            emptyEl.textContent = '등록된 댓글이 없습니다.';
            commentList.appendChild(emptyEl);
            return;
        }

        comments.forEach(comment => {
            const formattedDate = comment.commentDate
                ? comment.commentDate.replace('T', ' ')
                : '';

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

    // ─── 댓글 페이징 UI 생성 ───────────────────────────────────────────
    function renderCommentPagination(totalComments) {
        const totalPages = Math.ceil(totalComments / commentsPerPage);
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        if (currentCommentPage > 1) {
            pagination.innerHTML += `<button onclick="goCommentPage(1)">&lt;&lt;</button>`;
            pagination.innerHTML += `<button onclick="goCommentPage(${currentCommentPage - 1})">&lt;</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
                <button class="${i === currentCommentPage ? 'current' : ''}" 
                        onclick="goCommentPage(${i})">${i}</button>
            `;
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

    // ─── 댓글 등록 함수 ────────────────────────────────────────────────
    async function addComment() {
        const content = commentInput.value.trim();
        if (!content) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await axios.post(
                `/api/board/comment/add`,
                {boardId: boardId, commentContent: content},
                {headers: {'Content-Type': 'application/json'}}
            );

            // 댓글 등록 성공 시
            commentInput.value = '';
            currentCommentPage = 1;
            fetchAndRenderComments(currentCommentPage);

            // 댓글 개수 1 증가
            const prevCountText = elCommentCount.textContent.replace(/[^0-9]/g, '');
            const prevCount = parseInt(prevCountText, 10) || 0;
            const newCount = prevCount + 1;
            elCommentCount.innerHTML = `<i class="bi bi-chat-dots"></i> ${newCount}`;
        } catch (err) {
            console.error('댓글 등록 실패', err);
            if (err.response) {
                alert('댓글 등록 실패: ' + err.response.status);
            } else {
                alert('댓글 등록 중 네트워크 오류가 발생했습니다.');
            }
        }
    }

    // ─── 댓글 등록 버튼에 이벤트 연결 ─────────────────────────────────
    if (commentBtn) {
        commentBtn.addEventListener('click', addComment);
    }
});
