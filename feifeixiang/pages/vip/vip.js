const host = require('../../config.js').service.host
const getuserinfo_url = require('../../config.js').service.getuserinfo_url
var uid = ""
var isTiefen = ''
var name = ""
var nickname = ""
var moblie = ""
var cache = "0 KB"
/*  {
 src: "https://"+host+"/data/upload/huiyuanzhongxin/2x/yaoqinghongbao.png",
 text: '邀请红包',
 url: '../invite/invite'
 },
 */
var arrayData = [{
    src: "https://"+host+"/data/upload/huiyuanzhongxin/2x/haopinghongbao.png",
    text: '好评红包',
    url: ""
}, {
    src: "https://"+host+"/data/upload/huiyuanzhongxin/2x/wanshanhongbao.png",
    text: '完善红包',
    url: ""
}, {
    src:"https://"+host+"/data/upload/huiyuanzhongxin/2x/zhuanfahongbao.png",
    text: '分享红包',
    url: ""
}]
var arrayData2 = [{
    id: 0,
    num: '0',
    text: '可用红包'
},{
    id: 1,
    num: '0',
    text: '账户余额'
}]
Page({
    data: {
        tuichu:"",
        loginText:"立即登录",
        zhuanfaText: "转发红包",
        hideCube: 'hideCube',
        phone: '400-181-6261',
        shareSrc: "https://"+host+"/data/upload/order/share-img.png",
        src:"https://"+host+"/data/upload/huiyuanzhongxin/2x/top.png",
        src2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
        src3:"https://"+host+"/data/upload/huiyuanzhongxin/2x/back.png",
        src4:"https://"+host+"/data/upload/huiyuanzhongxin/2x/jiantou_icon.png",
        icon2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/yaoqingyouli_icon.png",
        icon3:"https://"+host+"/data/upload/huiyuanzhongxin/2x/haopingyouli_icon.png",
        icon4:"https://"+host+"/data/upload/huiyuanzhongxin/2x/cooperation@2x.png",
        icon5:"https://"+host+"/data/upload/huiyuanzhongxin/2x/qingchuhuancun_icon.png",
        icon6:"https://"+host+"/data/upload/huiyuanzhongxin/2x/about us@2x.png",
        icon7:"https://"+host+"/data/upload/huiyuanzhongxin/2x/contect@2x.png",
        icon8:"https://"+host+"/data/upload/huiyuanzhongxin/2x/shiyongxuzhi@2x.png",
        icon_1:"https://"+host+"/data/upload/huiyuanzhongxin/2x/602640-200@2x.png",
        icon_2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/collect@2x.png",
        icon_3:"https://"+host+"/data/upload/huiyuanzhongxin/2x/red package@2x.png",
        icon_4:"https://"+host+"/data/upload/huiyuanzhongxin/2x/chengzhangjilu@2x.png",
        cache: cache,
        userInfo: {},
        array: arrayData,
        array2: arrayData2
    },
    login: function() {
        uid = wx.getStorageSync('uid');
        if(uid!=""&&uid!=null&&uid!=undefined){
            wx.navigateTo({
                url: '../info/info'
            })
        }else{
            wx.navigateTo({
                url: '../login/login'
            })
        }
    }, recharge:function () {
        wx.navigateTo({
            url: '../recharge/recharge?yue='+this.data.array2[1].num
        })
    }, logout: function() {
        var that = this
        wx.showModal({
            content: '退出后您将看不到您的订单和个人信息,确定退出吗?',
            success: function(res) {
                if (res.confirm) {
                    //清除登陆缓存
                    try {
                        wx.clearStorageSync()
                        that.setData({
                            tuichu: "",
                            loginText:"立即登录",
                            src2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
                            'array2[0].num': 0,
                            'array2[1].num': 0
                        })
                        that.onShow()
                    } catch (e) {
                        //退出失败
                        wx.showToast({
                            title: '退出失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                    }
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    onLoad: function () {
        var that = this
        uid = wx.getStorageSync('uid')
        isTiefen = wx.getStorageSync('isTiefen')
        name = wx.getStorageSync('name')
        var isPartner = wx.getStorageSync('isPartner')
        that.setData({
            isPartner: isPartner
        })

        if(uid!=""&&uid!=null&&uid!=undefined){
            that.setData({
                hideCube: ''
            })
            wx.request({
                url: getuserinfo_url,
                data: {
                    uid: uid
                },
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var error_code = res.data.error_code
                    if (error_code == '0') {
                        var pj_red = res.data.pj_red||""
                        var wsgrxx_red = res.data.wsgrxx_red||""
                        var forward_red = res.data.forward_red||""
                        that.setData({
                            tuichu: "退出",
                            loginText: res.data.nickname,
                            'array2[0].num': res.data.red,
                            'array2[1].num': res.data.money,
                             src2: res.data.photo,
                            'array[0].url': '../haoping/haoping?pj_red='+pj_red,
                            'array[1].url': '../wanshan/wanshan?wsgrxx_red='+wsgrxx_red,
                            'array[2].url': '../zhuanfa/zhuanfa?forward_red='+forward_red
                        })
                        if(res.data.wanshanred){
                            that.setData({
                                wanshanText: '修改个人信息'
                            })
                        }else{
                            that.setData({
                                wanshanText: '完善个人信息,有红包奖励哦!'
                            })
                        }
                        isTiefen = res.data.isTiefen
                        wx.setStorageSync('name', res.data.nickname)
                        wx.setStorageSync('isTiefen', isTiefen)
                        wx.setStorageSync('isPartner', res.data.isPartner)
                        if(isTiefen == true||isTiefen == 'true'){
                            wx.setStorageSync('viptime', res.data.viptime)
                        }else{
                            wx.removeStorageSync('viptime')
                        }
                        that.setData({
                            hideCube: 'hideCube'
                        })
                    } else {
                        that.setData({
                            hideCube: 'hideCube'
                        })
                        wx.showToast({
                            title: '获取信息失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                    }
                }, fail: function (err) {
                    that.setData({
                        hideCube: 'hideCube'
                    })
                    wx.showToast({
                        title: '服务器异常!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                    console.log(err)
                }, complete: function () {
                    wx.hideLoading();
                    wx.stopPullDownRefresh()
                }
            })
        }
       /* //设置缓存
        wx.getStorageInfo({
            success: function(res) {
                cache = res.currentSize
                cache = cache > 999 ? (cache/1024).toFixed(2)+" MB" : cache+" KB"
                that.setData({
                    cache : cache
                })
            }
        })*/
        // var that = this
        // //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo){
        //     //更新数据
        //     that.setData({
        //         userInfo:userInfo
        //     })
        // })
    }, onShow:function () {
        uid = wx.getStorageSync('uid')
        if(uid==""||uid==null||uid==undefined){
            wx.showModal({
                title: '提示',
                content: '查看个人中心需要先登录,立即登录?',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../login/login'
                        })
                    }else{
                        wx.switchTab({
                            url: '../index/index'
                        })
                    }
                }
            })
        }
    }, onPullDownRefresh: function () {
        wx.showLoading({
            title: '页面刷新中...',
            mask: true
        })
        this.onLoad()
    }, onReady:function () {


    }, wanshan: function () {
        if(uid!=""&&uid!=null&&uid!=undefined){
            wx.navigateTo({
                url: '../info/info'
            })
        }else{
            wx.navigateTo({
                url: '../login/login'
            })
        }
    }, kefu: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    }, clear: function () {
        var that = this
        try {
            wx.clearStorageSync()
            wx.setStorageSync('uid', uid);
            wx.setStorageSync('isTiefen', isTiefen);
            wx.setStorageSync('name', name)
            wx.showToast({
                title: '缓存已清空!',
                mask: true
            })
            wx.getStorageInfo({
                success: function(res) {
                    cache = res.currentSize
                    cache = cache > 999 ? (cache/1024).toFixed(2)+" MB" : cache+" KB"
                    that.setData({
                        cache : cache
                    })
                }
            })
        } catch(e) {
            console.log(e)
            wx.showToast({
                title: '缓存清空失败!',
                mask: true,
                image: '../../images/warn.png'
            })
        }

    }, chakan: function () {
        wx.navigateTo({
            url: '../allorder/allorder'
        })
    }
})
