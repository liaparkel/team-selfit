// 로그아웃 기능
function handleLogout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        const logoutBtn = document.querySelector('.logout-btn');
        const originalText = logoutBtn.textContent;

        const memberInfo = document.querySelector('.memberInfo');
        const loginBtn = document.querySelector('.login-btn');
        logoutBtn.textContent = '로그아웃 중...';
        logoutBtn.disabled = true;
        logoutBtn.classList.add('loading');

        axios.post('/account/logout')
            .then(() => {
                memberInfo.style.display = 'none';
                logoutBtn.style.display = 'none';
                loginBtn.style.display = 'block';
                alert('로그아웃되었습니다.');
                window.location.reload();
            })
            .catch(error => {
                alert('로그아웃 실패: ' + error.response.status);
                logoutBtn.textContent = originalText;
                logoutBtn.disabled = false;
                logoutBtn.classList.remove('loading');
            });
    }
}

// 로그인 페이지로 이동하는 함수
function handleLogin() {
    window.location.href = '/account/login';
}

// 사용자 정보 업데이트 함수
function updateUserInfo(userData) {
    // 프로필 이미지 업데이트
    const memberImgElement = document.querySelector('.memberImg img');
    if (memberImgElement && userData.profileImg) {
        memberImgElement.src = userData.profileImg;
        memberImgElement.alt = `${userData.nickname || ''} 프로필 이미지`;
    }

    // 목표(goal) 업데이트
    const goalElement = document.querySelector('.goal p');
    if (goalElement) {
        goalElement.textContent = userData.goal || '유지';
    }

    // 닉네임 업데이트
    const nameElement = document.querySelector('.memberName p');
    if (nameElement) {
        const nickname = userData.nickname || '사용자';
        nameElement.textContent = `하고 싶은 ${nickname}님`;
    }
}

// 회원 정보 가져오기
async function fetchMemberInfo() {
    const memberInfo = document.querySelector('.memberInfo');
    const logoutBtn = document.querySelector('.logout-btn');
    const loginBtn = document.querySelector('.login-btn');
    try {
        const response = await fetch('/api/account/member');
        if (!response.ok) {
            throw new Error('회원 정보를 가져오는데 실패했습니다.');
        }
        const userData = await response.json();
        updateUserInfo(userData);
        // 로그인 상태
        memberInfo.style.display = 'flex';
        logoutBtn.style.display = 'block';
        loginBtn.style.display = 'none';
    } catch (error) {
        memberInfo.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        console.error('회원 정보 조회 오류:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMemberInfo();
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
            const selectEl = document.getElementById('categorySelect');
            if (selectEl) {
                // 기본 옵션만 남기고 초기화
                selectEl.innerHTML = '<option value="">카테고리 선택</option>';
                categoryList.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.categoryId;
                    opt.textContent = cat.categoryName;
                    selectEl.appendChild(opt);
                });
            }
        })
        .catch(err => {
            console.error('카테고리 불러오기 실패:', err);
        });

}