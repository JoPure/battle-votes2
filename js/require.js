/**
 * Created by karl.zheng on 2016/4/14.
 */
var url = "http://10.10.18.114:7400";
//var url = "http://54.255.175.55:8680"
var version = "v3";
var client_id = 1493751474262935;
var redirect_uri = "http://10.10.18.112:3000/index.html";
//var redirect_uri = "http://wsgth.pocketgamesol.com/votes/";
var queryURL = url+"/act/vote/bubbled/query";
var commentSaveURL = url+"/message/save";
var commentGetURL = url+"/message/get";
var voteURL = url + "/act/vote/bubbled/doVote";
var actNum = 6;
var flag = true;
var myTimer;
var groups;
var groupIndex;
var objectIndex;
var voteIndex;

var acts =["100022","100023","100024","100025","100026"];


function init(){
    if(localStorage.username!=""&&localStorage.token!=""){
        var active = new Date().getTime();
        active -= 1800000;
        if(active < parseInt(localStorage.activetime)){
            var charLen = localStorage.username.length;
            var length = charLen>11?charLen*14:111;
            $(".login").css("width",length+"px");
            var length2 = length + 141;
            $(".panel").css("width",length2+"px");
            $(".login p").text(localStorage.username);
        }else{
            localStorage.username = "";
            localStorage.token = "";
        }
    }

    if(localStorage.FBlogin==1){
        localStorage.FBlogin = 0;
        checkFBCallback();
    }

    /**************************************/
    localStorage.actId = 0;
    localStorage.currentStage = 0;
    localStorage.totalSize = 0;
    localStorage.pageIndex = 0;
    setActId(1);
}

$(function(){
   $(".signIn").click(function(){
       var random = Math.random()*1000;
       var loginURL = "https://www.facebook.com/v2.2/dialog/oauth?client_id=" + client_id
           + "&redirect_uri=" +encodeURIComponent(redirect_uri) + "&r=" + random;
        $(this).attr("disabled","disabled");
       localStorage.FBlogin = 1;
       window.location.href = loginURL;
   });

   $(".logout").click(function(){
       localStorage.token = "";
       localStorage.username = "";
       window.location.href = redirect_uri;
   }) ;

    $(".vote").click(function(){

        if(localStorage.currentStage<localStorage.stage){
            $(".message1").css("display","none");
            $(".message2").css("display","block");
        }else{
            var objId;
            var index;

            groups = JSON.parse(localStorage.getItem("groups"));
            if(localStorage.stage==1||localStorage.stage==2){
                if(localStorage.currentGroup == (localStorage.group-1)){
                    index = $(this).parent().parent().index();
                    voteIndex = index;
                    index += 18*(localStorage.currentPage-1);
                    var obj = groups[localStorage.currentGroup].objects;
                    objId = obj[index].id;
                    groupIndex = localStorage.currentGroup;
                    objectIndex = index;
                    localStorage.objId = objId;
                    vote(objId);

                }else{
                    $(".message1").css("display","none");
                    $(".message2").css("display","block");
                }
            }
            else{
                var val = parseFloat($(this).attr("id"));
                //record
                voteIndex = val;

                if(val <= 8&&localStorage.actId==3) {
                    var a = val/2;
                    index = Math.ceil(a) - 1;
                    localStorage.group = Math.ceil(a);
                    obj = groups[index].objects;
                    var temp = (val+1)%2;
                    objId = obj[temp].id;
                    //record
                    groupIndex = index;
                    objectIndex = temp;
                    localStorage.objId = objId;
                    vote(objId);
                }else if(val > 8 &&val <= 12&& localStorage.actId == 4){
                    val = (val-8);
                    var a = val/2;
                    index = Math.ceil(a)-1;
                    localStorage.group = Math.ceil(a);
                    obj = groups[index].objects;
                    temp = (val+1)%2;
                    objId = obj[temp].id;
                    //record
                    groupIndex = index;
                    objectIndex = temp;
                    localStorage.objId = objId;
                    vote(objId);
                }else if(val > 12&&localStorage.actId==5){
                    index = (val+1)%2;
                    localStorage.group = 1;
                    obj = groups[0].objects;
                    objId = obj[index].id;
                    //record
                    groupIndex = 0;
                    objectIndex = index;
                    localStorage.objId = objId;

                    vote(objId);
                }else{
                    $(".message1").css("display","none");
                    $(".message2").css("display","block");
                }
            }
        }

        var x = $(this).offset().left;
        var y = $(this).offset().top;
        $(".messageBox").css("top",y).css("left",x).fadeIn("slow").delay(500).fadeOut("slow");
    });


});

