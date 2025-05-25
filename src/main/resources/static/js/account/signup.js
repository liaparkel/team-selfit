// API 엔드포인트 설정
const API_BASE_URL = 'https://api.example.com';

// 폼 상태 관리
const formState = {
    email: { value: '', valid: false, checked: false },
    password: { value: '', valid: false },
    passwordConfirm: { value: '', valid: false },
    name: { value: '', valid: false },
    nickname: { value: '', valid: false, checked: false },
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    exerciseType: '',
    agreeTerms: false
};

// jQuery 선언
const $ = window.jQuery;

// =========================== API 함수들 (jQuery AJAX) ===========================

/**
 * 이메일 중복 확인 API
 * @param {string} email - 확인할 이메일
 * @returns {Promise<{success: boolean, available: boolean, message: string}>}
 */
async function checkEmailDuplicateAPI(email) {
    const requestData = {
        email: email,
        timestamp: new Date().toISOString()
    };
    
    console.log('이메일 중복확인 요청:', requestData);
    
    try {
        // jQuery AJAX 요청
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
        
        // 가짜 응답 (개발용)
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
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<{success: boolean, available: boolean, message: string}>}
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
        
        // 가짜 응답 (개발용)
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
 * 회원가입 API
 * @param {Object} userData - 회원가입 데이터
 * @returns {Promise<{success: boolean, userId?: string, message: string}>}
 */
async function signupAPI(userData) {
    const requestData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        nickname: userData.nickname,
        gender: userData.gender,
        birthDate: userData.birthDate,
        height: userData.height ? parseInt(userData.height) : null,
        weight: userData.weight ? parseInt(userData.weight) : null,
        exerciseType: userData.exerciseType,
        agreeTerms: userData.agreeTerms,
        timestamp: new Date().toISOString()
    };
    
    console.log('회원가입 요청:', requestData);
    
    try {
        const response = await $.ajax({
            url: `${API_BASE_URL}/auth/signup`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            timeout: 15000,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        console.log('회원가입 응답:', response);
        return response;
    } catch (error) {
        console.error('회원가입 API 오류:', error);
        
        // 가짜 응답 (개발용)
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    userId: 'user_' + Date.now(),
                    message: '회원가입이 성공적으로 완료되었습니다.'
                };
                console.log('회원가입 Mock 응답:', mockResponse);
                resolve(mockResponse);
            }, 2000);
        });
    }
}

// =========================== 유틸리티 함수들 ===========================

/**
 * 버튼 로딩 상태 토글
 * @param {jQuery} $button - jQuery 버튼 객체
 * @param {boolean} loading - 로딩 상태
 */
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
        // 확인완료 상태가 아닐 때만 버튼 활성화
        if (!$button.hasClass('checked')) {
            $button.prop('disabled', false);
        }
    }
}

/**
 * 에러 메시지 표시
 * @param {jQuery} $element - jQuery 입력 요소
 * @param {string} message - 에러 메시지
 */
function showError($element, message) {
    const $feedback = $element.closest('.mb-3').find('.invalid-feedback');
    if ($feedback.length) {
        $feedback.text(message);
    }
}

/**
 * 에러 메시지 제거
 * @param {jQuery} $element - jQuery 입력 요소
 */
function clearError($element) {
    const $feedback = $element.closest('.mb-3').find('.invalid-feedback');
    if ($feedback.length) {
        $feedback.text('');
    }
}

// =========================== 이벤트 리스너 등록 ===========================

$(document).ready(function() {
    initEventListeners();
});

function initEventListeners() {
    // 필수 입력 필드 검증
    $('#email').on('input', validateEmail);
    $('#password').on('input', validatePassword);
    $('#passwordConfirm').on('input', validatePasswordConfirm);
    $('#name').on('input', validateName);
    $('#nickname').on('input', validateNickname);
    $('#agreeTerms').on('change', validateForm);

    // 중복확인 버튼
    $('#emailCheck').on('click', handleEmailDuplicateCheck);
    $('#nicknameCheck').on('click', handleNicknameDuplicateCheck);

    // 성별 선택
    $('.gender-btn').on('click', function() {
        $('.gender-btn').removeClass('active');
        $(this).addClass('active');
        formState.gender = $(this).data('gender');
    });

    // 운동유형 선택
    $('.exercise-btn').on('click', function() {
        $('.exercise-btn').removeClass('active');
        $(this).addClass('active');
        formState.exerciseType = $(this).data('type');
    });

    // 생년월일 자동 ���맷팅 및 백스페이스 처리
    $('#birthDate').on('input', formatBirthDate);
    $('#birthDate').on('keydown', handleBirthDateKeydown);

    // 숫자만 입력 허용
    $('.number-only').on('input', function() {
        const value = $(this).val().replace(/[^0-9]/g, '');
        $(this).val(value);
    });

    // 회원가입 버튼
    $('#submitBtn').on('click', handleSignup);
}

