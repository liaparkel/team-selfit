// 현재 선택된 옵션들
const currentCompareType = "종합"
let currentYear = new Date().getFullYear()
let currentChart = null
let calendar
let selectedDate = null
const foodMap = {}
let foodList = foodMap[selectedDate] || []
let itemToDelete = null
let editIndex = null

// 더미 데이터 생성 (단일 라인용)
function generateMockData() {
    const arr = []
    const today = new Date()
    const currentYear = today.getFullYear()
    const startYear = currentYear - 2

    for (let year = startYear; year <= currentYear; year++) {
        const jan1 = new Date(year, 0, 1)
        const dec31 = new Date(year, 11, 31)
        const cursor = new Date(jan1)

        while (cursor <= dec31) {
            if (year === currentYear && cursor > today) break

            const dateStr = cursor.toISOString().split("T")[0]
            arr.push({ date: dateStr, kcal: Math.floor(Math.random() * 2500) + 1200 })
            cursor.setDate(cursor.getDate() + 1)
        }
    }
    return arr
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    setupDropdowns()
    renderChart()
    setupCalendar()
})

// 드롭다운 설정
function setupDropdowns() {
    // 연도 셀렉터 설정
    const startYear = currentYear - 2
    const yearSelector = document.querySelector(".year-selector")

    // 연도 옵션 생성
    let yearHtml = ""
    for (let y = currentYear; y >= startYear; y--) {
        const selected = y === currentYear ? "selected" : ""
        yearHtml += `<option value="${y}" ${selected}>${y}년</option>`
    }
    yearSelector.innerHTML = yearHtml

    // 연도 셀렉터 이벤트만 남김
    yearSelector.addEventListener("change", function (e) {
        currentYear = Number.parseInt(this.value)
        renderChart()
    })
}

// 차트 렌더링
function renderChart() {
    const allData = window.foodKcalList?.length ? window.foodKcalList : (window.foodKcalList = generateMockData())

    const data = allData.filter((item) => {
        return new Date(item.date).getFullYear() === currentYear
    })

    const seriesData = data.map((item) => ({
        x: new Date(item.date + "T00:00:00"),
        y: item.kcal,
    }))

    const yMax = Math.max(...seriesData.map((d) => d.y), 0)
    const yAxisMax = yMax <= 4000 ? 4000 : Math.ceil(yMax / 500) * 500

    const jan1 = new Date(currentYear, 0, 1).getTime()
    const dec31 = new Date(currentYear, 11, 31).getTime()
    const today = new Date()
    const todayTime = today.getTime()

    const xMin = jan1
    const xMax = currentYear === today.getFullYear() ? todayTime : dec31

    const options = {
        chart: {
            type: "line",
            height: 400,
            background: "#ffffff",
            zoom: { enabled: true, type: "x", autoScaleYaxis: true },
            toolbar: {
                show: true,
                offsetY: 0,
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                },
            },
        },
        series: [{ name: "섭취 칼로리", data: seriesData }],
        xaxis: {
            type: "datetime",
            min: xMin,
            max: xMax,
            labels: { format: "MM-dd", style: { fontSize: "12px", colors: "#444" } },
            tickPlacement: "on",
        },
        yaxis: {
            max: yAxisMax,
            title: { text: "kcal", style: { fontSize: "14px", color: "#999" } },
            labels: { style: { fontSize: "12px", colors: "#666" } },
        },
        stroke: {
            width: 3,
            curve: "smooth",
            colors: ["#22c55e"],
        },
        fill: {
            type: "solid",
            colors: ["#22c55e"],
        },
        markers: { size: 0, hover: { size: 6 } },
        grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
        title: { text: "식단 그래프", align: "left", style: { fontSize: "18px", color: "#666" } },
        colors: ["#22c55e"],
        tooltip: { x: { format: "yyyy-MM-dd" } },
    }

    // 기존 차트 제거
    if (currentChart) {
        currentChart.destroy()
    }

    const ApexCharts = window.ApexCharts
    currentChart = new ApexCharts(document.querySelector("#food-chart"), options)
    currentChart.render().then(() => {
        const recent7 = new Date()
        recent7.setDate(today.getDate() - 6)
        const recent7Time = recent7.getTime()
        if (currentYear === today.getFullYear()) {
            currentChart.zoomX(recent7Time, xMax)
        } else {
            currentChart.zoomX(xMin, xMax)
        }

        setTimeout(() => {
            const homeBtn = document.querySelector(".apexcharts-reset-icon")
            if (homeBtn) {
                homeBtn.addEventListener("click", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (currentYear === today.getFullYear()) {
                        currentChart.zoomX(recent7Time, xMax)
                    } else {
                        currentChart.zoomX(xMin, xMax)
                    }
                })
            }
        }, 100)
    })

    currentChart.addEventListener("zoomed", (ctx, { xaxis }) => {
        const min = Math.max(xaxis.min, xMin)
        const max = Math.min(xaxis.max, xMax)
        if (min !== xaxis.min || max !== xaxis.max) {
            currentChart.zoomX(min, max)
        }
    })
}

