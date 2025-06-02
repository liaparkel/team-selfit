// -----------------------------
// food.js (실제 백엔드 연동 버전)
// -----------------------------

// Axios 기본 설정
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 로그인된 회원 ID (예시: 테스트용 고정)
const memberId = 1;

let calendar;
let selectedDate = null;

// { "YYYY-MM-DD": [ { foodInfoId, foodName, amount, cal }, ... ] }
let foodMap = {};
let foodList = [];    // 현재 선택된 날짜의 음식 목록
let itemToDelete = null;  // 삭제 대상 인덱스

// (추가) 날짜별로 서버에서 받아온 foodNoteId를 저장
// 실제로는 "날짜 클릭 시"마다 서버에게 요청해서 얻어야 하지만, 여기서는 예시로 객체에 담아둡니다.
const foodNoteIdByDate = {}; // ex: { "2025-05-20": 42, ... }

// =======================================
// 1) ApexCharts를 이용한 “식단 그래프” 초기화
// =======================================
(function () {
    function setupYearDropdown() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 2;
        const dropdownBtn = document.getElementById('yearDropdownBtn');
        const menu = document.getElementById('yearDropdownMenu');

        dropdownBtn.innerText = `${currentYear}년`;
        let html = '';
        for (let y = currentYear; y >= startYear; y--) {
            html += `<li>
                 <a class="dropdown-item year-option" data-year="${y}" href="#">${y}년</a>
               </li>`;
        }
        menu.innerHTML = html;

        document.querySelectorAll('.year-option').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const year = parseInt(this.dataset.year);
                dropdownBtn.innerText = `${year}년`;

                // 서버에서 해당 연도 전체 '섭취 칼로리' 목록을 가져오기
                axios.post('/api/dashboard/foods', {
                    memberId: memberId,
                    intakeDate: `${year}`  // 백엔드가 “연도만 들어오면 해당 연도 전체 데이터” 를 처리하도록 약속
                })
                    .then(res => {
                        const data = res.data; // [{ date: "2025-05-01", intakeKcal: 2500 }, ...]
                        const seriesData = data
                            .filter(item => new Date(item.date).getFullYear() === year)
                            .map(item => ({ x: new Date(item.date + 'T00:00:00'), y: item.intakeKcal }));
                        renderChart(seriesData, year);
                    })
                    .catch(err => {
                        console.error("연도별 식단 그래프 데이터 조회 실패:", err);
                    });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const defaultYear = new Date().getFullYear();
        setupYearDropdown();

        // 페이지 로드 시, 기본 연도(올해)의 데이터로 그래프 그리기
        axios.post('/api/dashboard/foods', {
            memberId: memberId,
            intakeDate: `${defaultYear}`
        })
            .then(res => {
                const data = res.data;
                const seriesData = data
                    .filter(item => new Date(item.date).getFullYear() === defaultYear)
                    .map(item => ({ x: new Date(item.date + 'T00:00:00'), y: item.intakeKcal }));
                renderChart(seriesData, defaultYear);
            })
            .catch(err => {
                console.error("초기 식단 그래프 데이터 조회 실패:", err);
            });
    });

    function renderChart(seriesData, selectedYear) {
        const today = new Date();
        const jan1 = new Date(selectedYear, 0, 1).getTime();
        const dec31 = new Date(selectedYear, 11, 31).getTime();
        const todayTime = today.getTime();
        const xMin = jan1;
        const xMax = (selectedYear === today.getFullYear()) ? todayTime : dec31;

        const yMax = Math.max(...seriesData.map(d => d.y), 0);
        const yAxisMax = yMax <= 4000 ? 4000 : Math.ceil(yMax / 500) * 500;

        const options = {
            chart: {
                type: 'line',
                height: 350,
                background: '#f9f9f9',
                zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
                toolbar: {
                    show: true,
                    tools: {
                        download: false, selection: true, zoom: true,
                        zoomin: true, zoomout: true, pan: true, reset: true
                    }
                }
            },
            series: [{ name: '섭취 칼로리', data: seriesData }],
            xaxis: {
                type: 'datetime',
                min: xMin,
                max: xMax,
                labels: { format: 'MM-dd', style: { fontSize: '12px', colors: '#444' } },
                tickPlacement: 'on'
            },
            yaxis: {
                max: yAxisMax,
                title: { text: 'kcal', style: { fontSize: '14px', color: '#999' } },
                labels: { style: { fontSize: '12px', colors: '#666' } }
            },
            tooltip: { x: { format: 'yyyy-MM-dd' } },
            stroke: { width: 3, curve: 'smooth', colors: ['#33C181'] },
            fill: { type: 'solid', colors: ['#33C181'] },
            markers: { size: 0, hover: { size: 6 } },
            grid: { borderColor: '#eee', strokeDashArray: 4 },
            title: { text: '식단 그래프', align: 'left', style: { fontSize: '18px', color: '#666' } }
        };

        const chart = new ApexCharts(document.querySelector(".chart-container"), options);
        chart.render().then(() => {
            const recent7 = new Date();
            recent7.setDate(today.getDate() - 6);
            const recent7Time = recent7.getTime();
            if (selectedYear === today.getFullYear()) {
                chart.zoomX(recent7Time, xMax);
            } else {
                chart.zoomX(xMin, xMax);
            }
            setTimeout(() => {
                const homeBtn = document.querySelector(".apexcharts-reset-icon");
                if (homeBtn) {
                    homeBtn.addEventListener("click", e => {
                        e.preventDefault(); e.stopPropagation();
                        if (selectedYear === today.getFullYear()) {
                            chart.zoomX(recent7Time, xMax);
                        } else {
                            chart.zoomX(xMin, xMax);
                        }
                    });
                }
            }, 100);
        });

        chart.addEventListener("zoomed", (ctx, { xaxis }) => {
            const min = Math.max(xaxis.min, xMin);
            const max = Math.min(xaxis.max, xMax);
            if (min !== xaxis.min || max !== xaxis.max) {
                chart.zoomX(min, max);
            }
        });
    }
})();

