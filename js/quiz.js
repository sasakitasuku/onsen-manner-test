document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('exp_submitted') === 'true') {
        window.location.href = 'index.html';
        return;
    }    
    if (!localStorage.getItem('exp_hashedId')) {
        alert("不正なアクセスです。最初からやり直してください。");
        window.location.href = 'index.html';
        return;
    }

    const allQuizData = [
        { question: "和室に入る際、重いキャリーケースは持ち上げずに畳の上で転がして運んでもよい。", correctAnswer: false, explanation: "車輪の汚れや摩擦により畳に傷がつきます。張替えによる休室費用が発生し、施設に経済的損害を与えます。" },
        { question: "大浴場の脱衣所において、他人が背景に写り込まなければスマートフォンで自撮りをしてもよい。", correctAnswer: false, explanation: "盗撮防止および他客のプライバシー保護のため禁止されています。悪意がなくてもカメラを向ける行為自体が強い不安を与え、施設の信用失墜に直結します。" },
        { question: "髪が長い場合でも、お湯に頭まで浸からなければ、髪を結ばずにお湯に入ってもよい。", correctAnswer: false, explanation: "髪にお湯が触れると水質汚染が発生し、雑菌が繁殖します。他のお客様が不快な思いをするだけでなく、水質管理に悪影響を及ぼし、保健所による営業停止処分のリスクも生じます。" },
        { question: "貸切予約ではないが、友人との旅行なので、深夜まで部屋に集まってお酒を飲みながら大きな声で談笑してもよい。", correctAnswer: false, explanation: "古い旅館は木造建築が多く、音が響きやすい構造です。深夜の騒音は他の宿泊客の睡眠を妨げ、最悪の場合、他のお客様への「宿泊費の全額返金」という甚大な損害や警察の介入を招きます。" },
        { question: "髪色を整えるために、大浴場の洗い場で市販のヘアカラーやカラーシャンプーを使用してもよい。", correctAnswer: false, explanation: "染料が石材や木材、イスなどに付着すると特殊清掃でも落ちなくなる可能性があります。設備の交換にかかる高額な賠償請求の対象となります。" },
        { question: "温泉番組のように、大浴場の湯船にガラス瓶の飲み物を持ち込んで飲んでもよい。", correctAnswer: false, explanation: "万が一割れた場合、破片回収のために温泉をすべて抜き、徹底的な清掃と換水を行う必要が生じるため、数日間の「大浴場営業停止」という最悪の事態に直結します。" },
        { question: "体を洗わずに、いきなり湯船に入ってもよい。", correctAnswer: false, explanation: "衛生問題だけでなく、急激な血圧変動による事故リスクに繋がるため大変危険です。" },
        { question: "体を隠すために、フェイスタオルを湯船の中に入れてもよい。", correctAnswer: false, explanation: "タオルの繊維や付着している雑菌により、お湯が汚染されるため厳禁です。" },
        { question: "お風呂から上がった後にバスタオルを取りに行くためであったら、体が濡れたまま脱衣所へ出てもよい。", correctAnswer: false, explanation: "床が濡れて他のお客様の転倒事故に繋がるほか、床材が腐食する原因となります。" },
        { question: "自分のシャンプーやタオルを洗い場に置いたまま、湯船に浸かってもよい。", correctAnswer: false, explanation: "他のお客様がその洗い場を使えなくなり、クレーム等の直接的なトラブルに直結します。" },
        { question: "部屋にあるバスタオルや浴衣といったリネンは、記念に持ち帰ってもよい。", correctAnswer: false, explanation: "薄手のフェイスタオルと異なり、バスタオルや浴衣は施設の備品です。持ち帰りは窃盗罪に該当し、施設に明確な経済的損失を与えます(※施設による)。" },
        { question: "チェックアウトの際、親切心で布団を綺麗に畳んでおくべきである。", correctAnswer: false, explanation: "宿側は忘れ物チェックやシーツ交換のために布団を広げるため、そのままにしておくのが一番感謝されます。" },
        { question: "旅館の夕食会場に、コンビニで買ったお酒を持ち込んでもよい。", correctAnswer: false, explanation: "夕食会場は飲食店と同じ扱いです。無断の持ち込みは利益の損失になるほか、万が一食中毒が発生した場合の責任問題となります(※施設による)。" },
        { question: "立ってシャワーを浴びてもよい。", correctAnswer: false, explanation: "周囲のお客様にお湯や泡が飛び散り、直接的なトラブル・喧嘩の原因になるため、座って使用するのがマナーです。" },
        { question: "和室にある「床の間(掛け軸や花が飾られている一段高いスペース)」は、荷物を置いたり座ったりするスペースとして使ってもよい。", correctAnswer: false, explanation: "床の間は神聖な鑑賞スペースです。キャリーケースを置いたり座ったりすると、高価な木材や掛け軸が傷つき、数十万円単位の修繕費が発生する重大な器物損壊となります。" },
        { question: "ふざけて障子や襖に指で穴を開けても、紙を貼り替えるだけなので大きな問題にはならない。", correctAnswer: false, explanation: "障子の張り替えには専門の職人を呼ぶ必要があり、1枚数千円〜数万円のコストがかかります。また、修理が終わるまでその部屋を販売できなくなるため、明確な営業妨害・機会損失となります。" },
        { question: "風呂上がりに使った濡れたバスタオルを、邪魔なので部屋の畳や椅子の上に置いた。", correctAnswer: false, explanation: "濡れたタオルを放置すると、数時間で畳に水分が染み込み、カビや腐敗の原因となります。畳の交換が必要となり、施設に高額な損害を与えます。" },
        { question: "4人部屋を予約したが、夜は隣の部屋の友人も呼んで、6人分の布団を1つの部屋に敷き詰めて寝てもよい。", correctAnswer: false, explanation: "消防法で定められた定員超過違反になるリスクがあるほか、布団を無理に移動させることで畳が激しく擦れ、設備の劣化を早める重大なマナー違反です。" },
        { question: "客室内で、匂いの強い香水を大量に振り撒いたり、強烈な匂いのする食べ物を食べてもよい。", correctAnswer: false, explanation: "匂いが壁紙や畳に染み付くと、専門業者によるオゾン脱臭（数万円）が必要になり、数日間部屋を販売できなくなる甚大な損害が発生します。" },
        { question: "サウナ内で、自分のペットボトルの水をサウナストーンにかけて蒸気を発生(ロウリュ)させてもよい。", correctAnswer: false, explanation: "専用設備ではない電気ストーブに水をかけると、漏電やヒーターの破裂（故障）を引き起こします。数十万円の修理費とサウナの長期営業停止に直結する非常に危険な行為です。" },
        { question: "サウナの中で、汗をたっぷり吸ったタオルをそのままにしておくのは気持ち悪いので、床等に絞り出してよい。", correctAnswer: false, explanation: "極めて不衛生であり、サウナ室内に悪臭が染み付く原因となります。他のお客様からのクレームに直結し、木材の張り替えが必要になるケースもあります。" },
        { question: "露天風呂から内風呂へ戻る際、足についた泥や葉っぱを洗い流さずにそのまま内風呂に入ってもよい。", correctAnswer: false, explanation: "泥やゴミが内風呂の循環ポンプに詰まると、濾過（ろか）装置が故障し、大浴場全体の機能が停止する大規模な損害リスクがあります。" },
        { question: "大浴場の洗い場で、下着や靴下を石鹸で洗濯してもよい。", correctAnswer: false, explanation: "公衆衛生上NGであるだけでなく、衣類用の洗剤や柔軟剤の成分が温泉のお湯に混ざると、水質が大きく変化し、温泉としての成分基準を満たさなくなるリスクがあります。" },
        { question: "大浴場でヒゲを剃った後、カミソリや剃り落としたヒゲを洗い場にそのまま放置して退出してもよい。", correctAnswer: false, explanation: "血液が付着している可能性があるため、他のお客様や清掃スタッフに対する深刻なバイオハザード（感染症リスク）およびケガの危険を生じさせます。" },
        { question: "湯船の中で、体をゴシゴシと擦って垢を落としてもよい。", correctAnswer: false, explanation: "湯船に大量の汚れが浮き、他のお客様が利用できなくなります。完全なお湯の入れ替えが必要となり、施設側に多大な負担とクレーム対応を強いることになります。" },
        { question: "単なる「好き嫌い」だが、確実に抜いてもらうために「重度のアレルギーがある」と嘘をついて旅館に申告してもよい。", correctAnswer: false, explanation: "アレルギー申告を受けると、厨房では専用の調理器具の用意や食材の完全隔離など、命を守るための厳重な体制（多大なコストと労力）が敷かれます。虚偽申告は厨房のオペレーションを麻痺させる最悪の行為です。" },
        { question: "バイキング形式の食事で、SNS映えのために食べきれない量の料理をテーブルに並べ、残して退席してもよい。", correctAnswer: false, explanation: "深刻な食品ロス（経済的損失）を生むだけでなく、本当にその料理を食べたかった他のお客様の機会を奪う身勝手なマナー違反です。" },
        { question: "バイキング会場で、自分の手で直接ポテトフライやパンなどの料理を掴んでお皿に取ってもよいか？", correctAnswer: false, explanation: "手についたウイルスや細菌（ノロウイルス等）が料理全体に広がり、集団食中毒を引き起こす原因となります。発生した場合、旅館は数週間の営業停止処分を受けます。" },
        { question: "和食(会席料理)を食べ終わった後、お椀のフタを裏返して器に重ねたり、綺麗な漆器を重ねて片付けてもよい。", correctAnswer: false, explanation: "高級旅館の漆器や陶器は1客数万円〜数十万円する伝統工芸品です。裏返したり重ねたりすると塗りが剥がれたり傷がつき、取り返しのつかない損害になります。" },
        { question: "バイキングで余った料理やデザートを、持参したタッパーや水筒に詰めてこっそり部屋へ持ち帰ってもよい。", correctAnswer: false, explanation: "持ち帰った料理で食中毒が発生した場合でも旅館側の責任（営業停止）となるリスクがあるため、保健所の指導により厳しく禁止されています。" },
        { question: "お風呂上がりに、全身が濡れたままの浴衣でロビーの布製ソファに深く座り込んでもよいか？", correctAnswer: false, explanation: "ソファの内部のウレタンにまで水分が染み込み、カビや悪臭の原因となります。ソファの廃棄・買い替え（数十万円）が必要になる器物損壊です。" },
        { question: "湯上がりの休憩スペースで、スマートフォンをスピーカーにして大音量で動画を見たり音楽を流してもよいか？", correctAnswer: false, explanation: "静かにくつろぎたい他のお客様の深刻なストレスとなり、「うるさくて休めない」というクレームや返金要求などのトラブルに発展します。" },
        { question: "グループ旅行で車2台で来たため、隣に別の車が停められないように、駐車場の白線をまたいで2台分のスペースを占有して停めてもよいか？", correctAnswer: false, explanation: "他のお客様が駐車できなくなり、旅館側は外部の有料駐車場を手配する等の余計なコストと機会損失を被ります。" },
        { question: "脱衣所に備え付けられている高級ドライヤーを、髪を乾かすだけでなく、濡れた服や靴を乾かすために長時間占有してもよいか？", correctAnswer: false, explanation: "他のお客様が使えなくなるだけでなく、本来の用途と異なる長時間の連続使用は、モーターの焼き切れ（故障）や火災の原因となります。" },
        { question: "和風旅館の温泉街において、浴衣と下駄(スリッパ)のまま外を散策してもよいか？", correctAnswer: true, explanation: "温泉街の散策など、一般的な温泉情緒として浴衣での外出は推奨されています（※施設による）。" },
        { question: "湯船に浸かっている間、持参したタオルをお湯に入れないようにするため、自分の頭の上に乗せて入浴してもよいか？", correctAnswer: true, explanation: "お湯を汚さないための正しいマナーです。濡らしたタオルを頭に乗せることは、のぼせや立ちくらみを防ぐ効果もあります。" },
        { question: "旅館で用意された浴衣を着る際、下着やTシャツ（インナー）を着用したまま、その上に浴衣を着てもよいか？", correctAnswer: true, explanation: "全く問題ありません。着崩れによるトラブル防止や、汗を吸収して快適に過ごすためにも下着の着用が推奨されます。" },
        { question: "温泉街を散策するために外出する際、紛失を防ぐために部屋の鍵（ルームキー）をフロントスタッフに預けて出かけてもよいか？", correctAnswer: true, explanation: "鍵を紛失するとシリンダーごと交換になり弁償が発生することもあるため、進んでフロントに預けるのが安全な選択です。" },
        { question: "客室で飲んだペットボトルやコンビニの袋などのゴミは、持ち帰らずに部屋に備え付けのゴミ箱に捨てて帰ってもよいか？", correctAnswer: true, explanation: "出たゴミは備え付けのゴミ箱に捨てて問題ありません。ただし、壊れたキャリーケースなど「明らかな粗大ゴミ」を放置して帰る行為はNGです。" },
        { question: "自分たちが泊まっている客室の中や、旅館の庭園などのパブリックスペースで、友人との記念撮影を行ってもよいか？", correctAnswer: true, explanation: "脱衣所や大浴場での撮影は絶対NGですが、客室内や許可されたスペースでの撮影は問題ありません。他のお客様の写り込みには配慮が必要です。" },
        { question: "部屋に用意されている「個包装の歯ブラシ、小さな使い切り石鹸、持ち帰り用の袋」などのアメニティは、記念に持ち帰ってもよいか？", correctAnswer: true, explanation: "個包装の消耗品（アメニティ）は、お客様が持ち帰ることを前提として用意されているため、全く問題ありません（※タオルやドライヤーはNGです）。" },
        { question: "部屋の畳に誤ってお茶をこぼしてしまった。隠さずに、すぐにフロントへ電話をして拭くためのタオルをもらってもよいか？", correctAnswer: true, explanation: "大正解です。隠して放置されると畳の奥まで染み込んで全交換（数万円）になりますが、すぐに報告して対処すれば被害を最小限に食い止められるため、旅館側も大変感謝します。" },
        { question: "部屋を案内してくれた仲居さん（スタッフ）に対し、「心付け（チップ）」を一切渡さなくてもマナー違反にはならないか？", correctAnswer: true, explanation: "日本の宿泊施設では、宿泊料金の中に「サービス料」がすでに含まれているため、心付け（チップ）を渡さなくても全くマナー違反にはなりません。" },
        { question: "旅館に備え付けのシャンプーが肌に合わないため、自分が普段から家で使っているマイシャンプーやボディソープを大浴場に持ち込んで使ってもよいか？", correctAnswer: true, explanation: "全く問題ありません。お肌のトラブルを防ぐためにも、使い慣れたものを持ち込むことは推奨されています。" },
        { question: "トイレで誤ってタオルを便器に落としてしまった。フロントに事情を話し、新しい清潔なタオルをもう1枚貸してほしいと頼んでもよいか？", correctAnswer: true, explanation: "不衛生なタオルを使われる方が問題ですので、フロントに相談すれば快く新しいものと交換してくれます。" },
        { question: "客室の玄関（踏み込み）で用意されたスリッパを脱ぎ、畳の上は靴下や裸足で歩いてもよいか？", correctAnswer: true, explanation: "日本の和室の正しいマナーです。畳の上はスリッパやキャスター付きの鞄を避け、足で直接歩くのが正解です。" },
        { question: "朝チェックアウトする際、敷かれたままの布団を一切畳まず、そのままの状態で部屋を出てもよいか？", correctAnswer: true, explanation: "清掃スタッフはシーツを剥がしたり忘れ物を確認するために布団を広げる必要があるため、ぐちゃぐちゃでなければそのままにしておくのが親切です。" },
        { question: "バイキング形式の食事で、自分が食べきれる量であれば、何度おかわりに行ってもよいか？", correctAnswer: true, explanation: "食べきれる量であれば、何度でもおかわりをして食事を楽しむのがバイキングの醍醐味であり、全く問題ありません。" },
        { question: "大浴場へ行く際、着替えやタオルを入れるための自分用の「スパバッグ（濡れてもいいカゴやバッグ）」を持参して脱衣所に持ち込んでもよいか？", correctAnswer: true, explanation: "持ち物を整理しやすく、他人の荷物と混ざるのを防ぐ効果もあるため、スパバッグの活用は大変スマートなマナーです。" },
        { question: "一般的な温泉旅館において、夕食会場（大広間など）へ行く際、部屋に用意された浴衣とスリッパを着用して行ってもよいか？", correctAnswer: true, explanation: "シティホテルや一部の高級オーベルジュを除き、日本の温泉旅館では館内（食事処を含む）を浴衣でくつろいで過ごすことが推奨されています。" }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const questionCount = Math.min(15, allQuizData.length); 
    let currentIndex = parseInt(localStorage.getItem('exp_currentIndex')) || 0;   
    let correctCount = parseInt(localStorage.getItem('exp_correctCount')) || 0;   
    let currentQuizSet;

    if (localStorage.getItem('exp_quizSet')) {
        currentQuizSet = JSON.parse(localStorage.getItem('exp_quizSet'));
    } else {
        currentQuizSet = shuffleArray([...allQuizData]).slice(0, questionCount);
        localStorage.setItem('exp_quizSet', JSON.stringify(currentQuizSet));
        localStorage.setItem('exp_currentIndex', 0);
        localStorage.setItem('exp_correctCount', 0);
    }

    const quizArea = document.getElementById('quiz-area');
    const explanationArea = document.getElementById('explanation-area');
    const questionText = document.getElementById('question-text');
    const progressText = document.getElementById('progress-text');

    function renderQuestion() {
        quizArea.style.display = 'block';
        explanationArea.style.display = 'none';
        progressText.innerText = `第 ${currentIndex + 1} 問 / ${questionCount}問中`;
        questionText.innerText = currentQuizSet[currentIndex].question;
    }

    function checkAnswer(userAnswer) {
        if (explanationArea.style.display === 'block') return;
        const currentData = currentQuizSet[currentIndex];
        const isCorrect = (userAnswer === currentData.correctAnswer);
        if (isCorrect) {
            correctCount++;
            localStorage.setItem('exp_correctCount', correctCount); // 点数を永続保存
        }
        const resultMark = document.getElementById('result-mark');
        if (isCorrect) {
            resultMark.innerText = "正解！";
            resultMark.className = "result-mark correct-color";
        } else {
            resultMark.innerText = "不正解...";
            resultMark.className = "result-mark incorrect-color";
        }
        document.getElementById('correct-answer-text').innerText = "正解は「" + (currentData.correctAnswer ? "〇" : "✖") + "」です";
        document.getElementById('explanation-text').innerText = currentData.explanation;
        if (currentIndex === questionCount - 1) {
            document.getElementById('next-btn').innerText = "結果・アンケートへ";
        }
        quizArea.style.display = 'none';
        explanationArea.style.display = 'block';
    }

    document.getElementById('btn-true').addEventListener('click', () => checkAnswer(true));
    document.getElementById('btn-false').addEventListener('click', () => checkAnswer(false));    
    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex++;
        
        if (currentIndex < questionCount) {
            localStorage.setItem('exp_currentIndex', currentIndex); // 次の問題へ進んだ記録を保存
            renderQuestion();
        } else {
            localStorage.setItem('exp_score', correctCount);
            localStorage.setItem('exp_totalQuestions', questionCount);
            window.location.href = 'result.html';
        }
    });
    renderQuestion();
});