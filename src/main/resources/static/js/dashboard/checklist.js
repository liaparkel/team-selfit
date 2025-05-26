let calendar;
let currentSelectedDate = null;
const checklistData = {};
let checklistList = [];
let editIndex = null;
let itemToDeleteIndex = null;

function renderChecklistEvents(calendar) {
    const events = [];
    for (const date in checklistData) {
        const items = checklistData[date];
        if (items.length > 0) {
            const htmlItems = items.slice(0, 3).map(item => `
        <div class="check-item-box">
          <div style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;border:1px solid #ced4da;border-radius:4px;background:#fff">
            <i class="bi ${item.completed ? 'bi-check-lg text-success' : ''} check-icon"></i>
          </div>
          <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${item.text}</span>
        </div>
      `);
            events.push({
                start: date,
                allDay: true,
                display: 'block',
                extendedProps: {checklistHTML: htmlItems.join('')}
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
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        buttonText: {
            today: '오늘'
        },
        eventDisplay: 'block',
        eventContent: function (arg) {
            const div = document.createElement('div');
            div.innerHTML = arg.event.extendedProps.checklistHTML || '';
            return {domNodes: [div]};
        },
        dateClick: function (info) {
            const formatted = info.dateStr.replace(/-/g, '.');
            currentSelectedDate = info.dateStr;

            const panel = document.getElementById('check-panel');
            const dateEl = document.getElementById('panel-date');
            if (panel && dateEl) {
                dateEl.innerText = formatted;
                panel.style.display = 'block';
                editIndex = null;
                document.getElementById('add-check-btn').innerText = '등록';
                renderChecklistList();
            }

            document.getElementById('check-name').value = '';
        },
        events: []
    });

    calendar.render();
    renderChecklistEvents(calendar);
});

function renderChecklistList() {
    const listEl = document.getElementById('check-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    checklistList = checklistData[currentSelectedDate] || [];
    checklistData[currentSelectedDate] = checklistList;

    checklistList.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'check-row d-flex justify-content-between align-items-center';
        if (idx === editIndex) row.classList.add('editing');

        const checkIcon = item.completed ? 'bi-check-lg' : '';
        const textStyle = item.completed ? 'text-decoration-line-through text-muted' : '';

        row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi ${checkIcon} toggle-check" data-index="${idx}" role="button"></i>
        <span class="${textStyle}">${item.text}</span>
      </div>
      <div class="d-flex gap-2">
        <i class="bi bi-pencil-square text-black fs-5" role="button" data-index="${idx}"></i>
        <i class="bi bi-x-square text-black fs-5" role="button" data-bs-toggle="modal" data-bs-target="#delete-modal" data-index="${idx}"></i>
      </div>
    `;

        listEl.appendChild(row);
    });
}

const addBtn = document.getElementById('add-check-btn');
addBtn.classList.add("add-check-btn");

document.getElementById('add-check-btn').addEventListener('click', function () {
    const input = document.getElementById('check-name');
    const text = input.value.trim();
    if (!text) return;

    if (editIndex !== null) {
        checklistList[editIndex].text = text;
        editIndex = null;
        document.getElementById('add-check-btn').innerText = '등록';
    } else {
        checklistList.push({text, completed: false});
    }
    input.value = '';

    checklistData[currentSelectedDate] = checklistList;
    renderChecklistList();
    renderChecklistEvents(calendar);
});

document.getElementById('check-list').addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('bi-x-square')) {
        itemToDeleteIndex = parseInt(target.dataset.index);
    } else if (target.classList.contains('bi-pencil-square')) {
        editIndex = parseInt(target.dataset.index);
        const item = checklistList[editIndex];
        document.getElementById('check-name').value = item.text;
        document.getElementById('add-check-btn').innerText = '수정';
        renderChecklistList();
    } else if (target.classList.contains('toggle-check')) {
        const index = parseInt(target.dataset.index);
        checklistList[index].completed = !checklistList[index].completed;
        renderChecklistList();
        renderChecklistEvents(calendar);
    }
});

document.getElementById('confirm-delete-btn')?.addEventListener('click', function () {
    if (itemToDeleteIndex !== null) {
        checklistList.splice(itemToDeleteIndex, 1);
        itemToDeleteIndex = null;
        renderChecklistList();
        renderChecklistEvents(calendar);

        const modalEl = document.getElementById('delete-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
});

document.getElementById('close-panel-btn').addEventListener('click', function () {
    document.getElementById('check-panel').style.display = 'none';
});

document.addEventListener('click', function (e) {
    const panel = document.getElementById('check-panel');
    const modal = document.querySelector('.modal.show');

    if (!panel || panel.style.display === 'none') return;

    const isClickInside = panel.contains(e.target) ||
        e.target.closest('.fc-daygrid-day') ||
        e.target.closest('.modal') ||
        e.target.closest('.modal-content') ||
        e.target.classList.contains('modal-backdrop') ||
        e.target.closest('.bi-x-square') || e.target.closest('.bi-pencil-square') ||
        e.target.closest('.toggle-check');

    if (!isClickInside && !modal) {
        panel.style.display = 'none';
    }
});
