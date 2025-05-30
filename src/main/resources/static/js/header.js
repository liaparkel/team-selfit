// 로그아웃 기능
function handleLogout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        const logoutBtn = $('.logout-btn');
        const originalText = logoutBtn.text();

        logoutBtn.text('로그아웃 중...');
        logoutBtn.prop('disabled', true).addClass('loading');

        $.ajax({
            url: '/account/logout',
            type: 'POST',
            success: function () {
                alert('로그아웃되었습니다.');
                window.location.href = '/account/login';
            },
            error: function (xhr) {
                alert('로그아웃 실패: ' + xhr.status);
                logoutBtn.text(originalText).prop('disabled', false).removeClass('loading');
            }
        });
    }
}


// 사용자 이름 업데이트 함수
function updateUsername(newUsername) {
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = newUsername;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 모든 메뉴 아이템 중 자식이 있는 것들
    document.querySelectorAll('.menu-item.has-children').forEach(item => {
        item.addEventListener('click', () => {
            // 열린 아이템이 다른 그룹이면 닫고
            document.querySelectorAll('.menu-item.has-children').forEach(i => {
                if (i !== item) {
                    i.classList.remove('open', 'active');
                    i.querySelector('.submenu').style.maxHeight = null;
                }
            });

            // 자신 토글
            item.classList.toggle('open');
            item.classList.toggle('active');
            const submenu = item.querySelector('.submenu');
            if (item.classList.contains('open')) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            } else {
                submenu.style.maxHeight = null;
            }
        });
    });
    fetchCategoryList();
});

function fetchCategoryList() {
    axios.get('/api/category')
        .then(res => {
            const categoryList = res.data;
            const communityMenu = document.querySelector('[data-group="community"] .submenu');

            if (!communityMenu) return;

            communityMenu.innerHTML = ''; // 기존 비우고

            categoryList.forEach(category => {
                const div = document.createElement('div');
                div.className = 'submenu-item';
                div.textContent = category.categoryName;
                div.addEventListener('click', () => {
                    location.href = `/board/list?categoryId=${category.categoryId}`;
                });
                communityMenu.appendChild(div);
            });
        })
        .catch(err => {
            console.error('카테고리 불러오기 실패:', err);
        });

}