// 캘린더 설정
function setupCalendar() {
    const calendarEl = document.getElementById("calendar")
    if (!calendarEl) return

    const FullCalendar = window.FullCalendar
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "ko",
        height: 650,
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "",
        },
        buttonText: {
            today: "오늘",
        },
        dateClick: (info) => {
            const formatted = info.dateStr.replace(/-/g, ".")
            selectedDate = info.dateStr

            const panel = document.getElementById("food-panel")
            const dateEl = document.getElementById("panel-date")
            if (panel && dateEl) {
                dateEl.innerText = formatted
                panel.style.display = "block"
                editIndex = null
                document.getElementById("add-food-btn").innerText = "등록"
            }

            document.getElementById("food-name").value = ""
            document.getElementById("food-amount").value = ""
            document.getElementById("food-unit").innerText = ""
            document.getElementById("autocomplete-list").classList.add("d-none")

            foodList = foodMap[selectedDate] || []
            foodMap[selectedDate] = foodList
            renderFoodList()
        },
        events: [],
    })

    calendar.render()
}

// 나머지 패널 관련 코드들...
const foodData = [
    { name: "등심 돈까스", amountStr: "200g", calPerUnit: 500 },
    { name: "우동 정식", amountStr: "200g", calPerUnit: 500 },
    { name: "비프 카레", amountStr: "200g", calPerUnit: 500 },
    { name: "알리오 올리오", amountStr: "200g", calPerUnit: 500 },
    { name: "오뚜기 햇반", amountStr: "200g", calPerUnit: 500 },
    { name: "우유", amountStr: "500ml", calPerUnit: 500 },
]

// 음식명 입력 시 자동완성 리스트 처리
const nameInput = document.getElementById("food-name")
const amountInput = document.getElementById("food-amount")
const unitEl = document.getElementById("food-unit")
const listEl = document.getElementById("autocomplete-list")

nameInput.addEventListener("input", () => {
    const keyword = nameInput.value.trim()
    if (!keyword) return listEl.classList.add("d-none")

    const filtered = foodData.filter((f) => f.name.includes(keyword))
    if (filtered.length === 0) return listEl.classList.add("d-none")

    listEl.innerHTML = filtered
        .map(
            (f) => `
        <li class="list-group-item" data-name="${f.name}" data-amount="${f.amountStr}" data-cal="${f.calPerUnit}">
            ${f.name}
        </li>`,
        )
        .join("")
    listEl.classList.remove("d-none")
})

// 자동완성 키보드 네비게이션
let selectedIdx = -1

nameInput.addEventListener("keydown", (e) => {
    const items = listEl.querySelectorAll("li")
    if (items.length === 0) return

    if (e.key === "ArrowDown") {
        e.preventDefault()
        selectedIdx = (selectedIdx + 1) % items.length
        updateAutocompleteSelection(items)
    } else if (e.key === "ArrowUp") {
        e.preventDefault()
        selectedIdx = (selectedIdx - 1 + items.length) % items.length
        updateAutocompleteSelection(items)
    } else if (e.key === "Enter") {
        e.preventDefault()
        if (selectedIdx >= 0 && selectedIdx < items.length) {
            items[selectedIdx].click()
        } else {
            items[0].click()
        }
    }
})

function updateAutocompleteSelection(items) {
    items.forEach((item, idx) => {
        if (idx === selectedIdx) {
            item.classList.add("active")
        } else {
            item.classList.remove("active")
        }
    })
}

listEl.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return

    const name = e.target.dataset.name
    const amountStr = e.target.dataset.amount
    const calPerUnit = Number.parseInt(e.target.dataset.cal)

    const amount = Number.parseInt(amountStr.replace(/[^0-9]/g, ""))
    const unit = amountStr.replace(/[0-9]/g, "")

    nameInput.value = name
    amountInput.value = amount
    unitEl.innerText = unit
    nameInput.dataset.calPerUnit = calPerUnit

    listEl.classList.add("d-none")
})