// =======================================
// 2) FullCalendar + 패널(음식 입력)을 “서버 연동” 형태로 수정
// =======================================
function renderKcalEvents(calendar) {
    // calendar에 이벤트(“총 XX kcal”)를 그려 줌
    const events = [];
    for (const date in foodMap) {
        const list = foodMap[date];
        const totalKcal = list.reduce((sum, item) => sum + item.cal, 0);
        if (totalKcal > 0) {
            events.push({
                title: `총 ${totalKcal} kcal`,
                start: date,
                allDay: true
            });
        }
    }
    calendar.removeAllEvents();
    calendar.addEventSource(events);
}

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        height: 650,
        headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
        buttonText: { today: '오늘' },
        // 날짜 클릭 시 → 해당 날짜 패널 열고, 서버에서 식단 목록을 가져와서 화면에 뿌리기
        dateClick: async function (info) {
            selectedDate = info.dateStr; // ex) "2025-05-20"
            const formatted = selectedDate.replace(/-/g, '.');

            // -------------------------
            // 1) (추가) foodNoteId 조회
            //    → 실제 프로젝트에서는 이 부분을 API 호출로 대체하세요.
            //      예: const noteRes = await axios.post('/api/dashboard/foodNote', { memberId, checkDate: selectedDate });
            //          foodNoteIdByDate[selectedDate] = noteRes.data.foodNoteId;
            //    여기서는 예시로 하드코딩(=1) 처리합니다.
            // -------------------------
            if (!foodNoteIdByDate[selectedDate]) {
                foodNoteIdByDate[selectedDate] = 1; // 임시값. 실제로는 서버에서 받아온 ID를 넣어야 합니다.
            }

            // -------------------------
            // 2) 서버에서 해당 날짜의 음식 목록 조회
            // -------------------------
            try {
                const resp = await axios.post('/api/dashboard/foods', {
                    memberId: memberId,
                    intakeDate: selectedDate
                });
                // resp.data 예시:
                //   [
                //     { foodInfoId:123, foodName:"등심 돈까스", intake:200, unitKcal:500, intakeKcal:1000, unit:"g" },
                //     ...
                //   ]
                foodList = resp.data.map(f => ({
                    foodInfoId: f.foodInfoId,
                    foodName:   f.foodName,
                    amount:     `${f.intake}${f.unit}`,   // ex) “200g”
                    cal:        f.intakeKcal             // ex) 총 “1000 kcal”
                }));
                foodMap[selectedDate] = foodList;
            } catch (err) {
                console.error("서버에서 해당 날짜 식단 목록 로드 실패:", err);
                foodList = [];
                foodMap[selectedDate] = [];
            }

            // 3) 패널을 화면에 표시
            const panel = document.getElementById('food-panel');
            const dateEl = document.getElementById('panel-date');
            if (panel && dateEl) {
                dateEl.innerText = formatted;
                panel.style.display = 'block';
                editIndex = null;
                document.getElementById('add-food-btn').innerText = '등록';
            }
            document.getElementById('food-name').value = '';
            document.getElementById('food-amount').value = '';
            document.getElementById('food-unit').innerText = '';
            document.getElementById('autocomplete-list').classList.add('d-none');

            renderFoodList();
        },
        events: []
    });
    calendar.render();
});

