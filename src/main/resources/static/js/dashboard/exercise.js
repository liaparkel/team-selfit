// exercise.js - 운동 기록 기능 (차트: 백엔드 연동 버전)
// 기능: FullCalendar 달력, 자동완성 운동 입력, ApexCharts 차트(백엔드 API 호출), 등록/수정/삭제, 총 kcal 계산

// ===== 차트 관련 초기화 및 렌더링 =====
const memberId = window.memberId;
(function () {
    // 전역변수: 로그인된 회원 ID를 페이지에서 넘겨 받습니다.
    // (예: <script>const MEMBER_ID = {{loginMemberId}};</script> 형태로 서버에서 주입)

    /**
     * 년도 선택 드롭다운을 설정합니다.
     * 클릭 시 해당 연도 값을 받아서 백엔드 호출 → renderChart() 실행
     */
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
                const year = parseInt(this.dataset.year, 10);
                dropdownBtn.innerText = `${year}년`;

                // 해당 연도에 대해 백엔드 조회
                fetchYearlyKcal(year)
                    .then(seriesData => {
                        renderChart(seriesData, year);
                    })
                    .catch(err => {
                        console.error("연도별 kcal 데이터 호출 실패:", err);
                        renderChart([], year);
                    });
            });
        });
    }

    /**
     * 특정 연도의 날짜별 총 kcal 데이터를 백엔드에서 받아와서
     * ApexCharts용 seriesData 형식으로 변환하여 반환합니다.
     * @param {number} year
     * @returns {Promise<Array<{x: Date, y: number}>>}
     */
    function fetchYearlyKcal(year) {
        return axios.post('/api/dashboard/exercise/kcal/year', {
            exerciseYear: year
        })
            .then(res => {
                // res.data 예시:
                // [ { exerciseDate: "2025-05-01", exerciseSum: 2580 }, … ]
                const rawList = res.data || [];
                // ApexCharts 시리즈 형식: { x: Date객체, y: kcal 숫자 }
                return rawList.map(item => ({
                    x: new Date(item.exerciseDate + 'T00:00:00'),
                    y: item.exerciseSum
                }));
            });
    }

    document.addEventListener("DOMContentLoaded", function () {
        // 1) 드롭다운 구성
        setupYearDropdown();

        // 2) 초기 로딩: 현재 연도로 차트 그리기
        const defaultYear = new Date().getFullYear();
        fetchYearlyKcal(defaultYear)
            .then(seriesData => {
                renderChart(seriesData, defaultYear);
            })
            .catch(err => {
                console.error("초기 kcal 데이터 호출 실패:", err);
                renderChart([], defaultYear);
            });
    });

    /**
     * ApexCharts로 실제 차트를 그리는 함수
     * @param {Array<{x: number|Date, y: number}>} seriesData
     * @param {number} selectedYear
     */
    function renderChart(seriesData, selectedYear) {
        const today = new Date();
        const jan1 = new Date(selectedYear, 0, 1).getTime();
        const dec31 = new Date(selectedYear, 11, 31).getTime();
        const todayTime = today.getTime();

        const xMin = jan1;
        const xMax = (selectedYear === today.getFullYear() ? todayTime : dec31);

        // y축 최대값: 데이터가 없으면 4000, 있으면 500 단위 올림
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
            series: [{ name: '운동 칼로리', data: seriesData }],
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
            title: { text: '운동 그래프', align: 'left', style: { fontSize: '18px', color: '#666' } }
        };

        // 기존에 있던 차트를 제거하고 다시 생성하려면,
        // 차트 DOM에 이미 렌더된 차트가 남아있을 수 있으므로,
        // 이전 차트 인스턴스가 있다면 destroy()를 호출해야 합니다.
        if (window.exerciseChartInstance) {
            window.exerciseChartInstance.destroy();
        }
        const chart = new ApexCharts(document.querySelector("#exercise-chart"), options);
        window.exerciseChartInstance = chart;

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
                    homeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (selectedYear === today.getFullYear()) {
                            chart.zoomX(recent7Time, xMax);
                        } else {
                            chart.zoomX(xMin, xMax);
                        }
                    });
                }
            }, 100);
        });

        chart.addEventListener("zoomed", function (_ctx, { xaxis }) {
            const min = Math.max(xaxis.min, xMin);
            const max = Math.min(xaxis.max, xMax);
            if (min !== xaxis.min || max !== xaxis.max) {
                chart.zoomX(min, max);
            }
        });
    }
})();

