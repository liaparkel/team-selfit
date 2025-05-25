// 식단 섭취 칼로리 차트 초기화 및 렌더링
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const data = (window.foodKcalList && window.foodKcalList.length)
            ? window.foodKcalList
            : generateMockData();

        const seriesData = data.map(item => ({
            x: new Date(item.date + 'T00:00:00'),
            y: item.kcal
        }));

        renderChart(seriesData);
    });

    const today = new Date();
    const jan1 = new Date(today.getFullYear(), 0, 1);
    const recent7 = new Date(today);
    recent7.setDate(today.getDate() - 6);

    const jan1Time = jan1.getTime();
    const todayTime = today.getTime();
    const recent7Time = recent7.getTime();

    // ApexCharts 차트 렌더링 함수
    function renderChart(seriesData) {
        const yMax = Math.max(...seriesData.map(d => d.y), 0);
        const yAxisMax = yMax <= 4000 ? 4000 : Math.ceil(yMax / 500) * 500;

        const options = {
            chart: {
                type: 'line', height: 350, background: '#f9f9f9',
                zoom: {enabled: true, type: 'x', autoScaleYaxis: true},
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            series: [{name: '섭취 칼로리', data: seriesData}],
            xaxis: {
                type: 'datetime', min: jan1Time, max: todayTime,
                labels: {format: 'yyyy-MM-dd', style: {fontSize: '12px', colors: '#444'}},
                tickPlacement: 'on'
            },
            yaxis: {
                max: yAxisMax,
                title: {text: 'kcal', style: {fontSize: '14px', color: '#999'}},
                labels: {style: {fontSize: '12px', colors: '#666'}}
            },
            tooltip: {x: {format: 'yyyy-MM-dd'}},
            stroke: {
                width: 3,
                curve: 'smooth',
                colors: ['#33C181']
            },
            fill: {
                type: 'solid',
                colors: ['#33C181']
            },
            markers: {size: 0, hover: {size: 6}},
            grid: {borderColor: '#eee', strokeDashArray: 4},
            title: {text: '식단 그래프', align: 'left', style: {fontSize: '16px', color: '#666'}}
        };

        const chart = new ApexCharts(document.querySelector("#food-chart"), options);
        chart.render().then(() => {
            chart.zoomX(recent7Time, todayTime);

            setTimeout(() => {
                const homeBtn = document.querySelector(".apexcharts-reset-icon");
                if (homeBtn) {
                    homeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        chart.zoomX(recent7Time, todayTime);
                    });
                }
            }, 100);
        });

        chart.addEventListener("zoomed", function (ctx, {xaxis}) {
            const min = Math.max(xaxis.min, jan1Time);
            const max = Math.min(xaxis.max, todayTime);
            if (min !== xaxis.min || max !== xaxis.max) {
                chart.zoomX(min, max);
            }
        });
    }

    // 더미 데이터 생성 (1월 1일부터 오늘까지)
    function generateMockData() {
        const arr = [];
        const jan1 = new Date(today.getFullYear(), 0, 1);
        const cursor = new Date(jan1);
        while (cursor <= today) {
            const dateStr = cursor.toISOString().split('T')[0];
            arr.push({date: dateStr, kcal: Math.floor(Math.random() * 2500) + 1200});
            cursor.setDate(cursor.getDate() + 1);
        }
        return arr;
    }
})();

// 패널
// 자동완성용 테스트 데이터
const foodData = [
    {name: "등심 돈까스", amountStr: "200g", calPerUnit: 500},
    {name: "우동 정식", amountStr: "200g", calPerUnit: 500},
    {name: "비프 카레", amountStr: "200g", calPerUnit: 500},
    {name: "알리오 올리오", amountStr: "200g", calPerUnit: 500},
    {name: "오뚜기 햇반", amountStr: "200g", calPerUnit: 500},
    {name: "우유", amountStr: "500ml", calPerUnit: 500}
];

let selectedDate = null;
let foodMap = {};
let foodList = foodMap[selectedDate] || [];
let itemToDelete = null;

// FullCalendar 초기화 및 날짜 클릭 시 패널 표시
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 650,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        dateClick: function (info) {
            const formatted = info.dateStr.replace(/-/g, '.');
            selectedDate = info.dateStr;

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
            document.getElementById('food-unit').innerText = ''; // ← g → 빈 문자열
            document.getElementById('autocomplete-list').classList.add('d-none');

            foodList = foodMap[selectedDate] || [];
            foodMap[selectedDate] = foodList;
            foodMap[selectedDate] = foodList;
            renderFoodList();
        },
        events: []
    });

    calendar.render();
});

// 음식명 입력 시 자동완성 리스트 처리
const nameInput = document.getElementById('food-name');
const amountInput = document.getElementById('food-amount');
const unitEl = document.getElementById('food-unit');
const listEl = document.getElementById('autocomplete-list');

nameInput.addEventListener('input', function () {
    const keyword = nameInput.value.trim();
    if (!keyword) return listEl.classList.add('d-none');

    const filtered = foodData.filter(f => f.name.includes(keyword));
    if (filtered.length === 0) return listEl.classList.add('d-none');

    listEl.innerHTML = filtered.map(f => `
        <li class="list-group-item" data-name="${f.name}" data-amount="${f.amountStr}" data-cal="${f.calPerUnit}">
            ${f.name}
        </li>`).join('');
    listEl.classList.remove('d-none');
});


// 자동완성 키보드 네비게이션
let selectedIdx = -1;

