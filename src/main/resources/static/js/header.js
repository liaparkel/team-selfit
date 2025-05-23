// 로그아웃 기능
function handleLogout() {
    // 확인 대화상자 표시
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        // 로딩 상태 표시
        const logoutBtn = document.querySelector('.logout-btn');
        const originalText = logoutBtn.textContent;

        logoutBtn.textContent = '로그아웃 중...';
        logoutBtn.disabled = true;
        logoutBtn.classList.add('loading');

        // 실제 로그아웃 처리 (예시)
        setTimeout(() => {
            // 여기에 실제 로그아웃 API 호출 코드를 작성
            console.log('로그아웃 처리 완료');

            // 로그인 페이지로 리다이렉트 또는 다른 처리
            alert('로그아웃되었습니다.');

            // 버튼 상태 복원 (실제로는 페이지가 이동되므로 필요없음)
            logoutBtn.textContent = originalText;
            logoutBtn.disabled = false;
            logoutBtn.classList.remove('loading');

            // 실제 환경에서는 다음과 같이 처리
            // window.location.href = '/login';
        }, 1000);
    }
}

// 사용자 이름 업데이트 함수
function updateUsername(newUsername) {
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = newUsername;
    }
}
