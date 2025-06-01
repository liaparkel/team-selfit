// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    // ApexCharts 전역 객체
    const ApexCharts = window.ApexCharts;

    let radialChart = null;
    let lineChart = null;

    // 최대 칼로리 목표
    const maxCalories = 2000;
    function valueToPercent(value) {
        return (value * 100) / maxCalories;
    }

    // ========== 원형 차트 옵션 생성 함수 ==========
    function createRadialOptions(size = 330) {
        const intakeValue = 2500;   // 섭취 값 (예시)
        const exerciseValue = 1200; // 운동 값 (예시)

        const intakeExceeded = intakeValue > maxCalories;
        const exerciseExceeded = exerciseValue > maxCalories;

        return {
            series: [valueToPercent(intakeValue), valueToPercent(exerciseValue)],
            chart: {
                height: size,
                width: size,
                type: "radialBar",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                },
            },
            plotOptions: {
                radialBar: {
                    size: "85%",
                    startAngle: -90,
                    endAngle: 270,
                    hollow: {
                        size: "30%",
                    },
                    track: {
                        background: "#f1f5f9",
                        strokeWidth: "100%",
                        margin: 4,
                    },
                    dataLabels: {
                        name: {
                            fontSize: size > 250 ? "18px" : "16px",
                            color: "#374151",
                        },
                        value: {
                            fontSize: size > 250 ? "16px" : "14px",
                            color: "#111827",
                            formatter: (val, opts) => {
                                if (opts.seriesIndex === 0) return intakeValue + " kcal";
                                if (opts.seriesIndex === 1) return exerciseValue + " kcal";
                                return val + "%";
                            },
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
                            },
                        },
                    },
                },
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
                        stops: [0, 50, 51, 100],
                    },
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
                        stops: [0, 50, 51, 100],
                    },
                },
            ],
            colors: [
                intakeExceeded ? "#f59e0b" : "#33C181",
                exerciseExceeded ? "#ec4899" : "#11C6CF",
            ],
            labels: ["섭취", "운동"],
            legend: {
                show: false,
            },
            stroke: {
                lineCap: "round",
            },
        };
    }

    // ========== 라인 차트용 더미 데이터 ==========
    const chartData = {
        섭취: {
            "2025년": {
                myData: [
                    2800, 1500, 3200, 1800, 3500, 2100, 3800, 1600, 2900, 2400, 3300, 1900,
                    3600, 2200, 3100, 1700, 2700, 2600,
                ],
                avgData: [
                    2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 2500, 2400, 2300, 2600,
                    2700, 2800, 2500, 2400, 2300, 2200,
                ],
            },
            "2024년": {
                myData: [
                    1400, 2800, 1600, 3100, 1800, 2900, 2000, 3300, 1500, 2600, 1700, 3000,
                    1900, 2800, 1300, 2700, 1600, 2500,
                ],
                avgData: [
                    2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2400, 2300, 2200, 2500,
                    2600, 2700, 2400, 2300, 2200, 2100,
                ],
            },
            "2023년": {
                myData: [
                    2600, 1200, 2900, 1500, 3200, 1800, 3500, 1400, 2700, 2100, 3000, 1600,
                    3300, 1900, 2800, 1300, 2500, 2200,
                ],
                avgData: [
                    2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2300, 2200, 2100, 2400,
                    2500, 2600, 2300, 2200, 2100, 2000,
                ],
            },
        },
        운동: {
            "2025년": {
                myData: [
                    1800, 2000, 2400, 2800, 3200, 3600, 3800, 3500, 3200, 2800, 2400, 2000,
                    1800, 1600, 1400, 1800, 2200, 2600,
                ],
                avgData: [
                    2400, 2500, 2600, 2700, 2800, 2900, 3000, 2900, 2800, 2700, 2600, 2500,
                    2400, 2300, 2200, 2300, 2400, 2500,
                ],
            },
            "2024년": {
                myData: [
                    1600, 1800, 2200, 2600, 3000, 3400, 3600, 3300, 3000, 2600, 2200, 1800,
                    1600, 1400, 1200, 1600, 2000, 2400,
                ],
                avgData: [
                    2300, 2400, 2500, 2600, 2700, 2800, 2900, 2800, 2700, 2600, 2500, 2400,
                    2300, 2200, 2100, 2200, 2300, 2400,
                ],
            },
            "2023년": {
                myData: [
                    1400, 1600, 2000, 2400, 2800, 3200, 3400, 3100, 2800, 2400, 2000, 1600,
                    1400, 1200, 1000, 1400, 1800, 2200,
                ],
                avgData: [
                    2200, 2300, 2400, 2500, 2600, 2700, 2800, 2700, 2600, 2500, 2400, 2300,
                    2200, 2100, 2000, 2100, 2200, 2300,
                ],
            },
        },
    };

    // ========== 라인 차트 옵션 생성 함수 ==========
    function createLineOptions(compareType, year) {
        const data = chartData[compareType]?.[year];
        // 데이터가 없는 경우 기본값 사용
        if (!data) {
            console.warn(`데이터를 찾을 수 없습니다: ${compareType}, ${year}`);
            return createDefaultLineOptions(compareType, year);
        }

        return {
            series: [
                {
                    name: "나의 기록",
                    data: data.myData,
                },
                {
                    name: "평균 기록",
                    data: data.avgData,
                },
            ],
            chart: {
                height: 240,
                type: "line",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                },
            },
            stroke: {
                width: [5, 3],
                curve: "smooth",
                dashArray: [0, 5],
            },
            xaxis: {
                type: "category",
                categories: [
                    "05-01",
                    "05-02",
                    "05-03",
                    "05-04",
                    "05-05",
                    "05-06",
                    "05-07",
                    "05-08",
                    "05-09",
                    "05-10",
                    "05-11",
                    "05-12",
                    "05-13",
                    "05-14",
                    "05-15",
                    "05-16",
                    "05-17",
                    "05-18",
                ],
                tickAmount: 6,
                labels: {
                    style: {
                        fontSize: "12px",
                        colors: "#6b7280",
                    },
                },
            },
            yaxis: {
                min: 0,
                max: 4000,
                tickAmount: 8,
                labels: {
                    formatter: (val) => val,
                    style: {
                        fontSize: "12px",
                        colors: "#6b7280",
                    },
                },
                title: {
                    text: "kcal",
                    rotate: -90,
                    style: {
                        fontSize: "14px",
                        color: "#6b7280",
                        fontWeight: 500,
                    },
                },
            },
            title: {
                text: `기록 비교 - ${compareType} (${year})`,
                align: "left",
                style: {
                    fontSize: "16px",
                    color: "#666",
                },
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
                    stops: [0, 100, 100, 100],
                },
            },
            colors: ["#33C181", "#11C6CF"],
            markers: {
                size: 0,
                hover: { size: 6 },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => val + " kcal",
                },
            },
            legend: {
                show: true,
                position: "top",
                horizontalAlign: "right",
            },
            grid: {
                borderColor: "#f3f4f6",
                padding: { left: 0, right: 0 },
            },
        };
    }

    // ========== 기본 라인 차트 옵션 (데이터 없을 때) ==========
    function createDefaultLineOptions(compareType, year) {
        const defaultData = Array(18)
            .fill(0)
            .map(() => Math.floor(Math.random() * 2000) + 1000);

        return {
            series: [
                {
                    name: "나의 기록",
                    data: defaultData,
                },
                {
                    name: "평균 기록",
                    data: defaultData.map((val) => val + Math.floor(Math.random() * 500) - 250),
                },
            ],
            chart: {
                height: 240,
                type: "line",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                },
            },
            stroke: {
                width: [5, 3],
                curve: "smooth",
                dashArray: [0, 5],
            },
            xaxis: {
                type: "category",
                categories: [
                    "05-01",
                    "05-02",
                    "05-03",
                    "05-04",
                    "05-05",
                    "05-06",
                    "05-07",
                    "05-08",
                    "05-09",
                    "05-10",
                    "05-11",
                    "05-12",
                    "05-13",
                    "05-14",
                    "05-15",
                    "05-16",
                    "05-17",
                    "05-18",
                ],
                tickAmount: 6,
                labels: {
                    style: {
                        fontSize: "12px",
                        colors: "#6b7280",
                    },
                },
            },
            yaxis: {
                min: 0,
                max: 4000,
                tickAmount: 8,
                labels: {
                    formatter: (val) => val,
                    style: {
                        fontSize: "12px",
                        colors: "#6b7280",
                    },
                },
                title: {
                    text: "kcal",
                    rotate: -90,
                    style: {
                        fontSize: "14px",
                        color: "#6b7280",
                        fontWeight: 500,
                    },
                },
            },
            title: {
                text: `기록 비교 - ${compareType} (${year})`,
                align: "left",
                style: {
                    fontSize: "16px",
                    color: "#666",
                },
            },
            colors: ["#33C181", "#11C6CF"],
            markers: {
                size: 0,
                hover: { size: 6 },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => val + " kcal",
                },
            },
            legend: {
                show: true,
                position: "top",
                horizontalAlign: "right",
            },
            grid: {
                borderColor: "#f3f4f6",
                padding: { left: 0, right: 0 },
            },
        };
    }

    // ========== 원형 차트 렌더링 ==========
    function renderChart() {
        const chartArea = document.querySelector(".chart-area");
        const isChecklistOpen = document
            .querySelector(".grid")
            .classList.contains("checklist-open");
        const size = isChecklistOpen ? 240 : 330;

        if (radialChart) {
            radialChart.destroy();
        }
        radialChart = new ApexCharts(chartArea, createRadialOptions(size));
        radialChart.render();
    }

    // ========== 라인 차트 렌더링 ==========
    function renderLineChart() {
        const compareSelector = document.querySelector(".compare-selector");
        const yearSelector = document.querySelector(".year-selector");
        const compareType = compareSelector.value;
        const year = yearSelector.value;

        if (lineChart) {
            lineChart.destroy();
        }
        lineChart = new ApexCharts(
            document.querySelector(".chart-container"),
            createLineOptions(compareType, year)
        );
        lineChart.render();
    }

    // 페이지 로드 시 초기 렌더링
    renderChart();
    renderLineChart();

    // ========== 체크리스트 토글 시 차트 크기 재조정 ==========
    // 기존 toggleChecklist에 requestAnimationFrame으로 지연 호출하도록 연결
    const originalToggleChecklist = window.toggleChecklist;
    window.toggleChecklist = () => {
        originalToggleChecklist();
        // 레이아웃이 반영된 다음 프레임에 차트 다시 그리기
        window.requestAnimationFrame(() => {
            renderChart();
        });
    };

    // ========== 라인 차트 옵션 변경 리스너 ==========
    document.querySelector(".compare-selector").addEventListener("change", renderLineChart);
    document.querySelector(".year-selector").addEventListener("change", renderLineChart);
});

// ========== 체크리스트 토글 함수 ==========
// HTML에서 onclick="toggleChecklist()" 로 호출됨
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

// ========== 체크박스 상태 변경 처리 ==========
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

// ========== 새 항목 추가 기능 ==========
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