// ===== 달력, 패널, 자동완성, 리스트 =====
// (1) 노트 ID를 전역으로 저장할 변수 추가
let selectedDate   = null;
let exerciseNoteId = null;  // ── 클릭된 날짜에 대응하는 EXERCISE_NOTE ID

let exerciseMap    = {};    // { "2025-06-05": [ { name, amount, cal }, … ] }
let exerciseList   = [];
let editIndex      = null;
let itemToDelete   = null;

// DOM 요소 참조
const nameInput    = document.getElementById('exercise-name');
const amountInput  = document.getElementById('exercise-duration');
const listEl       = document.getElementById('autocomplete-list');


// 달력 이벤트 표시용 (기존 그대로)
function renderKcalEvents(calendar) {
    const events = [];
    for (const date in exerciseMap) {
        const list = exerciseMap[date];
        const totalKcal = list.reduce((sum, item) => sum + item.cal, 0);
        if (totalKcal > 0) {
            events.push({ title: `총 ${totalKcal} kcal`, start: date, allDay: true });
        }
    }
    calendar.removeAllEvents();
    calendar.addEventSource(events);
}


// ===== FullCalendar 초기화 및 날짜 클릭 시 패널 표시 + 노트 생성/조회 =====
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        height: 650,
        headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
        buttonText: { today: '오늘' },

        // ★ 달력에 보이는 날짜마다 getExerciseKcal 호출
        eventSources: [
            function(fetchInfo, successCallback, failureCallback) {
                const startDate = new Date(fetchInfo.start);
                const endDate   = new Date(fetchInfo.end);
                const requests = [];
                let cursor = new Date(startDate);

                while (cursor < endDate) {
                    const dateStr = cursor.toISOString().split('T')[0];
                    const req = axios
                        .post('/api/dashboard/exercise/kcal', { exerciseDate: dateStr })
                        .then(res => {
                            // res.data.exerciseSum 에 해당 날짜의 합계 kcal이 들어옵니다.
                            const sumKcal = res.data.exerciseSum || 0;

                            // sumKcal이 0이면 이벤트를 생성하지 않도록 null 반환
                            if (sumKcal <= 0) {
                                return null;
                            }

                            return {
                                title: `총 ${sumKcal} kcal`,
                                start: dateStr,
                                allDay: true
                            };
                        })
                        .catch(() => null);

                    requests.push(req);
                    cursor.setDate(cursor.getDate() + 1);
                }

                Promise.all(requests)
                    .then(results => {
                        // null이 아닌 객체만 필터해서 달력에 넘겨줍니다.
                        successCallback(results.filter(evt => evt !== null));
                    })
                    .catch(err => {
                        failureCallback(err);
                    });
            }
        ],

        // ────────────────────────────────────
        // 날짜 클릭 시 (팝업 열기 + 노트 생성/조회)
        // ────────────────────────────────────
        dateClick: function(info) {
            selectedDate = info.dateStr;
            document.getElementById('panel-date').innerText = selectedDate.replace(/-/g, '.');
            document.getElementById('exercise-panel').style.display = 'block';
            document.getElementById('add-exercise-btn').innerText = '등록';
            editIndex = null;

            nameInput.value   = '';
            amountInput.value = '';
            listEl.classList.add('d-none');

            // ────────────────────────────
            // (A) 노트 생성/조회
            // ────────────────────────────
            axios.post('/api/dashboard/exercise/list', { exerciseDate: selectedDate })
                .then(res => {
                    exerciseNoteId = res.data.exerciseNoteId;
                    // ────────────────────────────
                    // (B) 상세 목록 조회
                    // ────────────────────────────
                    return axios.post('/api/dashboard/exercises', { exerciseDate: selectedDate });
                })
                .then(res2 => {
                    // res2.data가 List<Exercise>로 올 것
                    const serverList = res2.data || [];
                    exerciseList = serverList.map(item => ({
                        id:     item.exerciseInfoId,
                        name:   item.exerciseName,
                        amount: `${item.exerciseMin}분`,
                        cal:    item.exerciseKcal
                    }));
                    exerciseMap[selectedDate] = exerciseList;
                    renderExerciseList();
                    calendar.refetchEvents(); // 혹시 합계가 바뀌었으면 달력 리프레시
                })
                .catch(err => {
                    console.error("노트 생성/조회 또는 상세 목록 조회 실패:", err);
                    // 에러 상황이더라도 최소한 팝업은 띄워 주고, 빈 목록을 렌더
                    exerciseNoteId = null;
                    exerciseList = [];
                    exerciseMap[selectedDate] = [];
                    renderExerciseList();
                });


    },

        // 더 이상 `events: []`가 필요 없습니다. eventSources가 대신합니다.
    });

    calendar.render();
    window.calendar = calendar;
});



