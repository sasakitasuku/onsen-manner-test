document.addEventListener('DOMContentLoaded', () => {
    (function() {
        let devtools = /./;
        devtools.toString = function() {
            this.opened = true;
        };
        setInterval(function() {
            if (devtools.opened) {
                document.getElementById('devtools-warning').style.display = 'block';
                alert("不正な操作が検知されました。ページをリロードします。");
                window.location.reload();
            }
        }, 1000);
    })();

    // 【多重送信・不正アクセス防止】
    if (localStorage.getItem('exp_submitted') === 'true') {
        window.location.href = 'index.html';
        return;
    }    
    if (!localStorage.getItem('exp_hashedId')) {
        alert("不正なアクセスです。最初からやり直してください。");
        window.location.href = 'index.html';
        return;
    }

    const fixedQuizData = [
        // 重大損害10問 ＋ ダミー5問＝計15問
        { question: "和室の景観や畳を保護するため、重いキャリーケースを持ち運ぶ際は、床から浮かせずに車輪を静かに転がして移動させるのが望ましい。", correctAnswer: false, explanation: "車輪の汚れや摩擦により畳に傷がつきます。張替えによる休室費用が発生し、施設に経済的損害を与えます。" },
        { question: "貸切対応の客室ではない場合でも、親睦を深める目的の旅行であれば、深夜帯に1つの客室へ集まって飲酒や歓談を楽しむことは許容される。", correctAnswer: false, explanation: "深夜の騒音は他の宿泊客の睡眠を妨げ、最悪の場合、他のお客様への「宿泊費の全額返金」という甚大な損害や警察の介入を招きます。" },
        { question: "翌日の外出に備えて身嗜みを整えるため、大浴場の洗い場スペースを私用して、市販のヘアカラー剤やカラーシャンプーによる染髪を行ってもよい。", correctAnswer: false, explanation: "染料が石材や木材、イスなどに付着すると特殊清掃でも落ちなくなる可能性があります。設備の交換にかかる高額な賠償請求の対象となります。" },
        { question: "旅行的情緒を演出し記念撮影等を行うため、温泉番組の演出と同様に、大浴場の湯船にガラス容器に入った飲料を持ち込む行為は認められる。", correctAnswer: false, explanation: "万が一割れた場合、破片回収のために温泉をすべて抜き、徹底的な清掃と換水を行う必要が生じるため、数日間の「大浴場営業停止」という最悪の事態に直結します。" },
        { question: "客室内にあらかじめセットされているバスタオルや浴衣といった各種リネン類は、宿泊費に含まれる消耗品アメニティの一部として、利用の記念にそのまま持ち帰ることができる。", correctAnswer: false, explanation: "薄手のフェイスタオルと異なり、バスタオルや浴衣は施設の備品です。持ち帰りは窃盗罪に該当し、施設に明確な経済的損失を与えます(※施設による/例外を除く)。" },
        { question: "和室の構造内にある「床の間」は、持参した手荷物を仮置きしたり、着座してくつろいだりする多目的スペースとして活用できる。", correctAnswer: false, explanation: "床の間は神聖な鑑賞スペースです。キャリーケースを置いたり座ったりすると、高価な木材や掛け軸が傷つき、数十万円単位の修繕費が発生する重大な器物損壊となります。" },
        { question: "浴後において、客室内の空間を有効に活用するため、水分を含んだ状態の濡れたバスタオルを一時的に和室の畳の上や座椅子の上へ広げて配置した。", correctAnswer: false, explanation: "濡れたタオルを放置すると、数時間で畳に水分が染み込み、カビや腐敗の原因となります。畳の交換が必要となり、施設に高額な損害を与えます。" },
        { question: "サウナ室内において、好みの湿度や室温へと自己調整する目的で、持参したペットボトルの飲料水を加熱されたサウナストーンへと直接振りかけて蒸気(ロウリュ)を発生させてもよい。", correctAnswer: false, explanation: "専用設備ではない電気ストーブに水をかけると、漏電やヒーターの破裂(故障)を引き起こします。数十万円の修理費とサウナの長期営業停止に直結する非常に危険な行為です。" },
        { question: "露天風呂エリアから内風呂エリアへと往来する際、足の裏に軽微な泥や落ち葉などが付着した状態のまま、特段の洗浄を行わず直接内風呂へ再入浴しても構わない。", correctAnswer: false, explanation: "泥やゴミが内風呂の循環ポンプに詰まると、濾過装置が故障し、大浴場全体の機能が停止する大規模な損害リスクがあります。" },
        { question: "個人の特定食材に対する単なる「好き嫌い」の範疇であっても、厨房側に該当食材を完全に排除させる目的であれば、事前に「重度のアレルギー疾患を保有している」と虚偽の申告を行ってもよい。", correctAnswer: false, explanation: "アレルギー申告を受けると、厨房では専用の調理器具の用意や食材の完全隔離など、命を守るための厳重な体制が敷かれます。虚偽申告は厨房のオペレーションを麻痺させる最悪の行為です。" },
        { question: "伝統的な和風旅館が立ち並ぶ温泉街の公共空間において、宿から貸与された浴衣および下駄(館内スリッパ等含む)を着用した状態のまま、館外へと外出して周囲を散策してもよい。", correctAnswer: true, explanation: "温泉街の散策など、一般的な温泉情緒として浴衣での外出は推奨されています(※施設による/例外を除く)。" },
        { question: "客室内の洗面所等にあらかじめ個包装された状態でセットされている歯ブラシや使い切り石鹸などの消耗品アメニティは、利用せず記念としてそのまま自宅へ持ち帰ってもよい。", correctAnswer: true, explanation: "個包装の消耗品(アメニティ)は、お客様が持ち帰ることを前提として用意されているため、全く問題ありません(※施設による/例外を除く)。" },
        { question: "客室の畳スペースにおいて、過って飲料を転倒させ汚損してしまった際、被害の拡大や内部への染み込みを最小限に防ぐため、事実を隠蔽せず即座にフロントへ連絡して清掃手配を要請すべきである。", correctAnswer: true, explanation: "隠して放置されると畳の全交換になりますが、すぐに報告して対処すれば被害を最小限に食い止められるため、旅館側も大変感謝します(※施設による/例外を除く)。" },
        { question: "浴槽の湯船に浸かって入浴している間、持参した私用タオルを温泉の湯量内に混入させないための配慮として、折り畳んだタオルを自身の頭部の上に配置して入浴しても差し支えない。", correctAnswer: true, explanation: "お湯を汚さないための正しいマナーです。濡らしたタオルを頭に乗せることは、のぼせや立ちくらみを防ぐ効果もあります(※施設による/例外を除く)。" },
        { question: "朝のチェックアウトによる退室の際、清掃スタッフによるシーツの全回収作業や忘れ物チェックの工程を円滑にするため、敷かれたままの布団をあえて畳み直すことなく、そのままの状態で部屋を出るのが合理的である。", correctAnswer: true, explanation: "清掃スタッフはシーツを剥がしたり忘れ物を確認するために布団を広げる必要があるため、ぐちゃぐちゃでなければそのままにしておくのが最も親切です(※施設による/例外を除く)。" }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const questionCount = 15; 
    let currentIndex = parseInt(localStorage.getItem('exp_currentIndex')) || 0;   
    let correctCount = parseInt(localStorage.getItem('exp_correctCount')) || 0;   
    let currentQuizSet;

    if (localStorage.getItem('exp_quizSet')) {
        currentQuizSet = JSON.parse(localStorage.getItem('exp_quizSet'));
    } else {
        currentQuizSet = shuffleArray([...fixedQuizData]);
        localStorage.setItem('exp_quizSet', JSON.stringify(currentQuizSet));
        localStorage.setItem('exp_currentIndex', 0);
        localStorage.setItem('exp_correctCount', 0);
    }

    const quizArea = document.getElementById('quiz-area');
    const explanationArea = document.getElementById('explanation-area');
    const questionText = document.getElementById('question-text');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('quiz-progress');

    function renderQuestion() {
        quizArea.style.display = 'block';
        explanationArea.style.display = 'none';
        const currentNum = currentIndex + 1;
        progressText.innerText = `第 ${currentNum} 問 / ${questionCount}問中`;
        if (progressBar) { progressBar.value = currentNum; progressBar.max = questionCount; }
        questionText.innerText = currentQuizSet[currentIndex].question;
    }

    function checkAnswer(userAnswer) {
        if (explanationArea.style.display === 'block') return;
        const currentData = currentQuizSet[currentIndex];
        const isCorrect = (userAnswer === currentData.correctAnswer);
        if (isCorrect) { correctCount++; localStorage.setItem('exp_correctCount', correctCount); }
        
        const resultMark = document.getElementById('result-mark');
        if (isCorrect) { resultMark.innerText = "正解!"; resultMark.className = "result-mark correct-color";
        } else { resultMark.innerText = "不正解"; resultMark.className = "result-mark incorrect-color"; }
        document.getElementById('correct-answer-text').innerText = "正解は「" + (currentData.correctAnswer ? "〇" : "✖") + "」です";
        document.getElementById('explanation-text').innerText = currentData.explanation;
        if (currentIndex === questionCount - 1) document.getElementById('next-btn').innerText = "結果・アンケートへ";
        quizArea.style.display = 'none';
        explanationArea.style.display = 'block';
    }

    document.getElementById('btn-true').addEventListener('click', () => checkAnswer(true));
    document.getElementById('btn-false').addEventListener('click', () => checkAnswer(false));    
    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < questionCount) { localStorage.setItem('exp_currentIndex', currentIndex); renderQuestion();
        } else { localStorage.setItem('exp_score', correctCount); localStorage.setItem('exp_totalQuestions', questionCount); window.location.href = 'result.html'; }
    });
    renderQuestion();
    
    const group = localStorage.getItem('experiment_group');
    if (!group) {
        localStorage.setItem('experiment_group', Math.random() < 0.5 ? 'reward' : 'control');
    }
});