/*getParameterByName*/
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkFBCallback(){
    var FB_CODE = $.trim(this.getParameterByName("code"));
    if(FB_CODE=="")
    {
        return;
    }

    var fbURL = url+"/fb/login2";
    var requestURL = fbURL + "?code=" + FB_CODE + "&redirect_uri=" + redirect_uri
                 + "&version=" + version + "&client_id=" + client_id;

    $.ajax({
        type: "GET",
        url: requestURL,
        dataType: "jsonp",
        jsonp: "jsonCallback",

        success: function (result){
            if(result.code==200){
                var data = result.data;
                localStorage.token = data.token;
                localStorage.username = data.user.name;
                myTimer = new Date().getTime();
                localStorage.activetime = myTimer;
                var charLen = localStorage.username.length;
                var length = charLen>10?charLen*16:111;
                $(".login").css("width",length+"px");
                var length2 = length + 141;
                $(".panel").css("width",length2+"px");
                $(".login p").text(localStorage.username);

            }else{
                alert(msg[result.code]);
                console.log(result.code+result.message);
            }
        },

        error: function(err){
            alert(err);
        }
    })
}

function smallerThanNow(time){

        var date = Date.parse(time.replace(/-/g,"/"));

        var myDate = new Date();

        return myDate>date;
}

function setActId(num){
    $.ajax({
        type: "GET",
        url: queryURL,
        data:{
            actId: acts[num-1],
            sort: true,
            asc: false
        },
        dataType: "jsonp",
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                localStorage.startTime = result.data.startTime;
                localStorage.endTime = result.data.endTime;
                localStorage.actId = num;
                num += 1;
                if(num<actNum){
                    setActId(num);
                }else{
                    setStage();
                    commentQuery(true);
                }

            }else if(result.code == 106){
                setStage();
                if(num!=1)
                     commentQuery(true);
            }
            else{
                alert(msg[result.code]);
                console.log(result.code+result.message);
            }
        },

        error: function(err){
            alert(err);
        }
    })
}


function setStage(){
    if(localStorage.actId==0){
        localStorage.stage = 0;
        $(".scheduleBody li").css("cursor" ,"not-allowed").find("p").css("color","rgb(16,120,159)").siblings(".status").text("ยังไม่เริ่มกิจกรรม");
    }
    else if(localStorage.actId==6){
        localStorage.stage = 3;
        $(".scheduleBody li").css("cursor" ,"pointer").find("p").css("color","gray").siblings(".status").text("สิ้นสุดแล้ว");
        $(".stage3").trigger("click");
    }
    else{
        localStorage.stage = (localStorage.actId>2)?3:(localStorage.actId);

        var str = ".stage"+localStorage.stage;
        $(str).prevAll("li").css("cursor","pointer").find("p").css("color","gray").siblings(".status").text("สิ้นสุดแล้ว");

        if(smallerThanNow(localStorage.endTime)&&(localStorage.stage<3||localStorage.actId ==5)){
            $(str).css("cursor","pointer").find("p").css("color","gray").siblings(".status").text("สิ้นสุดแล้ว").trigger("click");
        }else{
            $(str).css("cursor","pointer").find("p").css("color","rgb(94,122,171)").siblings(".status").text("อยู่ในระหว่างกิจกรรม").trigger("click");
        }

        $(str).nextAll("li").css("cursor" ,"not-allowed").find("p").css("color","rgb(16,120,159)").siblings(".status").text("ยังไม่เริ่มกิจกรรม");
    }

}


