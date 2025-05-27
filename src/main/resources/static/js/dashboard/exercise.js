// exercise.js - 운동 기록 기능 전체 통합 버전
// 기능: FullCalendar 달력, 자동완성 운동 입력, ApexCharts 차트, 등록/수정/삭제, 총 kcal 계산

// ===== 차트 관련 초기화 및 렌더링 =====
(function () {
    function setupYearDropdown() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 2;
        const dropdownBtn = document.getElementById('yearDropdownBtn');
        const menu = document.getElementById('yearDropdownMenu');

        dropdownBtn.innerText = `${currentYear}년`;

        let html = '';
        for (let y = currentYear; y >= startYear; y--) {
            html += `<li><a class="dropdown-item year-option" data-year="${y}" href="#">${y}년</a></li>`;
        }
        menu.innerHTML = html;

        document.querySelectorAll('.year-option').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const year = parseInt(this.dataset.year);
                dropdownBtn.innerText = `${year}년`;

                const allData = window.exerciseKcalList?.length
                    ? window.exerciseKcalList
                    : (window.exerciseKcalList = generateMockData());

                const data = allData.filter(item => new Date(item.date).getFullYear() === year);
                const seriesData = data.map(item => ({x: new Date(item.date + 'T00:00:00'), y: item.kcal}));

                renderChart(seriesData, year);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const data = window.exerciseKcalList?.length
            ? window.exerciseKcalList
            : (window.exerciseKcalList = generateMockData());

        window.exerciseKcalList = data;
        setupYearDropdown();

        const defaultYear = new Date().getFullYear();
        const filteredData = data.filter(item => new Date(item.date).getFullYear() === defaultYear);
        const seriesData = filteredData.map(item => ({x: new Date(item.date + 'T00:00:00'), y: item.kcal}));

        renderChart(seriesData, defaultYear);
    });

    function renderChart(seriesData, selectedYear) {
        const today = new Date();
        const jan1 = new Date(selectedYear, 0, 1);
        const dec31 = new Date(selectedYear, 11, 31);
        const todayTime = today.getTime();
        const xMin = jan1.getTime();
        const xMax = (selectedYear === today.getFullYear()) ? todayTime : dec31.getTime();

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
            series: [{name: '운동 칼로리', data: seriesData}],
            xaxis: {
                type: 'datetime', min: xMin, max: xMax,
                labels: {format: 'MM-dd', style: {fontSize: '12px', colors: '#444'}},
                tickPlacement: 'on'
            },
            yaxis: {
                max: yAxisMax,
                title: {text: 'kcal', style: {fontSize: '14px', color: '#999'}},
                labels: {style: {fontSize: '12px', colors: '#666'}}
            },
            tooltip: {x: {format: 'yyyy-MM-dd'}},
            stroke: {width: 3, curve: 'smooth', colors: ['#33C181']},
            fill: {type: 'solid', colors: ['#33C181']},
            markers: {size: 0, hover: {size: 6}},
            grid: {borderColor: '#eee', strokeDashArray: 4},
            title: {text: '운동 그래프', align: 'left', style: {fontSize: '18px', color: '#666'}}
        };

        const chart = new ApexCharts(document.querySelector("#exercise-chart"), options);
        chart.render().then(() => {
            const recent7 = new Date();
            recent7.setDate(today.getDate() - 6);
            const recent7Time = recent7.getTime();
            if (selectedYear === today.getFullYear()) chart.zoomX(recent7Time, xMax);
            else chart.zoomX(xMin, xMax);

            setTimeout(() => {
                const homeBtn = document.querySelector(".apexcharts-reset-icon");
                if (homeBtn) {
                    homeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (selectedYear === today.getFullYear()) chart.zoomX(recent7Time, xMax);
                        else chart.zoomX(xMin, xMax);
                    });
                }
            }, 100);
        });

        chart.addEventListener("zoomed", function (ctx, {xaxis}) {
            const min = Math.max(xaxis.min, xMin);
            const max = Math.min(xaxis.max, xMax);
            if (min !== xaxis.min || max !== xaxis.max) chart.zoomX(min, max);
        });
    }

    function generateMockData() {
        const arr = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const startYear = currentYear - 2;
        for (let year = startYear; year <= currentYear; year++) {
            const jan1 = new Date(year, 0, 1);
            const dec31 = new Date(year, 11, 31);
            const cursor = new Date(jan1);
            while (cursor <= dec31) {
                if (year === currentYear && cursor > today) break;
                const dateStr = cursor.toISOString().split('T')[0];
                arr.push({date: dateStr, kcal: Math.floor(Math.random() * 800) + 200});
                cursor.setDate(cursor.getDate() + 1);
            }
        }
        return arr;
    }
})();

// ===== 달력, 패널, 자동완성, 리스트 =====

const exerciseData = [
    {name: "러닝", amountStr: "30분", calPerUnit: 300},
    {name: "자전거 타기", amountStr: "30분", calPerUnit: 250},
    {name: "수영", amountStr: "30분", calPerUnit: 350},
    {name: "줄넘기", amountStr: "30분", calPerUnit: 280},
    {name: "요가", amountStr: "30분", calPerUnit: 180},
    {name: "근력 운동", amountStr: "30분", calPerUnit: 220}
];

let selectedDate = null;
let exerciseMap = {};
let exerciseList = [];
let editIndex = null;
let itemToDelete = null;

const nameInput = document.getElementById('exercise-name');
const amountInput = document.getElementById('exercise-duration');
const unitEl = document.getElementById('exercise-unit');
const listEl = document.getElementById('autocomplete-list');

