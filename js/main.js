/**
 * Created by karl.zheng on 2016/4/11.
 */
$(function(){
    $(".stage1").click(function(){
            if(localStorage.stage>=1){
                localStorage.currentStage = 1;
                localStorage.currentPage = 1;
                $(".votingArea1").css("display","block");
                $(".votingArea2").css("display","none");
                setGroups();
            }
    });

    $(".stage2").click(function(){
        if(localStorage.stage >= 2){
            localStorage.currentStage = 2;
            localStorage.currentPage = 1;
            $(".votingArea1").css("display","block");
            $(".votingArea2").css("display","none");
            setGroups();
        }
    });

    $(".stage3").click(function(){
        if(localStorage.stage==3){
            localStorage.currentStage = 3;
            $(".votingArea1").css("display","none");
            $(".votingArea2").css("display","block");
            setGroups();
        }
    });


    //login model
    $(".panel").hover(function(){
       $(".login").css("border-bottom-right-radius", 0);
        $(".separator").animate({width:10}).css("display","block");
        $(".logout").animate({width:111}).css("display","block");
    },function(){
        $(".login").css("border-bottom-right-radius", 10);
        $(".separator").animate({width:0}).css("display","none");
        $(".logout").animate({width:0}).css("display","none");
    });

    //wrap
    $(".close").click(function(){
        $(".wrap").css("display","none");
    });

    $(".login").click(function(){
       $(".wrap").css("display","block");
    });



    $(".discussionContent textarea").focus(function(){
        $(this).css("height","100").css("background","white");
        $(".post").css("display","block");
        $(".discussionContent").css("height","120").css("background-image",'url(img/discussionBg2.png)');

    });

    $(".post button").click(function(){
        var message = $(".discussionContent textarea").val();
        $.ajax({
            type: "GET",
            url: commentSaveURL,
            data:{
                actId: acts[localStorage.actId-1],
                token: localStorage.token,
                message: message
            },
            dataType: "jsonp",
            jsonp: "jsonCallback",

            success: function(result){
                if(result.code==200){
                    localStorage.pageIndex = 0;
                    $(".commentsContent li").remove();
                    commentQuery(true);
                }else{
                    alert(msg[result.code]);
                    console.log(result.code+result.message);
                    if(result.code==403){
                        $(".login").trigger("click");
                    }
                }
            },

            error: function(err){
                alert(err);
            }
        });

        $(".discussionContent textarea").val("").css("height","20").css("background"," rgb(226,231,234)");
        $(".post").css("display","none");
        $(".discussionContent").css("height","52").css("background-image",'url(img/discussionBg.png)');
    });

    $(".loadComments").click(function(){
        var index = parseInt(localStorage.pageIndex);
        index+=1;
        localStorage.pageIndex = index;
        commentQuery(true);

    });


    $(".groups li").click(function(){
        var index = $(this).index();
        if(localStorage.actId!=0&&index < localStorage.group){
            localStorage.currentGroup = index;
            var temp = JSON.parse(localStorage.getItem("groups"));
            var tempObj = temp[localStorage.currentGroup].objects;
            var len = Math.ceil(tempObj.length / 18);
            var pages = (localStorage.currentStage==1)?len:1;


            $.jqPaginator('.pagination', {
                totalPages: pages,
                visiblePages: pages,
                currentPage: 1,
                prev: '<li class="prev"><a href="javascript:;">ก่อนหน้า</a></li>',
                next: '<li class="next"><a href="javascript:;">ถัดไป</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num, type) {
                    localStorage.currentPage = num;
                    $(".mainArea li").css("display","block");
                    var index = localStorage.currentGroup;
                    var obj =JSON.parse(localStorage.getItem("groups"));
                    var objects = obj[index].objects;
                    var y,z;
                    for(y = 1,z=(num-1)*18+1; y <= 18&&z<=objects.length; y++,z++)
                    {
                        var str = ".mainArea li:nth-child("+y+")";
                        var headStr = str+"  .headBg .head";
                        var nameStr = str+" .information .name";
                        var numStr = str+" .information .voteNum p";
                        $(headStr).css("background","url(head/"+objects[z-1].id+".png) center no-repeat");
                        $(nameStr).text(objects[z-1].name);
                        $(numStr).text(objects[z-1].count);
                    }
                    var str2 = ".mainArea li:nth-child(n+"+y+")";
                    $(str2).css("display","none");
                }
            });
        }

    });
});




