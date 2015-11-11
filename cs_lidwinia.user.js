// ==UserScript==
// @name         CS_Lidwinia
// @version      0.3
// @author       M. Kleuskens
// @include      *cyclingsimulator.com*
// @grant        none
// @downloadURL	https://github.com/Starlynk/CS_Lidwinia/raw/master/CS_Lidwinia.user.js
// @updateURL	  https://github.com/Starlynk/CS_Lidwinia/raw/master/CS_Lidwinia.user.js
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// ==/UserScript==

//Scripts below overwrites standard 'riderProfileStateChanged' function on the site
//Changes include:
//1. Profile of previous rider isn't closed automatically. Display attiribute only changes for the rider clicked.
//2. Experience now shows sublevel based on the width of the bar
//3. Rider link for forum added to profile
//4. Adding max RV and max profit to profile on hire list
var script = document.createElement('script');    // create the script element
script.innerHTML +=  'function riderProfileStateChanged() { '
script.innerHTML +=  'if (ajax.readyState==4) { '
script.innerHTML +=  'document.getElementById("loading").style.visibility="hidden";'
script.innerHTML +=  'riderProfile = document.getElementById(riderProfileDiv);'
script.innerHTML +=  'riderID = riderProfileDiv.replace("riderprofile","");'

//Following lines to add the sublevel of XP to the profile
script.innerHTML +=  'var div = document.createElement("div");'
script.innerHTML +=  'div.innerHTML = ajax.responseText;'
script.innerHTML +=  'xpl = "00"+div.getElementsByClassName("text")[0].getElementsByTagName("td")[0].width;'
script.innerHTML +=  'xpl = xpl.substr(xpl.length - 2);'
script.innerHTML +=  'xp = div.textContent.substring(div.textContent.indexOf("Experience"),div.textContent.indexOf("Experience")+19);'
script.innerHTML +=  'document.getElementById(riderProfileDiv).innerHTML=ajax.responseText.replace(xp,xp+"."+xpl);'

