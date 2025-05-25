document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = parseInt(urlParams.get('categoryId')) || 1;
    const postId = parseInt(urlParams.get('postId')) || 1;

    function generateMockDetails(prefix, authorPrefix, categoryName) {
        return Array.from({length: 25}, (_, i) => ({
            boardId: i + 1,
            boardTitle: `${prefix} ${i + 1}`,
            boardContents: `내용입니다 - ${prefix} ${i + 1}`,
            boardImage: "/img/logo_img.png",
            boardDate: `2025-05-${String(i + 1).padStart(2, '0')}`,
            viewCount: (i + 1) * 3,
            commentCount: (i + 1),
            memberId: `${authorPrefix}${i + 1}`,
            nickName: `${authorPrefix}닉네임${i + 1}`,
            memberImage: "/img/memberImg.png",
            categoryName: categoryName
        }));
    }

    const detailMockData = {
        1: generateMockDetails("식단 샘플 제목", "식단유저", "식단"),
        2: generateMockDetails("운동 샘플 제목", "운동유저", "운동"),
        3: generateMockDetails("자유 샘플 제목", "자유유저", "자유")
    };

    function getBoardetail() {
        const posts = detailMockData[categoryId] || [];
        return posts.find(post => post.boardId === postId);
    }

    function renderPostDetail(data) {
        if (!data) return;
        document.querySelector('.board-category').textContent = data.categoryName;
        document.querySelector('.board-title').textContent = data.boardTitle;
        document.querySelector('.nickName').textContent = data.nickName;
        document.querySelector('.board-body').textContent = data.boardContents;
        document.querySelector('.board-image img').setAttribute('src', data.boardImage);
        document.querySelector('.board-date').innerHTML = `<i class="bi bi-clock"></i> ${data.boardDate}`;
        document.querySelector('.view-count').innerHTML = `<i class="bi bi-eye"></i> ${data.viewCount}`;
        document.querySelector('.comment-count').innerHTML = `<i class="bi bi-chat-dots"></i> ${data.commentCount}`;
    }

    const boardDetail = getBoardetail();
    renderPostDetail(boardDetail);

    const mockComments = Array.from({length: 25}, (_, i) => ({
        id: i + 1,
        writerNickName: `유저${i + 1}`,
        profileImage: '/img/memberImg.png',
        commentDate: `2024-12-${String(i + 1).padStart(2, '0')}`,
        commentContent: `${i + 1}번째 댓글입니다!`
    }));

    const commentsPerPage = 5;
    let currentCommentPage = 1;

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

    function renderComments(page) {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = '';

        const start = (page - 1) * commentsPerPage;
        const pageComments = mockComments.slice(start, start + commentsPerPage);

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

        renderCommentPagination(mockComments.length);
    }

    window.goCommentPage = function (page) {
        currentCommentPage = page;
        renderComments(page);
    };

    renderComments(currentCommentPage);
});
