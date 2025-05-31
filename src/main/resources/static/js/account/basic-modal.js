// 모달 표시 함수들
/**
 * 알림 모달 표시
 * @param {string} message
 * @param {function|null} callback
 * @param {boolean} triggerOnClose
 */
function showAlertModal(message, redirectPath = null, triggerOnClose = false) {
    $("#alertModalMessage").text(message);
    const $modal = $("#alertModal");
    const modal = new bootstrap.Modal($modal[0]);

    $("#alertModalConfirm").off("click");
    $modal.off("hidden.bs.modal");


    const redirect = () => {
            if (redirectPath) {
                window.location.href = redirectPath;
            }
        };

        if (redirectPath) {
            $("#successModalConfirm").on("click", () => {
                modal.hide();
                redirect();
            });

            if (triggerOnClose) {
                $modal.on("hidden.bs.modal", redirect);
            }
        }

    modal.show();
}

/**
 * 성공 모달 표시
 * @param {string} message
 * @param {function|null} callback
 * @param {boolean} triggerOnClose
 */
function showSuccessModal(message, redirectPath = null, triggerOnClose = false) {
    $("#successModalMessage").text(message);
    const $modal = $("#successModal");
    const modal = new bootstrap.Modal($modal[0]);

    $("#successModalConfirm").off("click");
    $modal.off("hidden.bs.modal");

    const redirect = () => {
        if (redirectPath) {
            window.location.href = redirectPath;
        }
    };

    if (redirectPath) {
        $("#successModalConfirm").on("click", () => {
            modal.hide();
            redirect();
        });

        if (triggerOnClose) {
            $modal.on("hidden.bs.modal", redirect);
        }
    }

    modal.show();
}


/**
 * 에러 모달 표시
 * @param {string} message
 * @param {function|null} callback
 * @param {boolean} triggerOnClose
 */
function showErrorModal(message, redirectPath = null, triggerOnClose = false) {
    $("#errorModalMessage").text(message);
    const $modal = $("#errorModal");
    const modal = new bootstrap.Modal($modal[0]);

    $("#errorModalConfirm").off("click");
    $modal.off("hidden.bs.modal");

    const redirect = () => {
            if (redirectPath) {
                window.location.href = redirectPath;
            }
        };

    if (redirectPath) {
       $("#successModalConfirm").on("click", () => {
               modal.hide();
               redirect();
           });
           if (triggerOnClose) {
               $modal.on("hidden.bs.modal", redirect);
           }
       }

    modal.show();
}

export { showAlertModal, showSuccessModal, showErrorModal };

// 모달 HTML 동적 삽입
(function insertModals() {
    const modalHTML = `
<!-- 알림 모달 -->
<div aria-hidden="true" aria-labelledby="alertModalLabel" class="modal fade" id="alertModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title" id="alertModalLabel">알림</h5>
                <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body text-center py-4">
                <div class="mb-3" id="alertModalIcon">
                    <i class="bi bi-info-circle-fill text-primary" style="font-size: 3rem;"></i>
                </div>
                <p class="mb-0 fs-6" id="alertModalMessage"></p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button class="btn btn-primary px-4" data-bs-dismiss="modal" id="alertModalConfirm" type="button">확인</button>
            </div>
        </div>
    </div>
</div>

<!-- 성공 모달 -->
<div aria-hidden="true" aria-labelledby="successModalLabel" class="modal fade" id="successModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title" id="successModalLabel">성공</h5>
                <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body text-center py-4">
                <div class="mb-3">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <p class="mb-0 fs-6" id="successModalMessage"></p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button class="btn btn-success px-4" id="successModalConfirm" type="button">확인</button>
            </div>
        </div>
    </div>
</div>

<!-- 에러 모달 -->
<div aria-hidden="true" aria-labelledby="errorModalLabel" class="modal fade" id="errorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title" id="errorModalLabel">오류</h5>
                <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body text-center py-4">
                <div class="mb-3">
                    <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
                </div>
                <p class="mb-0 fs-6" id="errorModalMessage"></p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button class="btn btn-danger px-4" data-bs-dismiss="modal" id="errorModalConfirm" type="button">확인</button>
            </div>
        </div>
    </div>
</div>
    `;
    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container);
})();
