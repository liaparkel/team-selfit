// 로그인한 회원 ID (테스트용 고정)
const memberId = 1;

let calendar;
let currentSelectedDate = null;
const checklistData = {}; // { "YYYY-MM-DD": [ { checkId, checklistId, text, completed } ] }
let checklistList = [];
let editIndex = null;
let itemToDeleteIndex = null;

// Axios 기본 설정
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 해당 연-월의 체크리스트 데이터를 서버에서 불러와 checklistData에 저장
async function loadMonthlyChecklist(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const promises = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        promises.push(
            axios.post('/api/dashboard/checklist/items', {memberId, checkDate: date})
                .then(res => checklistData[date] = res.data.map(item => ({
                    checkId: item.checkId,
                    checklistId: item.checklistId,
                    text: item.checkContent,
                    completed: item.isCheck === 1
                })))
                .catch(() => checklistData[date] = [])
        );
    }
    await Promise.all(promises);
}

// FullCalendar 이벤트 데이터 생성 (최대 3개 아이템)
function buildCalendarEvents() {
    return Object.entries(checklistData)
        .filter(([_, items]) => items && items.length)
        .map(([date, items]) => {
            const html = items.slice(0, 3).map(item =>
                `<div class="check-item-box d-flex align-items-center mb-1">
           <i class="bi ${item.completed ? 'bi-check-square text-success' : 'bi-square'}"></i>
           <span class="check-text text-truncate" title="${item.text}">${item.text}</span>
         </div>`
            ).join('');
            return {start: date, allDay: true, display: 'block', extendedProps: {checklistHTML: html}};
        });
}

// 패널 목록 렌더링 (수정 중인 행에 .editing 클래스)
function renderChecklistList() {
    const listEl = document.getElementById('check-list');
    if (!listEl || !currentSelectedDate) return;
    listEl.innerHTML = '';
    checklistList = checklistData[currentSelectedDate] || [];

    checklistList.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'check-row d-flex justify-content-between align-items-center';
        if (idx === editIndex) row.classList.add('editing');
        row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi ${item.completed ? 'bi-check2 text-success' : ''} toggle-check" data-index="${idx}" role="button"></i>
        <span class="flex-grow-1 ${item.completed ? 'text-decoration-line-through text-muted' : ''}">${item.text}</span>
      </div>
      <div class="d-flex gap-2">
        <i class="bi bi-pencil-square edit-btn" data-index="${idx}" role="button"></i>
        <i class="bi bi-x-square delete-btn" data-index="${idx}" data-bs-toggle="modal" data-bs-target="#delete-modal" role="button"></i>
      </div>
    `;
        listEl.appendChild(row);
    });
}

// 수정 버튼 클릭 핸들러
function onEditClick(e) {
    const idx = Number(e.target.dataset.index);
    editIndex = idx;
    document.getElementById('check-name').value = checklistList[idx].text;
    document.getElementById('add-check-btn').innerText = '수정';
    renderChecklistList();
}

// 체크 토글 핸들러
async function onCheckboxChange(e) {
    const idx = Number(e.target.dataset.index);
    const item = checklistList[idx];
    const completed = !item.completed;
    await axios.put('/api/dashboard/checklist/item/check', {checkId: item.checkId, isCheck: completed ? 1 : 0});
    item.completed = completed;
    renderChecklistList();
    calendar.refetchEvents();
}

// 등록/수정 핸들러
async function onAddOrEdit() {
    const input = document.getElementById('check-name');
    const text = input.value.trim();
    if (!text) return;

    // 수정 모드
    if (editIndex !== null) {
        const item = checklistList[editIndex];
        await axios.put('/api/dashboard/checklist/item', {
            checkId: item.checkId,
            checkContent: text
        });
        item.text = text;
        editIndex = null;
        document.getElementById('add-check-btn').innerText = '등록';
    } else {
        // 신규 모드: 먼저 해당 날짜의 체크리스트가 있는지 확인
        let cid;
        const itemsRes = await axios.post('/api/dashboard/checklist/items', {
            memberId,
            checkDate: currentSelectedDate
        });
        if (itemsRes.data.length > 0) {
            // 이미 있으면 기존 checklistId 사용
            cid = itemsRes.data[0].checklistId;
        } else {
            // 없으면 체크리스트 생성
            const createRes = await axios.post('/api/dashboard/checklist', {
                memberId,
                checkDate: currentSelectedDate
            });
            cid = createRes.data;
        }
        // 체크 항목 추가
        const itemRes = await axios.post('/api/dashboard/checklist/item', {
            checklistId: cid,
            checkContent: text
        });
        checklistList.push({
            checkId: itemRes.data,
            checklistId: cid,
            text,
            completed: false
        });
    }

    // 입력 초기화 및 UI 갱신
    input.value = '';
    checklistData[currentSelectedDate] = checklistList;
    renderChecklistList();

    // 달력 이벤트 다시 불러오기
    calendar.refetchEvents();
}


// 삭제 확정 핸들러
async function onDeleteConfirmed() {
    if (itemToDeleteIndex === null) return;
    const item = checklistList[itemToDeleteIndex];
    await axios.delete('/api/dashboard/checklist/item', {data: {checkId: item.checkId}});
    checklistList.splice(itemToDeleteIndex, 1);
    checklistData[currentSelectedDate] = checklistList;
    renderChecklistList();
    calendar.refetchEvents();
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    itemToDeleteIndex = null;
}

// 날짜 클릭 핸들러: 패널 열고 상세 로드
async function onDateClick(info) {
    currentSelectedDate = info.dateStr;
    document.getElementById('panel-date').innerText = currentSelectedDate.replace(/-/g, '.');
    document.getElementById('check-panel').style.display = 'block';
    editIndex = null;
    document.getElementById('add-check-btn').innerText = '등록';
    document.getElementById('check-name').value = '';
    await loadMonthlyChecklist(info.date.getFullYear(), info.date.getMonth() + 1);
    checklistList = checklistData[currentSelectedDate] || [];
    renderChecklistList();
}

// 초기화 및 FullCalendar 설정
document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', locale: 'ko', height: 650,
        headerToolbar: {left: 'prev,next today', center: 'title', right: ''}, buttonText: {today: '오늘'},
        eventDisplay: 'block', events: async (fetchInfo, success) => {
            await loadMonthlyChecklist(fetchInfo.start.getFullYear(), fetchInfo.start.getMonth() + 1);
            success(buildCalendarEvents());
        },
        eventContent: info => {
            const d = document.createElement('div');
            d.innerHTML = info.event.extendedProps.checklistHTML || '';
            return {domNodes: [d]};
        },
        dateClick: onDateClick
    });
    calendar.render();
    calendar.refetchEvents();

    // 패널 인터랙션 바인딩
    document.getElementById('add-check-btn').addEventListener('click', onAddOrEdit);
    document.getElementById('check-list').addEventListener('click', e => {
        if (e.target.classList.contains('edit-btn')) onEditClick(e);
        if (e.target.classList.contains('delete-btn')) itemToDeleteIndex = Number(e.target.dataset.index);
        if (e.target.classList.contains('toggle-check')) onCheckboxChange(e);
    });
    document.getElementById('confirm-delete-btn').addEventListener('click', onDeleteConfirmed);
    document.getElementById('close-panel-btn').addEventListener('click', () => {
        document.getElementById('check-panel').style.display = 'none';
    });
});
