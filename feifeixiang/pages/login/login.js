const getuserinfo_url = require('../../config.js').service.getuserinfo_url
var app = getApp()
Page({
    /*onShow: function () {
        //检测登录态
        wx.checkSession({
            success: function(e){
                //session 未过期，并且在本生命周期一直有效
                console.log(e)
            },
            fail: function(e){
                console.log("e")
                console.log(e)
            }
        })

    },*/
    onLoad: function (options) {
    },
    weixin: function () {
        var that = this
        that.setData({
            wxLoginFlag: true,
            disabled: true
        })

        app.getUserOpenId(function(err, openid, uid) {
            if (!err) {
                if(uid != ''&&uid != null&&uid != undefined){
                    wx.setStorageSync('uid',uid)
                    wx.setStorageSync('openid',openid)
                    var pages = getCurrentPages()
                    var j
                    for(var i=0;i<pages.length;i++){
                        //返回页面的路径
                        if(pages[i].route == "pages/vip/vip"){
                            j = i;
                            break;
                        }
                    }
                    if(j!=undefined){
                        pages[j].onLoad()
                    }
                    wx.navigateBack({
                        delta: 1
                    })
                    /*wx.reLaunch({
                     url: '../vip/vip'
                     })*/
                    /*var pages = getCurrentPages()
                    var j
                    for(var i=0;i<pages.length;i++){
                        //返回页面的路径
                        if(pages[i].route == "pages/vip/vip"){
                            j = i;
                            break;
                        }
                    }
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
                                if(j!=undefined){
                                    pages[j].setData({
                                        tuichu: "退出",
                                        loginText: res.data.nickname,
                                        'array2[0].num': res.data.red,
                                        'array2[1].num': res.data.money,
                                        src2: res.data.photo
                                    })
                                    if(res.data.wanshanred){
                                        pages[j].setData({
                                            wanshanText: '修改个人信息'
                                        })
                                    }else{
                                        pages[j].setData({
                                            wanshanText: '完善个人信息,有红包奖励哦!'
                                        })
                                    }
                                }

                                wx.setStorageSync('name', res.data.nickname)
                                wx.setStorageSync('isTiefen', res.data.isTiefen)
                                wx.setStorageSync('isPartner', res.data.isPartner)
                                if(res.data.isTiefen == true||res.data.isTiefen == 'true'){
                                    wx.setStorageSync('viptime', res.data.viptime)
                                }
                                wx.navigateBack({
                                    delta: 1
                                })
                            } else {
                                wx.showToast({
                                    title: '获取个人信息失败!',
                                    mask: true,
                                    image: '../../images/warn.png'
                                })
                            }
                        }, fail: function (err) {
                            wx.showToast({
                                title: '服务器异常!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                            console.log(err)
                        }
                    })*/
                }else {
                    app.getUserInfo(function (userInfo) {
                        that.setData({
                            wxLoginFlag: false,
                            disabled: false
                        })
                        if(userInfo.nickName){
                            var nickname = userInfo.nickName
                            var photo = userInfo.avatarUrl
                            wx.navigateTo({
                                url: `../bindtel/bindtel?openid=${openid}&nickname=${nickname}&photo=${photo}`
                            })
                        }
                    })
                }
            } else {
                console.log('err:', err)
                that.setData({
                    wxLoginFlag: false,
                    disabled: false
                })
            }
        })
    },phone: function () {
        wx.navigateTo({
            url: '../login2/login2'
        })
    }
})