// ===========================================
// 3) 자동완성 → “실제 백엔드(openSearch API)” 호출로 변경
// ===========================================
const nameInput = document.getElementById('food-name');
const amountInput = document.getElementById('food-amount');
const unitEl = document.getElementById('food-unit');
const listEl = document.getElementById('autocomplete-list');

let selectedIdx = -1;

// 입력할 때마다 백엔드에 검색 요청 보내고, 결과를 드롭다운에 렌더링
nameInput.addEventListener('input', async function () {
    const keyword = nameInput.value.trim();
    if (!keyword) {
        listEl.classList.add('d-none');
        return;
    }

    try {
        const res = await axios.post('/api/dashboard/food/openSearch', {
            keyword:  keyword,
            pageNo:   1,     // 필요한 만큼 paging 적용
            numOfRows: 20
        });
        const items = res.data; // List<FoodApi> 형태 [{ foodCd, foodNm, enerc, foodSize }, ...]
        if (!items || items.length === 0) {
            listEl.classList.add('d-none');
            return;
        }

        // `<li>` 태그를 “음식명 + 총중량 + 칼로리” 형태로 생성
        listEl.innerHTML = items.map(f => {
            // 예:총중량(foodSize) 예: "200g", 칼로리(enerc) 예: "500"
            return `
                <li class="autocomplete-item"
                    data-name="${f.foodNm}"
                    data-amount="${f.foodSize}"
                    data-cal="${f.enerc}">
                  <div class="item-info">
                    <div class="info-name">${f.foodNm}</div>
                    <div class="info-detail">${f.foodSize} / ${f.enerc}kcal</div>
                  </div>
                </li>`;
        }).join('');
        listEl.classList.remove('d-none');
    } catch (e) {
        console.error("자동완성 API 호출 실패:", e);
        listEl.classList.add('d-none');
    }
});

// 키보드 ↑↓ 및 Enter 네비게이션
nameInput.addEventListener('keydown', function (e) {
    const items = listEl.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % items.length;
        updateAutocompleteSelection(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + items.length) % items.length;
        updateAutocompleteSelection(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = (selectedIdx >= 0 && selectedIdx < items.length) ? selectedIdx : 0;
        items[idx].click();
    }
});

function updateAutocompleteSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('active', idx === selectedIdx);
    });
}

// 자동완성 결과 클릭 시 → input 채우고 드롭다운 닫기
listEl.addEventListener('click', function (e) {
    const clickedLi = e.target.closest('.autocomplete-item');
    if (!clickedLi) return;

    const name = clickedLi.dataset.name;
    const amountStr = clickedLi.dataset.amount; // ex) "200g"
    const calPerUnit = parseInt(clickedLi.dataset.cal, 10); // ex) 500

    // 숫자와 단위를 분리
    const amountVal = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    const unitText = amountStr.replace(/[0-9]/g, '');

    nameInput.value = name;
    amountInput.value = amountVal;
    unitEl.innerText = unitText;
    nameInput.dataset.calPerUnit = calPerUnit;

    listEl.classList.add('d-none');
    selectedIdx = -1;
});

// ===========================================
// 4) “등록/수정” 버튼 클릭 시 → 서버 호출
// ===========================================
let editIndex = null;

document.getElementById('add-food-btn').addEventListener('click', async function () {
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value, 10);
    const unit = unitEl.innerText;
    const calPerUnit = parseInt(nameInput.dataset.calPerUnit || '0', 10);

    if (!name) {
        alert("음식명을 입력해주세요.");
        return;
    }
    if (!calPerUnit) {
        alert("자동완성에서 음식을 선택해주세요.");
        return;
    }
    if (!amount || amount <= 0) {
        alert("중량을 올바르게 입력해주세요.");
        return;
    }

    // “기준 칼로리” 계산: (단위당칼로리 / 기준중량) * 입력량
    // 고정 기준중량은 서버 OpenAPI에서 내려준 foodSize(예: "200g") 에서 가져와야 하지만,
    // 여기서는 단순히 “(enerc / 100) * 입력량” 형태로 계산한다고 가정합니다.
    const baseAmount = parseInt((unit || "100g").replace(/[^0-9]/g, ''), 10) || 100;
    const cal = Math.round((calPerUnit / baseAmount) * amount);

    // ----------------------------
    // 수정 모드
    // ----------------------------
    if (editIndex !== null) {
        const item = foodList[editIndex];
        try {
            await axios.put('/api/dashboard/food', {
                foodInfoId: item.foodInfoId,
                newIntake: amount
            });
            // 로컬 상태 반영
            foodList[editIndex].amount = `${amount}${unit}`;
            foodList[editIndex].cal = cal;
            renderFoodList();
            renderKcalEvents(calendar);
        } catch (err) {
            console.error("서버에서 음식 정보 수정 실패:", err);
        }

        editIndex = null;
        document.getElementById('add-food-btn').innerText = '등록';
        document.querySelectorAll('.food-row').forEach(row => row.classList.remove('editing'));
    }
        // ----------------------------
        // 신규 등록 모드
    // ----------------------------
    else {
        try {
            // 실제로는 “selectedDate”에 매핑되는 foodNoteId를 서버에서 얻어야 합니다.
            const foodNoteId = foodNoteIdByDate[selectedDate] || 1;

            await axios.post('/api/dashboard/food', {
                foodNoteId: foodNoteId,
                foodName: name,
                intake: amount,
                unitKcal: calPerUnit
            });
            // 로컬에도 반영 (서버가 반환해준 foodInfoId를 쓴다면 실제 ID로 교체)
            foodList.push({
                foodInfoId: -1,      // 서버 반환 ID가 없으므로 임시 -1
                foodName: name,
                amount: `${amount}${unit}`,
                cal: cal
            });
            foodMap[selectedDate] = foodList;
            renderFoodList();
            renderKcalEvents(calendar);
        } catch (err) {
            console.error("서버에서 음식 정보 등록 실패:", err);
        }
    }

    // 입력창 초기화
    nameInput.value = '';
    amountInput.value = '';
    unitEl.innerText = '';
    delete nameInput.dataset.calPerUnit;
});

