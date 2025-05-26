// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function () {
    // 기능 카드 클릭 이벤트 처리
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('click', function () {
            const action = this.getAttribute('data-action');

            if (action === 'dashboard') {
                window.location.href = '/dashboard';
            } else if (action === 'community') {
                window.location.href = '/board/list';
            }
        });
    });
});