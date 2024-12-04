// function GetRandomNumber() {
//     var randnum = 1 + Math.floor( Math.random() * 12 );
//     document.getElementById("sample").innerHTML = randnum;
// }
// function clickDecition(){
//     window.alert("aaaaaa");
// }


// var user = { name:'太郎', age:32, tel:'080-1234-5678' };

// console.log( user['name'] );
// console.log( user.name );
// キャラの初期値の設定
// playerの設定
let playerSetting = {playerHP:"100", playerSP:"100",  criticalPercent:"1.5"}
let pHP = playerSetting["playerHP"]
let pSP = playerSetting["playerSP"]
playerStatus(pHP, pSP)
let playerAttackData = [{level: "1", successRange: "100", minDamage:"15", maxDamage: "25", critical: "20"}, 
                        {level: "2", successRange: "80", minDamage:"10", maxDamage: "20", critical: "10"}, 
                        {level: "3", successRange: "60", minDamage:"5", maxDamage: "15", critical: "5"}]
let playerHealData = [{level: "1", successRange: "100", minHeal:"20", maxHeal: "30"}, 
                    {level: "2", successRange: "75", minHeal:"10", maxHeal: "20"}, 
                    {level: "3", successRange: "50", minHeal:"5", maxHeal: "10"}];
let playerDefenceData = [{level: "1", successRange: "100", Defencerate:0.4, counter:10}, 
                        {level: "2", successRange: "75", Defencerate:0.25, counter:5}, 
                        {level: "3", successRange: "50", Defencerate:0.1, counter:0}];

//  enemyの設定
let enemySetting = {enemyHP:"100", enemySP:"100", criticalPercent:"1.5"}
let eHP = enemySetting["enemyHP"]
let eSP = enemySetting["enemySP"]
enemyStatus(eHP, eSP)
let enemyAttackData = [{level: "1", successRange: "100", minDamage:"10", maxDamage: "20", critical: "15"}, 
                        {level: "2", successRange: "80", minDamage:"5", maxDamage: "15", critical: "5"}, 
                        {level: "3", successRange: "60", minDamage:"0", maxDamage: "10", critical: "0"}]
let enemyHealData = [{level: "1", successRange: "100", minHeal:"15", maxHeal: "25"}, 
                    {level: "2", successRange: "75", minHeal:"10", maxHeal: "15"}, 
                    {level: "3", successRange: "50", minHeal:"5", maxHeal: "10"}];
let enemyDefenceData = [{level: "1", successRange: "100", Defencerate:0.3, counter:5}, 
                        {level: "2", successRange: "75", Defencerate:0.2, counter:2}, 
                        {level: "3", successRange: "50", Defencerate:0.1, counter:0}];

const buttonClick = document.getElementById("turn_btn");

// スキルの使用SP
let useSP = 20

// ログ用
let logStr = ""
let lStr = ""

// ターン回数
let count = 1

// 終了判定変数
let judge = 0

// bar要素用
let pBar = {};
let eBar = {};

for (var i = 1; i <= 20; i++) {
    pBar[i] = document.getElementById('player_bar_' + i)
}

for (var i = 1; i <= 20; i++) {
    eBar[i] = document.getElementById('enemy_bar_' + i)
}

// 選択決定、戦闘開始ボタン
// document.getElementById("decision_button").onclick = function() {
//     document.getElementById("text").innerHTML = "戦闘開始";
    // document.getElementById("text").innerHTML = playerSetting[playerHP];
// };

