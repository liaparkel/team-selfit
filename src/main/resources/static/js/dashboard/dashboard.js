// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const ApexCharts = window.ApexCharts;

    let radialChart = null;
    let lineChart = null;

    // ------------------------------
    // 공통: fetch 요청 시 사용하는 헤더
    // ------------------------------
    const JSON_HEADERS = {
        "Content-Type": "application/json"
    };

    // ------------------------------
    // 최대 칼로리 목표 (예: 2000kcal)
    // ------------------------------
    const maxCalories = 2000;
    function valueToPercent(value) {
        return (value * 100) / maxCalories;
    }

    // ------------------------------
    // 1) 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환
    // ------------------------------
    function getTodayString() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    // ------------------------------
    // 2) 오늘 BMR / 오늘 섭취 합계 / 오늘 운동 합계 조회 함수
    // ------------------------------
    async function fetchTodayBmr() {
        const res = await fetch("/api/dashboard/bmr", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({})
        });
        if (!res.ok) throw new Error("BMR 조회 실패");
        const data = await res.json();
        return data.bmr;
    }

    async function fetchIntakeForDate(dateStr) {
        const res = await fetch("/api/dashboard/food/kcal", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ intakeDate: dateStr })
        });
        if (!res.ok) throw new Error("오늘 섭취 합계 조회 실패");
        const data = await res.json();
        // 실제 DTO가 { intakeSum: #### } 형태로 넘어온다고 가정
        return data.intakeSum ?? 0;
    }

    async function fetchExerciseForDate(dateStr) {
        const res = await fetch("/api/dashboard/exercise/kcal", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ exerciseDate: dateStr })
        });
        if (!res.ok) throw new Error("오늘 운동 합계 조회 실패");
        const data = await res.json();
        return data.exerciseSum ?? 0;
    }

    // ------------------------------
    // 3) 오늘 먹은 음식 목록 / 오늘 한 운동 목록 조회
    // ------------------------------
    async function fetchTodayFoodList(dateStr) {
        const res = await fetch("/api/dashboard/foods", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ intakeDate: dateStr })
        });
        if (!res.ok) throw new Error("오늘 음식 리스트 조회 실패");
        return await res.json();
        // 예: [ { foodName:"햇반", intake:1, unitKcal:350, totalKcal:350, intakeDate:"2025-06-11" }, … ]
    }

    async function fetchTodayExerciseList(dateStr) {
        const res = await fetch("/api/dashboard/exercises", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ exerciseDate: dateStr })
        });
        if (!res.ok) throw new Error("오늘 운동 리스트 조회 실패");
        return await res.json();
        // 예: [ { exerciseName:"벤치 프레스", exerciseMin:30, exerciseKcal:350, totalKcal:350, exerciseDate:"2025-06-11" }, … ]
    }

    // ------------------------------
    // 4) 연간 기록 비교 데이터 조회
    // ------------------------------
    async function fetchYearIntakeCompare(year) {
        const res = await fetch("/api/dashboard/food/kcal/avg/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ intakeYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("연간 섭취 비교 조회 실패");
        return await res.json();
        // 예: [ { intakeDate:"2025-05-28", intakeTotal:2300, avgTotal:2500 }, … ]
    }

    async function fetchYearExerciseCompare(year) {
        const res = await fetch("/api/dashboard/exercise/kcal/avg/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ exerciseYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("연간 운동 비교 조회 실패");
        return await res.json();
        // 예: [ { exerciseDate:"2025-05-28", exerciseTotal:800, avgTotal:950 }, … ]
    }

    // -------------------------------------------------
    // 5) 원형 차트 옵션 생성 (오늘 데이터 기반)
    // -------------------------------------------------
    async function createRadialOptions(size = 330) {
        const today = getTodayString();
        let bmr = 0, intakeValue = 0, exerciseValue = 0;

        try {
            [bmr, intakeValue, exerciseValue] = await Promise.all([
                fetchTodayBmr(),
                fetchIntakeForDate(today),
                fetchExerciseForDate(today)
            ]);
        } catch (e) {
            console.error("오늘 데이터 조회 에러:", e);
            bmr = 0;
            intakeValue = 0;
            exerciseValue = 0;
        }

        const intakeExceeded = intakeValue > maxCalories;
        const exerciseExceeded = exerciseValue > maxCalories;

        return {
            series: [
                valueToPercent(intakeValue),   // 섭취 비율
                valueToPercent(exerciseValue)  // 운동 비율
            ],
            chart: {
                height: size,
                width: size,
                type: "radialBar",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800
                }
            },
            plotOptions: {
                radialBar: {
                    size: "85%",
                    startAngle: -90,
                    endAngle: 270,
                    hollow: { size: "30%" },
                    track: {
                        background: "#f1f5f9",
                        strokeWidth: "100%",
                        margin: 4
                    },
                    dataLabels: {
                        name: {
                            fontSize: size > 250 ? "18px" : "16px",
                            color: "#374151"
                        },
                        value: {
                            fontSize: size > 250 ? "16px" : "14px",
                            color: "#111827",
                            formatter: (val, opts) => {
                                if (opts.seriesIndex === 0) return intakeValue + " kcal";
                                if (opts.seriesIndex === 1) return exerciseValue + " kcal";
                                return val + "%";
                            }
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: "평균",
                            fontSize: size > 250 ? "16px" : "14px",
                            fontWeight: 600,
                            color: "#374151",
                            formatter: () => {
                                const avgPercent = Math.round(
                                    (valueToPercent(intakeValue) + valueToPercent(exerciseValue)) / 2
                                );
                                return avgPercent + "%";
                            }
                        }
                    }
                }
            },
            fill: [
                {
                    type: "gradient",
                    gradient: {
                        shade: "light",
                        type: "horizontal",
                        shadeIntensity: 0.6,
                        gradientToColors: [intakeExceeded ? "#fbbf24" : "#10b981"],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 51, 100]
                    }
                },
                {
                    type: "gradient",
                    gradient: {
                        shade: "light",
                        type: "horizontal",
                        shadeIntensity: 0.6,
                        gradientToColors: [exerciseExceeded ? "#f472b6" : "#22d3ee"],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 51, 100]
                    }
                }
            ],
            colors: [
                intakeExceeded ? "#f59e0b" : "#33C181",
                exerciseExceeded ? "#ec4899" : "#11C6CF"
            ],
            labels: ["섭취", "운동"],
            legend: { show: false },
            stroke: { lineCap: "round" }
        };
    }

    // -------------------------------------------------
    // 6) 오늘 카드형 UI 렌더링
    // -------------------------------------------------
    async function renderTodayCards() {
        const today = getTodayString();

        let foodList = [], exerciseList = [];
        try {
            [foodList, exerciseList] = await Promise.all([
                fetchTodayFoodList(today),
                fetchTodayExerciseList(today)
            ]);
        } catch (e) {
            console.error("오늘 카드형 데이터 조회 실패:", e);
            foodList = [];
            exerciseList = [];
        }

        // 식단(음식 목록) 카드
        const foodListUl = document.querySelector(".food-list");
        if (foodListUl) {
            foodListUl.innerHTML = "";
            if (foodList.length === 0) {
                const li = document.createElement("li");
                li.innerText = "오늘 먹은 음식이 없습니다.";
                foodListUl.appendChild(li);
            } else {
                foodList.forEach(item => {
                    const li = document.createElement("li");
                    const totalKcal = (item.intake ?? 1) * (item.unitKcal ?? 0);
                    li.innerHTML = `<strong>${item.foodName}</strong> ${item.intake}개 (${totalKcal} kcal)`;
                    foodListUl.appendChild(li);
                });
            }
        }

        // 운동(운동 목록) 카드
        const exerciseListUl = document.querySelector(".exercise-list");
        if (exerciseListUl) {
            exerciseListUl.innerHTML = "";
            if (exerciseList.length === 0) {
                const li = document.createElement("li");
                li.innerText = "오늘 한 운동이 없습니다.";
                exerciseListUl.appendChild(li);
            } else {
                exerciseList.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${item.exerciseName}</strong> ${item.exerciseMin}분 (${item.exerciseKcal} kcal)`;
                    exerciseListUl.appendChild(li);
                });
            }
        }

        // 카드 우측 상단 “섭취/운동” 텍스트 업데이트
        const intakeValueElem = document.querySelector(".intake-value");
        const exerciseValueElem = document.querySelector(".exercise-value");
        if (intakeValueElem) {
            try {
                const intakeSum = await fetchIntakeForDate(today);
                intakeValueElem.innerText = `${intakeSum} kcal`;
            } catch {
                intakeValueElem.innerText = `0 kcal`;
            }
        }
        if (exerciseValueElem) {
            try {
                const exerciseSum = await fetchExerciseForDate(today);
                exerciseValueElem.innerText = `${exerciseSum} kcal`;
            } catch {
                exerciseValueElem.innerText = `0 kcal`;
            }
        }
    }

    // -------------------------------------------------
    // ───────────────────────────────────────────────────────────
// 7) 연간 기록 비교 라인 차트 옵션 생성 함수
// ───────────────────────────────────────────────────────────
    async function fetchYearIntakeMy(year) {
        const res = await fetch("/api/dashboard/food/kcal/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ intakeYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("나의 섭취 합계 조회 실패");
        // 리턴값: List<Food> 형태. 예를 들어:
        // [ { intakeDate:"2025-05-28", intakeTotal: 2300 }, { intakeDate:"2025-06-03", intakeTotal:1500 }, … ]
        return await res.json();
    }

    async function fetchYearIntakeAvg(year) {
        const res = await fetch("/api/dashboard/food/kcal/avg/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ intakeYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("평균 섭취 합계 조회 실패");
        // 리턴값: List<Map<String,Object>> 형태. 예시:
        // [ { "intakeDate":"2025-05-28", "avgIntakeKcal": 2200 }, { "intakeDate":"2025-06-03","avgIntakeKcal":1800 }, … ]
        return await res.json();
    }

    async function fetchYearExerciseMy(year) {
        const res = await fetch("/api/dashboard/exercise/kcal/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ exerciseYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("나의 운동 합계 조회 실패");
        // 리턴값: List<Exercise> 형태. 예:
        // [ { exerciseDate:"2025-05-14", exerciseTotal: 800 }, { exerciseDate:"2025-06-03", exerciseTotal: 1200 }, … ]
        return await res.json();
    }

    async function fetchYearExerciseAvg(year) {
        const res = await fetch("/api/dashboard/exercise/kcal/avg/year", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ exerciseYear: parseInt(year) })
        });
        if (!res.ok) throw new Error("평균 운동 합계 조회 실패");
        // 리턴값: List<Map<String,Object>> 형태. 예:
        // [ { "EXERCISE_DATE":"2025-05-14", "avgKcal": 180 }, { "EXERCISE_DATE":"2025-06-03","avgKcal": 352.5}, … ]
        return await res.json();
    }

// ───────────────────────────────────────────────────────────
// createLineOptions(compareType, year)
//   - compareType = "섭취" 또는 "운동"
//   - year = 2025 (숫자 형태로 넘긴다고 가정)
// ───────────────────────────────────────────────────────────
    async function createLineOptions(compareType, year) {
        const myData = [];
        const avgData = [];
        const categories = [];

        if (compareType === "섭취") {
            // 1) 두 API를 병렬 호출
            let [myList, avgList] = [[], []];
            try {
                [myList, avgList] = await Promise.all([
                    fetchYearIntakeMy(year),
                    fetchYearIntakeAvg(year)
                ]);
            } catch (error) {
                console.error("섭취 연간 데이터 로딩 실패:", error);
                myList = [];
                avgList = [];
            }

            // 2) 두 리스트를 날짜별로 합쳐서 맵 형태로 만든 뒤, x축 카테고리 순으로 뽑아내자.
            //    Map key = "YYYY-MM-DD", value = { my: ###, avg: ### }
            const mapByDate = {};
            myList.forEach(item => {
                // item.intakeDate, item.intakeTotal
                mapByDate[item.intakeDate] = {
                    my: item.intakeSum ?? 0,
                    avg: 0
                };
            });
            avgList.forEach(item => {
                // item.intakeDate, item.avgIntakeKcal
                if (!mapByDate[item.intakeDate]) {
                    mapByDate[item.intakeDate] = { my: 0, avg: 0 };
                }
                mapByDate[item.intakeDate].avg = item.avgIntakeKcal ?? 0;
            });

            // 3) mapByDate의 키(날짜)들을 **정렬**된 배열로 뽑아 오자.
            //    예: ["2025-05-01","2025-05-02",...,"2025-12-31"]
            //    여기서는 예시로 “mapByDate”에 들어 있는 날짜만 기준으로 정렬하도록.
            const sortedDates = Object.keys(mapByDate).sort((a, b) => new Date(a) - new Date(b));

            // 4) 정렬된 날짜 배열 순서대로 myData, avgData, categories 채우기
            sortedDates.forEach(dateStr => {
                const { my, avg } = mapByDate[dateStr];
                myData.push(my);
                avgData.push(avg);
                const dt = new Date(dateStr);
                const mm = String(dt.getMonth() + 1).padStart(2, "0");
                const dd = String(dt.getDate()).padStart(2, "0");
                categories.push(`${mm}-${dd}`);
            });
        } else {
            // ─ “운동” 분기 ─
            let [myList, avgList] = [[], []];
            try {
                [myList, avgList] = await Promise.all([
                    fetchYearExerciseMy(year),
                    fetchYearExerciseAvg(year)
                ]);
            } catch (error) {
                console.error("운동 연간 데이터 로딩 실패:", error);
                myList = [];
                avgList = [];
            }

            const mapByDate = {};
            // myList: [ { exerciseDate:"2025-05-14", exerciseTotal: 800 }, … ]
            myList.forEach(item => {
                mapByDate[item.exerciseDate] = {
                    my: item.exerciseSum ?? 0,
                    avg: 0
                };
            });
            // avgList: [ { EXERCISE_DATE:"2025-05-14", avgKcal: 180 }, … ]
            avgList.forEach(item => {
                // 서버 응답 키가 "EXERCISE_DATE" 이므로 item.EXERCISE_DATE
                const dtKey = item.EXERCISE_DATE;
                if (!mapByDate[dtKey]) {
                    mapByDate[dtKey] = { my: 0, avg: 0 };
                }
                mapByDate[dtKey].avg = item.avgKcal ?? 0;
            });

            const sortedDates = Object.keys(mapByDate).sort((a, b) => new Date(a) - new Date(b));
            sortedDates.forEach(dateStr => {
                const { my, avg } = mapByDate[dateStr];
                myData.push(my);
                avgData.push(avg);
                const dt = new Date(dateStr);
                const mm = String(dt.getMonth() + 1).padStart(2, "0");
                const dd = String(dt.getDate()).padStart(2, "0");
                categories.push(`${mm}-${dd}`);
            });
        }

        // 5) 정리된 myData, avgData, categories 를 ApexCharts 옵션에 넣어서 리턴
        return {
            series: [
                { name: "나의 기록", data: myData },
                { name: "평균 기록", data: avgData }
            ],
            chart: {
                height: 240,
                type: "line",
                animations: { enabled: true, easing: "easeinout", speed: 800 }
            },
            stroke: {
                width: [5, 3],
                curve: "smooth",
                dashArray: [0, 5]
            },
            xaxis: {
                type: "category",
                categories: categories,
                tickAmount: 6,
                labels: { style: { fontSize: "12px", colors: "#6b7280" } }
            },
            yaxis: {
                min: 0,
                max: 4000,
                tickAmount: 5,
                labels: { formatter: (val) => val, style: { fontSize: "12px", colors: "#6b7280" } },
                title: { text: "kcal", rotate: -90, style: { fontSize: "14px", color: "#6b7280", fontWeight: 500 } }
            },
            title: {
                text: `기록 비교 - ${compareType} (${year}년)`,
                align: "left",
                style: { fontSize: "16px", color: "#666" }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    gradientToColors: ["#33C181", "#11C6CF"],
                    shadeIntensity: 1,
                    type: "horizontal",
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100, 100, 100]
                }
            },
            colors: ["#33C181", "#11C6CF"],
            markers: { size: 0, hover: { size: 6 } },
            tooltip: {
                shared: true,
                intersect: false,
                y: { formatter: (val) => val + " kcal" }
            },
            legend: { show: true, position: "top", horizontalAlign: "right" },
            grid: { borderColor: "#f3f4f6", padding: { left: 0, right: 0 } }
        };
    }


    // ------------------------------
    // 8) 실제 렌더링 작업
    // ------------------------------
    async function renderChart() {
        const chartArea = document.querySelector(".chart-area");
        const isChecklistOpen = document
            .querySelector(".grid")
            .classList.contains("checklist-open");

        const size = isChecklistOpen ? 240 : 330;
        if (radialChart) radialChart.destroy();

        const opts = await createRadialOptions(size);
        radialChart = new ApexCharts(chartArea, opts);
        radialChart.render();
    }

    async function renderLineChart() {
        const compareSelector = document.querySelector(".compare-selector");
        const yearSelector = document.querySelector(".year-selector");
        const compareType = compareSelector.value; // "섭취" or "운동"
        const year = yearSelector.value;           // "2025년" 등

        if (lineChart) lineChart.destroy();

        const opts = await createLineOptions(compareType, year);
        lineChart = new ApexCharts(
            document.querySelector(".chart-container"),
            opts
        );
        lineChart.render();
    }

    // ------------------------------
    // 9) 페이지 로드 시 초기 실행
    // ------------------------------
    (async function initDashboard() {
        // 오늘 원형 차트 + 카드 목록(식단/운동) 렌더링
        await renderChart();
        await renderTodayCards();

        // 연간 기록 비교 라인 차트 렌더링
        await renderLineChart();
    })();

    // ------------------------------
    // 10) 체크리스트 토글 시 원형 차트 크기 재조정
    // ------------------------------
    const originalToggleChecklist = window.toggleChecklist;
    window.toggleChecklist = () => {
        originalToggleChecklist();
        window.requestAnimationFrame(() => {
            renderChart();
        });
    };

    // ------------------------------
    // 11) 기록 비교 옵션 변경 리스너
    // ------------------------------
    document
        .querySelector(".compare-selector")
        .addEventListener("change", renderLineChart);
    document
        .querySelector(".year-selector")
        .addEventListener("change", renderLineChart);
});

// ------------------------------
// 12) 체크리스트 토글 함수
// ------------------------------
function toggleChecklist() {
    const panel = document.getElementById("checklistPanel");
    const grid = document.querySelector(".grid");

    if (panel.classList.contains("open")) {
        panel.classList.remove("open");
        grid.classList.remove("checklist-open");
    } else {
        panel.classList.add("open");
        grid.classList.add("checklist-open");
    }
}

// ------------------------------
// 13) 체크박스 상태 변경 처리
// ------------------------------
document.addEventListener("change", (e) => {
    if (e.target.type === "checkbox" && e.target.closest(".checklist-item")) {
        const label = e.target.nextElementSibling;
        if (e.target.checked) {
            label.style.textDecoration = "line-through";
            label.style.color = "#9ca3af";
        } else {
            label.style.textDecoration = "none";
            label.style.color = "#374151";
        }
    }
});

// ------------------------------
// 14) 새 체크리스트 항목 추가
// ------------------------------
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-item-btn")) {
        const newItem = prompt("새로운 체크리스트 항목을 입력하세요:");
        if (newItem && newItem.trim()) {
            const checklistContent = document.querySelector(".checklist-content");
            const itemCount = checklistContent.children.length + 1;

            const newItemDiv = document.createElement("div");
            newItemDiv.className = "checklist-item";
            newItemDiv.innerHTML = `
                <input type="checkbox" id="check${itemCount}">
                <label for="check${itemCount}">${newItem.trim()}</label>
            `;
            checklistContent.appendChild(newItemDiv);
        }
    }
});
