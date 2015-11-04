// ==UserScript==
// @name         CS_Lidwinia
// @version      0.1
// @author       M. Kleuskens
// @include      *cyclingsimulator.com*
// @grant        none
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

//Following lines to add the sublevel of XP to the profile
script.innerHTML +=  'var div = document.createElement("div");'
script.innerHTML +=  'div.innerHTML = ajax.responseText;'
script.innerHTML +=  'xpl = "00"+div.getElementsByClassName("text")[0].getElementsByTagName("td")[0].width;'
script.innerHTML +=  'xpl = xpl.substr(xpl.length - 2);'
script.innerHTML +=  'xp = div.textContent.substring(div.textContent.indexOf("Experience"),div.textContent.indexOf("Experience")+19);'
script.innerHTML +=  'document.getElementById(riderProfileDiv).innerHTML=ajax.responseText.replace(xp,xp+"."+xpl);'

//Following lines to calculate the maximum Release Value and maximum profit for riders on the hirelist
script.innerHTML +=  'if(window.location.search.indexOf("Hire") > -1) {' //Only on hire page for now, since bonus RV for 50+ skills and results is not implemented
script.innerHTML +=  'riderStats = document.getElementById(riderProfileDiv).previousElementSibling;'
script.innerHTML +=  'var maxBaseRV = 36000;' //36000 = base RV at max DP (99) + RS (80)
script.innerHTML +=  'for (i = 1; i < 9; i++) {maxBaseRV += 75*(parseInt(riderStats.getElementsByClassName("right")[i].textContent)-27);};' //75 extra RV for every point above 27 (and -75 for every point below 27)
script.innerHTML +=  'var ageCorrection = (maxBaseRV/25)*-(parseInt(riderStats.getElementsByClassName("right")[0].textContent)-22);' //agecorrection first based on age (every year above 22 removes 1/25th of the maxBaseRV; every year below 22 adds 1/25th)
script.innerHTML +=  'bd = parseInt(div.textContent.substring(div.textContent.indexOf("Day")+4,div.textContent.indexOf("Day")+6));' //Get birthday
script.innerHTML +=  'toptitle = document.getElementsByClassName("toptitle")[1].textContent;' //Get topbar with current day
script.innerHTML +=  'cd = parseInt(toptitle.substring(toptitle.indexOf("Day")+4,toptitle.indexOf("Day")+6));' //Get current day
script.innerHTML +=  'if(bd>cd){' //If birthday > current day 
script.innerHTML +=  'ageCorrection -= (90-bd+cd)/90*(maxBaseRV/25)'
script.innerHTML +=  '} else {'
script.innerHTML +=  'ageCorrection -= (cd-bd)/90*(maxBaseRV/25)'
script.innerHTML +=  '}'
script.innerHTML +=  'ageCorrection -= (1/3)*(maxBaseRV/25);' //Extra age correction for 30 days ahead
script.innerHTML +=  'maxRV = Math.max(Math.round(maxBaseRV+ageCorrection),29000);' //Rounding and minimum value of 29000
script.innerHTML +=  'maxRVtxt = maxRV.toString();' //Converting to text for thousands separator etc.
script.innerHTML +=  'maxRVtxt = maxRVtxt.substr(0, maxRVtxt.length - 3)+"."+maxRVtxt.substr(maxRVtxt.length - 3)+" $";' //Converting to text for thousands separator etc.
script.innerHTML +=  'price = parseInt(riderStats.getElementsByClassName("right")[12].textContent.replace(".",""));' //Get price from hirelist to calculate potential profite (ONLY AVAILABLE ON HIRELIST)
script.innerHTML +=  'profit = Math.max(maxRV-price,0);'
script.innerHTML +=  'profittxt = profit.toString();'
script.innerHTML +=  'if(profittxt.length>3){point="."}else{point=""};'
script.innerHTML +=  'profittxt = profittxt.substr(0, profittxt.length - 3)+point+profittxt.substr(profittxt.length - 3)+" $";'
script.innerHTML +=  'riderProfile.getElementsByClassName("text")[1].innerHTML = riderProfile.getElementsByClassName("text")[1].innerHTML+"<br>Maximum RV: "+maxRVtxt+"<br>Expected profit: "+profittxt;'
script.innerHTML +=  '};'

//Following lines to add the link to the riderprofile
script.innerHTML +=  'riderID = riderProfileDiv.replace("riderprofile","");'
script.innerHTML +=  'riderProfile.getElementsByClassName("text")[1].innerHTML = riderProfile.getElementsByClassName("text")[1].innerHTML+"<br><br>[rider]"+riderID+"[/rider]";'

//Following lines voor showing hiding profiles
script.innerHTML +=  'if(document.getElementById(riderProfileDiv).style.display=="none") {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="block";'
script.innerHTML +=  '		} else {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="none";'
script.innerHTML +=  '		}'   
script.innerHTML +=  '	}'
script.innerHTML +=  '}'

//test = document.querySelectorAll("[onclick*=""+riderID+""]")[0].textContent

// this is sort of hard to read, because it's doing 2 things:
// 1. finds the first body tag on the page
// 2. adds the new script just before the </body> tag
document.getElementsByTagName('body')[0].appendChild(script);
