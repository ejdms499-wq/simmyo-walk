/* 옛 맞춤법(겟소·잇소·우에…)을 요즘 맞춤법으로 — 대사 말투를 한 가지로 맞춤 */
(function(){var R=[['압헤','앞에'],['까지 갓소','까지 갔소'],['끈소','끊소'],['만소','많소'],['겟소','겠소'],['잇소','있소'],['잇고','있고'],['갓소','같소'],['엇소','었소'],['앗소','았소'],['업소','없소'],['업더','없더'],['아즉','아직'],['우에','위에'],['압','앞'],['안즌','앉은'],['몰랏','몰랐'],['엿소','였소'],['가튼','같은'],['렷소','렸소'],['뛰엇','뛰었'],['모르겟','모르겠'],['잇다','있다'],['햇소','했소'],['햇다','했다']];
function modern(t){if(t==null)return t;t=String(t);R.forEach(function(r){t=t.split(r[0]).join(r[1])});return t}
window.modern=window.modern||modern;
var D=window.SIMMYO_DATA;if(D&&D.P)D.P.forEach(function(p){if(p.say)p.say=[].concat(p.say).map(modern);if(p.night)p.night=modern(p.night)})})();
