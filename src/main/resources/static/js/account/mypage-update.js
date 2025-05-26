// API 엔드포인트 설정
const API_BASE_URL = 'https://api.example.com';

// 폼 상태 관리
const formState = {
    email: {value: 'kosis@gmail.com', valid: true, checked: true},
    password: {value: '', valid: true},
    passwordConfirm: {value: '', valid: true},
    name: {value: '송민지', valid: true},
    nickname: {value: 'kodiet', valid: true, checked: true},
    gender: '여자',
    birthDate: '2000.05.21',
    height: '164',
    weight: '55',
    exerciseType: '감량'
};

// jQuery 선언
const $ = window.jQuery;

// =========================== API 함수들 ===========================

/**
 * 이메일 중복 확인 API
 */
async function checkEmailDuplicateAPI(email) {
    const requestData = {
        email: email,
        timestamp: new Date().toISOString()
    };

    console.log('이메일 중복확인 요청:', requestData);

    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/auth/check-email`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log('이메일 중복확인 응답:', response);
        return response;
    } catch (error) {
        console.error('이메일 중복확인 API 오류:', error);

        // Mock 응답
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    available: true,
                    message: '사용 가능한 이메일입니다.'
                };
                console.log('이메일 중복확인 Mock 응답:', mockResponse);
                resolve(mockResponse);
            }, 1000);
        });
    }
}

/**
 * 닉네임 중복 확인 API
 */
async function checkNicknameDuplicateAPI(nickname) {
    const requestData = {
        nickname: nickname,
        timestamp: new Date().toISOString()
    };

    console.log('닉네임 중복확인 요청:', requestData);

    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/auth/check-nickname`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log('닉네임 중복확인 응답:', response);
        return response;
    } catch (error) {
        console.error('닉네임 중복확인 API 오류:', error);

        // Mock 응답
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    available: true,
                    message: '사용 가능한 닉네임입니다.'
                };
                console.log('닉네임 중복확인 Mock 응답:', mockResponse);
                resolve(mockResponse);
            }, 800);
        });
    }
}

/**
 * 회원정보 수정 API
 */