function setGroups(){
    if(localStorage.currentStage==1){
        $.ajax({
            type: "GET",
            url: queryURL,
            async: false,
            data:{
                actId: acts[0],
                sort: true,
                asc: false
            },
            dataType: "jsonp",
            jsonp: "jsonCallback",

            success: function(result){
                if(result.code==200){
                    localStorage.setItem("startTime",result.data.startTime);
                    localStorage.setItem("endTime",result.data.endTime);
                    groups = result.data.groups;
                    groups = JSON.stringify(groups);
                    localStorage.setItem("groups",groups);
                }else{
                    alert(msg[result.code]);
                    console.log(result.code+result.message);
                }
            },

            complete: function(){
                if(localStorage.stage > localStorage.currentStage){
                    //$(".groups li").css("color","rgb(16,120,159)").css("cursor","pointer");
                    $(".groups li").css("color","gray").css("cursor","pointer");
                    $(".group1").trigger("click");
                    localStorage.group = 5;
                }
                else{
                    groups = JSON.parse(localStorage.getItem("groups"));
                    for(var x = 0; x < groups.length; x++){
                        var time = groups[x].endTime;
                        if(!smallerThanNow(time)){
                            localStorage.group = x+1;
                            break;
                        }
                    }

                    var str = ".group" + localStorage.group;
                    $(str).prevAll().css("color","gray").css("cursor","pointer");
                    $(str).css("color","rgb(94,122,171)").css("cursor","pointer").trigger("click");
                    $(str).nextAll().css("color","rgb(16,120,159)").css("cursor","not-allowed");
                }

            },

            error: function(err){
                alert(err);
            }
        });

    }else if(localStorage.currentStage==2){
        $.ajax({
            type: "GET",
            url: queryURL,
            async: false,
            data:{
                actId: acts[1],
                sort: true,
                asc: false
            },
            dataType: "jsonp",
            jsonp: "jsonCallback",

            success: function(result){
                if(result.code==200){
                    localStorage.setItem("startTime",result.data.startTime);
                    localStorage.setItem("endTime",result.data.endTime);
                    groups = result.data.groups;
                    groups = JSON.stringify(groups);
                    localStorage.setItem("groups",groups);
                }else{
                    alert(msg[result.code]);
                    console.log(result.code+result.message);
                }
            },

            complete: function(){
                $(".groups li:nth-child(n+2)").css("color","gray").css("cursor","not-allowed");

                if(localStorage.stage > localStorage.currentStage){
                    $(".group1").css("color","gray");
                }else{
                    $(".group1").css("color","rgb(94,122,171)");
                }
                localStorage.group = 1;
                $(".group1").css("cursor","pointer").trigger("click");
            },

            error: function(err){
                alert(err);
            }
        });


    }else{
        $.ajax({
            type: "GET",
            url: queryURL,
            data:{
                actId: acts[2],
                sort: false,
                asc: true
            },
            dataType: "jsonp",
            jsonp: "jsonCallback",

            success: function(result){
                if(result.code==200){
                    localStorage.setItem("startTime",result.data.startTime);
                    localStorage.setItem("endTime",result.data.endTime);
                    groups = result.data.groups;
                    groups = JSON.stringify(groups);
                    localStorage.setItem("groups",groups);
                }else{
                    alert(result.code+result.message);
                }
            },

            complete: function(){
                groups = JSON.parse(localStorage.getItem("groups"));

                for(var m = 0; m < groups.length; m++){
                    var objects = groups[m].objects;
                    for(var a=0;a<2;a++){
                        var n = m*2+a+1;
                        var str = ".top8-"+n;
                        var strHead = str + " .top8Head";
                        var strName = str + " .top8Name p";
                        var strNum = str + " .top8Num p";
                        $(strHead).css("background","url(head/"+objects[a].id+".png) center no-repeat");
                        $(strName).text(objects[a].name);
                        $(strNum).text(objects[a].count);
                    }
                }
            },

            error: function(err){
                alert(err);
            }
        });

        if(localStorage.actId>3){
            $.ajax({
                type: "GET",
                url: queryURL,
                async: false,
                data:{
                    actId: acts[3],
                    sort: false,
                    asc: true
                },
                dataType: "jsonp",
                jsonp: "jsonCallback",

                success: function(result){
                    if(result.code==200){
                        localStorage.setItem("startTime",result.data.startTime);
                        localStorage.setItem("endTime",result.data.endTime);
                        groups = result.data.groups;
                        groups = JSON.stringify(groups);
                        localStorage.setItem("groups",groups);
                    }else{
                        alert(msg[result.code]);
                        console.log(result.code+result.message);
                    }
                },

                complete: function(){
                        groups = JSON.parse(localStorage.getItem("groups"));

                        for(var m = 0; m < groups.length; m++){
                            var objects = groups[m].objects;
                            for(var a=0;a<2;a++){
                                var n = m*2+a+1;
                                var str = ".top4-"+n;
                                var strHead = str + " .top8Head";
                                var strName = str + " .top8Name p";
                                var strNum = str + " .top8Num p";
                                $(strHead).css("background","url(head/"+objects[a].id+".png) center no-repeat");
                                $(strName).text(objects[a].name);
                                $(strNum).text(objects[a].count);
                            }
                        }
                },

                error: function(err){
                    alert(err);
                }
            });


            if(localStorage.actId > 4){
                $.ajax({
                    type: "GET",
                    url: queryURL,
                    async: false,
                    data:{
                        actId: acts[4],
                        sort: false,
                        asc: true
                    },
                    dataType: "jsonp",
                    jsonp: "jsonCallback",

                    success: function(result){
                        if(result.code==200){
                            localStorage.setItem("startTime",result.data.startTime);
                            localStorage.setItem("endTime",result.data.endTime);
                            groups = result.data.groups;
                            groups = JSON.stringify(groups);
                            localStorage.setItem("groups",groups);
                        }else{
                            alert(msg[result.code]);
                            console.log(result.code+result.message);
                        }
                    },

                    complete: function(){
                            groups = JSON.parse(localStorage.getItem("groups"));

                            for(var m = 0; m < groups.length; m++){
                                var objects = groups[m].objects;
                                for(var a=0;a<2;a++){
                                    var n = m*2+a+1;
                                    var str = ".top2-"+n;
                                    var strHead = str + " .top8Head";
                                    var strName = str + " .top8Name p";
                                    var strNum = str + " .top8Num p";
                                    $(strHead).css("background","url(head/"+objects[a].id+".png) center no-repeat");
                                    $(strName).text(objects[a].name);
                                    $(strNum).text(objects[a].count);
                                }
                            }

                            if(smallerThanNow(localStorage.endTime)){
                                //var objects2 = groups[0].objects;
                                //var win;
                                //if(objects2[0].count>objects2[1].count){
                                //    win = 0;
                                //}else{
                                //    win =1;
                                //}
                                $(".championBody").css("background","url(head/champion.png) rgb(0,63,154) center no-repeat");
                                //$(".championBody").css("background","url(head/"+objects[win].id+".png) rgb(0,63,154) center no-repeat");
                            }
                    },

                    error: function(err){
                        alert(err);
                    }
                });
            }
        }
    }

}


