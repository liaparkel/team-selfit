// kcal.js

// 사용자 더미 정보 (기초대사량 계산용)
const userInfo = {
    birth: "1995-06-01",
    gender: "female",
    height: 165,
    weight: 55
};

function calculateBMR(user) {
    const age = new Date().getFullYear() - new Date(user.birth).getFullYear();
    if (user.gender === "male") {
        return Math.round(66.47 + (13.75 * user.weight) + (5 * user.height) - (6.76 * age));
    } else {
        return Math.round(655.1 + (9.56 * user.weight) + (1.85 * user.height) - (4.68 * age));
    }
}

function generateChartData() {
    const today = new Date();
    const data = [];
    const intakeData = [];
    const burnData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const x = new Date(date);
        const bmr = calculateBMR(userInfo);
        const burned = Math.floor(Math.random() * 1000) + 500;
        const intake = Math.floor(Math.random() * 1000) + 2500;

        intakeData.push({x, y: intake});
        burnData.push({x, y: bmr + burned});
    }

    return {intakeData, burnData};
}

function renderLineChart() {
    const {intakeData, burnData} = generateChartData();

    const options = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    reset: true
                }
            }
        },
        series: [
            {name: '섭취', data: intakeData},
            {name: '기초대사량 + 운동', data: burnData}
        ],
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            floating: false,
            offsetY: 0,
            markers: {
                width: 10,
                height: 10,
                radius: 12
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'MM-dd',
                style: {
                    fontSize: '12px',
                    colors: '#444'
                }
            }
        },
        yaxis: {
            title: {
                text: 'kcal',
                style: {
                    fontSize: '14px',
                    color: '#999'
                }
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#666'
                }
            }
        },
        colors: ['#33C181', '#11C6CF'],
        stroke: {width: 3, curve: 'smooth'},
        tooltip: {
            x: {format: 'yyyy-MM-dd'},
            y: {formatter: val => val + ' kcal'}
        },
        title: {
            text: '칼로리 그래프',
            align: 'left',
            style: {
                fontSize: '18px',
                color: '#666'
            }
        }
    };

    const container = document.querySelector(".chart-container");
    container.innerHTML = "";
    const chart = new ApexCharts(container, options);
    chart.render();
}

function setupCalendar() {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "ko",
        height: 650,
        headerToolbar: {left: "prev,next today", center: "title", right: ""},
        buttonText: {today: "오늘"},
        dateClick: function (info) {
            const clicked = info.dateStr;
            document.getElementById("panel-date").innerText = clicked.replace(/-/g, ".");

            const bmr = calculateBMR(userInfo);
            const burned = Math.floor(Math.random() * 1000) + 500;
            const intake = Math.floor(Math.random() * 1000) + 2500;
            const diff = intake - (bmr + burned);

            document.getElementById("bmr").innerText = `${bmr}kcal`;
            document.getElementById("burned").innerText = `${burned}kcal`;
            document.getElementById("intake").innerText = `${intake}kcal`;
            document.getElementById("result").innerHTML =
                `<strong>${Math.abs(diff)}kcal</strong> ${diff >= 0 ? "더 섭취" : "덜 섭취"}하셨습니다.`;

            document.getElementById("kcal-panel").style.display = "block";
        }
    });
    calendar.render();
}

function setupPanelClose() {
    document.getElementById("close-panel-btn").addEventListener("click", () => {
        document.getElementById("kcal-panel").style.display = "none";
    });
    document.addEventListener("click", (e) => {
        const panel = document.getElementById("kcal-panel");
        if (!panel || panel.contains(e.target) || e.target.closest(".fc-daygrid-day") || e.target.closest(".modal")) return;
        panel.style.display = "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderLineChart();
    setupCalendar();
    setupPanelClose();
});
