document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        height: 650,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        buttonText: {today: '오늘'},
        dateClick: function (info) {
            const selected = info.dateStr;
            document.getElementById('panel-date').innerText = selected.replace(/-/g, '.');
            document.getElementById('kcal-panel').style.display = 'block';
        },
        events: [
            {
                title: '섭취: 2900kcal',
                start: '2025-05-20',
                allDay: true
            },
            {
                title: '소모: 2700kcal',
                start: '2025-05-20',
                allDay: true
            }
        ]
    });

    calendar.render();

    document.getElementById('close-panel-btn').addEventListener('click', function () {
        document.getElementById('kcal-panel').style.display = 'none';
    });

    document.addEventListener('click', function (e) {
        const panel = document.getElementById('kcal-panel');
        if (!panel) return;
        if (panel.contains(e.target) || e.target.closest('.fc-daygrid-day') || e.target.closest('.modal')) return;
        panel.style.display = 'none';
    });

    // ApexChart
    const chart = new ApexCharts(document.querySelector("#kcal-chart"), {
        chart: {
            type: 'line',
            height: 350,
            zoom: {enabled: true, type: 'x', autoScaleYaxis: true},
            toolbar: {show: true}
        },
        series: [
            {name: '섭취', data: generateSeries('intake')},
            {name: '소모', data: generateSeries('burn')}
        ],
        xaxis: {
            type: 'datetime',
            labels: {format: 'MM-dd', style: {fontSize: '12px', colors: '#444'}}
        },
        yaxis: {
            title: {text: 'kcal', style: {fontSize: '14px', color: '#999'}},
            labels: {style: {fontSize: '12px', colors: '#666'}}
        },
        colors: ['#33C181', '#11C6CF'],
        stroke: {width: 3, curve: 'smooth'},
        grid: {borderColor: '#eee'},
        title: {
            text: '섭취/소모 칼로리 추이',
            align: 'left',
            style: {fontSize: '18px', color: '#666'}
        }
    });

    chart.render();

    function generateSeries(type) {
        const today = new Date();
        const arr = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const kcal = type === 'intake'
                ? Math.floor(2500 + Math.random() * 500)
                : Math.floor(2000 + Math.random() * 500);
            arr.push({x: new Date(dateStr + 'T00:00:00'), y: kcal});
        }
        return arr;
    }
});
