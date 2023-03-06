// ==UserScript==
// @name         Talent Extract
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hotslogs.com/sitewide/talentdetails*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotslogs.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // START SELECTORS
    const hero_sel = 'span.mat-mdc-select-min-line';
    const navbar_sel = 'ul#nav1';
    const talent_table_sel = '//table[not(@role)][@*[starts-with(name(), "_ngcontent")]]';
    const hdr_row_sel = 'tr.rgGroupHeader';
    const talent_rows_sel = 'tr.rgRow,tr.rgAltRow';
    const already_active_sel = talent_table_sel + '//tr[contains(@style,"contents")]';
    // END SELECTORS

    var getElementByXpath = (xpath)=>{
        return new XPathEvaluator()
            .createExpression(xpath)
            .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
            .singleNodeValue
    }

    var observer = new MutationObserver(function(mutations) {
        const a_talent = document.querySelector('a#a_talent');
        const app_talent = getElementByXpath('//app-talent-builds');
        //console.log('a_talent:', a_talent);
        if(a_talent == null && app_talent != null){
            var active = false;
            var paliers = [];
            var navbar = document.querySelector(navbar_sel);
            var first_li = navbar.querySelectorAll('li')[0];
            var copy_li = first_li.cloneNode(false);
            var copy_div = null;
            copy_li.setAttribute('class', null);
            copy_li.innerHTML = '<a id="a_talent">Best Talents</a>';
            first_li.after(copy_li);
            document.getElementById('a_talent').addEventListener (
                "click", ()=>{
                    var hero = "";
                    if(document.querySelectorAll(hero_sel).length > 0){
                        hero = document.querySelectorAll(hero_sel)[1].innerText;
                    }
                    console.log('hero:'+ hero);
                    switch(hero){
                        case 'Abathur':
                            //4-3-3-2-3-4-4
                            paliers = [[0,1,2,3],[4,5,6],[7,8,9],[10,11],[12,13,14],[15,16,17,18],[19,20,21,22]];
                            break;
                        case 'Chen':
                        case 'Junkrat':
                            //3-3-3-2-4-3-4
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13,14],[15,16,17],[18,19,20,21]];
                            break;
                        case 'Gul\'dan':
                            //3-3-3-2-4-3-3
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13,14],[15,16,17],[18,19,20]];
                            break;
                        case 'Lunara':
                            //3-3-3-2-4-4-4
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13,14],[15,16,17,18],[19,20,21,22]];
                            break;
                        case 'Valeera':
                            //4-4-3-4-3-4
                            paliers = [[0,1,2,3],[4,5,6,7],[8,9,10],[11,12,13,14],[16,17,18],[19,20,21,22]];
                            break;
                        case 'Maiev':
                        case 'Deathwing':
                            //3-3-3-2-3-3-3
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13],[14,15,16],[17,18,19]];
                            break;
                        case 'Kharazim':
                        case 'Thrall':
                            //3-3-3-2-3-3-5
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13],[14,15,16],[17,18,19,20,21]];
                            break;
                        default:
                            //3-3-3-2-3-3-4
                            paliers = [[0,1,2],[3,4,5],[6,7,8],[9,10],[11,12,13],[14,15,16],[17,18,19,20]];
                    }
                    console.log("hero_type: " + JSON.stringify(paliers.map((a)=> {return a.length})));
                    active = !active;
                    //console.log("active changed: "+active);
                    var talent_table = getElementByXpath(talent_table_sel);
                    var hdr_row = talent_table.querySelectorAll(hdr_row_sel);
                    var talent_rows = talent_table.querySelectorAll(talent_rows_sel);
                    // Test if page changed and button was active in previous page
                    var is_already_active = getElementByXpath(already_active_sel) != null;
                    if(!active && !is_already_active){
                        active = true;
                    }
                    if(active){
                        const div = document.createElement('div');
                        div.style.position = "relative";
                        div.style.display = "inline";
                        div.style.fontWeight = "bold";
                        div.style.fontSize = "larger";
                        //div.style.top = '-35px';
                        //div.style.left = '15px';

                        talent_rows.forEach((el, idx)=>{
                            el.style.display = 'none';
                        });
                        hdr_row.forEach((el, index)=>{
                            //console.log("index", index);
                            var percents = [];
                            //console.log(paliers[index].length);
                            for(var i=0;i<paliers[index].length;i++){
                                //console.log(paliers[index][i]);
                                copy_div = div.cloneNode(false);
                                copy_div.setAttribute('id', 'talent_'+paliers[index][i]);
                                percents.push(talent_rows[paliers[index][i]].querySelectorAll('td')[4].innerText.replace(',', '.').replace('%', ''));
                            }
                            var max = Math.max(...percents).toFixed(1);
                            var idx = percents.indexOf(''+max);
                            //console.log("$$$", percents);
                            //console.log("$$$", max);
                            //console.log("$$$", idx);
                            //console.log("$$$", paliers[index][idx]);
                            copy_div.innerText = idx*1+1;
                            talent_rows[paliers[index][idx]].querySelectorAll('td')[1].appendChild(copy_div);
                            talent_rows[paliers[index][idx]].style.display='contents';
                        });
                    }else{
                        document.querySelectorAll('div[id*="talent_"]').forEach((el)=>{el.remove()});
                        talent_rows.forEach((el)=>{
                            el.style.display = null;
                        });
                    }
                }, false);
        }
    });

     // configuration of the observer:
    var config = {
        childList: true,
        subtree: true
    };
    // pass in the target node, as well as the observer options
    observer.observe(document.body, config);
})();
