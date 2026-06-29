document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('exp_submitted') === 'true') {
        alert("すでに回答データを送信済みです。ご協力ありがとうございました。");
        window.location.href = 'index.html';
        return;
    }
    if (!localStorage.getItem('exp_hashedId') || localStorage.getItem('exp_score') === null) {
        alert("不正なアクセスです。最初からやり直してください。");
        window.location.href = 'index.html';
        return;
    }

    const group = localStorage.getItem('experiment_group');
    const score = parseInt(localStorage.getItem('exp_score')) || 0;
    const rewardQuestionArea = document.getElementById('reward-question-area');
    const rewardRadios = document.querySelectorAll('input[name="q_reward"]');

    if (group === 'reward' && score === 15) {
        rewardQuestionArea.style.display = 'block';
        rewardRadios.forEach(radio => radio.required = true); 
    }

    const surveyForm = document.getElementById('surveyForm');
    const submitBtn = document.getElementById('submitSurveyBtn');
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q1Value = document.querySelector('input[name="q1"]:checked')?.value || '';
        const q2Value = document.querySelector('input[name="q2"]:checked')?.value || '';
        const q3Value = document.querySelector('input[name="q3"]:checked')?.value || '';
        const q4Value = document.querySelector('input[name="q4"]:checked')?.value || '';
        const q5Value = document.querySelector('input[name="q5"]:checked')?.value || '';
        const qRewardValue = document.querySelector('input[name="q_reward"]:checked')?.value || '';
        const freeTextValue = document.getElementById('freeText').value.trim();
        const gasUrl = 'https://script.google.com/macros/s/AKfycbzD9iArJ1hmMtKq_A5Vlxo0DG0uwrDmqEdEnx2NBIia5ZoKWJ84h0R8RNhcRKgfSdu3Ng/exec';
        const payload = {
            userId: localStorage.getItem('experiment_userId'),
            group: group,
            grade: localStorage.getItem('exp_grade'),
            gender: localStorage.getItem('exp_gender'),
            hashedId: localStorage.getItem('exp_hashedId'),
            score: score,
            survey_q1: q1Value,
            survey_q2: q2Value,
            survey_q3: q3Value,
            survey_q4: q4Value,
            survey_q5: q5Value,
            survey_reward_motivate: qRewardValue,
            survey_free: freeTextValue
        };

        submitBtn.innerText = "送信中...";
        submitBtn.disabled = true;
        fetch(gasUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'DUPLICATE') {
                alert("この学籍番号による回答は既に記録されています。\n重複してデータを送信することはできません。");
                submitBtn.innerText = "送信エラー(重複)";
                submitBtn.style.backgroundColor = "#e74c3c";
                localStorage.setItem('exp_submitted', 'true');
            } else if (data.status === 'SUCCESS') {
                localStorage.setItem('exp_submitted', 'true');
                alert("すべてのデータが正常に送信されました。\nご協力ありがとうございました。");
                submitBtn.innerText = "送信完了";
                submitBtn.style.backgroundColor = "#bdc3c7";
            } else {
                throw new Error("Server returned ERROR status");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("データ送信に失敗しました。電波の良い場所でもう一度お試しください。");
            submitBtn.innerText = "全てのデータを送信して終了";
            submitBtn.disabled = false;
        });
    });
});