async function updateMemberAPI(userData) {
    const requestData = {
        ...userData,
        timestamp: new Date().toISOString()
    };

    console.log('회원정보 수정 요청:', requestData);

    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/member/update`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            timeout: 15000,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log('회원정보 수정 응답:', response);
        return response;
    } catch (error) {
        console.error('회원정보 수정 API 오류:', error);

        // Mock 응답
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    message: '회원정보가 성공적으로 수정되었습니다.'
                };
                console.log('회원정보 수정 Mock 응답:', mockResponse);
                resolve(mockResponse);
            }, 2000);
        });
    }
}

// =========================== 유틸리티 함수들 ===========================

function toggleButtonLoading($button, loading) {
    const $textSpan = $button.find('.btn-text');
    const $loadingSpan = $button.find('.btn-loading');

    if (loading) {
        $textSpan.addClass('d-none');
        $loadingSpan.removeClass('d-none');
        $button.prop('disabled', true);
    } else {
        $textSpan.removeClass('d-none');
        $loadingSpan.addClass('d-none');
        if (!$button.hasClass('checked')) {
            $button.prop('disabled', false);
        }
    }
}

function showError($element, message) {
    // 가장 가까운 .mb-3 또는 .mb-4 컨테이너에서 invalid-feedback 찾기
    const $container = $element.closest('.mb-3, .mb-4');
    const $feedback = $container.find('.invalid-feedback');
    if ($feedback.length) {
        $feedback.text(message);
        $element.addClass('is-invalid');
    }
}

function clearError($element) {
    // 가장 가까운 .mb-3 또는 .mb-4 컨테이너에서 invalid-feedback 찾기
    const $container = $element.closest('.mb-3, .mb-4');
    const $feedback = $container.find('.invalid-feedback');
    if ($feedback.length) {
        $feedback.text('');
        $element.removeClass('is-invalid');
    }
}

// =========================== 이벤트 리스너 등록 ===========================

$(document).ready(function () {
    initEventListeners();
    initFormData();
});

function initEventListeners() {
    // 입력 필드 검증
    $('#email').on('change', validateEmail);
    $('#password').on('input', validatePassword);
    $('#passwordConfirm').on('input', validatePasswordConfirm);
    $('#name').on('input', validateName);
    $('#nickname').on('input', validateNickname);

    // 중복확인 버튼
    $('#emailCheck').on('click', handleEmailDuplicateCheck);
    $('#nicknameCheck').on('click', handleNicknameDuplicateCheck);

    // 성별 선택
    $('.gender-btn').on('click', function () {
        $('.gender-btn').removeClass('active');
        $(this).addClass('active');
        formState.gender = $(this).data('gender');
    });

    // 운동유형 선택
    $('.exercise-btn').on('click', function () {
        $('.exercise-btn').removeClass('active');
        $(this).addClass('active');
        formState.exerciseType = $(this).data('type');
    });

    // 생년월일 포맷팅
    $('#birthDate').on('input', formatBirthDate);
    $('#birthDate').on('keydown', handleBirthDateKeydown);

    // 숫자만 입력
    $('.number-only').on('input', function () {
        const value = $(this).val().replace(/[^0-9]/g, '');
        $(this).val(value);
    });

    // 프로필 이미지 업로드
    $('.profile-upload-area').on('click', function () {
        $('#profileImage').click();
    });

    $('#profileImage').on('change', handleProfileImageChange);

    // 버튼 이벤트
    $('#cancelBtn').on('click', handleCancel);
    $('#saveBtn').on('click', handleSave);
}

function initFormData() {
    // 기존 데이터로 폼 초기화 (이미 HTML에 value로 설정됨)

    // 성별 버튼 활성화
    $(`.gender-btn[data-gender="${formState.gender}"]`).addClass('active');

    // 운동 목적 버튼 활성화
    $(`.exercise-btn[data-type="${formState.exerciseType}"]`).addClass('active');

    // 중복확인 ���료 상태 표시
    if (formState.email.checked) {
        $('#emailCheck').addClass('checked').find('.btn-text').text('확인완료');
        $('#emailCheck').prop('disabled', true);
    }
    if (formState.nickname.checked) {
        $('#nicknameCheck').addClass('checked').find('.btn-text').text('확인완료');
        $('#nicknameCheck').prop('disabled', true);
    }

    // 입력 필드 검증 상태 표시
    if (formState.name.valid) {
        $('#name').closest('.input-wrapper').addClass('valid');
    }
}

// =========================== 검증 함수들 ===========================

function validateEmail() {
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formState.email.value = email;
    formState.email.valid = emailRegex.test(email);

    // 값이 변경되면 중복확인 초기화 (기본값이 아닌 경우)
    if (formState.email.checked && email !== 'kosis@gmail.com') {
        formState.email.checked = false;
        resetDuplicateButton($('#emailCheck'), '중복확인');
    }

    if (email === '') {
        clearError($('#email'));
    } else if (!formState.email.valid) {
        showError($('#email'), '올바른 이메일 형식을 입력해주세요.');
    } else {
        clearError($('#email'));
    }
}

function validatePassword() {
    const password = $('#password').val();

    if (password === '') {
        // 비밀번호는 선택사항이므로 빈 값일 때는 유효
        formState.password.valid = true;
        clearError($('#password'));
        $('#password').closest('.input-wrapper').removeClass('valid');
    } else {
        const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        formState.password.valid = passwordRegex.test(password);

        const $wrapper = $('#password').closest('.input-wrapper');

        if (!formState.password.valid) {
            $wrapper.removeClass('valid');
            showError($('#password'), '8~20자, 숫자, 특수문자를 포함해주세요.');
        } else {
            $wrapper.addClass('valid');
            clearError($('#password'));
        }
    }

    formState.password.value = password;

    // 비밀번호 확인도 다시 검증
    if ($('#passwordConfirm').val()) {
        validatePasswordConfirm();
    }
}

function validatePasswordConfirm() {
    const passwordConfirm = $('#passwordConfirm').val();
    const password = $('#password').val();

    formState.passwordConfirm.value = passwordConfirm;

    if (password === '' && passwordConfirm === '') {
        // 둘 다 비어있으면 유효
        formState.passwordConfirm.valid = true;
        clearError($('#passwordConfirm'));
        $('#passwordConfirm').removeClass('is-invalid');
    } else if (passwordConfirm !== password) {
        formState.passwordConfirm.valid = false;
        showError($('#passwordConfirm'), '비밀번호가 일치하지 않습니다.');
        $('#passwordConfirm').addClass('is-invalid');
    } else if (!formState.password.valid) {
        formState.passwordConfirm.valid = false;
        showError($('#passwordConfirm'), '올바른 비밀번호 형식이 아닙니다.');
        $('#passwordConfirm').addClass('is-invalid');
    } else {
        formState.passwordConfirm.valid = true;
        clearError($('#passwordConfirm'));
        $('#passwordConfirm').removeClass('is-invalid');
    }
}

function validateName() {
    const name = $('#name').val().trim();

    formState.name.value = name;
    formState.name.valid = name.length >= 2;

    const $wrapper = $('#name').closest('.input-wrapper');

    if (name === '') {
        $wrapper.removeClass('valid');
        clearError($('#name'));
    } else if (!formState.name.valid) {
        $wrapper.removeClass('valid');
        showError($('#name'), '이름은 2자 이상 입력해주세요.');
    } else {
        $wrapper.addClass('valid');
        clearError($('#name'));
    }
}

function validateNickname() {
    const nickname = $('#nickname').val().trim();

    formState.nickname.value = nickname;
    formState.nickname.valid = nickname.length >= 2;

    // 값이 변경되면 중복확인 초기화 (기본값이 아닌 경우)
    if (formState.nickname.checked && nickname !== 'kodiet') {
        formState.nickname.checked = false;
        const $wrapper = $('#nickname').closest('.input-wrapper');
        $wrapper.removeClass('valid');
        resetDuplicateButton($('#nicknameCheck'), '중복확인');
    }

    if (nickname === '') {
        clearError($('#nickname'));
    } else if (!formState.nickname.valid) {
        showError($('#nickname'), '닉네임은 2자 이상 입력해주세요.');
    } else {
        clearError($('#nickname'));
    }
}

// =========================== 이벤트 핸들러들 ===========================

async function handleEmailDuplicateCheck() {
    if (!formState.email.valid) {
        alert('올바른 이메일을 입력해주세요.');
        return;
    }

    const $emailCheck = $('#emailCheck');
    toggleButtonLoading($emailCheck, true);

    try {
        const response = await checkEmailDuplicateAPI(formState.email.value);

        if (response.success && response.available) {
            formState.email.checked = true;
            $emailCheck.addClass('checked');
            $emailCheck.find('.btn-text').text('확인완료');
            $emailCheck.prop('disabled', true);
        } else {
            showError($('#email'), response.message || '이미 사용중인 이메일입니다.');
        }
    } catch (error) {
        console.error('이메일 중복확인 오류:', error);
        showError($('#email'), '중복확인 중 오류가 발생했습니다.');
    } finally {
        toggleButtonLoading($emailCheck, false);
    }
}

async function handleNicknameDuplicateCheck() {
    if (!formState.nickname.valid) {
        alert('올바른 닉네임을 입력해주세요.');
        return;
    }

    const $nicknameCheck = $('#nicknameCheck');
    toggleButtonLoading($nicknameCheck, true);

    try {
        const response = await checkNicknameDuplicateAPI(formState.nickname.value);

        if (response.success && response.available) {
            formState.nickname.checked = true;
            $nicknameCheck.addClass('checked');
            $nicknameCheck.find('.btn-text').text('확인완료');
            $nicknameCheck.prop('disabled', true);

            const $wrapper = $('#nickname').closest('.input-wrapper');
            $wrapper.addClass('valid');
        } else {
            showError($('#nickname'), response.message || '이미 사용중인 닉네임입니다.');
        }
    } catch (error) {
        console.error('닉네임 중복확인 오류:', error);
        showError($('#nickname'), '중복확인 중 오류가 발생했습니다.');
    } finally {
        toggleButtonLoading($nicknameCheck, false);
    }
}

function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log('프로필 이미지 선택됨:', file.name);
            // 실제 구현 시 이미지 미리보기 추가
        };
        reader.readAsDataURL(file);
    }
}

function handleCancel() {
    if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
        window.history.back();
    }
}

async function handleSave() {
    // 모든 필드 검증
    validateEmail();
    validatePassword();
    validatePasswordConfirm();
    validateName();
    validateNickname();

    const isValid = formState.email.valid && formState.email.checked &&
        formState.password.valid &&
        formState.passwordConfirm.valid &&
        formState.name.valid &&
        formState.nickname.valid && formState.nickname.checked;

    if (!isValid) {
        alert('입력 정보를 확인해주세요.');
        return;
    }

    const $saveBtn = $('#saveBtn');
    toggleButtonLoading($saveBtn, true);

    try {
        const userData = {
            email: formState.email.value,
            name: formState.name.value,
            nickname: formState.nickname.value,
            gender: formState.gender,
            birthDate: $('#birthDate').val(),
            height: $('#height').val(),
            weight: $('#weight').val(),
            exerciseType: formState.exerciseType
        };

        // 비밀번호가 입력된 경우에만 포함
        if (formState.password.value) {
            userData.password = formState.password.value;
        }

        const response = await updateMemberAPI(userData);

        if (response.success) {
            alert('회원정보가 수정되었습니다.');
            window.location.href = '/account/mypage';
        } else {
            alert(response.message || '수정 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('회원정보 수정 오류:', error);
        alert('수정 중 오류가 발생했습니다.');
    } finally {
        toggleButtonLoading($saveBtn, false);
    }
}

// =========================== 기타 함수들 ===========================

function resetDuplicateButton($button, text) {
    $button.removeClass('checked');
    $button.find('.btn-text').text(text);
    $button.prop('disabled', false);
}

function formatBirthDate() {
    let value = $('#birthDate').val().replace(/\D/g, '');

    if (value.length >= 4) {
        value = value.substring(0, 4) + '.' + value.substring(4);
    }
    if (value.length >= 7) {
        value = value.substring(0, 7) + '.' + value.substring(7, 9);
    }

    $('#birthDate').val(value);
    formState.birthDate = value;
}

function handleBirthDateKeydown(e) {
    const $input = $(e.target);
    const value = $input.val();

    if (e.keyCode === 8) {
        const cursorPos = $input[0].selectionStart;

        if (cursorPos > 0 && value.charAt(cursorPos - 1) === '.') {
            e.preventDefault();
            const newValue = value.substring(0, cursorPos - 2) + value.substring(cursorPos);
            $input.val(newValue);

            setTimeout(() => {
                $input[0].setSelectionRange(cursorPos - 2, cursorPos - 2);
            }, 0);
        }
    }
}

// =========================== jQuery AJAX 전역 설정 ===========================

$.ajaxSetup({
    error: function (xhr, status, error) {
        console.error('AJAX 오류:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            error: error
        });
    }
});