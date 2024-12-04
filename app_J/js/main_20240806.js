let playerAttackData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];
let playerHealData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];
let playerDefenceData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];
let enemyAttackData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];
let enemyHealData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];
let enemyDefenceData = [{lebel: "1", successRange: "1", minDamage:"15", maxDamage: "25", critical: "0.2"}, {lebel: "2", successRange: "0.8", minDamage:"10", maxDamage: "20", critical: "0.1"}, {lebel: "3", successRange: "0.6", minDamage:"5", maxDamage: "15", critical: "0.05"}];

console.log(playerAttackData[0]["minDamage"]);
console.log(enemyAttackData[2]["minDamage"]);


playNM = turnselect()
console.log(levelselect(playNM))

playerAttackData[playNM]