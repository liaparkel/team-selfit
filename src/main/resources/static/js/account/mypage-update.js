import {showAlertModal, showSuccessModal, showErrorModal} from './basic-modal.js';

// API 엔드포인트 설정
const API_BASE_URL = "/api/account"

// 폼 상태 관리 - 원본 데이터와 현재 데이터 분리
const originalData = {
  email: null,
  name: null,
  nickname: null,
  gender: null,
  birthDate: null,
  height: null,
  weight: null,
  exerciseType: null,
  memberType: "DEFAULT",
}

const formState = {
  email: { value: "", valid: true, checked: true },
  password: { value: "", valid: true },
  passwordConfirm: { value: "", valid: true },
  name: { value: "", valid: true },
  nickname: { value: "", valid: true, checked: true },
  gender: null,
  birthDate: { value: null, valid: true },
  height: { value: null, valid: true },
  weight: { value: null, valid: true },
  exerciseType: null,
  memberType: "DEFAULT",
}

// jQuery 선언
const $ = window.jQuery

// =========================== API 함수들 ===========================

/**
 * 회원 정보 조회 API
 */
async function getMemberInfoAPI() {
  try {
    const response = await axios.get("/api/account/member", {
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    console.log("회원 정보 조회 응답:", response.data)
    return response.data
  } catch (error) {
    console.error("회원 정보 로드 실패:", error)
    $(".info-value").text("정보를 불러올 수 없습니다.")
    return null
  }
}

/**
 * 닉네임 중복 확인 API
 */
async function checkNicknameDuplicateAPI(nickname) {
  const requestData = {
    nickname: nickname,
  }

  console.log("닉네임 중복확인 요청:", requestData)

  try {
    const response = await axios.post(`${API_BASE_URL}/check-nickname`, requestData, {
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    })

    console.log("닉네임 중복확인 응답:", response.data)
    return response.data
  } catch (error) {
    console.error("닉네임 중복확인 API 오류:", error)
    return null
  }
}

/**
 * 회원정보 수정 API
 */
async function updateMemberAPI(userData) {
  try {
    const response = await axios.put("/api/account/member", userData, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    })

    console.log("회원정보 수정 응답:", response.data)
    return response.data
  } catch (error) {
    console.error("회원정보 수정 API 오류:", error)
    return null
  }
}

// =========================== 유틸리티 함수들 ===========================

function toggleButtonLoading($button, loading) {
  const $textSpan = $button.find(".btn-text")
  const $loadingSpan = $button.find(".btn-loading")

  if (loading) {
    $textSpan.addClass("d-none")
    $loadingSpan.removeClass("d-none")
    $button.prop("disabled", true)
  } else {
    $textSpan.removeClass("d-none")
    $loadingSpan.addClass("d-none")
    if (!$button.hasClass("checked")) {
      $button.prop("disabled", false)
    }
  }
}

/**
 * 에러 메시지 표시
 */
function showError($element, message) {
  let $feedback

  if ($element.hasClass("compact-input")) {
    $feedback = $element.closest(".compact-input-group").find(".invalid-feedback")
  } else {
    $feedback = $element.closest(".mb-3, .mb-4").find(".invalid-feedback")
  }

  if ($feedback.length === 0) {
    const $newFeedback = $('<div class="invalid-feedback"></div>')
    if ($element.hasClass("compact-input")) {
      $element.closest(".compact-input-group").append($newFeedback)
    } else {
      $element.closest(".mb-3, .mb-4").append($newFeedback)
    }
    $newFeedback.text(message)
  } else {
    $feedback.text(message)
  }
  $element.addClass("is-invalid")
}

/**
 * 에러 메시지 제거
 */
function clearError($element) {
  let $feedback

  if ($element.hasClass("compact-input")) {
    $feedback = $element.closest(".compact-input-group").find(".invalid-feedback")
  } else {
    $feedback = $element.closest(".mb-3, .mb-4").find(".invalid-feedback")
  }

  if ($feedback.length) {
    $feedback.text("")
    $element.removeClass("is-invalid")
  }
}

/**
 * 필드가 원본 데이터에서 변경되었는지 확인
 */
function isFieldChanged(fieldName, currentValue) {
  return originalData[fieldName] !== currentValue
}

/**
 * 필드에 입력이 진행 중인지 확인 (빈 값이 아니고 내용이 있는 경우)
 */
function isFieldBeingEdited(value) {
  return value !== null && value !== undefined && value.toString().trim() !== ""
}

/**
 * 모든 에러 상태 초기화
 */
function clearAllErrors() {
  $(".is-invalid").removeClass("is-invalid")
  $(".invalid-feedback").text("")
}

// =========================== 초기화 함수들 ===========================

$(document).ready(() => {
  initEventListeners()
  loadMemberData()
})

/**
 * 회원 데이터 로드 및 폼 초기화
 */
async function loadMemberData() {
  try {
    const memberData = await getMemberInfoAPI()

    if (memberData) {
      // 원본 데이터 저장
      originalData.email = memberData.email || null
      originalData.name = memberData.name || null
      originalData.nickname = memberData.nickname || null
      originalData.gender = memberData.gender || null
      originalData.birthDate = memberData.birthday || null
      originalData.height = memberData.height || null
      originalData.weight = memberData.weight || null
      originalData.exerciseType = memberData.goal || null
      originalData.memberType = memberData.memberType || "DEFAULT"

      // 폼 상태 업데이트
      formState.email.value = originalData.email
      formState.name.value = originalData.name
      formState.nickname.value = originalData.nickname
      formState.gender = originalData.gender
      formState.birthDate.value = originalData.birthDate
      formState.height.value = originalData.height
      formState.weight.value = originalData.weight
      formState.exerciseType = originalData.exerciseType
      formState.memberType = originalData.memberType

      // 폼 필드에 데이터 설정
      $("#email").val(originalData.email)
      $("#name").val(originalData.name)
      $("#nickname").val(originalData.nickname)
      $("#birthDate").val(originalData.birthDate)
      $("#height").val(originalData.height)
      $("#weight").val(originalData.weight)

      // 이메일 필드 비활성화 및 중복확인 버튼 숨기기
      $("#email").prop("disabled", true)
      $("#emailCheck").addClass("d-none")

      // 성별 버튼 활성화
      if (originalData.gender) {
        $(`.gender-btn[data-gender="${originalData.gender}"]`).addClass("active")
      }

      // 운동 목적 버튼 활성화
      if (originalData.exerciseType) {
        $(`.exercise-btn[data-type="${originalData.exerciseType}"]`).addClass("active")
      }

      // memberType이 DEFAULT가 아니면 비밀번호 수정 부분 숨기기
      if (originalData.memberType !== "DEFAULT") {
        hidePasswordSection()
      }

      // 닉네임 중복확인 완료 상태로 설정 (기존 데이터이므로)
      setNicknameDuplicateCheckComplete()
    }
  } catch (error) {
    console.error("회원 데이터 로드 오류:", error)
    showAlertModal("회원 정보를 불러오는 중 오류가 발생했습니다.")
  }
}

/**
 * 비밀번호 수정 섹션 숨기기
 */
function hidePasswordSection() {
  $(".password-section").hide()
  formState.password.valid = true
  formState.passwordConfirm.valid = true
}

/**
 * 닉네임 중복확인 완료 상태 설정
 */
function setNicknameDuplicateCheckComplete() {
  formState.nickname.checked = true
  $("#nicknameCheck").addClass("checked").find(".btn-text").text("확인완료")
  $("#nicknameCheck").prop("disabled", true)
}

function initEventListeners() {
  // 입력 필드 검증 - 변경된 필드만 검증
  $("#password").on("input", validatePassword)
  $("#passwordConfirm").on("input", validatePasswordConfirm)
  $("#name").on("input", validateName)
  $("#nickname").on("input", validateNickname)

  // 선택적 필드 검증 - 입력 중인 경우만 검증
  $("#birthDate").on("input", () => {
    formatBirthDate()
    // 원본과 다른 경우에만 검증
    const currentValue = $("#birthDate").val().trim()
    if (isFieldChanged("birthDate", currentValue)) {
      validateBirthDate()
    } else {
      // 원본과 같으면 에러 제거
      clearError($("#birthDate"))
      formState.birthDate.valid = true
    }
  })
  $("#height").on("input", validateHeight)
  $("#weight").on("input", validateWeight)

  // 중복확인 버튼 (닉네임만)
  $("#nicknameCheck").on("click", handleNicknameDuplicateCheck)

  // 성별 선택
  $(".gender-btn").on("click", function () {
    $(".gender-btn").removeClass("active")
    $(this).addClass("active")
    formState.gender = $(this).data("gender")
  })

  // 운동유형 선택
  $(".exercise-btn").on("click", function () {
    $(".exercise-btn").removeClass("active")
    $(this).addClass("active")
    formState.exerciseType = $(this).data("type")
  })

  // 생년월일 포맷팅 및 키다운 처리
  $("#birthDate").on("keydown", handleBirthDateKeydown)

  // 숫자만 입력
  $(".number-only").on("input", function () {
    const value = $(this)
      .val()
      .replace(/[^0-9]/g, "")
    $(this).val(value)
  })

  // 프로필 이미지 업로드
  $(".profile-upload-area").on("click", () => {
    $("#profileImage").click()
  })

  $("#profileImage").on("change", handleProfileImageChange)

  // 버튼 이벤트
  $("#cancelBtn").on("click", handleCancel)
  $("#saveBtn").on("click", handleSave)
}

// =========================== 검증 함수들 - 스마트 검증 적용 ===========================

function validatePassword() {
  const password = $("#password").val()

  // 비밀번호가 입력 중인 경우에만 검증
  if (!isFieldBeingEdited(password)) {
    formState.password.valid = true
    clearError($("#password"))
    $("#password").closest(".input-wrapper").removeClass("valid")
    return
  }

  const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  formState.password.valid = passwordRegex.test(password)

  const $wrapper = $("#password").closest(".input-wrapper")

  if (!formState.password.valid) {
    $wrapper.removeClass("valid")
    showError($("#password"), "8~20자, 숫자, 특수문자를 포함해주세요.")
  } else {
    $wrapper.addClass("valid")
    clearError($("#password"))
  }

  formState.password.value = password

  // 비밀번호 확인도 다시 검증
  if ($("#passwordConfirm").val()) {
    validatePasswordConfirm()
  }
}

function validatePasswordConfirm() {
  const passwordConfirm = $("#passwordConfirm").val()
  const password = $("#password").val()

  formState.passwordConfirm.value = passwordConfirm

  // 둘 다 비어있으면 유효
  if (!isFieldBeingEdited(password) && !isFieldBeingEdited(passwordConfirm)) {
    formState.passwordConfirm.valid = true
    clearError($("#passwordConfirm"))
    $("#passwordConfirm").removeClass("is-invalid")
    return
  }

  // 비밀번호 확인이 입력 중인 경우에만 검증
  if (!isFieldBeingEdited(passwordConfirm)) {
    formState.passwordConfirm.valid = true
    clearError($("#passwordConfirm"))
    $("#passwordConfirm").removeClass("is-invalid")
    return
  }

  if (passwordConfirm !== password) {
    formState.passwordConfirm.valid = false
    showError($("#passwordConfirm"), "비밀번호가 일치하지 않습니다.")
    $("#passwordConfirm").addClass("is-invalid")
  } else if (!formState.password.valid) {
    formState.passwordConfirm.valid = false
    showError($("#passwordConfirm"), "올바른 비밀번호 형식이 아닙니다.")
    $("#passwordConfirm").addClass("is-invalid")
  } else {
    formState.passwordConfirm.valid = true
    clearError($("#passwordConfirm"))
    $("#passwordConfirm").removeClass("is-invalid")
  }
}

function validateName() {
  const name = $("#name").val().trim()

  // 원본 데이터에서 변경된 경우에만 검증
  if (!isFieldChanged("name", name)) {
    formState.name.valid = true
    clearError($("#name"))
    return
  }

  formState.name.value = name
  formState.name.valid = name.length >= 2

  const $wrapper = $("#name").closest(".input-wrapper")

  if (!formState.name.valid) {
    $wrapper.removeClass("valid")
    showError($("#name"), "이름은 2자 이상 입력해주세요.")
  } else {
    $wrapper.addClass("valid")
    clearError($("#name"))
  }
}

function validateNickname() {
  const nickname = $("#nickname").val().trim()

  // 원본 데이터와 같으면 중복확인 완료 처리
  if (!isFieldChanged("nickname", nickname)) {
    formState.nickname.valid = true
    formState.nickname.checked = true
    clearError($("#nickname"))

    // 중복확인 버튼도 완료 상태로 설정
    const $nicknameCheck = $("#nicknameCheck")
    $nicknameCheck.addClass("checked").find(".btn-text").text("확인완료")
    $nicknameCheck.prop("disabled", true)

    const $wrapper = $("#nickname").closest(".input-wrapper")
    $wrapper.addClass("valid")
    return
  }

  formState.nickname.value = nickname
  formState.nickname.valid = nickname.length >= 2

  // 값이 변경되면 중복확인 초기화
  if (formState.nickname.checked) {
    formState.nickname.checked = false
    const $wrapper = $("#nickname").closest(".input-wrapper")
    $wrapper.removeClass("valid")
    resetDuplicateButton($("#nicknameCheck"), "중복확인")
  }

  if (!formState.nickname.valid) {
    showError($("#nickname"), "닉네임은 2자 이상 입력해주세요.")
  } else {
    clearError($("#nickname"))
  }
}

function validateBirthDate() {
  if (!formState.birthDate || typeof formState.birthDate !== "object") {
    formState.birthDate = { value: "", valid: true }
  }

  const birthDate = $("#birthDate").val().trim()

  // 원본 데이터와 같으면 항상 유효 (검증 안함)
  if (!isFieldChanged("birthDate", birthDate)) {
    formState.birthDate.valid = true
    clearError($("#birthDate"))
    return
  }

  // 빈 값이면 유효 (선택적 필드)
  if (!isFieldBeingEdited(birthDate)) {
    formState.birthDate.valid = true
    clearError($("#birthDate"))
    return
  }

  formState.birthDate.value = birthDate

  const birthDateRegex = /^\d{4}\.\d{2}\.\d{2}$/
  if (!birthDateRegex.test(birthDate)) {
    formState.birthDate.valid = false
    showError($("#birthDate"), "형식: YYYY.MM.DD")
    return
  }

  const parts = birthDate.split(".")
  const year = Number.parseInt(parts[0])
  const month = Number.parseInt(parts[1])
  const day = Number.parseInt(parts[2])

  const date = new Date(year, month - 1, day)
  const isValidDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

  if (!isValidDate) {
    formState.birthDate.valid = false
    showError($("#birthDate"), "올바른 날짜를 입력하세요")
  } else if (year < 1900 || year > new Date().getFullYear()) {
    formState.birthDate.valid = false
    showError($("#birthDate"), "올바른 연도를 입력하세요")
  } else {
    formState.birthDate.valid = true
    clearError($("#birthDate"))
  }
}

function validateHeight() {
  if (!formState.height || typeof formState.height !== "object") {
    formState.height = { value: "", valid: true }
  }

  const height = $("#height").val().trim()

  // 입력 중인 경우에만 검증
  if (!isFieldBeingEdited(height)) {
    formState.height.valid = true
    clearError($("#height"))
    return
  }

  formState.height.value = height

  const heightNum = Number.parseInt(height)
  if (heightNum < 50 || heightNum > 250) {
    formState.height.valid = false
    showError($("#height"), "50-250cm")
  } else {
    formState.height.valid = true
    clearError($("#height"))
  }
}

function validateWeight() {
  if (!formState.weight || typeof formState.weight !== "object") {
    formState.weight = { value: "", valid: true }
  }

  const weight = $("#weight").val().trim()

  // 입력 중인 경우에만 검증
  if (!isFieldBeingEdited(weight)) {
    formState.weight.valid = true
    clearError($("#weight"))
    return
  }

  formState.weight.value = weight

  const weightNum = Number.parseInt(weight)
  if (weightNum < 20 || weightNum > 300) {
    formState.weight.valid = false
    showError($("#weight"), "20-300kg")
  } else {
    formState.weight.valid = true
    clearError($("#weight"))
  }
}

// =========================== 이벤트 핸들러들 ===========================

async function handleNicknameDuplicateCheck() {
  if (!formState.nickname.valid) {
    showAlertModal("올바른 닉네임을 입력해주세요.")
    return
  }

  const $nicknameCheck = $("#nicknameCheck")
  toggleButtonLoading($nicknameCheck, true)

  try {
    const response = await checkNicknameDuplicateAPI(formState.nickname.value)

    if (response && !response.result) {
      formState.nickname.checked = true
      $nicknameCheck.addClass("checked")
      $nicknameCheck.find(".btn-text").text("확인완료")
      $nicknameCheck.prop("disabled", true)

      const $wrapper = $("#nickname").closest(".input-wrapper")
      $wrapper.addClass("valid")
    } else {
      showError($("#nickname"), response?.message || "이미 사용중인 닉네임입니다.")
    }
  } catch (error) {
    console.error("닉네임 중복확인 오류:", error)
    showError($("#nickname"), "중복확인 중 오류가 발생했습니다.")
  } finally {
    toggleButtonLoading($nicknameCheck, false)
  }
}

function handleProfileImageChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log("프로필 이미지 선택됨:", file.name)
    }
    reader.readAsDataURL(file)
  }
}

