import {getDownloadURL, ref, uploadBytes} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import {storage} from "./firebaseConfig.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1) URL로 “edit 모드인지, write 모드인지” 판별
    const pathParts = window.location.pathname.split('/');
    const isEditMode = pathParts.includes('edit');
    let boardId = null;
    if (isEditMode) {
        boardId = parseInt(pathParts[pathParts.length - 1], 10);
    }

    // 2) DOM 요소 참조
    const formTitle = document.getElementById('form-title');
    const postForm = document.getElementById('postForm');
    const titleInput = document.getElementById('boardTitle');
    const categorySelect = document.getElementById('categorySelect');
    const contentTextarea = document.getElementById('boardContent');
    const imageInput = document.getElementById('imageFileInput');
    const previewImg = document.getElementById('previewImg');
    const submitBtn = document.getElementById('submitBtn');

    // 4) 이미지 미리보기/업로드 토글
    window.triggerImageUpload = () => imageInput.click();
    window.previewImage = (inputEl) => {
        const file = inputEl.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // 5) 모드별 분기
    if (isEditMode && boardId) {
        // 5-1) 수정 모드인 경우
        formTitle.innerText = '글 수정';
        submitBtn.innerText = '수정하기';

        // 기존 데이터 로드
        axios.get(`/api/board/${boardId}`)
            .then(res => {
                const board = res.data.board;
                titleInput.value = board.boardTitle || '';
                contentTextarea.value = board.boardContent || '';
                if (board.categoryId) {
                    categorySelect.value = board.categoryId;
                }
                if (board.boardImg && board.boardImg !== 'null') {
                    previewImg.src = board.boardImg;
                }
            })
            .catch(err => console.error('수정 대상 게시글 로드 실패', err));

        // 수정 제출
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // 유효성 검사
            if (!titleInput.value.trim()) {
                alert('제목을 입력하세요.');
                return;
            }
            if (!contentTextarea.value.trim()) {
                alert('내용을 입력하세요.');
                return;
            }
            if (!categorySelect.value) {
                alert('카테고리를 선택하세요.');
                return;
            }
            let imageUrl = previewImg.src;
            // “previewImg.src”가 기본 icon ("/img/photoicon.png") 이거나 null이면, upload 하지 않음.
            if (imageInput.files[0]) {
                const file = imageInput.files[0];
                // “boards/{timestamp}_{원본파일명}” 경로로 저장
                const storageRefObj = ref(storage, `boards/${Date.now()}_${file.name}`);
                try {
                    const snapshot = await uploadBytes(storageRefObj, file);
                    imageUrl = await getDownloadURL(snapshot.ref);
                } catch (uploadErr) {
                    console.error("Firebase 업로드 실패", uploadErr);
                    alert("이미지 업로드에 실패했습니다.");
                    return;
                }
            }
            const payload = {
                boardTitle: titleInput.value.trim(),
                boardContent: contentTextarea.value.trim(),
                categoryId: parseInt(categorySelect.value, 10),
                boardImg: imageUrl // Firebase에서 받아온 URL 또는 기존 URL
            };

            axios.put(`/api/board/edit/${boardId}`, payload, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(() => {
                    alert('글이 수정되었습니다.');
                    window.location.href = `/board/detail/${boardId}`;
                })
                .catch(err => {
                    console.error('수정 중 오류', err);
                    alert('글 수정에 실패했습니다.');
                });
        });

    } else {
        // 5-2) 작성 모드인 경우
        formTitle.innerText = '글 작성';
        submitBtn.innerText = '게시하기';

        postForm.addEventListener('submit', async e => {
            e.preventDefault();

            // 유효성 검사
            if (!titleInput.value.trim()) {
                alert('제목을 입력하세요.');
                return;
            }
            if (!contentTextarea.value.trim()) {
                alert('내용을 입력하세요.');
                return;
            }
            if (!categorySelect.value) {
                alert('카테고리를 선택하세요.');
                return;
            }

            // 1) 이미지 URL을 null로 초기화
            let imageUrl = null;

            // 2) 사용자가 파일을 선택했다면 Firebase Storage로 업로드
            if (imageInput.files[0]) {
                const file = imageInput.files[0];
                const storageRefObj = ref(storage, `boards/${Date.now()}_${file.name}`);
                try {
                    const snapshot = await uploadBytes(storageRefObj, file);
                    imageUrl = await getDownloadURL(snapshot.ref);
                } catch (uploadErr) {
                    console.error("Firebase 업로드 실패", uploadErr);
                    alert("이미지 업로드에 실패했습니다.");
                    return;
                }
            }

            // 3) 순수 JSON 페이로드 생성 (Content-Type: application/json)
            const payload = {
                boardTitle: titleInput.value.trim(),
                boardContent: contentTextarea.value.trim(),
                categoryId: parseInt(categorySelect.value, 10),
                boardImg: imageUrl // 업로드된 이미지 URL 혹은 null
            };

            // ← 여기서 multipart/form-data 대신 JSON으로 전송
            axios.post('/api/board/add', payload, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(() => {
                    alert('게시글 등록 성공');
                    window.location.href = `/board/list?categoryId=${categorySelect.value}`;
                })
                .catch(err => {
                    console.error('등록 실패', err);
                    alert('새 글 등록에 실패했습니다.');
                });
        });
    }
});
