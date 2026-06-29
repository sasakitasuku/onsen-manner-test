document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('exp_submitted') === 'true') {
        alert("すでに回答データを送信済みです。ご協力ありがとうございました。");
        window.location.href = 'index.html';
        return;
    }

    const score = parseInt(localStorage.getItem('exp_score')) || 0;
    const totalQuestions = parseInt(localStorage.getItem('exp_totalQuestions')) || 15;
    const group = localStorage.getItem('experiment_group'); 
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = totalQuestions;
    const resultMessage = document.getElementById('result-message');
    const isPerfect = (score === totalQuestions);

    

    if (isPerfect) {
        resultMessage.innerText = "素晴らしい!温泉マナーマスターです!";
        if (group === 'reward') {
            document.getElementById('coupon-area').style.display = 'block';
        }
    } else {
        resultMessage.innerText = `惜しい!あと ${totalQuestions - score} 問で全問正解です。`;
    }
    document.getElementById('go-survey-btn').addEventListener('click', () => {
        window.location.href = 'survey.html';
    });
});