buttonClick.addEventListener('click', () => {

    // 終了判定初期化
    // judge = 1 ゲームオーバー
    // judge = 2 ゲームクリア
    judge = 0

    lStr = "<<<ターン" + count + ">>>\n"
    logStr = logStr + lStr
    logEdit(logStr)

    // const str = document.getElementById("skill").value;
    // document.getElementById("selectCommand").textContent = str;

    // プレイヤーコマンド
    // 1：攻撃、2：スキル(回復)、3：防御
    const str = document.getElementById("skill");
    const playerS = str.selectedIndex + 1;

    // 先攻後攻
    playNM  = turnSelect()
    
    // エネミーコマンド
    // 1：攻撃、2：スキル(回復)、3：防御
    enemyS = enemyCommand()

    // 行動の強弱
    levelP = levelSelect()
    levelE = levelSelect()

    // 成功確率
    successP = successRate(1, playerS, levelP-1)   //player
    successE = successRate(2, enemyS, levelE-1)  //enemy

    // 攻撃処理
    // プレイヤー
    if (successP && playerS == 1) {
        attackPointP = attackProcess(1, levelP-1)
    } else {
        attackPointP = 0
    }
    // エネミー
    if (successE && enemyS == 1) {
        attackPointE = attackProcess(2, levelE-1)
    } else {
        attackPointE = 0
    }

    // 回復処理
    // プレイヤー
    if (successP && playerS == 2) {
        healPointP = healProcess(1, levelP-1)
    } else {
        healPointP = 0
    }
    // エネミー
    if (successE && enemyS == 2) {
        healPointE = healProcess(2, levelE-1)
    } else {
        healPointE = 0
    }
    
    def = 0
    counterBl = false
    counterPointP = 0
    counterPointE = 0

    // 防御処理
    // プレイヤー
    if (successP && playerS == 3) {
        def, counterBl = defenceProcess(1, levelP-1)
        // カウンター処理
        // カウンター失敗
        // console.log("エネミー攻撃" + attackPointE)
        if (attackPointE > 0 && !counterBl) {
            attackPointE = Math.floor(attackPointE * def)
        // カウンター成功
        } else if (attackPointE > 0 && counterBl) {
            // エネミーの攻撃ダメージをプレイヤーダメージとし、エネミーの攻撃ダメージは0にする
            counterPointP = attackPointE
            attackPointE = 0
        }
    }
    // エネミー
    if (successE && enemyS == 3) {
        def, counterBl = defenceProcess(1, levelE-1)
        // カウンター処理
        // カウンター失敗
        // console.log("プレイヤー攻撃" + attackPointP)
        if (attackPointP > 0 && !counterBl) {
            attackPointP = Math.floor(attackPointP * def)
        // カウンター成功
        } else if (attackPointP > 0 && counterBl) {
            // プレイヤーの攻撃ダメージをエネミーダメージとし、プレイヤーの攻撃ダメージは0にする
            counterPointE = attackPointP
            attackPointP= 0
        }
    }

    // HP・SP・ログ処理
    // プレイヤー先行エネミー後攻
    if (playNM == 1) {
        // プレイヤー側コメント設定
        lStr = "プレイヤー先攻 \n"
        logStr = logStr + lStr
        logEdit(logStr)
        if (playerS == 1) {
            lStr = "プレイヤーの攻撃 \n"
            logStr = logStr + lStr
            logEdit(logStr)
            if (attackPointP == 0) {
                lStr = "攻撃に失敗した \n"
                logStr = logStr + lStr
                logEdit(logStr)
            } else {
                if (counterPointE > 0) {
                    lStr = "エネミーのカウンターが発動 \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    lStr = "プレイヤーは" + counterPointE + "のダメージを受けた \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    pHP = pHP - counterPointE
                    if (pHP <= 0) {
                        lStr = "プレイヤーはやられた \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        lStr = "プレイヤーの敗北 \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        pHP = 0
                        judge = 1
                    } else {
                        lStr = "プレイヤーのHP：" + pHP + " \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                    }
                } else {
                    // if (criticalP) {
                    //     lStr = "プレイヤーは **クリティカルヒット** \n"
                    //     logStr = logStr + lStr
                    // }
                    lStr = "プレイヤーは" + attackPointP + "のダメージを与えた \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    eHP = eHP - attackPointP
                    if (eHP <= 0) {
                        logStr = "エネミーを倒した \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        lStr = "プレイヤーの勝利 \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        eHP = 0
                        judge = 2
                    } else {
                        lStr = "エネミーのHP：" + eHP + " \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                    }
                }
            }
        // スキル（回復）の場合
        } else if (playerS == 2) {
            lStr = "プレイヤーはスキル【回復】を発動 \n"
            logStr = logStr + lStr
            logEdit(logStr)
            if (healPointP > 0 && pSP >= useSP) {
                lStr = "プレイヤーは" + healPointP + "回復した \n"
                logStr = logStr + lStr
                logEdit(logStr)
                pHP = pHP + healPointP
                if (pHP > playerSetting["playerHP"]) {
                    pHP = playerSetting["playerHP"]
                }
                pSP = pSP - useSP
                // lStr = "プレイヤーのHP：" + pHP + "\n" + " SP：" + pSP + " \n"
                // logStr = logStr + lStr
                // logEdit(logStr)
            } else if (healPointP > 0 && pSP < useSP) {
                lStr = "SPが足らなかった \n"
                logStr = logStr + lStr
                logEdit(logStr)
            }
            else {
                lStr = "回復に失敗 \n"
                logStr = logStr + lStr
                logEdit(logStr)
            }
        // 防御の場合
        } else if (playerS == 3) {
            lStr = "プレイヤーは防御の構え \n"
            logStr = logStr + lStr
            logEdit(logStr)
        }
        // エネミー側コメント設定
        if (enemyS == 1) {
            lStr = "エネミーの攻撃 \n"
            logStr = logStr + lStr
            logEdit(logStr)
            if (attackPointE == 0) {
                lStr = "攻撃に失敗した \n"
                logStr = logStr + lStr
                logEdit(logStr)
            } else {
                if (counterPointP > 0) {
                    lStr = "プレイヤーのカウンターが発動 \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    lStr = "エネミーは" + counterPointP + "のダメージを受けた \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    eHP = eHP - counterPointP
                    if (eHP <= 0) {
                        lStr = "エネミーを倒した \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        lStr = "プレイヤーの勝利 \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        eHP = 0
                        judge = 2
                    } else {
                        lStr = "エネミーのHP：" + eHP + " \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                    }
                } else {
                    // if (criticalE) {
                    //     lStr = "エネミーは **クリティカルヒット** \n"
                    //     logStr = logStr + lStr
                    // }
                    lStr = "エネミーは" + attackPointE + "のダメージを与えた \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    pHP = pHP - attackPointE
                    if (pHP <= 0) {
                        lStr = "プレイヤーはやられた \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        lStr = "プレイヤーの敗北 \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                        pHP = 0
                        judge = 1
                    } else {
                        lStr = "プレイヤーのHP：" + pHP + " \n"
                        logStr = logStr + lStr
                        logEdit(logStr)
                    }
                }
            }
        // スキル（回復）の場合
        } else if (enemyS == 2) {
            lStr = "エネミーはスキル【回復】を発動 \n"
            logStr = logStr + lStr
            logEdit(logStr)
            if (healPointE > 0 && eSP >= useSP) {
                lStr = "エネミーは" + healPointE + "回復した \n"
                logStr = logStr + lStr
                logEdit(logStr)
                eHP = eHP + healPointE
                if (eHP > enemySetting["enemyHP"]) {
                    eHP = enemySetting["enemyHP"]
                }
                eSP = eSP - useSP
                // lStr = "エネミーのHP：" + eHP + "\n" + " SP：" + eSP + " \n"
                // logStr = logStr + lStr
                logEdit(logStr)
            } else if (healPointE > 0 && eSP < useSP) {
                lStr = "SPが足らなかった \n"
                logStr = logStr + lStr
                logEdit(logStr)
            } else {
                lStr = "回復に失敗 \n"
                logStr = logStr + lStr
                logEdit(logStr)
            }
        // 防御の場合
        } else if (enemyS == 3) {
            lStr = "エネミーは防御の構え \n"
            logStr = logStr + lStr
            logEdit(logStr)
        }
    // プレイヤー後攻エネミー先行
    } else {
        lStr = "エネミー先攻 \n"
        logStr = logStr + lStr
        logEdit(logStr)
        // エネミー側コメント設定
        if (enemyS == 1) {
            lStr = "エネミーの攻撃 \n"
            logStr = logStr + lStr
            logEdit(logStr)
            if (attackPointE == 0) {
                lStr = "攻撃に失敗した \n"
                logStr = logStr + lStr
                logEdit(logStr)
            } else {
                if (counterPointP > 0) {
                    lStr = "プレイヤーのカウンターが発動 \n"
                    logStr = logStr + lStr
                    lStr = "エネミーは" + counterPointP + "のダメージを受けた \n"
                    logStr = logStr + lStr
                    logEdit(logStr)
                    eHP = eHP - counterPointP
                    if (eHP <= 0) {
                        lStr = "エネミーを倒した \n"
                        logStr = logStr + lStr
                        lStr = "プレイヤーの勝利 \n"
                        logStr = logStr + lStr
                        eHP = 0
                        judge = 2
                    } else {
                        lStr = "エネミーのHP：" + eHP + " \n"
                        logStr = logStr + lStr
                    }
                } else {
                    // if (criticalE) {
                    //     lStr = "エネミーは **クリティカルヒット** \n"
                    //     logStr = logStr + lStr
                    // }
                    lStr = "エネミーは" + attackPointE + "のダメージを与えた \n"
                    logStr = logStr + lStr
                    pHP = pHP - attackPointE
                    if (pHP <= 0) {
                        lStr = "プレイヤーはやられた \n"
                        logStr = logStr + lStr
                        lStr = "プレイヤーの敗北 \n"
                        logStr = logStr + lStr
                        pHP = 0
                        judge = 1
                    } else {
                        lStr = "プレイヤーのHP：" + pHP + " \n"
                        logStr = logStr + lStr
                    }
                }
            }
        // スキル（回復）の場合
        } else if (enemyS == 2) {
            lStr = "エネミーはスキル【回復】を発動 \n"
            logStr = logStr + lStr
            if (healPointE > 0 && eSP >= useSP) {
                lStr = "エネミーは" + healPointE + "回復した \n"
                eHP = eHP + healPointE
                if (eHP > enemySetting["enemyHP"]) {
                    eHP = enemySetting["enemyHP"]
                }
                eSP = eSP - useSP
                // lStr = "エネミーのHP：" + eHP + "\n" + " SP：" + eSP + " \n"
                // logStr - logStr + lStr
            } else if (healPointE > 0 && eSP < useSP) {
                lStr = "SPが足らなかった \n"
                logStr = logStr + lStr
            } else {
                lStr = "回復に失敗 \n"
                logStr = logStr + lStr
            }
        // 防御の場合
        } else if (enemyS == 3) {
            lStr = "エネミーは防御の構え \n"
            logStr = logStr + lStr
        }
        // プレイヤー側コメント設定
        if (playerS == 1) {
            lStr = "プレイヤーの攻撃 \n"
            logStr = logStr + lStr
            if (attackPointP == 0) {
                lStr = "攻撃に失敗した \n"
                logStr = logStr + lStr
            } else {
                if (counterPointE > 0) {
                    lStr = "エネミーのカウンターが発動 \n"
                    logStr = logStr + lStr
                    lStr = "プレイヤーは" + counterPointE + "のダメージを受けた \n"
                    logStr = logStr + lStr
                    pHP = pHP - counterPointE
                    if (pHP <= 0) {
                        lStr = "プレイヤーはやられた \n"
                        logStr = logStr + lStr
                        lStr = "プレイヤーの敗北 \n"
                        logStr = logStr + lStr
                        pHP = 0
                        judge = 1
                    } else {
                        lStr = "プレイヤーのHP：" + pHP + " \n"
                        logStr = logStr + lStr
                    }
                } else {
                    // if (criticalP) {
                    //     lStr = "プレイヤーは **クリティカルヒット** \n"
                    //     logStr = logStr + lStr
                    // }
                    lStr = "プレイヤーは" + attackPointP + "のダメージを与えた \n"
                    logStr = logStr + lStr
                    eHP = eHP - attackPointP
                    if (eHP <= 0) {
                        lStr = "エネミーを倒した \n"
                        logStr = logStr + lStr
                        lStr = "プレイヤーの勝利 \n"
                        logStr = logStr + lStr
                        eHP = 0
                        judge = 2
                    } else {
                        lStr = "エネミーのHP：" + eHP + " \n"
                        logStr = logStr + lStr
                    }
                }
            }
        // スキル（回復）の場合
        } else if (playerS == 2) {
            lStr = "プレイヤーはスキル【回復】を発動 \n"
            logStr = logStr + lStr
            if (healPointP > 0 && pSP >= useSP) {
                lStr = "プレイヤーは" + healPointP + "回復した \n"
                logStr = logStr +lStr
                pHP = pHP + healPointP
                if (pHP > playerSetting["playerHP"]) {
                    pHP = playerSetting["playerHP"]
                }
                pSP = pSP - useSP
                // lStr = "プレイヤーのHP：" + pHP + "\n" + " SP：" + pSP + " \n"
                // logStr = logStr + lStr
            } else if (healPointP > 0 && pSP < useSP) {
                lStr = "SPが足らなかった \n"
                logStr = logStr + lStr
            } else {
                lStr = "回復に失敗 \n"
                logStr = logStr + lStr
            }
        // 防御の場合
        } else if (playerS == 3) {
            lStr = "プレイヤーは防御の構え \n"
            logStr - logStr + lStr
        }
    }

    // テキストエリア更新
    logEdit(logStr)

    // ステータス表示更新
    playerStatus(pHP, pSP)
    enemyStatus(eHP, eSP, enemyS)

    // 画像入れ替え
    if (pHP < parseInt(enemySetting["enemyHP"]) * 0.5) {
        imgChange(2)
    } else {
        imgChange(1)
    }
    
    // プレイヤーbar更新
    if (playerSetting["playerHP"] != pHP) {
        hpBarChange(1, playerSetting["playerHP"] - pHP)
    }

    // エネミーbar更新
    if (enemySetting["enemyHP"] != eHP) {
        hpBarChange(2, enemySetting["enemyHP"] - eHP)
    }

    // 最終判定
    if (judge != 0) {
        gameEnd(judge)
    }

    count = count + 1

});

// 先攻後攻を決めます
function turnSelect() {
    player = 0

    r = 0
    r = 1 + Math.floor( Math.random() * 2 );
    
    if (r == 1) {
        player = 1
    } else {
        player = 2
    }
    return player
}

//エネミーコマンドを決めます
function enemyCommand() {
    enemySelect = 0

    r = 0
    r = 1 + Math.floor( Math.random() * 3 );

    if (r == 1) {
        enemySelect = 1
    } else if (r == 2) {
        enemySelect = 2
    } else if (r == 3) {
        enemySelect = 3
    }
    return enemySelect
}

// 行動の強弱を決めます
function levelSelect() {
    level = 0
    
    r = 0
    r = Math.floor( Math.random() * 100 )

    if (r >= 0 && r <= 50) {
        level = 1
    } else if (r > 50 && r <= 80) {
        level = 2
    } else if (r > 80 && r <= 100) {
        level = 3
    }

    return level
}

// 成功確率を決めます
function successRate(playNM, commandNM, level) {
    successBl = false
    
    r = 0
    r = Math.floor( Math.random() * 100 );
    
    n = 0

    // player攻撃
    if (playNM == 1 && commandNM == 1) {
        n = playerAttackData[level]["successRange"]
    }
    // playerスキル
    else if (playNM == 1 && commandNM == 2) {
        n = playerHealData[level]["successRange"]
    }
    // player防御
    else if (playNM == 1 && commandNM == 3) {
        n = playerDefenceData[level]["successRange"]
    }
    // enemy攻撃
    else if (playNM == 2 && commandNM == 1) {
        n = enemyAttackData[level]["successRange"]
    }
    // enemy攻撃
    else if (playNM == 2 && commandNM == 2) {
        n = enemyHealData[level]["successRange"]
    }
    // enemy攻撃
    else if (playNM == 2 && commandNM == 3) {
        n = enemyDefenceData[level]["successRange"]
    }

    if (r < n) {
        successBl = true
    } else {
        successBl = false
    }

    return successBl

}

// 攻撃処理時の値を決めます
function attackProcess(playNM, level) {
    min = 0
    max = 0
    critical = 0
    point = 0
    criticalBl = false
    
    r = 0

    // player攻撃
    if (playNM == 1) {
        // ダメージ範囲取得
        min = parseInt(playerAttackData[level]["minDamage"])
        max = parseInt(playerAttackData[level]["maxDamage"])
        point = Math.floor(Math.random() * (max + 1 - min)) + min
        // クリティカルヒット確率取得
        critical = parseInt(playerAttackData[level]["critical"])
        r = Math.floor(Math.random() * 100)
    }
    // enemy攻撃
    else if (playNM == 2) {
        // ダメージ範囲取得
        min = parseInt(enemyAttackData[level]["minDamage"])
        max = parseInt(enemyAttackData[level]["maxDamage"])
        point = Math.floor(Math.random() * (max + 1 - min)) + min
        // クリティカルヒット確率取得
        critical = parseInt(playerAttackData[level]["critical"])
        r = Math.floor(Math.random() * 100)
    }
    // クリティカル判定
    if (critical >= r) {
        // クリティカル成功
        point = point * parseInt(playerSetting["criticalPercent"])
        criticalBl = true
    } else {
        // クリティカル失敗
        point = point * 1
        criticalBl = false
    }

    return point

}

// 回復処理時の値を決めます
function healProcess(playNM, level) {
    min = 0
    max = 0
    
    point = 0
    
    r = 0

    // player回復
    if (playNM == 1) {
        // 回復範囲取得
        min = parseInt(playerHealData[level]["minHeal"])
        max = parseInt(playerHealData[level]["maxHeal"])
        point = Math.floor(Math.random() * (max + 1 - min)) + min
    }
    // enemy回復
    else if (playNM == 2) {
        // 回復範囲取得
        min = parseInt(enemyHealData[level]["minHeal"])
        max = parseInt(enemyHealData[level]["maxHeal"])
        point = Math.floor(Math.random() * (max + 1 - min)) + min
    }

    return point

}

// 防御処理時の値を決めます
function defenceProcess(playNM, level) {
    def = 0
    counter = 0
    
    counterBl = false
    
    r = 0

    // player防御
    if (playNM == 1) {
        // ダメージ軽減率取得
        def = playerDefenceData[level]["Defencerate"]
        // カウンター確率取得
        counter = parseInt(playerDefenceData[level]["counter"])
        r = Math.floor(Math.random() * 100)
    }
    // enemy防御
    else if (playNM == 2) {
        // ダメージ軽減率取得
        def = enemyDefenceData[level]["Defencerate"]
        // カウンター確率取得
        counter = parseInt(enemyDefenceData[level]["counter"])
        r = Math.floor(Math.random() * 100)
    }
    // カウンター判定
    if (counter >= r) {
        // カウンター成功
        counterBl = true
    } else {
        // カウンター失敗
        counterBl = false
    }

    return def, counterBl

}

// バトル時のHP・SP・ログの値を決めます
function battleProcess() {
    
}

// HPが20%になった時に画像を変更
function imgChange(iNum) {

    // 1:通常、2:瀕死
    if (iNum == 1) {
        document.getElementById("player_img").src = "img/player.png";
    } else if (iNum == 2) {
        document.getElementById("player_img").src = "img/player_emergency.png";
    }
}

// ゲーム終了時にボタンの文字を変更
function gameEnd(jNum) {

    if (jNum == 1) {
        // console.log("ゲームオーバー")
        buttonClick.textContent = "ゲームオーバー";
        buttonClick.style.color = "red";
        buttonClick.style.backgroundColor = "black"
    } else if (jNum == 2) {
        // console.log("ゲームクリア")
        buttonClick.textContent = "ゲームクリア";
        buttonClick.style.color = "yellow";
        buttonClick.style.backgroundColor = "black"
    }
}

// ログ更新
function logEdit(logStr) {
    document.getElementById('log').innerHTML = logStr;
    document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
}

// HPbar更新
function hpBarChange(numPlay, hPPlay) {
    
    if (numPlay == 1) {
        for (var i = 1; i <= Math.floor(hPPlay / 5) + 1; i++) {
            pBar[i].style.backgroundColor = "red";
        }
        for (var i = 20; i >= Math.floor(hPPlay / 5) + 1; i--) {
            pBar[i].style.backgroundColor = "aqua";
        }
    } else if (numPlay == 2) {
        for (var i = 1; i <= Math.floor(hPPlay / 5) + 1; i++) {
            eBar[i].style.backgroundColor = "red"
        }
        for (var i = 20; i >= Math.floor(hPPlay / 5) + 1; i--) {
            eBar[i].style.backgroundColor = "aqua"
        }
    }

}

// プレイヤーステータス更新
function playerStatus(pHP, pSP) { 
    document.getElementById('playerHP').innerHTML = "HP:" + (pHP);
    document.getElementById('playerSP').innerHTML = "SP:" + (pSP);    
}


// const PydamageHp = 0
// const PyusedSp = 0

// document.getElementById('playerHP').innerHTML =
// "HP:" + (playerSetting["playerHP"] - PydamageHp);
// document.getElementById('playerSP').innerHTML =
// "SP:" + (playerSetting["playerSP"] - PyusedSp);    
// ここまでプレイヤーステータス

// エネミーステータス更新
function enemyStatus(eHP, eSP, eCom) {
    
    let comStr = ""

    enemy_com = document.getElementById('enemy_command');

    if (eCom == 1) {
        comStr = "攻撃"
        enemy_com.style.color = "black";
    } else if (eCom == 2) {
        comStr = "回復"
        enemy_com.style.color = "green";
    } else if (eCom == 3) {
        comStr = "防御"
        enemy_com.style.color = "blue";
    }

    document.getElementById('enemyHP').innerHTML = "HP:" + (eHP);
    document.getElementById('enemySP').innerHTML = "SP:" + (eSP);
    enemy_com.innerHTML = comStr;

}

// const EmdamageHp = 0
// const EmusedSp = 0

// document.getElementById('enemyHP').innerHTML =
//     "HP:" + (enemySetting["enemyHP"] - EmdamageHp);
// document.getElementById('enemySP').innerHTML =
//     "SP:" + (enemySetting["enemySP"] - EmusedSp);
// ここまでエネミーステータス
