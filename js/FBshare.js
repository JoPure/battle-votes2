window.fbAsyncInit = function () {
    FB.init({
        appId: '1493751474262935',
        xfbml: true,
        version: 'v2.4'
    });
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


$(".share").on("click", function () {
    if (localStorage.token!="") {
        FB.ui({
            method: 'feed',
            link:  redirect_uri, 
            picture: 'http://wsgth.pocketgamesol.com/votes/img/share.png',
            name: 'Warship GirlsR TH',
            description: 'การลงคะแนนเลือกตัวละครWatship GirlsRครั้งที่1เริ่มขึ้นอย่างเป็นทางการแล้ว ตัวละครสาวกว่า200ตัวได้เข้าร่วมกิจกรรมนี้ และทุกวันจะมีตัวละครไม่ซ้ำกันมาให้ลงคะแนน ผู้การรีบมาช่วยลงคะแนนให้สาวเรือรบในดวงใจกันเถอะ!',
            caption: 'ถึงเวลาที่ผู้การต้องออกมาโหวตสาวเรือรบที่ชอบแล้ว',
            message: 'ถึงเวลาที่ผู้การต้องออกมาโหวตสาวเรือรบที่ชอบแล้ว'
        }, function friendShare(response) {
            console.log('response:', response);
        });
    }else{
        alert("ยังไม่ล็อกอิน");
        $(".login").trigger("click");
    }
});