// =========================== 검증 함수들 ===========================

function validateEmail() {
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    formState.email.value = email;
    formState.email.valid = emailRegex.test(email);
    
    // 값이 변경되면 중복확인 초기화
    if (formState.email.checked) {
        formState.email.checked = false;
        const $wrapper = $('#email').closest('.input-wrapper');
        $wrapper.removeClass('valid');
        resetDuplicateButton($('#emailCheck'), '중복확인');
    }
    
    if (email === '') {
        clearError($('#email'));
    } else if (!formState.email.valid) {
        showError($('#email'), '올바른 이메일 형식을 입력해주세요.');
    } else {
        clearError($('#email'));
    }
    
    validateForm();
}

function validatePassword() {
    const password = $('#password').val();
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/; // 함수 내부로 이동
    
    formState.password.value = password;
    formState.password.valid = passwordRegex.test(password);
    
    const $wrapper = $('#password').closest('.input-wrapper');
    
    if (password === '') {
        $wrapper.removeClass('valid');
        clearError($('#password'));
    } else if (!formState.password.valid) {
        $wrapper.removeClass('valid');
        showError($('#password'), '8~20자, 숫자, 특수문자를 포함해주세요.');
    } else {
        $wrapper.addClass('valid');
        clearError($('#password'));
    }
    
    // 비밀번호 확인도 다시 검증
    if ($('#passwordConfirm').val()) {
        validatePasswordConfirm();
    }
    
    validateForm();
}

function validatePasswordConfirm() {
    const passwordConfirm = $('#passwordConfirm').val();
    const password = $('#password').val();
    
    formState.passwordConfirm.value = passwordConfirm;
    // 비밀번호 확인은 일치하고 + 비밀번호가 유효할 때만 true
    formState.passwordConfirm.valid = passwordConfirm === password && formState.password.valid;
    
    const $passwordConfirm = $('#passwordConfirm');
    
    if (passwordConfirm === '') {
        clearError($passwordConfirm);
        $passwordConfirm.removeClass('is-invalid');
    } else if (passwordConfirm !== password) {
        showError($passwordConfirm, '비밀번호가 일치하지 않습니다.');
        $passwordConfirm.addClass('is-invalid');
    } else if (!formState.password.valid) {
        showError($passwordConfirm, '올바른 비밀번호 형식이 아닙니다.');
        $passwordConfirm.addClass('is-invalid');
    } else {
        clearError($passwordConfirm);
        $passwordConfirm.removeClass('is-invalid');
    }
    
    validateForm();
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
    
    validateForm();
}

