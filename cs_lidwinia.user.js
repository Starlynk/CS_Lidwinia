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
var script = document.createElement('script');    // create the script element
script.innerHTML +=  'function riderProfileStateChanged() { '
script.innerHTML +=  'if (ajax.readyState==4) { '
script.innerHTML +=  'document.getElementById("loading").style.visibility="hidden";'
script.innerHTML +=  'var div = document.createElement("div");'
script.innerHTML +=  'div.innerHTML = ajax.responseText;'
script.innerHTML +=  'xpl = "00"+div.getElementsByClassName("text")[0].getElementsByTagName("td")[0].width;'
script.innerHTML +=  'xpl = xpl.substr(xpl.length - 2);'
script.innerHTML +=  'xp = div.textContent.substring(div.textContent.indexOf("Experience"),div.textContent.indexOf("Experience")+19);'
script.innerHTML +=  'document.getElementById(riderProfileDiv).innerHTML=ajax.responseText.replace(xp,xp+"."+xpl);'
script.innerHTML +=  'if(document.getElementById(riderProfileDiv).style.display=="none") {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="block";'
script.innerHTML +=  '		} else {'
script.innerHTML +=  'document.getElementById(riderProfileDiv).style.display="none";'
script.innerHTML +=  '		}'   
script.innerHTML +=  '	}'
script.innerHTML +=  '}'

// this is sort of hard to read, because it's doing 2 things:
// 1. finds the first body tag on the page
// 2. adds the new script just before the </body> tag
document.getElementsByTagName('body')[0].appendChild(script);