function commentQuery(flag){
    $.ajax({
        type: "GET",
        url: commentGetURL,
        data:{
            actId: acts[localStorage.actId-1],
            totalSize: 0,
            pageSize: 10,
            pageIndex: localStorage.pageIndex
        },
        dataType: "jsonp",
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                var data = result.data;
                localStorage.totalSize = data.totalSize;
                var str = localStorage.totalSize + " Comments";
                $(".commentsNum").text(str);

                for(var i=0;i<data.list.length;i++){
                    if(flag){
                        var msg = "<li><div class='commentsHead'></div><div class='userInformation'><p class='commentsName'></p><p class='commentsTime'></p></div><p class='commentsMessage'></p></li>"
                        $(".commentsContent").append(msg);
                    }

                    var k = parseInt(localStorage.pageIndex)*10+i+1;
                    var str2 = ".commentsContent li:nth-child("+k+")";
                    var headStr = str2 +" .commentsHead";
                    var informationName = str2 + " .userInformation .commentsName";
                    var informationTime = str2 + " .userInformation .commentsTime";
                    var messageStr = str2 + " .commentsMessage";

                    var index2 = data.list.length - i -1;
                    var head = data.list[index2].pictureUrl;
                    $(headStr).css("background","url("+head+")");
                    $(informationName).text(data.list[index2].userId);
                    $(informationTime).text(" • "+data.list[index2].createTime);
                    $(messageStr).text(data.list[index2].message);
                }

            }else{
                alert(msg[result.code]);
                console.log(result.code+result.message);
            }
        },

        complete: function(){
          flag = true;
        },

        error: function(err){
            alert(err);
        }
    });
}

