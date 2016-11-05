// ==UserScript==
// @name		6V评分强化器
// @name:en		neu6ratehelper
// @namespace	https://github.com/popcorner/neu6ratehelper
// @description	ratehelper
// @version		1.0.0
// @author		popcorner
// @grant		unsafeWindow
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @include		http://bt.neu6.edu.cn/thread*
// @include		http://bt.neu6.edu.cn/forum.php?mod=viewthread*
// @require		http://bt.neu6.edu.cn/static/js/mobile/jquery-1.8.3.min.js
// @icon		http://bt.neu6.edu.cn/favicon.ico
// @updateURL	none
// @downloadURL	none
// @supportURL	http://bt.neu6.edu.cn/thread-1562575-1-1.html
// ==/UserScript==

var jq = jQuery.noConflict();
jq('#mn_N04e2_menu').append('<li><a id="pfsettings" hidefocus="true" style="color: purple;cursor:pointer">\u8bc4\u5206\u8bbe\u7f6e</a></li>');
jq('#pfsettings').click(function(){
    var pfhtml = '<h3 class="flb"><em id="return_reply">\u8bc4\u5206\u8bbe\u7f6e</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'pfst\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div style="width:580px;height:300px;">'+
        '<div class="c" style="height:247px;"><label><input type="checkbox" id="setnewstyle">\u4f7f\u7528\u65b0\u6837\u5f0f</label><label><input type="checkbox" id="setnotify">\u901a\u77e5\u4f5c\u8005\uff08\u8d85\u7248\u4ee5\u4e0a\u53ef\u7528\uff09'+
        '</label><p>\u8bbe\u7f6e\u7406\u7531</p><textarea id="setreason"></textarea><p>\u8bbe\u7f6e\u6d6e\u4e91\u8bc4\u5206</p><textarea id="setoption2"></textarea><p>\u8bbe\u7f6e\u8d21\u732e\u8bc4\u5206</p><textarea id="setoption5"></textarea></div>'+
        '<div class="o"><button id="submitset">\u4fdd\u5b58\u8bbe\u7f6e</button>&nbsp;<button id="submitdelete">\u6e05\u7a7a\u8bbe\u7f6e</button></div></div><style>.c textarea{resize:both}</style>';
    showWindow('pfst',pfhtml,'html');
    jq('#setnewstyle').prop('checked',GM_getValue('setnewstyle'));
    jq('#setnotify').prop('checked',GM_getValue('setnotify'));
    jq('#setreason').val(tencode(GM_getValue('setreason')));
    jq('#setoption2').val(tencode(GM_getValue('setoption2')));
    jq('#setoption5').val(tencode(GM_getValue('setoption5')));
    jq('#submitset').click(function(){
        GM_setValue('setnewstyle',jq('#setnewstyle').prop('checked'));
        GM_setValue('setnotify',jq('#setnotify').prop('checked'));
        GM_setValue('setreason',tparse(jq('#setreason').val()));
        GM_setValue('setoption2',tparse(jq('#setoption2').val()));
        GM_setValue('setoption5',tparse(jq('#setoption5').val()));
        hideWindow('pfst');
    });
    jq('#submitdelete').click(function(){
        GM_deleteValue('setnewstyle');
        GM_deleteValue('setnotify');
        GM_deleteValue('setreason');
        GM_deleteValue('setoption2');
        GM_deleteValue('setoption5');
        hideWindow('pfst');
    });
});
jq('.pob>p>a').each(function(){
    if(jq(this).html()=='\u8bc4\u5206') {
        jq(this).attr('ratepid',jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
        jq(this).removeAttr('onclick');
        jq(this).click(function(){openRate(this);});
    }
});
jq('#ak_rate').each(function(){
    jq(this).attr('ratepid',jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
    jq(this).removeAttr('onclick');
    jq(this).click(function(){openRate(this);});
});
function openRate(target) {
    var postget = function(){
        var ratehtml = jq('#fwin_temp_rate').html();
        jq('#fwin_temp_r').remove();
        showWindow('rate',ratehtml,'html');
        if(GM_getValue('setoption2')) {
            jq('#scoreoption2').html('<li>'+JSON.parse(GM_getValue('setoption2')).join('</li><li>')+'</li>');
        }
        if(GM_getValue('setoption5')) {
            jq('#scoreoption5').html('<li>'+JSON.parse(GM_getValue('setoption5')).join('</li><li>')+'</li>');
        }
        var reasonselector;
        if(GM_getValue('setreason')) {
            reasonselector = '<li>'+JSON.parse(GM_getValue('setreason')).join('</li><li>')+'</li>';
        } else {
            reasonselector = jq('#reasonselect').html();
        }
        if(GM_getValue('setnewstyle')) {
            var newstylehtml = '<h4 style="width:auto"><a onclick="showselect(this, \'reason\', \'reasonselect\')" class="dpbtn y" href="javascript:;">^</a>\u53ef\u9009\u8bc4\u5206\u7406\u7531:</h4><p class="reason_slct"><textarea name="reason"'+
                ' id="reason" class="pt" onkeyup="seditor_ctlent(event, \'$(\\\'modsubmit\\\').click()\')"></textarea></p><ul id="reasonselect" style="display: none">'+ reasonselector +'</ul>';
            jq('#rateform>.c>.tpclg').html(newstylehtml);
        } else if(GM_getValue('setreason')) {
            jq('#reasonselect').html(reasonselector);
        }
        if(GM_getValue('setnotify')) {
            jq('#sendreasonpm').prop('checked',true);
        }
    };
    jq('#append_parent').append('<div id="fwin_temp_r" style="display:none"><div id="fwin_temp_rate"></div></div>');
    ajaxget('forum.php?mod=misc&action=rate&tid='+tid+'&pid='+jq(target).attr('ratepid')+'&infloat=yes&handlekey=rate'+'&t='+(+ new Date()), 'fwin_temp_rate', null, '', '', function() {postget();});
    loadingst = setTimeout(function() {showDialog('', 'info', '<img src="' + IMGDIR + '/loading.gif"> \u8bf7\u7a0d\u5019...');}, 500);
}
function tparse(input) {
    if(input.trim()) {
        return JSON.stringify(input.trim().replace(/(\r)/g,'').split('\n'));
    } else {
        return '';
    }
}
function tencode(input) {
    return input?(JSON.parse(input).join('\n')):'';
}