// ===========================================
// 5) 음식 목록 렌더링 함수
// ===========================================
function renderFoodList() {
    const listContainer = document.getElementById('food-list');
    listContainer.innerHTML = '';
    let total = 0;

    foodList.forEach((item, idx) => {
        total += item.cal;
        const rowClass = idx % 2 === 0 ? 'food-row-even' : 'food-row-odd';
        listContainer.innerHTML += `
      <div class="food-row ${rowClass}">
        <div class="cell-name fw-semibold">${item.foodName}</div>
        <div class="cell-amount">${item.amount}</div>
        <div class="cell-kcal">${item.cal}kcal</div>
        <div class="cell-action">
          <i class="bi bi-pencil-square text-black fs-5 edit-btn" data-index="${idx}" role="button"></i>
          <i class="bi bi-x-square text-black fs-5 delete-btn" data-index="${idx}" role="button"></i>
        </div>
      </div>`;
    });

    document.getElementById('total-cal').innerText = total;
    renderKcalEvents(calendar);
}

// ===========================================
// 6) 수정 및 삭제 버튼 클릭 이벤트 바인딩
// ===========================================
document.getElementById('food-list').addEventListener('click', async function (e) {
    const idx = Number(e.target.dataset.index);
    // “수정” 아이콘 클릭
    if (e.target.classList.contains('edit-btn')) {
        editIndex = idx;
        const item = foodList[idx];
        const amountVal = parseInt(item.amount.replace(/[^0-9]/g, ''), 10);
        const unitText = item.amount.replace(/[0-9]/g, '');

        nameInput.value = item.foodName;
        amountInput.value = amountVal;
        unitEl.innerText = unitText;
        nameInput.dataset.calPerUnit = Math.round(item.cal / amountVal * (amountVal || 100));
        document.getElementById('add-food-btn').innerText = '수정';

        document.querySelectorAll('.food-row').forEach(row => row.classList.remove('editing'));
        e.target.closest('.food-row').classList.add('editing');
    }
    // “삭제” 아이콘 클릭
    else if (e.target.classList.contains('delete-btn')) {
        itemToDelete = idx;
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }
});

// ===========================================
// 7) 삭제 확인 버튼 클릭 시 → 서버 호출
// ===========================================
document.getElementById('confirm-delete-btn').addEventListener('click', async function () {
    if (itemToDelete === null) return;
    const item = foodList[itemToDelete];
    try {
        await axios.delete('/api/dashboard/food', { data: { foodInfoId: item.foodInfoId } });
        foodList.splice(itemToDelete, 1);
        foodMap[selectedDate] = foodList;
        renderFoodList();
        renderKcalEvents(calendar);
    } catch (err) {
        console.error("서버에서 음식 삭제 실패:", err);
    }
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    itemToDelete = null;
});

// ===========================================
// 8) 패널 닫기 (버튼 및 외부 클릭 시 닫기)
// ===========================================
document.getElementById('close-panel-btn').addEventListener('click', function () {
    const panel = document.getElementById('food-panel');
    if (panel) panel.style.display = 'none';
});
document.addEventListener('click', function (e) {
    const panel = document.getElementById('food-panel');
    if (!panel) return;
    if (panel.contains(e.target) || e.target.closest('.fc-daygrid-day') || e.target.closest('.modal')) {
        return;
    }
    panel.style.display = 'none';
});