//Following lines to calculate the maximum Release Value and maximum profit for riders on the hirelist
script.innerHTML +=  'riderStats = document.getElementById(riderProfileDiv).previousElementSibling;'
script.innerHTML +=  'var maxBaseRV = 36000;' //36000 = base RV at max DP (99) + RS (80)
script.innerHTML +=  'totalstats=0;'
script.innerHTML +=  'for (i = 1; i < 9; i++) {stat=parseInt(riderStats.getElementsByClassName("right")[i].textContent);totalstats+=stat;maxBaseRV += 75*(stat-27);' //75 extra RV for every point above 27 (and -75 for every point below 27)
//Bonus RV for skills above 50
script.innerHTML +=  'if(stat>=50){maxBaseRV += 2500};'
script.innerHTML +=  'if(stat>=60){maxBaseRV += 5000};'
script.innerHTML +=  'if(stat>=70){maxBaseRV += 10000};'
script.innerHTML +=  'if(stat>=80){maxBaseRV += 20000};'
script.innerHTML +=  'if(stat>=90){maxBaseRV += 40000};'
script.innerHTML +=  '};'
//Bonus RV based on AV (average, rounded up)
script.innerHTML +=  'av=Math.ceil(totalstats/8);'
script.innerHTML +=  'if(av==41){maxBaseRV+=2000};'
script.innerHTML +=  'if(av==42){maxBaseRV+=5000};'
script.innerHTML +=  'if(av==43){maxBaseRV+=9000};'
script.innerHTML +=  'if(av==44){maxBaseRV+=14000};'
script.innerHTML +=  'if(av==45){maxBaseRV+=21500};'
script.innerHTML +=  'if(av==46){maxBaseRV+=31500};'
script.innerHTML +=  'if(av==47){maxBaseRV+=45500};'
script.innerHTML +=  'if(av==48){maxBaseRV+=63500};'
script.innerHTML +=  'if(av==49){maxBaseRV+=83500};'
script.innerHTML +=  'if(av>=50){maxBaseRV+=108500};'
//Next part to get number of results from other page with ajax query. Bad for performance.
script.innerHTML +=  'var res = document.createElement("div");'
script.innerHTML +=  'res.innerHTML=$.ajax({ url: "http://www.cyclingsimulator.com/?page=Rider%20Profile&id="+riderID, global: false, async:false, success: function(data) {return data;} }).responseText;;'
script.innerHTML +=  'res=res.querySelectorAll("span.boxtitle");'
script.innerHTML +=  'var results = 0;'
script.innerHTML +=  'for (r = 0; r<res.length;r++){if(res[r].textContent.indexOf("Total") > -1) {results += parseInt(res[r].textContent.replace("Total: ",""))}}'
script.innerHTML +=  'maxBaseRV += (results*2000);'
//Next part to calculate age correction
script.innerHTML +=  'var ageCorrection = (maxBaseRV/25)*-(parseInt(riderStats.getElementsByClassName("right")[0].textContent)-22);' //agecorrection first based on age (every year above 22 removes 1/25th of the maxBaseRV; every year below 22 adds 1/25th)
script.innerHTML +=  'bd = parseInt(div.textContent.substring(div.textContent.indexOf("Day")+4,div.textContent.indexOf("Day")+6));' //Get birthday
script.innerHTML +=  'toptitle = document.getElementsByClassName("toptitle")[1].textContent;' //Get topbar with current day
script.innerHTML +=  'cd = parseInt(toptitle.substring(toptitle.indexOf("Day")+4,toptitle.indexOf("Day")+6));' //Get current day
script.innerHTML +=  'if(bd>cd){' //If birthday > current day 
script.innerHTML +=  'ageCorrection -= (90-bd+cd)/90*(maxBaseRV/25)'
script.innerHTML +=  '} else {'
script.innerHTML +=  'ageCorrection -= (cd-bd)/90*(maxBaseRV/25)'
script.innerHTML +=  '}'
script.innerHTML +=  'maxRV = Math.max(Math.round(maxBaseRV+ageCorrection),29000);' //Rounding and minimum value of 29000
script.innerHTML +=  'maxRVtxt = maxRV.toString();' //Converting to text for thousands separator etc.
script.innerHTML +=  'maxRVtxt = maxRVtxt.substr(0, maxRVtxt.length - 3)+"."+maxRVtxt.substr(maxRVtxt.length - 3)+" $";' //Converting to text for thousands separator etc.
script.innerHTML +=  'riderProfile.getElementsByClassName("text")[1].innerHTML = riderProfile.getElementsByClassName("text")[1].innerHTML+"<br>Maximum RV: "+maxRVtxt;'
//On Hire page show Max RV in 30 days and potential profit additionally
script.innerHTML +=  'if(window.location.search.indexOf("Hire") > -1) {' 
script.innerHTML +=  'ageCorrection -= (1/3)*(maxBaseRV/25);' //Extra age correction for 30 days ahead
script.innerHTML +=  'price = parseInt(riderStats.getElementsByClassName("right")[12].textContent.replace(".",""));' //Get price from hirelist to calculate potential profite (ONLY AVAILABLE ON HIRELIST)
script.innerHTML +=  'maxRV2 = Math.max(Math.round(maxBaseRV+ageCorrection),29000);' //Rounding and minimum value of 29000
script.innerHTML +=  'maxRV2txt = maxRV2.toString();' //Converting to text for thousands separator etc.
script.innerHTML +=  'maxRV2txt = maxRV2txt.substr(0, maxRV2txt.length - 3)+"."+maxRV2txt.substr(maxRV2txt.length - 3)+" $";' //Converting to text for thousands separator etc.
script.innerHTML +=  'profit = Math.max(maxRV2-price,0);'
script.innerHTML +=  'profittxt = profit.toString();'
script.innerHTML +=  'if(profittxt.length>3){point="."}else{point=""};'
script.innerHTML +=  'profittxt = profittxt.substr(0, profittxt.length - 3)+point+profittxt.substr(profittxt.length - 3)+" $";'
script.innerHTML +=  'riderProfile.getElementsByClassName("text")[1].innerHTML = riderProfile.getElementsByClassName("text")[1].innerHTML+"<br>MaxRV in 30d: "+maxRV2txt+"<br>Expected profit: "+profittxt;'
script.innerHTML +=  '};'

//Following lines to add the link to the riderprofile
script.innerHTML +=  'riderProfile.getElementsByClassName("text")[1].innerHTML = riderProfile.getElementsByClassName("text")[1].innerHTML+"<br><br>[rider]"+riderID+"[/rider]";'

//Following lines voor showing hiding profiles
script.innerHTML +=  'if(document.getElementById(riderProfileDiv).style.display=="none") {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="block";'
script.innerHTML +=  '		} else {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="none";'
script.innerHTML +=  '		}'   
script.innerHTML +=  '	}'
script.innerHTML +=  '}'

//Get Team Name
var team = $("#menu").find("b:first").text();

