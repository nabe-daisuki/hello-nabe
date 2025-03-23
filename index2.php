<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>クイズアプリ</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff;
            color: #333333;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
            position: relative;
        }
        .container {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            width: 90vw;
            height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        .quiz-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }
        .question-container {
            background: #ffffff;
            padding: 15px;
            border-radius: 5px;
            text-align: left;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .tags a {
            font-size: 12px;
            color: #007BFF;
            text-decoration: underline;
            cursor: pointer;
        }
        input {
            width: calc(100% - 16px);
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ccc;
            background: #ffffff;
            color: #333;
            border-radius: 5px;
            box-sizing: border-box;
            display: block;
        }
        .result {
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .question-image {
            width: 100%;
            height: auto;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        /* 送信ボタン */
        .submit-button {
            width: 100%;
            padding: 10px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .submit-button.disabled {
            background-color: #ccc;
            color: #666;
            cursor: not-allowed;
        }
        .submit-button.enabled {
            background-color: #28a745;
            color: #fff;
        }

        /* オーバーレイ用 */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
        }
        /* ポップアップ用 */
        .popup {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
        }
        /* 通常のボタン用 */
        .button-base{
            margin: 10px;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
        /* ワイドボタン用 */
        .wide-button-base{
            padding: 10px 15px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
        }
        /* YESボタン用 */
        .yes-button {
            background-color: #28a745;
            color: white;
        }
        /* NOボタン用 */
        .no-button {
            background-color: #dc3545;
            color: white;
        }

        /* 送信確認用ウィンドウ */
        #send-confirm-overlay {
            z-index: 999;
        }
        #send-confirm-content{
            text-align: center;
            width: 300px;
        }

        /* 問題追加ウィンドウ */
        #add-question-overlay{
            z-index: 1500;
        }
        #add-question-content {
            display: flex;
            flex-direction: column;
            width: 75%;
            min-height: 56%;
            max-height: 63%;
            box-sizing: border-box;
        }

        /* フォームのスタイル */
        .popup input,
        .popup textarea {
            margin-top: 10px;
            padding: 10px;
            width: 100%;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        /* 入力欄のスタイル */
        textarea {
            max-width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }

        #newQuestionText{
            height: 40px;
            min-height: 40px;
            max-height: 70px;
            min-width: 100%;
            max-width: 100%;
        }

        /* 選択肢入力用のテキストエリア */
        #newAnswers {
            height: 40px;
            min-height: 40px;
            max-height: 55px;
            min-width: 100%;
            max-width: 100%;
        }

        /* タグ入力用のテキストエリア */
        #newTags {
            height: 40px;
            min-height: 40px;
            max-height: 55px;
        }
        /* 問題追加ボタン（右上固定） */
        .add-question-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #007BFF;
            color: transparent;
            font-size: 36px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            border: none;
            cursor: pointer;
            z-index: 500;
        }
        .add-question-button::before {
            content: "";
            position: absolute;
            width: 30px;
            height: 3px;
            background-color: white;
            transform: rotate(0deg);
        }
        .add-question-button::after {
            content: "";
            position: absolute;
            width: 30px;
            height: 3px;
            background-color: white;
            transform: rotate(90deg);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="quiz-grid" id="quiz-container"></div>
        <button id="submit-button" class="submit-button disabled" onclick="displayPopup()" disabled>答案を送信</button>
    </div>

    <div class="overlay" id="send-confirm-overlay">
        <div class="popup" id="send-confirm-content">
            <p>本当に送信しますか？</p>
            <button class="button-base yes-button" id="send-confirm-yes" onclick="sendResult()">はい</button>
            <button class="button-base no-button" id="send-confirm-no" onclick="hidePopup()">いいえ</button>
        </div>
    </div>

    <button class="add-question-button" onclick="openAddQuestionPopup()"></button>

    <!-- 問題追加ポップアップ -->
    <div class="overlay" id="add-question-overlay">
        <div class="popup" id="add-question-content">
            <h2>新しい問題を追加</h2>
            <label for="newQuestionText">問題文:</label>
            <textarea id="newQuestionText" placeholder="問題文を入力してください"></textarea>

            <hr>
            <label for="newAnswers">選択肢:</label>
            <textarea id="newAnswers" placeholder="選択肢をカンマで区切って入力"></textarea>

            <hr>
            <label for="newTags">タグ:</label>
            <textarea id="newTags" placeholder="タグをカンマで区切って入力"></textarea>

            <hr>
            <button class="wide-button-base" onclick="addNewQuestion()">問題を追加</button>
            <button class="wide-button-base" onclick="closeAddQuestionPopup()">閉じる</button>
        </div>
    </div>
<?php

//
// getQuestions　問題の取得
//
function getQuestions(){
    require './db/aqua.php';

    $isErr=false;
    try{
        $conn=new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql="call getQuestions";
        $stmt=$conn->prepare($sql);
    }catch(PDOException $e){
        echo "Error : " . $e->getMessage();
        $isErr=true;
    }finally{
        $conn=null;
    }

    if($isErr)return null;
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//
// toJavaScriptCode　JavaScriptの構文への変換
//  - $target　変換元文字列
//  - $shouldArray　配列にするか否か
//
function toJavaScriptCode(string $target, bool $shouldArray=false){
    if($shouldArray){
        return json_encode(explode(",", $target));
    }else{
        return json_encode($target);
    }
}

$questions=getQuestions();

?>
    <script>
        const quiz = [
            <?php 
            if($questions):
                foreach($questions as $record):
                    echo "{";
            ?>
                q_id: <?php echo toJavaScriptCode($record["q_id"]) ?>,
                tags: <?php echo toJavaScriptCode($record["t_names"], true) ?>,
                question: <?php echo toJavaScriptCode($record["q"]) ?>,
                answers: <?php echo toJavaScriptCode($record["rs"], true) ?>,
                image: <?php echo toJavaScriptCode($record["img"]) ?>
            <?php
                    echo "},";
                endforeach;
            endif;
            ?>
        ];

        //
        // loadQuestions　問題を動的追加
        // ※ quiz配列の登録順に追加される
        //
        function loadQuestions() {
            const quizContainer = document.getElementById("quiz-container");
            quizContainer.innerHTML = "";
            
            quiz.forEach((q, index) => {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question-container");
                questionDiv.setAttribute("q-id", q.q_id);
                questionDiv.setAttribute("is-right", 0);
                let inputFields = "";
                q.answers.forEach((_, i) => {
                    inputFields += `<input type="text" id="answer-${index}-${i}" placeholder="答えを入力" oninput="autoCheck(${index})">`;
                });
                
                const tagList = q.tags.map(tag => `<a href="#" tabindex="-1" onclick="filterByTag('${tag}')">${tag}</a>`).join(" | ");
                
                questionDiv.innerHTML = `
                    <p>${q.question}</p>
                    <img src="${q.image}" alt="問題の画像" class="question-image">
                    ${inputFields}
                    <div class="result" id="result-${index}"></div>
                    <div class="tags">${tagList}</div>
                `;
                quizContainer.appendChild(questionDiv);
            });
        }

        //
        // nomalizeText　全角英数字を半角に
        //  - text　変換対象
        //
        function normalizeText(text) {
            return text.replace(/　/g, " ").replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
        }

        //
        // autoCheck　解答に対する正否判断
        //  - index　問題番号（quiz配列の登録順）
        //
        function autoCheck(index) {
            let allFilled = true;
            let correctCount = 0;
            const userAnswers = [];
            
            quiz[index].answers.forEach((correctAnswer, i) => {
                const inputElement = document.getElementById(`answer-${index}-${i}`);
                if (inputElement.value.trim() === "") {
                    allFilled = false;
                }
                if (inputElement.value.trim()) {
                    userAnswers.push(normalizeText(inputElement.value.trim()));
                }
            });

            if (allFilled) {
                let correctAnswers=quiz[index].answers;
                let correctCount=0;
                userAnswers.forEach(userAnswer=>{
                    if(!correctAnswers.includes(userAnswer))return;
                    correctAnswers=correctAnswers.filter(correctAnswer=>correctAnswer!==userAnswer);
                    correctCount++;
                });

                const resultElement = document.getElementById(`result-${index}`);
                resultElement.textContent = `正解数: ${correctCount} / ${quiz[index].answers.length}`;

                if(correctCount === quiz[index].answers.length){
                    resultElement.style.color = "#28a745";
                    resultElement.parentElement.setAttribute("is-right", 1);
                }else{
                    resultElement.style.color = "#dc3545";
                    resultElement.parentElement.setAttribute("is-right", 0);
                }
                
            }
        }

        //
        // filterByTag　タグで問題をフィルタ
        //  - tagName　フィルタ対象のタグ
        //
        function filterByTag(tagName){
            const qTags=document.querySelectorAll(".question-container>.tags");
            Array.from(qTags).forEach( (qTag, i) => {
                let qContainer=document.querySelectorAll(".question-container")[i];
                let tags=qTag.getElementsByTagName("a");
                let hasClickedTag=Array.from(tags).filter(tag=>tag.textContent===tagName).length;
                if(hasClickedTag){
                    qContainer.style.display="block";
                }else{
                    qContainer.style.display="none";
                }
            });
        }

        //
        // checkCompletion　すべてに答えたか
        //
        function checkCompletion() {
            const inputs = document.querySelectorAll(".question-container>input");
            let allAnswered = Array.from(inputs).every(input => input.value.trim() !== "");
            const submitButton = document.getElementById("submit-button");
            if (allAnswered) {
                submitButton.classList.remove("disabled");
                submitButton.classList.add("enabled");
                submitButton.disabled = false;
            } else {
                submitButton.classList.remove("enabled");
                submitButton.classList.add("disabled");
                submitButton.disabled = true;
            }
        }
        document.addEventListener("input", checkCompletion);

        //
        // displayPopup　送信確認ウィンドウの表示
        //
        function displayPopup(){
            document.getElementById("send-confirm-overlay").style.display = "flex";
        }

        //
        // hidePopup　送信確認ウィンドウを隠す
        //
        function hidePopup(){
            document.getElementById("send-confirm-overlay").style.display = "none";
        };

        //
        // sendResult　解答結果を送信
        //
        function sendResult(){
            console.log("aiueo");
            hidePopup();
        }

        //
        // openAddQuestionPopup　問題追加用ウィンドウの表示
        //
        function openAddQuestionPopup() {
            document.getElementById("add-question-overlay").style.display = "flex";
        }

        //
        // closeAddQuestionPopup　問題追加用ウィンドウを隠す
        //
        function closeAddQuestionPopup() {
            document.getElementById("add-question-overlay").style.display = "none";
        }

        //
        // addNewQuestion　新しい問題の追加
        //
        function addNewQuestion() {
            const questionText = document.getElementById("newQuestionText").value;
            const answersText = document.getElementById("newAnswers").value;
            const tagsText = document.getElementById("newTags").value;

            if (!questionText || !answersText || !tagsText) {
                alert("\"問題文\"・\"選択肢\"及び\"タグ\"は必須です。");
                return;
            }

            const answers = answersText.split(",").map(ans => ans.trim());
            const tags = tagsText.split(",").map(tag => tag.trim());

            const newQuestion = {
                q_id: `${quiz.length + 1}`,
                question: questionText,
                answers: answers,
                tags: tags,
                image: ""
            };

            const data = {
                q: questionText,
                rs: answers,
                ts: tags
            };
            console.log(data);
            fetch('add_question.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            // .catch(error => console.error('Error:', error));

            closeAddQuestionPopup();
        }

        window.onload = loadQuestions;
    </script>
</body>
</html>
