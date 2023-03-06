// ==UserScript==
// @name         Heroes Chronicles Utilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Full PA ETA. Order monsters list by level.
// @author       Pangloss
// @match        http://heroeschronicles.nainwak.org/interface.php
// @icon         http://heroeschronicles.nainwak.org/images/heroes.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const max_pa = 50;
    const max_timer_pa = 1800;
    var missing_pa = 0;
    var missing_timer_pa = 0;
    var comptarebour3_center = null;

    var convert_to_hms = (seconds, bpad, bsec, ar_label=["h","mn","s"])=> {
        var h = Math.floor(seconds/3600);
        var m = Math.floor((seconds%3600)/60);
        var s = Math.floor((seconds%3600)%60);
        if(ar_label.length != 3){
            ar_label=["h","mn","s"];
        }
        return ((bpad ? ("0"+h).substr(-2) : h) + ar_label[0] + (bpad ? ("0"+m).substr(-2) : m) + ar_label[1] + (bsec ? ((bpad ? ("0"+s).substr(-2) : s) + ar_label[2] ) : ""));
    };

    var convert_to_date = (s)=>{
        //return new Date(s*1000+new Date().getTime())
        return new Date((s+new Date().getTime()/1000)*1000);
    };

    window.setInterval(()=>{
        const sel_pa = window.top.frames[0].document.querySelector('li#pa');
        const sel_timer_pa = window.top.frames[1].document.querySelector('div#comptarebour1 center');
        const comptarebour2 = window.top.frames[1].document.querySelector('div#comptarebour2');
        var comptarebour3 = window.top.frames[1].document.querySelector('div#comptarebour3');
        if(comptarebour3 == null && comptarebour2 != null){
            comptarebour3 = comptarebour2.cloneNode(true);
            comptarebour3.id = "comptarebour3";
            comptarebour3.setAttribute("class","vert");
            comptarebour3.setAttribute("title","XXXX");
            comptarebour3.style.fontSize='10px';
            comptarebour3.querySelector('center').innerText = '00h00m00s';
            comptarebour2.after(comptarebour3);
        }
        var current_pa = sel_pa.innerText.replace("PA", "").replace(/\s/g, '');
        //console.log('curent PA: '+ current_pa);
        missing_pa = max_pa - current_pa*1;
        //console.log('missing_pa: '+ missing_pa);
        missing_timer_pa = max_timer_pa * missing_pa;
        //console.log('missing_timer_pa: '+ missing_timer_pa);
        if(sel_timer_pa != null && missing_timer_pa != 0){
            var [mn, s] = sel_timer_pa.innerText.split(": ")[1].replace('mn', '').replace('s', '').split(' ');
            //console.log('mn: '+ mn);
            //console.log('s: '+ s);
            var delta_timer_pa = 1800 - (mn*60+s*1);
            //console.log('timer:' + delta_timer_pa);
            var missing_timer_pa_text = missing_timer_pa - delta_timer_pa;
            //console.log('full timer:' + missing_timer_pa_text);
            //console.log('full timer:' + convert_to_hms(missing_timer_pa_text));
            comptarebour3.querySelector('center').innerText = convert_to_hms(missing_timer_pa_text, true, false, [":", "", ""]);
            comptarebour3.title = convert_to_date(missing_timer_pa_text);
        }
        //console.log("marchands: ", window.top.frames[4].frames[1].document.querySelector('.list_detect'));
        //fdetect = window.top.document.getElementsByName('detec')[0].contentDocument.getElementsByName('frame_detect')[0];
        //list = fdetect.contentDocument.getElementsByClassName('list_detect');
        //new_list=[...list[0].children].sort((a,b)=>{return a.getElementsByClassName('LevelDetection')[0].innerText*1>b.getElementsByClassName('LevelDetection')[0].innerText*1?1:-1});
        //while (list[0].hasChildNodes()) {list[0].removeChild(list[0].firstChild);}
        //new_list.forEach((el)=>{list[0].appendChild(el)})
    }, 1000);

    window.setTimeout(()=>{window.top.frames[3].document.querySelectorAll('div[class*="pub"]').forEach((elem)=>{elem.remove()})},5000);
    window.setTimeout(()=>{window.top.frames[4].document.querySelectorAll('div[class*="pub"]').forEach((elem)=>{elem.remove()})},5000);
})();
