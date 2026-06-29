document.addEventListener('DOMContentLoaded', () => {
    // 【多重送信防止】すでにデータを送信済みの場合は入力させない
    if (localStorage.getItem('exp_submitted') === 'true') {
        alert("すでに回答データを送信済みです。");
        window.location.href = 'index.html';
        return;
    }
    if (localStorage.getItem('exp_quiz_started') === 'true') {
        alert("すでにクイズが進行中です。");
        window.location.href = 'quiz.html';
        return;
    }

    const form = document.getElementById('attributeForm');
    const inputs = form.querySelectorAll('select, input');
    const nextBtn = document.getElementById('nextBtn');
    const studentIdInput = document.getElementById('studentId');
    
    const zenkakuToHankaku = (str) => {
        return str.replace(/[０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    };

    const validateForm = () => {
        const idValue = zenkakuToHankaku(studentIdInput.value.trim());
        const isAllFilled = Array.from(inputs).every(input => {
            if(input.type === 'checkbox') return input.checked;
            return input.value.trim() !== '';
        });
        const isValidId = /^[0-9]{8}$/.test(idValue);
        if (isAllFilled && isValidId) {
            nextBtn.classList.add('active');
            nextBtn.removeAttribute('disabled');
        } else {
            nextBtn.classList.remove('active');
            nextBtn.setAttribute('disabled', 'true');
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });

    async function hashString(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    nextBtn.addEventListener('click', async () => {
        if (!nextBtn.classList.contains('active')) return;
        nextBtn.classList.remove('active');
        nextBtn.setAttribute('disabled', 'true');
        nextBtn.innerText = "照会中...";
        const finalId = zenkakuToHankaku(studentIdInput.value.trim());
        const hashedStudentId = await hashString(finalId);
        const gasUrl = 'https://script.google.com/macros/s/AKfycbzt9zfQlVlc8oDxTlk7NRCK0j_M8DCSgMQRlmgeKFMA9To_KOtw4zyjETt-UVBXp_wuNg/exec'; 

        try {
            const checkUrl = `${gasUrl}?action=checkId&hashedId=${hashedStudentId}`;
            const response = await fetch(checkUrl, { method: 'GET' });
            const data = await response.json();
            if (data.exists) {
                alert("この学籍番号による回答は既に記録されています。\n重複して参加することはできません。");                
                nextBtn.innerText = "登録済み";
                nextBtn.style.backgroundColor = "#e74c3c";
                localStorage.setItem('exp_submitted', 'true');
                return; 
            } else {
                localStorage.setItem('exp_grade', document.getElementById('grade').value);
                localStorage.setItem('exp_gender', document.getElementById('gender').value);
                localStorage.setItem('exp_hashedId', hashedStudentId); 
                localStorage.setItem('exp_quiz_started', 'true');
                window.location.href = 'quiz.html';
            }
        } catch (error) {
            console.error("ID確認エラー:", error);
            alert("サーバーとの通信に失敗しました。電波の良い場所で再度お試しください。");
            nextBtn.classList.add('active');
            nextBtn.removeAttribute('disabled');
            nextBtn.innerText = "クイズへ進む";
        }
    });
});