// ===== 자동완성(Autocomplete) 기능 ===== (기존 그대로)
nameInput.addEventListener('input', async function () {
    const keyword = nameInput.value.trim();
    if (!keyword) {
        listEl.classList.add('d-none');
        return;
    }

    try {
        const res = await axios.post('/api/dashboard/exercise/openSearch', {
            keyword:  keyword,
            pageNo:   1,
            numOfRows: 100
        });
        const items = res.data;

        if (!items || items.length === 0) {
            listEl.classList.add('d-none');
            return;
        }

        listEl.innerHTML = items.map(e => {
            const name = e["운동명"] || "";
            const met  = parseFloat(e["단위체중당에너지소비량"] || 0);

            return `
        <li class="autocomplete-item"
            data-name="${name}"
            data-met="${met}">
          <div class="item-info">
            <div class="info-name">${name}</div>
            <div class="info-detail">분당 ${met} kcal</div>
          </div>
        </li>`;
        }).join('');

        listEl.classList.remove('d-none');
    } catch (err) {
        console.error("운동 자동완성 OpenSearch 호출 실패:", err);
        listEl.classList.add('d-none');
    }
});


// ===== 자동완성 항목 클릭 처리 ===== (기존 그대로)
listEl.addEventListener('click', function (e) {
    const clickedLi = e.target.closest('.autocomplete-item');
    if (!clickedLi) return;

    const 운동명   = clickedLi.dataset.name || "";
    const 분당메트 = parseFloat(clickedLi.dataset.met) || 0;

    nameInput.value = 운동명;
    amountInput.value = "";
    nameInput.dataset.calPerUnit = 분당메트;
    listEl.classList.add('d-none');
});


// ===== 키보드 ↑↓ / Enter 자동완성 네비게이션 ===== (기존 그대로)
let selectedIdx = -1;
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
        if (selectedIdx >= 0 && selectedIdx < items.length) {
            items[selectedIdx].click();
        } else {
            items[0].click();
        }
    }
});

function updateAutocompleteSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('active', idx === selectedIdx);
    });
}