function validateNickname() {
    const nickname = $('#nickname').val().trim();
    
    formState.nickname.value = nickname;
    formState.nickname.valid = nickname.length >= 2;
    
    // 값이 변경되면 중복확인 초기화
    if (formState.nickname.checked) {
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
    
    validateForm();
}

function validateForm() {
    formState.agreeTerms = $('#agreeTerms').is(':checked');
    
    const isValid = formState.email.valid && formState.email.checked &&
                   formState.password.valid &&
                   formState.passwordConfirm.valid &&
                   formState.name.valid &&
                   formState.nickname.valid && formState.nickname.checked &&
                   formState.agreeTerms;
    
    $('#submitBtn').prop('disabled', !isValid);
    
    console.log('폼 검증 상태:', {
        email: { valid: formState.email.valid, checked: formState.email.checked },
        password: formState.password.valid,
        passwordConfirm: formState.passwordConfirm.valid,
        name: formState.name.valid,
        nickname: { valid: formState.nickname.valid, checked: formState.nickname.checked },
        agreeTerms: formState.agreeTerms,
        isValid: isValid
    });
}

// =========================== 새로운 검증 함수들 ===========================

/**
 * 생년월일 키다운 이벤트 처리 (백스페이스 시 . 제거)
 * @param {Event} e - 키보드 이벤트
 */
function handleBirthDateKeydown(e) {
    const $input = $(e.target);
    const value = $input.val();
    
    // 백스페이스 키 (keyCode 8)
    if (e.keyCode === 8) {
        // 현재 커서 위치
        const cursorPos = $input[0].selectionStart;
        
        // 커서 바로 앞 문자가 '.'인 경우
        if (cursorPos > 0 && value.charAt(cursorPos - 1) === '.') {
            e.preventDefault();
            
            // '.' 앞의 문자까지 제거
            const newValue = value.substring(0, cursorPos - 2) + value.substring(cursorPos);
            $input.val(newValue);
            
            // 커서 위치 조정
            setTimeout(() => {
                $input[0].setSelectionRange(cursorPos - 2, cursorPos - 2);
            }, 0);
        }
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
            $emailCheck.prop('disabled', true); // 확인완료 후 버튼 비활성화
            
            const $wrapper = $('#email').closest('.input-wrapper');
            $wrapper.addClass('valid');
            
            validateForm();
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
            $nicknameCheck.prop('disabled', true); // 확인완료 후 버튼 비활성화
            
            const $wrapper = $('#nickname').closest('.input-wrapper');
            $wrapper.addClass('valid');
            
            validateForm();
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

async function handleSignup() {
    if ($('#submitBtn').prop('disabled')) {
        return;
    }
    
    const $submitBtn = $('#submitBtn');
    toggleButtonLoading($submitBtn, true);
    
    try {
        const userData = {
            email: formState.email.value,
            password: formState.password.value,
            name: formState.name.value,
            nickname: formState.nickname.value,
            gender: formState.gender,
            birthDate: formState.birthDate,
            height: $('#height').val(),
            weight: $('#weight').val(),
            exerciseType: formState.exerciseType,
            agreeTerms: formState.agreeTerms
        };
        
        const response = await signupAPI(userData);
        
        if (response.success) {
            alert('회원가입이 완료되었습니다!');
            resetForm();
        } else {
            alert(response.message || '회원가입 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    } finally {
        toggleButtonLoading($submitBtn, false);
    }
}

// =========================== 기타 함수들 ===========================

function resetDuplicateButton($button, text) {
    $button.removeClass('checked');
    $button.find('.btn-text').text(text);
    $button.prop('disabled', false); // 버튼 재활성화
}

function formatBirthDate() {
    let value = $('#birthDate').val().replace(/\D/g, ''); // 숫자만 추출
    
    if (value.length >= 4) {
        value = value.substring(0, 4) + '.' + value.substring(4);
    }
    if (value.length >= 7) {
        value = value.substring(0, 7) + '.' + value.substring(7, 9);
    }
    
    $('#birthDate').val(value);
    formState.birthDate = value;
}

function resetForm() {
    // 폼 상태 초기화
    Object.keys(formState).forEach(key => {
        if (typeof formState[key] === 'object') {
            formState[key] = { value: '', valid: false, checked: false };
        } else {
            formState[key] = '';
        }
    });
    
    // 입력 필드 초기화
    $('input').each(function() {
        $(this).val('').removeClass('is-invalid');
    });
    
    // 체크박스 초기화
    $('#agreeTerms').prop('checked', false);
    
    // 버튼 상태 초기화
    $('.gender-btn, .exercise-btn').removeClass('active');
    
    // 검증 상태 초기화
    $('.input-wrapper').removeClass('valid');
    
    // 중복확인 버튼 초기화
    resetDuplicateButton($('#emailCheck'), '중복확인');
    resetDuplicateButton($('#nicknameCheck'), '중복확인');
    
    // 에러 메시지 제거
    $('.invalid-feedback').text('');
    
    // 제출 버튼 비활성화
    $('#submitBtn').prop('disabled', true);
}

// =========================== jQuery AJAX 전역 설정 ===========================

// AJAX 요청 전역 설정
$.ajaxSetup({
    error: function(xhr, status, error) {
        console.error('AJAX 오류:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            error: error
        });
    }
});