function renderKcalEvents(calendar) {
    const events = [];
    for (const date in exerciseMap) {
        const list = exerciseMap[date];
        const totalKcal = list.reduce((sum, item) => sum + item.cal, 0);
        if (totalKcal > 0) {
            events.push({title: `총 ${totalKcal} kcal`, start: date, allDay: true});
        }
    }
    calendar.removeAllEvents();
    calendar.addEventSource(events);
}

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        height: 650,
        headerToolbar: {left: 'prev,next today', center: 'title', right: ''},
        buttonText: {today: '오늘'},
        dateClick: function (info) {
            selectedDate = info.dateStr;
            document.getElementById('panel-date').innerText = selectedDate.replace(/-/g, '.');
            document.getElementById('exercise-panel').style.display = 'block';
            document.getElementById('add-exercise-btn').innerText = '등록';
            editIndex = null;

            nameInput.value = '';
            amountInput.value = '';
            listEl.classList.add('d-none');

            exerciseList = exerciseMap[selectedDate] || [];
            exerciseMap[selectedDate] = exerciseList;
            renderExerciseList();
        },
        events: []
    });

    calendar.render();
    window.calendar = calendar;
});

nameInput.addEventListener('input', function () {
    const keyword = nameInput.value.trim();
    if (!keyword) return listEl.classList.add('d-none');

    const filtered = exerciseData.filter(e => e.name.includes(keyword));
    if (filtered.length === 0) return listEl.classList.add('d-none');

    listEl.innerHTML = filtered.map(e => `<li class="list-group-item" data-name="${e.name}" data-amount="${e.amountStr}" data-cal="${e.calPerUnit}">${e.name}</li>`).join('');
    listEl.classList.remove('d-none');
});

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
        if (selectedIdx >= 0 && selectedIdx < items.length) items[selectedIdx].click();
        else items[0].click();
    }
});

function updateAutocompleteSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('active', idx === selectedIdx);
    });
}

listEl.addEventListener('click', function (e) {
    if (e.target.tagName !== 'LI') return;
    const li = e.target;
    nameInput.value = li.dataset.name;
    amountInput.value = parseInt(li.dataset.amount);
    nameInput.dataset.calPerUnit = li.dataset.cal;
    listEl.classList.add('d-none');
});

document.getElementById('add-exercise-btn').addEventListener('click', function () {
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);
    const unit = '분';
    const calPerUnit = parseInt(nameInput.dataset.calPerUnit || 0);

    if (!name || !calPerUnit || !amount || amount <= 0) return alert('올바른 값을 입력하세요.');

    const base = exerciseData.find(e => e.name === name);
    const baseAmount = parseInt(base?.amountStr.replace(/[^0-9]/g, '') || 30);
    const cal = Math.round((calPerUnit / baseAmount) * amount);

    if (editIndex !== null) {
        exerciseList[editIndex] = {name, amount: `${amount}${unit}`, cal};
        editIndex = null;
    } else {
        exerciseList.push({name, amount: `${amount}${unit}`, cal});
    }

    exerciseMap[selectedDate] = exerciseList;
    renderExerciseList();
    nameInput.value = '';
    amountInput.value = '';
    nameInput.dataset.calPerUnit = '';
    document.getElementById('add-exercise-btn').innerText = '등록';
});

function renderExerciseList() {
    const listContainer = document.getElementById('exercise-list');
    listContainer.innerHTML = '';
    let total = 0;
    exerciseList.forEach((item, idx) => {
        total += item.cal;
        const rowClass = idx % 2 === 0 ? 'exercise-row-even' : 'exercise-row-odd';
        listContainer.innerHTML += `
        <div class="exercise-row ${rowClass}">
            <div class="cell-name fw-semibold">${item.name}</div>
            <div class="cell-amount">${item.amount}</div>
            <div class="cell-kcal">${item.cal}kcal</div>
            <div class="cell-action">
                <i class="bi bi-pencil-square text-black fs-5" role="button" data-idx="${idx}"></i>
                <i class="bi bi-x-square text-black fs-5" role="button" data-idx="${idx}"></i>
            </div>
        </div>`;
    });
    document.getElementById('total-cal').innerText = total;
    renderKcalEvents(window.calendar);
}

document.getElementById('exercise-list').addEventListener('click', function (e) {
    const idx = parseInt(e.target.dataset.idx);
    if (e.target.classList.contains('bi-pencil-square')) {
        const item = exerciseList[idx];
        nameInput.value = item.name;
        amountInput.value = parseInt(item.amount);
        nameInput.dataset.calPerUnit = exerciseData.find(e => e.name === item.name)?.calPerUnit || 0;
        editIndex = idx;
        document.getElementById('add-exercise-btn').innerText = '수정';
        document.querySelectorAll('.exercise-row').forEach(row => row.classList.remove('editing'));
        e.target.closest('.exercise-row')?.classList.add('editing');
    }
    if (e.target.classList.contains('bi-x-square')) {
        itemToDelete = idx;
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }
});

document.getElementById('confirm-delete-btn').addEventListener('click', function () {
    if (itemToDelete !== null) {
        exerciseList.splice(itemToDelete, 1);
        exerciseMap[selectedDate] = exerciseList;
        renderExerciseList();
        itemToDelete = null;
    }
    const modalEl = document.getElementById('delete-modal');
    bootstrap.Modal.getInstance(modalEl)?.hide();
});

document.getElementById('close-panel-btn').addEventListener('click', function () {
    document.getElementById('exercise-panel').style.display = 'none';
});

document.addEventListener('click', function (e) {
    const panel = document.getElementById('exercise-panel');
    if (!panel) return;
    if (panel.contains(e.target) || e.target.closest('.fc-daygrid-day') || e.target.closest('.modal')) return;
    panel.style.display = 'none';
});
