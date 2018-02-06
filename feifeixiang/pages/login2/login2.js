const getuserinfo_url = require('../../config.js').service.getuserinfo_url
const sendmsg_url = require('../../config.js').service.sendmsg_url
const login_url = require('../../config.js').service.login_url
var codeIsSending = false
Page({
    data:{
        load1: false,
        load2: false,
        flag1: true,
        flag2: true,
        flag3: true,
        disable1: "disable",
        disable2: "disable",
        disable3: "disable",
        getVerifyCode: "获取",
        second: "",
    },onLoad: function () {
        codeIsSending = false
    },xuzhi: function () {
        wx.navigateTo({
            url: '../notice/notice?nid=7'
        })
    },mobileInputEvent: function(e){
        this.setData({
            moblie:e.detail.value
        })
        var moblie = this.data.moblie
        var regMobile = /^1(3|4|5|7|8)\d{9}$/
        if (moblie == "" || moblie == undefined || moblie == null) {
            this.setData({
                flag1: true,
                flag2: true,
                flag3: true,
                disable1: "disable",
                disable2: "disable",
                disable3: "disable"
            })
        }else if (regMobile.test(moblie)) {
            this.setData({
                flag1: false,
                disable1: ""
            })
            //验证码不在发送中
            if(!codeIsSending){
                this.setData({
                    flag2: false,
                    disable2: ""
                })
            }
        }else {
            this.setData({
                flag1: true,
                flag2: true,
                flag3: true,
                disable1: "disable",
                disable2: "disable",
                disable3: "disable"
            })
        }
    },passInputEvent: function(e){
        this.setData({
            code:e.detail.value
        })
        var code = this.data.code
        var regCode = /^\d{6}$/
        if (code == "" || code == undefined || code == null) {
            this.setData({
                flag3: true,
                disable3: "disable"
            })
        }else if (regCode.test(code)) {
            this.setData({
                flag3: false,
                disable3: ""
            })
        }else {
            this.setData({
                flag3: true,
                disable3: "disable"
            })
        }
    },getCode: function () {
        codeIsSending = true
        this.setData({
            load1: true,
            flag2: true,
            disable2: "disable"
        })
        var that = this
        var moblie = this.data.moblie
        wx.request({
            url: sendmsg_url,
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=gbk'
            },
            method: 'POST',
            data: {
                moblie: moblie
            },
            success: function (res) {
                var error_code = res.data.error_code
                console.log(res.data)
                console.log("error_code:" + error_code)
                if (error_code == '0') {
                    that.setData({
                        load1: false,
                        getVerifyCode: 60,
                        second: "秒",
                    })
                    var countDown = that.data.getVerifyCode
                    var time = setInterval(
                        function () {
                            if (countDown > 0) {
                                that.setData({
                                    getVerifyCode: --countDown
                                })
                            } else {
                                clearInterval(time)
                                codeIsSending = false
                                that.setData({
                                    getVerifyCode: "获取",
                                    second: "",
                                    flag2: false,
                                    disable2: ""
                                })
                            }
                        }, 1000)
                    wx.showToast({
                        title: '发送成功!',
                        mask: true
                    })
                } else if (error_code == '1') {
                    wx.showToast({
                        title: '发送失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                    that.setData({
                        load1: false,
                        flag2: false,
                        disable2: ""
                    })
                } else {
                    wx.showToast({
                        title: '发送失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                    that.setData({
                        load1: false,
                        flag2: false,
                        disable2: ""
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '发送失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                that.setData({
                    load1: false,
                    flag2: false,
                    disable2: ""
                })
                console.log(err)
            },
            complete: function () {
            }
        })
    },login: function () {
        this.setData({
            load2: true,
            flag3: true,
            disable3: "disable"
        })
        var that = this
        var moblie = this.data.moblie
        var code = this.data.code
        wx.request({
            url: login_url,
            data: {
                moblie: moblie,
                code: code
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var error_code = res.data.error_code
                console.log("----------",res)
                if (error_code == '0') {
                    var uid = res.data.uid
                    wx.setStorageSync('uid', uid)
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
                        delta: 2
                    })
                    /*wx.reLaunch({
                        url: '../vip/vip'
                    })*/
                    /*if(uid!=""&&uid!=null&&uid!=undefined){
                        var pages = getCurrentPages()
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
                                            'array2[1].num': res.data.money
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
                                        delta: 2
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
                        })
                    }*/

                } else if (error_code == '1') {
                    wx.showToast({
                        title: '提交失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                } else if (error_code == '2') {
                    wx.navigateTo({
                        url: '../nickname/nickname?moblie='+moblie
                    })
                } else {
                    wx.showToast({
                        title: '提交异常!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '提交异常!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }, complete: function () {
                that.setData({
                    load2: false,
                    flag3: false,
                    disable3: ""
                })
            }
        })
    }
})