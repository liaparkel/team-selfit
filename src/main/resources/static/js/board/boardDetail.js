// src/main/resources/static/js/board/boardDetail.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL 경로를 슬래시로 분리
    const parts = window.location.pathname.split('/');
    // 2. 마지막 세그먼트를 숫자로 변환
    const boardId = parseInt(parts[parts.length - 1], 10);

    // 3. 모크 데이터에서 해당 ID 찾기
    const board = allBoards.find(b => b.id === boardId);
    if (!board) return;

    // 상세 정보 렌더링
    document.querySelector('.board-category').textContent = board.categoryName;
    document.querySelector('.board-title').textContent = board.title;
    document.querySelector('.nickName').textContent = board.author;
    document.querySelector('.board-body').textContent = board.contents;
    document.querySelector('.board-image img').setAttribute('src', board.image);
    document.querySelector('.board-date').innerHTML = `<i class="bi bi-clock"></i> ${board.createdDate}`;
    document.querySelector('.view-count').innerHTML = `<i class="bi bi-eye"></i> ${board.views}`;
    document.querySelector('.comment-count').innerHTML = `<i class="bi bi-chat-dots"></i> ${board.commentCount}`;

    // 댓글 페이징 & 렌더링 (post.comments 배열 사용)
    const commentsPerPage = 5;
    let currentCommentPage = 1;

    // 댓글 페이징 UI 렌더링
    function renderCommentPagination(totalComments) {
        const totalPages = Math.ceil(totalComments / commentsPerPage);
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

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

    // 댓글 리스트 렌더링
    function renderComments(page) {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = '';

        const start = (page - 1) * commentsPerPage;
        const pageComments = board.comments.slice(start, start + commentsPerPage);

        pageComments.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `
                <img src="${comment.profileImage}" alt="프로필 이미지" class="comment-profile-img">
                <div class="comment-right">
                    <div class="comment-nickName-date">
                        <div class="comment-nickName">${comment.writerNickName}</div>
                        <div class="comment-date">${comment.commentDate}</div>
                    </div>
                    <div class="comment-box">
                        <div class="comment-text">${comment.commentContent}</div>
                    </div>
                </div>
            `;
            commentList.appendChild(div);
        });

        renderCommentPagination(board.comments.length);
    }

    // 전역에서 호출 가능한 페이지 이동 함수
    window.goCommentPage = function (page) {
        currentCommentPage = page;
        renderComments(page);
    };

    // 초기 댓글 렌더링
    renderComments(currentCommentPage);
});
