document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.querySelector('.start-btn');
    const completedMsg = document.getElementById('completed-msg');
    const existingId = localStorage.getItem('experiment_userId');

    if (existingId) {
        if(startBtn) startBtn.style.display = 'none';
        if(completedMsg) completedMsg.style.display = 'block';
    } else {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newUserId = 'user_' + Date.now() + Math.floor(Math.random() * 1000);
            const isReward = Math.random() < 0.5;
            const groupType = isReward ? 'reward' : 'control';
            localStorage.setItem('experiment_userId', newUserId);
            localStorage.setItem('experiment_group', groupType);
            window.location.href = 'screen2.html';
        });
    }
});