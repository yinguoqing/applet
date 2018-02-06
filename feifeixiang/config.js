/**
 * 小程序配置文件
 */

//主机域名
var host = 'ffx.weiweitouzi.cn';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        // 请求路径
        // url: `https://${host}/xcx/index.php`,
        address_url: `https://${host}/xcx/address.php`,
        address_save_url: `https://${host}/xcx/address_save.php`,
        address_del_url: `https://${host}/xcx/address_del.php`,
        address_status_url: `https://${host}/xcx/address_status.php`,
        baochang_url: `https://${host}/xcx/baochang.php`,
        checkpartner_url: `https://${host}/xcx/checkpartner.php`,
        checktiefen_url: `https://${host}/xcx/checktiefen.php`,
        checkzhubo_url: `https://${host}/xcx/checkzhubo.php`,
        chengzhang_url: `https://${host}/xcx/chengzhang.php`,
        chuxingren_url: `https://${host}/xcx/chuxingren.php`,
        chuxingren_add_url: `https://${host}/xcx/chuxingren_add.php`,
        chuxingren_del_url: `https://${host}/xcx/chuxingren_del.php`,
        continuepay_url: `https://${host}/xcx/continuepay.php`,
        delorder_url: `https://${host}/xcx/delorder.php`,
        detail_url: `https://${host}/xcx/detail.php`,
        dianzan_url: `https://${host}/xcx/dianzan.php`,
        getallorder_url: `https://${host}/xcx/getallorder.php`,
        forget_url: `https://${host}/xcx/forget.php`,
        getorderinfo_url: `https://${host}/xcx/getorderinfo.php`,
        getptid_url: `https://${host}/xcx/getptid.php`,
        getrecharge_url: `https://${host}/xcx/getrecharge.php`,
        getsharered_url: `https://${host}/xcx/getsharered.php`,
        getshop_url: `https://${host}/xcx/getshop.php`,
        getuserinfo_url: `https://${host}/xcx/getuserinfo.php`,
        hbrecord_url: `https://${host}/xcx/hbrecord.php`,
        index_url: `https://${host}/xcx/index.php`,
        info_newphone_url: `https://${host}/xcx/info_newphone.php`,
        list_url: `https://${host}/xcx/list.php`,
        liuyan_url: `https://${host}/xcx/liuyan.php`,
        live_url: `https://${host}/xcx/live.php`,
        livelist_url: `https://${host}/xcx/livelist.php`,
        live_del_url: `https://${host}/xcx/live_del.php`,
        live_dianzan_url: `https://${host}/xcx/live_dianzan.php`,
        live_pinglun_url: `https://${host}/xcx/live_pinglun.php`,
        login_url: `https://${host}/xcx/login.php`,
        login_nickname_url: `https://${host}/xcx/login_nickname.php`,
        myshoucang_url: `https://${host}/xcx/myshoucang.php`,
        order_url: `https://${host}/xcx/order.php`,
        order_tea_url: `https://${host}/xcx/order_tea.php`,
        partner_url: `https://${host}/xcx/partner.php`,
        partner_fans_url: `https://${host}/xcx/partner_fans.php`,
        partner_info_url: `https://${host}/xcx/partner_info.php`,
        partner_shouyi_url: `https://${host}/xcx/partner_shouyi.php`,
        party_url: `https://${host}/xcx/party.php`,
        pay_url: `https://${host}/xcx/pay.php`,
        photo_url: `https://${host}/xcx/photo.php`,
        photo_delphoto_url: `https://${host}/xcx/photo_delphoto.php`,
        photo_pingjia_url: `https://${host}/xcx/photo_pingjia.php`,
        photo_uploadlive_url: `https://${host}/xcx/photo_uploadlive.php`,
        pingjia_url: `https://${host}/xcx/pingjia.php`,
        queren_url: `https://${host}/xcx/queren.php`,
        recharge_url: `https://${host}/xcx/recharge.php`,
        search_url: `https://${host}/xcx/search.php`,
        searchnear_url: `https://${host}/xcx/searchnear.php`,
        sendmsg_url: `https://${host}/xcx/sendmsg.php`,
        shoucang_url: `https://${host}/xcx/shoucang.php`,
        tiaokuan_url: `https://${host}/xcx/tiaokuan.php`,
        tiefen_url: `https://${host}/xcx/tiefen.php`,
        tuikuan_url: `https://${host}/xcx/tuikuan.php`,
        uploadlive_url: `https://${host}/xcx/uploadlive.php`,
        userdetail_url: `https://${host}/xcx/userdetail.php`,
        userdetail_save_url: `https://${host}/xcx/userdetail_save.php`,
        video_url: `https://${host}/xcx/video.php`,
        wxlogin_url: `https://${host}/xcx/wxlogin.php`,
        wxlogin_adduser_url: `https://${host}/xcx/wxlogin_adduser.php`,
        wxpay_url: `https://${host}/xcx/wxpay.php`,
        yewu_url: `https://${host}/xcx/yewu.php`,
        zanshang_url: `https://${host}/xcx/zanshang.php`,
        zbf_url: `https://${host}/xcx/zbf.php`,
        zuling_url: `https://${host}/xcx/zuling.php`
    }
};

module.exports = config;