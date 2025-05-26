// ========== 체크리스트 달력 JavaScript (콘텐츠 내부 패널) ==========

let calendar;
let currentSelectedDate = null;
let checklistData = {
    '2025-05-01': [
        { text: '관리 칼로리어...', completed: false },
        { text: '물 2L 마시기', completed: false },
        { text: '물 1L 마시기', completed: false }
    ]
};

// ========== 초기화 ==========
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeCalendar();
    }, 100);
    setupEventListeners();
});

// ========== 달력 초기화 ==========
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    if (typeof window.FullCalendar === 'undefined') {
        console.error('FullCalendar is not loaded');
        return;
    }

    calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        height: 'auto',
        dayMaxEvents: false,

        // 날짜 클릭 이벤트
        dateClick: function(info) {
            openPanel(info.date);
        },

        // 날짜 셀 렌더링 커스터마이징
        dayCellDidMount: function(info) {
            renderDateCell(info);
        }
    });

    calendar.render();
}

// ========== 날짜 셀 렌더링 ==========
function renderDateCell(info) {
    const dateStr = info.date.toISOString().split('T')[0];
    const dayEl = info.el;

    // 체크리스트 아이템 표시 영역 생성
    const checklistContainer = createChecklistContainer(dateStr);
    dayEl.appendChild(checklistContainer);

    // 클릭 가능한 영역임을 나타내는 스타일 추가
    dayEl.style.cursor = 'pointer';
    dayEl.title = '클릭하여 체크리스트 등록';
}

// ========== 체크리스트 컨테이너 생성 ==========
function createChecklistContainer(dateStr) {
    const checklistContainer = document.createElement('div');
    checklistContainer.className = 'checklist-items';

    // 해당 날짜의 체크리스트 데이터가 있으면 표시
    if (checklistData[dateStr]) {
        checklistData[dateStr].forEach(item => {
            const itemEl = createChecklistItemElement(item);
            checklistContainer.appendChild(itemEl);
        });
    }

    return checklistContainer;
}

// ========== 체크리스트 아이템 요소 생성 ==========
function createChecklistItemElement(item) {
    const itemEl = document.createElement('div');
    itemEl.className = `checklist-item ${item.completed ? 'completed' : ''}`;
    itemEl.innerHTML = `
        <span class="checkbox">${item.completed ? '☑' : '☐'}</span>
        <span class="item-text">${item.text}</span>
    `;
    return itemEl;
}

// ========== 패널 관련 함수들 ==========
function openPanel(date) {
    currentSelectedDate = date;
    const panel = document.getElementById('checklistPanel');
    const panelDate = document.getElementById('panelDate');
    const contentGrid = document.querySelector('.content-grid');

    if (!panel || !panelDate || !contentGrid) {
        console.error('Panel elements not found');
        return;
    }

    // 날짜 형식 설정
    const formattedDate = formatDate(date);
    panelDate.textContent = formattedDate;

    // 기존 체크리스트 데이터 로드
    const dateStr = date.toISOString().split('T')[0];
    loadChecklistItems(dateStr);

    // 패널 열기 (그리드 변경)
    panel.classList.add('open');
    contentGrid.classList.add('panel-open');
}

function closePanel() {
    const panel = document.getElementById('checklistPanel');
    const contentGrid = document.querySelector('.content-grid');

    if (panel && contentGrid) {
        panel.classList.remove('open');
        contentGrid.classList.remove('panel-open');
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// ========== 체크리스트 아이템 관리 ==========
function loadChecklistItems(dateStr) {
    const container = document.getElementById('checklistDisplay');
    if (!container) {
        console.error('Checklist display container not found');
        return;
    }

    container.innerHTML = '';

    const items = checklistData[dateStr] || [];

    items.forEach((item, index) => {
        const itemEl = createDisplayItem(item, index, dateStr);
        container.appendChild(itemEl);
    });
}

function createDisplayItem(item, index, dateStr) {
    const itemEl = document.createElement('div');
    itemEl.className = 'checklist-display-item';
    itemEl.innerHTML = `
        <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleItemComplete('${dateStr}', ${index})">
        <label class="item-label">${item.text}</label>
        <div class="item-actions">
            <button class="action-btn delete-btn" onclick="deleteDisplayItem('${dateStr}', ${index})">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;
    return itemEl;
}

function toggleItemComplete(dateStr, index) {
    if (checklistData[dateStr] && checklistData[dateStr][index]) {
        checklistData[dateStr][index].completed = !checklistData[dateStr][index].completed;

        // 달력 다시 렌더링
        if (calendar) {
            calendar.render();
        }
    }
}

function deleteDisplayItem(dateStr, index) {
    if (checklistData[dateStr]) {
        checklistData[dateStr].splice(index, 1);

        // 빈 배열이면 삭제
        if (checklistData[dateStr].length === 0) {
            delete checklistData[dateStr];
        }

        // 패널과 달력 다시 렌더링
        loadChecklistItems(dateStr);
        if (calendar) {
            calendar.render();
        }
    }
}

function saveChecklist() {
    // 현재는 실시간으로 저장되므로 패널만 닫기
    closePanel();
}

// ========== 모달 관련 함수들 ==========
function openAddModal() {
    const modal = document.getElementById('addItemModal');
    const input = document.getElementById('newItemInput');

    if (modal && input) {
        modal.style.display = 'flex';
        input.value = '';
        input.focus();
        document.body.style.overflow = 'hidden';
    }
}

function closeAddModal() {
    const modal = document.getElementById('addItemModal');

    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addNewItemFromModal() {
    const input = document.getElementById('newItemInput');

    if (!input || !input.value.trim()) {
        return;
    }

    if (!currentSelectedDate) {
        console.error('No date selected');
        return;
    }

    const dateStr = currentSelectedDate.toISOString().split('T')[0];

    // 체크리스트 데이터에 새 항목 추가
    if (!checklistData[dateStr]) {
        checklistData[dateStr] = [];
    }

    checklistData[dateStr].push({
        text: input.value.trim(),
        completed: false
    });

    // 패널과 달력 다시 렌더링
    loadChecklistItems(dateStr);
    if (calendar) {
        calendar.render();
    }

    // 모달 닫기
    closeAddModal();
}

// ========== 이벤트 리스너 설정 ==========
function setupEventListeners() {
    // ESC 키로 패널/모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePanel();
            closeAddModal();
        }
    });

    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('addItemModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddModal();
            }
        });
    }

    // Enter 키로 모달에서 등록
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const modal = document.getElementById('addItemModal');
            if (modal && modal.style.display === 'flex') {
                addNewItemFromModal();
            }
        }
    });
}

// ========== 전역 함수 (HTML에서 호출) ==========
window.openPanel = openPanel;
window.closePanel = closePanel;
window.saveChecklist = saveChecklist;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.addNewItemFromModal = addNewItemFromModal;
window.toggleItemComplete = toggleItemComplete;
window.deleteDisplayItem = deleteDisplayItem;