//Get RB info, only on Race Break page
if(window.location.search.indexOf("Break") > -1)
{
    //Get RE doctor value from main page; this is horrible site design without ID's or classes
    var mpage = document.createElement("div");
    mpage.innerHTML=$.ajax({ url: "http://www.cyclingsimulator.com/team/"+team.replace(" ","_"), global: false, async:false, success: function(data) {return data;} }).responseText;//Get HTML data from main site
    var doctors = $(mpage).find("span:contains('Doctor')").parent().parent().parent().parent().parent().parent().parent().parent().next("table").find("td:eq(1)").find("td");//Impossible way to get all cells from table with Doctors
    var re_doc = 0
    if (doctors.length>1){re_doc = Math.max(re_doc,doctors[1].textContent)}//if there is more than 1 cell (you have at least 1 doctor), check RE level of doctor 1
    if (doctors.length>7){re_doc = Math.max(re_doc,doctors[7].textContent)}//if there are more than 7 cells (you have at least 2 doctors), check RE level of doctor 2
    if (doctors.length>13){re_doc = Math.max(re_doc,doctors[13].textContent)}//if there are more than 13 cells (you have 3 doctors), check RE level of doctor 3
    var rb_doc_impact = 1; //impact with no doctor =1 
    if (re_doc>=50) //if you have an RE doctor
    {rb_doc_impact += ((re_doc/5)-5)/100;}//Calculate extra DP increase percentage
     
    //Get riders info (DP) from riderlist
    var rlist = document.createElement("div");
    rlist.innerHTML=$.ajax({ url: "http://www.cyclingsimulator.com/ajax_riderlist.php?page=Teams&team="+team.replace(" ","+"), global: false, async:false, success: function(data) {return data;} }).responseText;
    rlist_riders = $(rlist).find("a");//Link is rider
    rlist_skills = $(rlist).find("p.right");//Skills are right aligned
    
    //Another horrible piece of site design. Since nothing's one table you have to do multiple overrules width to make it look alright
    //This is the "send" table. I made this one smaller to be able to show extra data on on-break table
    $("[width=350]:first").css("width","300");
    $("[width=284]:first").css("width","234");
    $("[width=298]:first").css("width","248");
    $("[width=300]:first").css("width","250");
    
    //This is the on-break table. I made this one bigger to show the extra data.
    $("[width=350]:eq(1)").css("width","400");
    $("[width=284]:eq(1)").css("width","334");
    $("[width=298]:eq(3)").css("width","348");
    $("[width=298]:eq(4)").css("width","348");
    $("[width=298]:eq(5)").css("width","348");
    $("[width=300]:eq(1)").css("width","350");
    
    //Add extra boxtitles to on-break table for DP, Out & After
    $("[width=234]").parent().find("td:last").after("<td width=38><p class = right><span class = 'boxtitle'>DP</span></p></td>");
    $("[width=234]").parent().find("td:last").after("<td width=55><p class = right><span class = 'boxtitle'>Out</span></p></td>");
    $("[width=234]").parent().find("td:last").after("<td width=42><p class = right><span class = 'boxtitle'>After</span></p></td>");
   
    //Check #ridersonbreak list
    var riders = $("#ridersonbreak").find("a");
    for (r=0;r<riders.length-1;r++)//Loop through all links/riders in onbreak
    {
        var riderID = $(riders[r]).attr("onClick").replace("getBackFromBreak(","").replace(")",""); //riderId in onClick
        for (l=0;l<rlist_riders.length;l++)//Loop through all riders in riderlist on main page
        {
            if ($(rlist_riders[l]).attr("onClick").indexOf(riderID) >-1) //If there's a match on riderId
                {                
                    var DP = $(rlist_skills[l*12+9]).text(); // Get rider's DP from riderlist table                 
                    var cur_rb = $("#ridersonbreak table:eq("+r+") td:last").text(); //Get Length value from on break table
                    var subhelp = cur_rb.indexOf("hour");//subhelp to find how many hours a rider is in racebreak
                    var cur_hours = parseInt(cur_rb)*24+parseInt(cur_rb.substring(subhelp-3,subhelp));//cur_hours is first number you find (days in race break) * 24, + number of hours found with subhelp
                    //Calculate RB rise and hours required according to Excel formula's
                    var rb_rise = Math.min(Math.floor(((rb_doc_impact*120*Math.max((100-Math.max(DP,50)),10))/240)),99-DP);
                    var rb_hours = Math.ceil((rb_rise*240)/rb_doc_impact/Math.max((100-Math.max(DP,50)),10));
                    //If a rider should be taken out of RB, make extra cells bold
                    var bold = ''                  
                    if (cur_hours >= rb_hours)
                    {var bold = "<b>"}
                    
                    //Format for display:
                    var rb_days = Math.floor(rb_hours/24);
                    rb_hours = rb_hours-(rb_days*24);

                    //Add info to table! Finally!
                    $("#ridersonbreak table:eq("+r+") td:last").after("<td width=38><p class='right'><span class = 'text'>"+bold+""+DP+"</span></p></td>");
                    $("#ridersonbreak table:eq("+r+") td:last").after("<td width=55><p class='right'><span class = 'text'>"+bold+""+rb_days+"-"+rb_hours+"</span></p></td>");
                    $("#ridersonbreak table:eq("+r+") td:last").after("<td width=50><p class='right'><span class = 'text'>"+bold+""+Math.min(parseInt(DP)+parseInt(Math.max(rb_rise,5)),99)+"</span></p></td>");
                    
                    break;
                }
        }
    }
    
}


//This part to add the script stuff
document.getElementsByTagName('body')[0].appendChild(script);