function handleCancel() {
showAlertModal("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.", "/account/mypage")
}

async function handleSave() {
  // 저장 전 모든 에러 상태 초기화
  clearAllErrors()

  // 현재 입력된 값들
  const currentName = $("#name").val().trim()
  const currentNickname = $("#nickname").val().trim()
  const currentBirthDate = $("#birthDate").val().trim()
  const currentHeight = $("#height").val().trim()
  const currentWeight = $("#weight").val().trim()
  const currentPassword = $("#password").val()

  // 변경된 필드나 입력 중인 필드만 검증
  let hasValidationErrors = false

  // 이름 검증 (변경된 경우만)
  if (isFieldChanged("name", currentName)) {
    validateName()
    if (!formState.name.valid) hasValidationErrors = true
  }

  // 닉네임 검증 (변경된 경우만)
  if (isFieldChanged("nickname", currentNickname)) {
    if (!formState.nickname.valid || !formState.nickname.checked) {
      hasValidationErrors = true
      if (!formState.nickname.checked) {
      showAlertModal("변경된 닉네임의 중복확인을 해주세요.")
        return
      }
    }
  }

  // 비밀번호 검증 (입력된 경우만)
  if (isFieldBeingEdited(currentPassword)) {
    validatePassword()
    validatePasswordConfirm()
    if (!formState.password.valid || !formState.passwordConfirm.valid) {
      hasValidationErrors = true
    }
  }

  // 생년월일 검증 (변경된 경우에만)
  if (isFieldChanged("birthDate", currentBirthDate)) {
    validateBirthDate()
    if (!formState.birthDate.valid) hasValidationErrors = true
  }

  // 키 검증 (입력된 경우만)
  if (isFieldBeingEdited(currentHeight)) {
    validateHeight()
    if (!formState.height.valid) hasValidationErrors = true
  }

  // 몸무게 검증 (입력된 경우만)
  if (isFieldBeingEdited(currentWeight)) {
    validateWeight()
    if (!formState.weight.valid) hasValidationErrors = true
  }

  if (hasValidationErrors) {
    showAlertModal("입력 정보를 확인해주세요.")
    return
  }

  const $saveBtn = $("#saveBtn")
  toggleButtonLoading($saveBtn, true)

  try {
    const userData = {
      email: originalData.email, // 이메일은 항상 원본 (수정 불가)
      name: isFieldChanged("name", currentName) ? currentName : originalData.name,
      nickname: isFieldChanged("nickname", currentNickname) ? currentNickname : originalData.nickname,
      gender: formState.gender, // 성별은 현재 선택된 값
      birthday: isFieldChanged("birthDate", currentBirthDate)
        ? (currentBirthDate === "" ? null : currentBirthDate)
        : originalData.birthDate,
      height: isFieldChanged("height", currentHeight) ? currentHeight : originalData.height,
      weight: isFieldChanged("weight", currentWeight) ? currentWeight : originalData.weight,
      goal: formState.exerciseType, // 운동 목적은 현재 선택된 값
    }
    console.log(currentBirthDate);
    console.log(originalData.birthDate)
    // 비밀번호는 입력되고 검증된 경우에만 포함
    if (isFieldBeingEdited(currentPassword) && formState.password.valid && formState.passwordConfirm.valid) {
      userData.pw = currentPassword
    }

    console.log("전송할 데이터:", userData)
    console.log("원본 데이터:", originalData)

    const response = await updateMemberAPI(userData)

    if (response && response.success) {
      showSuccessModal("회원정보가 수정되었습니다.", "/account/mypage", true )
    } else {
        showAlertModal("수정에 실패했습니다. 다시 시도해주세요.")
    }
  } catch (error) {
    console.error("회원정보 수정 오류:", error)
    showErrorModal("수정 중 오류가 발생했습니다.")
  } finally {
    toggleButtonLoading($saveBtn, false)
  }
}

// =========================== 기타 함수들 ===========================

function resetDuplicateButton($button, text) {
  $button.removeClass("checked")
  $button.find(".btn-text").text(text)
  $button.prop("disabled", false)
}

function formatBirthDate() {
  let value = $("#birthDate").val().replace(/\D/g, "")

  if (value.length >= 4) {
    value = value.substring(0, 4) + "." + value.substring(4)
  }
  if (value.length >= 7) {
    value = value.substring(0, 7) + "." + value.substring(7, 9)
  }

  $("#birthDate").val(value)
}

function handleBirthDateKeydown(e) {
  const $input = $(e.target)
  const value = $input.val()

  if (e.keyCode === 8) {
    const cursorPos = $input[0].selectionStart

    if (cursorPos > 0 && value.charAt(cursorPos - 1) === ".") {
      e.preventDefault()
      const newValue = value.substring(0, cursorPos - 2) + value.substring(cursorPos)
      $input.val(newValue)

      setTimeout(() => {
        $input[0].setSelectionRange(cursorPos - 2, cursorPos - 2)
      }, 0)
    }
  }
}
