// ==UserScript==
// @name         Cycling Simulator Default lineups
// @version      0.1
// @description  to save default lineups in cycling simulator
// @author       Martijn Kleuskens
// @match        http://www.cyclingsimulator.com/?page=Race&race=*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// ==/UserScript==

(function() {
    var sButton = document.createElement('button');
    sButton.innerHTML = 'Save';
    sButton.onclick = function(){
    var teamType=($('select[name=teamType]').val());
    $('select').each(function() {
    GM_setValue(teamType+$(this).attr("name"),$(this).find('option:selected').val());
    });
    return false;
    };

    var lButton = document.createElement('button');
    lButton.innerHTML = 'Load';
    lButton.onclick = function(){
    var teamType=($('select[name=teamType]').val());
    $('select').each(function() {
    $(this).val(GM_getValue(teamType+$(this).attr("name")));
    });
    return false;
    };

    $("select:last").after('<p><b>Team:<b><BR><select name="teamType"><option>SP</option><option>CL</option><option>HL</option></select><BR>');
    $("select:last").after(sButton);
    $("select:last").after(lButton);

})();
