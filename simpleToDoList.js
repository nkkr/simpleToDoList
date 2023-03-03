setAddEventLisnerForInputTypeText();
/** 
 * input要素を全て取得後、それぞれに以下を実行する。
 * １・input要素にfocusした場合、keydownイベントで関数keydownCheckを実行するイベントリスナーを設定する。
 * ２・input要素からfocusoutした場合、１で設定したイベントリスナーを削除する。
 *  */
function setAddEventLisnerForInputTypeText() {
    let textAreas = document.getElementsByTagName("input");
    for (var area of textAreas) {
        area.addEventListener("focus", (event) => {
            document.addEventListener('keydown', keydownCheck);
        });
        area.addEventListener("focusout", (event) => {
            document.removeEventListener('keydown', keydownCheck);
        });
    }
}

/**
 * input要素の数を取得する
 * @returns input要素の数{number}
 */
function countInputText() {
    const inputTypeTexts = document.getElementsByTagName("input");
    return inputTypeTexts.length;
}


/**
 * keydown時に発生し、入力内容によって以下の挙動を行う。
 * １・Ctrl + Enter　新たにli、input要素を生成し、focusされている要素の一つ下に挿入する。
 * ２・Ctrl + Delete　focusされている要素を削除する
 * ３・Ctrl + Shift　新たにul、li。input要素を生成し、focusされている要素の一つ下に挿入する。
 * @param イベントオブジェクト{*} e 
 * @returns false
 */
function keydownCheck(e) {
    /** focusされている要素のidを取得*/
    let selfId = document.activeElement.id;
    /** focusされている要素の取得*/
    let self = document.getElementById(selfId)
        /** focusされている要素の親要素を取得*/
    let selfParent = self.parentElement
        /** focusされている要素の祖父要素を取得*/
    let selfGrandParent = self.parentElement.parentElement

    if (e.ctrlKey === true) {
        if (e.key === "Enter") {
            const newLi = createInputInList();
            /**現在focusされた要素からみて、弟要素の位置に挿入 */
            selfGrandParent.insertBefore(newLi, selfParent.nextSibling)
                /**新たに作成されたinput要素に、イベントリスナーを設定 */
            setAddEventLisnerForInputTypeText()
                /**focusを現在の要素から新たな要素へ移動 */
            focusShift(self, newLi.firstChild);
        } else if (e.key === "Delete") {
            /**id="0"の最初のinputだけは削除の対象から除外 */
            if (selfId !== "0") {
                /**親要素のli要素ごと移動するため、targetはselfParent */
                let target = selfParent;

                /**必要な分だけ上の階層の親要素を取得し、focusを移動後、現在の要素を削除 */
                while (true) {
                    if (target.previousSibling !== null) {
                        target.previousSibling.lastChild.focus();
                        targetRemover(target);
                        break;
                    } else {
                        target = target.parentElement;
                    }
                }
            }
        } else if (e.key === "Shift") {
            /**一つ階層を下げるためにulを生成し、そこにinputを格納したli要素をappend */
            let newUl = document.createElement("ul");
            const newLi = createInputInList();
            newUl.appendChild(newLi);
            /**以降の手順はCtrl + Enterと同じ*/
            selfGrandParent.insertBefore(newUl, selfParent.nextSibling)
            setAddEventLisnerForInputTypeText()
            focusShift(self, newLi.firstChild);
        }
    }
    return false;
}



/**
 * 引数として受け取った要素を削除する。仮に削除で親要素の持つ子要素が０になった場合、親要素も削除する。
 * @param {HTMLElement} target 
 */
function targetRemover(target) {
    let grandParent = target.parentElement;
    target.remove();
    if (grandParent.childElementCount < 1) {
        grandParent.remove();
    }
}




/**
 * focusを現在の要素から、新たに作られた要素へ移動する
 * @param {HTMLElement} from 現在の要素
 * @param {HTMLElement} to 新たに作られた要素
 */
function focusShift(from, to) {
    from.blur();
    to.focus()
}

/**
 * li要素とinput要素を生成し、input要素をliの子要素にappendし、li要素を返す
 * @returns input要素を子に持つli要素
 */
function createInputInList() {
    /**最新idの設定 */
    const newestId = countInputText();
    /**li要素の生成 */
    const newLi = document.createElement("li");
    /**input要素の生成 */
    const newInput = document.createElement("input");
    /** inputのtypeをテキストに設定*/
    newInput.setAttribute("type", "text");
    /** inputにIDを設定*/
    newInput.setAttribute("id", newestId);
    /** li要素にinputを格納*/
    newLi.appendChild(newInput);
    return newLi;
}
/**
 * id="wrap"が付与されたdivの内容と、各inputに入力された値をlocal storageに保存する
 */
function saveToLocalStorage() {
    let field = document.getElementById("wrap").innerHTML;
    let valuesData = getValues()
    localStorage.setItem("fieldData", field);
    localStorage.setItem("valuesData", valuesData);
    alert("データがセーブされました")
}

/**
 * local storageに保存されたid="warp"のdivの内容と、inputに入力された値を呼び出し、再現する。
 */
function loadFromLocalStorage() {
    if (localStorage.getItem("fieldData") == null) {
        /**データが存在しない場合の処理 */
        alert("データが存在しません")
    } else {
        /**各種データの呼び出し*/
        let field = document.getElementById("wrap");
        const fieldData = localStorage.getItem("fieldData");
        /**入力値を文字列から配列に変換*/
        const valuesData = JSON.parse(localStorage.getItem("valuesData"));
        field.innerHTML = fieldData;
        /**入力されていた値をinput["type"="text"]に割り当て*/
        let inputText = document.getElementsByTagName("input");
        for (i = 0; i < valuesData.length; i++) {
            inputText[i].value = valuesData[i];
        }
        alert("データがロードされました")
            /**イベントリスナーをサイド割り当て*/
        setAddEventLisnerForInputTypeText()
    }
}

/**local storageに保存されているデータを削除 */
function deleteLocalStorage() {
    localStorage.removeItem("fieldData")
    localStorage.removeItem("valuesData")
    alert("データが削除されました")
}

/**input要素に入力された値を読みだし、配列を文字列に変換して返す*/
function getValues() {
    let values = [];
    const inputText = document.getElementsByTagName("input");
    Array.prototype.forEach.call(inputText, (text) => {
        values.push(String(text.value))
    })
    return JSON.stringify(values);
}