nameInput.addEventListener('keydown', function (e) {
    const items = listEl.querySelectorAll('li');
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
        if (selectedIdx >= 0 && selectedIdx < items.length) {
            items[selectedIdx].click();
        } else {
            items[0].click(); // 아무것도 선택 안 했으면 첫 번째 항목 자동 선택
        }
    }
});

function updateAutocompleteSelection(items) {
    items.forEach((item, idx) => {
        if (idx === selectedIdx) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}


listEl.addEventListener('click', function (e) {
    if (e.target.tagName !== 'LI') return;

    const name = e.target.dataset.name;
    const amountStr = e.target.dataset.amount;
    const calPerUnit = parseInt(e.target.dataset.cal);

    const amount = parseInt(amountStr.replace(/[^0-9]/g, ''));
    const unit = amountStr.replace(/[0-9]/g, '');

    nameInput.value = name;
    amountInput.value = amount;
    unitEl.innerText = unit;
    nameInput.dataset.calPerUnit = calPerUnit;

    listEl.classList.add('d-none');
});

// 등록 버튼 클릭 시 음식 리스트에 항목 추가

// 등록 버튼 클릭 시 음식 리스트에 항목 추가 또는 수정
let editIndex = null;

document.getElementById('add-food-btn').addEventListener('click', function () {
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);
    const unit = unitEl.innerText;
    const calPerUnit = parseInt(nameInput.dataset.calPerUnit || 0);

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

    const baseAmount = parseInt(foodData.find(f => f.name === name)?.amountStr.replace(/[^0-9]/g, '') || 100);
    const cal = Math.round((calPerUnit / baseAmount) * amount);

    if (editIndex !== null) {
        foodList[editIndex] = {name, amount: `${amount}${unit}`, cal};
        editIndex = null;
    } else {
        if (editIndex !== null) {
            foodList[editIndex] = {name, amount: `${amount}${unit}`, cal};
            editIndex = null;
            document.getElementById('add-food-btn').innerText = '등록';

            // 수정중 행 표시 제거
            document.querySelectorAll('.food-row').forEach(row => row.classList.remove('editing'));
        } else {
            foodList.push({name, amount: `${amount}${unit}`, cal});
        }
    }

    foodMap[selectedDate] = foodList;
    renderFoodList();
    nameInput.value = '';
    amountInput.value = '';
    unitEl.innerText = '';
    nameInput.dataset.calPerUnit = '';
    document.getElementById('add-food-btn').innerText = '등록';
});

// 음식 리스트 렌더링 함수
function renderFoodList() {
    const listEl = document.getElementById('food-list');
    listEl.innerHTML = '';
    let total = 0;

    foodList.forEach((item, idx) => {
        total += item.cal;
        const rowClass = idx % 2 === 0 ? 'food-row-even' : 'food-row-odd';
        listEl.innerHTML += `
            <div class="food-row ${rowClass}">
                <div class="cell-name fw-semibold">${item.name}</div>
                <div class="cell-amount">${item.amount}</div>
                <div class="cell-kcal">${item.cal}kcal</div>
                <div class="cell-action">
                    <i class="bi bi-pencil-square text-black fs-5" role="button"></i>
                    <i class="bi bi-x-square text-black fs-5" role="button" data-index="${idx}"></i>
                </div>
            </div>
        `;
    });

    document.getElementById('total-cal').innerText = total;
}


// 수정 아이콘 클릭 시 입력창에 값 불러오기
document.getElementById('food-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('bi-pencil-square')) {
        const index = Array.from(document.querySelectorAll('.bi-pencil-square')).indexOf(e.target);
        editIndex = index;

        const item = foodList[editIndex];
        const name = item.name;
        const amount = parseInt(item.amount); // 예: "200g" → 200
        const unit = item.amount.replace(/[0-9]/g, '');

        nameInput.value = name;
        amountInput.value = amount;
        unitEl.innerText = unit;

        const base = foodData.find(f => f.name === name);
        nameInput.dataset.calPerUnit = base?.calPerUnit || 0;

        document.getElementById('add-food-btn').innerText = '수정';

        // 기존 강조 제거 후 현재 행 강조
        document.querySelectorAll('.food-row').forEach(row => row.classList.remove('editing'));
        e.target.closest('.food-row')?.classList.add('editing');

    }
});

// 삭제 아이콘 클릭 시 삭제 모달 표시
document.getElementById('food-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('bi-x-square')) {
        itemToDelete = parseInt(e.target.dataset.index);
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }
});

// 삭제 모달에서 확인 버튼 클릭 시 리스트 항목 삭제
document.getElementById('confirm-delete-btn').addEventListener('click', function () {
    if (itemToDelete !== null && itemToDelete >= 0) {
        foodList.splice(itemToDelete, 1);
        itemToDelete = null;
        foodMap[selectedDate] = foodList;
        renderFoodList();
    }

    const modalEl = document.getElementById('delete-modal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
});

// 패널 우상단 닫기 버튼 클릭 시 패널 닫기
document.getElementById('close-panel-btn').addEventListener('click', function () {
    const panel = document.getElementById('food-panel');
    if (panel) {
        panel.style.display = 'none';
    }
});

// 패널 외부 클릭 시 패널 닫기
document.addEventListener('click', function (e) {
    const panel = document.getElementById('food-panel');
    if (!panel) return;

    // 패널, 달력 셀, 모달 내부 클릭은 무시
    if (
        panel.contains(e.target) ||
        e.target.closest('.fc-daygrid-day') ||
        e.target.closest('.modal')
    ) return;

    panel.style.display = 'none';
});
