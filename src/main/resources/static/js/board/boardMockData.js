function generateBoards(prefix, authorPrefix, categoryId, categoryName) {
    return Array.from({length: 25}, (_, i) => {
        const id = (categoryId - 1) * 25 + (i + 1);
        return {
            // 리스트용 요약 필드
            id,
            title: `${prefix} ${i + 1}`,
            author: `${authorPrefix}${i + 1}`,
            views: (i + 1) * 10,
            createdDate: `2023-05-${String(i + 1).padStart(2, '0')}`,
            categoryId,
            categoryName,

            // 상세용 필드
            contents: `이것은 상세 내용입니다. ${prefix} ${i + 1}`,
            image: '/img/logo_img.png',
            commentCount: (i + 1) * 2,            // 예시
            comments: Array.from({length: 25}, (_, j) => ({
                id: j + 1,
                writerNickName: `${authorPrefix}댓글러${j + 1}`,
                profileImage: '/img/memberImg.png',
                commentDate: `2024-12-${String(j + 1).padStart(2, '0')}`,
                commentContent: `${j + 1}번째 댓글 예시입니다.`
            }))
        };
    });
}

// 전체 게시글 배열
const allBoards = [
    ...generateBoards('식단 샘플 게시글', '작성자', 1, '식단'),
    ...generateBoards('운동 샘플 게시글', '운동러', 2, '운동'),
    ...generateBoards('자유 샘플 게시글', '유저', 3, '자유')
];