// 등록 버튼 클릭 시 음식 리스트에 항목 추가 또는 수정
document.getElementById("add-food-btn").addEventListener("click", () => {
    const name = nameInput.value.trim()
    const amount = Number.parseInt(amountInput.value)
    const unit = unitEl.innerText
    const calPerUnit = Number.parseInt(nameInput.dataset.calPerUnit || 0)

    if (!name) {
        alert("음식명을 입력해주세요.")
        return
    }

    if (!calPerUnit) {
        alert("자동완성에서 음식을 선택해주세요.")
        return
    }

    if (!amount || amount <= 0) {
        alert("중량을 올바르게 입력해주세요.")
        return
    }

    const baseAmount = Number.parseInt(foodData.find((f) => f.name === name)?.amountStr.replace(/[^0-9]/g, "") || 100)
    const cal = Math.round((calPerUnit / baseAmount) * amount)

    if (editIndex !== null) {
        foodList[editIndex] = { name, amount: `${amount}${unit}`, cal }
        editIndex = null
        document.getElementById("add-food-btn").innerText = "등록"
        document.querySelectorAll(".food-row").forEach((row) => row.classList.remove("editing"))
    } else {
        foodList.push({ name, amount: `${amount}${unit}`, cal })
    }

    foodMap[selectedDate] = foodList
    renderFoodList()
    nameInput.value = ""
    amountInput.value = ""
    unitEl.innerText = ""
    nameInput.dataset.calPerUnit = ""
    document.getElementById("add-food-btn").innerText = "등록"
})

// 음식 리스트 렌더링 함수
function renderFoodList() {
    const listEl = document.getElementById("food-list")
    listEl.innerHTML = ""
    let total = 0

    foodList.forEach((item, idx) => {
        total += item.cal
        const rowClass = idx % 2 === 0 ? "food-row-even" : "food-row-odd"
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
        `
    })

    document.getElementById("total-cal").innerText = total
    renderKcalEvents(calendar)
}

function renderKcalEvents(calendar) {
    const events = []

    for (const date in foodMap) {
        const list = foodMap[date]
        const totalKcal = list.reduce((sum, item) => sum + item.cal, 0)
        if (totalKcal > 0) {
            events.push({
                title: `총 ${totalKcal} kcal`,
                start: date,
                allDay: true,
            })
        }
    }

    calendar.removeAllEvents()
    calendar.addEventSource(events)
}

// 수정 아이콘 클릭 시 입력창에 값 불러오기
document.getElementById("food-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-pencil-square")) {
        const index = Array.from(document.querySelectorAll(".bi-pencil-square")).indexOf(e.target)
        editIndex = index

        const item = foodList[editIndex]
        const name = item.name
        const amount = Number.parseInt(item.amount)
        const unit = item.amount.replace(/[0-9]/g, "")

        nameInput.value = name
        amountInput.value = amount
        unitEl.innerText = unit

        const base = foodData.find((f) => f.name === name)
        nameInput.dataset.calPerUnit = base?.calPerUnit || 0

        document.getElementById("add-food-btn").innerText = "수정"
        document.querySelectorAll(".food-row").forEach((row) => row.classList.remove("editing"))
        e.target.closest(".food-row")?.classList.add("editing")
    }
})

// 삭제 아이콘 클릭 시 삭제 모달 표시
document.getElementById("food-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-x-square")) {
        itemToDelete = Number.parseInt(e.target.dataset.index)
        const bootstrap = window.bootstrap
        const modal = new bootstrap.Modal(document.getElementById("delete-modal"))
        modal.show()
    }
})

// 삭제 모달에서 확인 버튼 클릭 시 리스트 항목 삭제
document.getElementById("confirm-delete-btn").addEventListener("click", () => {
    if (itemToDelete !== null && itemToDelete >= 0) {
        foodList.splice(itemToDelete, 1)
        itemToDelete = null
        foodMap[selectedDate] = foodList
        renderFoodList()
    }

    const modalEl = document.getElementById("delete-modal")
    const bootstrap = window.bootstrap
    const modalInstance = bootstrap.Modal.getInstance(modalEl)
    if (modalInstance) modalInstance.hide()
})

// 패널 우상단 닫기 버튼 클릭 시 패널 닫기
document.getElementById("close-panel-btn").addEventListener("click", () => {
    const panel = document.getElementById("food-panel")
    if (panel) {
        panel.style.display = "none"
    }
})

// 패널 외부 클릭 시 패널 닫기
document.addEventListener("click", (e) => {
    const panel = document.getElementById("food-panel")
    if (!panel) return

    if (panel.contains(e.target) || e.target.closest(".fc-daygrid-day") || e.target.closest(".modal")) return

    panel.style.display = "none"
})
