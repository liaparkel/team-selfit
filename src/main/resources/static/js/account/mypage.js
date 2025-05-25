$(function() {
    // 가짜 북마크 데이터
    const bookmarkData = [
        "초보를 위한 4주 근력운동 루틴",
        "닭가슴살 질릴 때 먹는 고단백 도시락 레시피",
        "아침 공복 유산소, 효과 있을까? 실험 결과 정리",
        "하루 10분 전신 스트레칭 루틴",
        "식단 실패할 때 먹는 죄책감 없는 간식",
        "운동 후 근육통 완화하는 5가지 방법",
        "체중 감량을 위한 효과적인 유산소 운동",
        "단백질 섭취량 계산하는 방법",
        "홈트레이닝으로 복근 만들기",
        "건강한 다이어트를 위한 식단 가이드"
    ];

    const itemsPerPage = 5;
    let currentPage = 1;
    const totalPages = Math.ceil(bookmarkData.length / itemsPerPage);

    // 북마크 리스트 렌더링
    function renderBookmarks(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = bookmarkData.slice(startIndex, endIndex);

        const $bookmarkList = $('#bookmarkList');
        $bookmarkList.empty();

        pageItems.forEach(item => {
            $bookmarkList.append(`<div class="bookmark-item">${item}</div>`);
        });
    }

    // 페이지네이션 렌더링
    function renderPagination() {
        const $pagination = $('#pagination');
        $pagination.empty();

        // 이전 버튼
        const $prevBtn = $(`<div class="page-btn ${currentPage === 1 ? 'disabled' : ''}">&lt;</div>`);
        if (currentPage > 1) {
            $prevBtn.on('click', function() {
                currentPage--;
                renderBookmarks(currentPage);
                renderPagination();
            });
        }
        $pagination.append($prevBtn);

        // 페이지 번호들
        for (let i = 1; i <= totalPages; i++) {
            const $pageBtn = $(`<div class="page-btn ${i === currentPage ? 'active' : ''}">${i}</div>`);
            $pageBtn.on('click', function() {
                currentPage = i;
                renderBookmarks(currentPage);
                renderPagination();
            });
            $pagination.append($pageBtn);
        }

        // 다음 버튼
        const $nextBtn = $(`<div class="page-btn ${currentPage === totalPages ? 'disabled' : ''}">&gt;</div>`);
        if (currentPage < totalPages) {
            $nextBtn.on('click', function() {
                currentPage++;
                renderBookmarks(currentPage);
                renderPagination();
            });
        }
        $pagination.append($nextBtn);

        // 마지막 페이지 버튼
        const $lastBtn = $(`<div class="page-btn ${currentPage === totalPages ? 'disabled' : ''}">&gt;&gt;</div>`);
        if (currentPage < totalPages) {
            $lastBtn.on('click', function() {
                currentPage = totalPages;
                renderBookmarks(currentPage);
                renderPagination();
            });
        }
        $pagination.append($lastBtn);
    }

    // 초기 렌더링
    renderBookmarks(currentPage);
    renderPagination();

    // 회원탈퇴 버튼 클릭 이벤트
    $('.edit-btn').on('click', function() {
        if (confirm('정말로 회원탈퇴를 하시겠습니까?')) {
            alert('회원탈퇴가 처리되었습니다.');
        }
    });

    // 수정 버튼 클릭 이벤트
    $('.settings-btn').on('click', function() {
        alert('회원정보 수정 페이지로 이동합니다.');
    });

    // 회원 정보 데이터 업데이트 (가짜 데이터)
    const memberData = {
        email: 'kosis@gmail.com',
        name: '송민지',
        nickname: 'kodiet',
        gender: '여자',
        birth: '2000.05.21',
        height: '164',
        weight: '55',
        goal: '감량'
    };

    // 회원 정보 표시
    Object.keys(memberData).forEach(key => {
        $(`#${key}`).text(memberData[key]);
    });

    // 북마크 아이템 클릭 이벤트 (동적으로 추가되는 요소에 대한 이벤트 위임)
    $(document).on('click', '.bookmark-item', function() {
        const bookmarkText = $(this).text();
        alert(`선택한 북마크: ${bookmarkText}`);
    });

    // 마이페이지 활성화 표시
    $('.myPage').addClass('sideBar__item--active');
});