function vote(objId){
    $.ajax({
        type: "GET",
        url: voteURL,
        async: false,
        data:{
            token: localStorage.token,
            actId: acts[localStorage.actId-1],
            groupIndex: localStorage.group,
            objectId: objId
        },
        dataType: "jsonp",
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                $(".message1").css("display","block");
                $(".message2").css("display","none");

                var data = JSON.stringify(result);
                localStorage.setItem("data",data);
                var num = result.data[localStorage.objId];
                groups = JSON.parse(localStorage.getItem("groups"));
                groups[groupIndex].objects[objectIndex].count = num;
                groups = JSON.stringify(groups);
                localStorage.setItem("groups",groups);

                if(localStorage.currentStage==1||localStorage.currentStage==2){
                    voteIndex+=1;
                    var str = ".mainArea li:nth-child("+voteIndex+")";
                    var numStr = str+" .information .voteNum p";
                    $(numStr).text(num);
                }else if(localStorage.currentStage==3){
                    var str2 = "#"+voteIndex;
                    $(str2).prev(".top8Num").find("p").text(num);
                }

            }else{
                alert(msg[result.code]);
                console.log(result.code+result.message);
                $(".message1").css("display","none");
                $(".message2").css("display","block");
                if(result.code==403){
                    $(".login").trigger("click");
                }
            }
        },

        complete: function(){
            flag = true;
        },

        error: function(err){
            alert(err);
        }
    });
}


var msg = {
    "100": "ไม่มีกิจกรรมนี้",
    "101": "เงื่อนไขกิจกรรมไม่พอ",
    "102": "เงื่อนไขกิจกรรมไม่พอหรือจำนวนลงคะแนนใช้หมดแล้ว",
    "103": "สำเร็จแล้ว",
    "104": "รางวัลcodeไม่พอแล้ว",
    "105": "กิจกรรมนี้ไม่มีรางวัล",
    "106": "กิจกรรมยังไม่เริ่มต้น",
    "107": "กิจกรรมสิ้นสุดแล้ว",
    "108": "ปัญชีนี้ได้voteไปแล้ว",
    "109": "ลงคะแนนได้เพียง2ภาพเท่านั้น",
    "150": "ไม่มี APP",
    "160": "ไม่มีเซิร์ฟนี้",
    "170": "หาปัญชีFBนี้ไม่เจอ",
    "201": "ไม่มีข้อมูล",
    "300": " เชื่อมติดด่อล้มเหลว",
    "301": "บัญชีหรือรหัสไม่ถูกต้อง รบกวนตรวจเช็คอีกครั้ง หรือไปโหลดเกมส์แล้วลองบัญชีของเกมเรา",
    "400": "บัญชีหรือรหัสไม่สามารถว่าง",
    "401": "version error",
    "403": "ยังไม่ล็อกอิน",
    "500": "เซิร์ฟเวอร์ล้มเหลว",
    "600": "ไม่มีsession",
    "700": "ผู้เล่นไม่ได้ใช้ APPนี้"
}