// ===== 등록 버튼 클릭 시 운동 항목 서버에 저장 =====
document.getElementById('add-exercise-btn').addEventListener('click', function () {
    const 운동명   = nameInput.value.trim();
    const 분량     = parseInt(amountInput.value, 10);
    const 분당메트 = parseFloat(nameInput.dataset.calPerUnit) || 0;

    if (!운동명) {
        alert("운동명을 입력해주세요.\n(자동완성에서 운동을 선택하세요.)");
        return;
    }
    if (!분당메트) {
        alert("자동완성에서 운동을 선택한 뒤 다시 시도해주세요.");
        return;
    }
    if (!분량 || 분량 <= 0) {
        alert("분량(분)을 올바르게 입력해주세요.");
        return;
    }
    if (!exerciseNoteId) {
        alert("노트 ID가 없습니다. 날짜를 다시 클릭해주세요.");
        return;
    }

    // “총 소모 칼로리 = 분당 메트(㎉/분) × 분량(분)”
    const 총소모칼로리 = Math.round(분당메트 * 분량);

    const requestBody = {
        exerciseNoteId: exerciseNoteId,
        exerciseMin:    분량,
        exerciseName:   운동명,
        met:            분당메트
    };

    axios.post('/api/dashboard/exercise', requestBody)
        .then(response => {
            if (response.data.success) {
                // (C) DB 삽입 성공 시 로컬 데이터도 갱신
                const newItem = {
                    name:   운동명,
                    amount: `${분량}분`,
                    cal:    총소모칼로리
                };

                if (editIndex !== null) {
                    // 수정 모드였으면 로컬 목록 업데이트
                    exerciseList[editIndex] = newItem;
                    editIndex = null;
                } else {
                    // 새로 등록 모드 → 로컬 목록에 추가
                    exerciseList.push(newItem);
                }
                exerciseMap[selectedDate] = exerciseList;

                // (D) 화면 렌더
                renderExerciseList();

                // (E) 입력창 리셋
                nameInput.value = "";
                amountInput.value = "";
                delete nameInput.dataset.calPerUnit;
                document.getElementById('add-exercise-btn').innerText = "등록";
            } else {
                alert("운동 정보를 서버에 저장하지 못했습니다. 다시 시도해주세요.");
            }
        })
        .catch(err => {
            console.error("운동 등록 실패:", err);
            alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        });
});


// ===== 운동 리스트 렌더링 함수 ===== (기존 그대로)
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


// ===== 리스트 아이콘(수정/삭제) 클릭 처리 ===== (기존 그대로)
document.getElementById('exercise-list').addEventListener('click', function (e) {
    const idx = parseInt(e.target.dataset.idx, 10);
    // 수정 아이콘 클릭
    if (e.target.classList.contains('bi-pencil-square')) {
        const item = exerciseList[idx];
        nameInput.value = item.name;
        amountInput.value = parseInt(item.amount, 10); // ex: "30분" → 30
        // 자동완성 시 저장했던 met(분당 kcal)을 동일하게 dataset에 넣어 두면 수정 기능 연결 가능
        // 예: nameInput.dataset.calPerUnit = (item.cal / parseInt(item.amount)) || 0;
        editIndex = idx;
        document.getElementById('add-exercise-btn').innerText = '수정';
        document.querySelectorAll('.exercise-row').forEach(row => row.classList.remove('editing'));
        e.target.closest('.exercise-row')?.classList.add('editing');
    }
    // 삭제 아이콘 클릭
    if (e.target.classList.contains('bi-x-square')) {
        itemToDelete = idx;
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }
});


// ===== 모달 확인 버튼 클릭 시 아이템 삭제 ===== (기존 그대로)
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


// ===== 패널 닫기, 외부 클릭 시 패널 닫기 ===== (기존 그대로)
document.getElementById('close-panel-btn').addEventListener('click', function () {
    document.getElementById('exercise-panel').style.display = 'none';
});

document.addEventListener('click', function (e) {
    const panel = document.getElementById('exercise-panel');
    if (!panel) return;
    if (
        panel.contains(e.target)
        || e.target.closest('.fc-daygrid-day')
        || e.target.closest('.modal')
    ) return;
    panel.style.display = 'none';
});

