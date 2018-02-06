const getrecharge_url = require('../../config.js').service.getrecharge_url
const recharge_url = require('../../config.js').service.recharge_url
const host = require('../../config.js').service.host
var lastCurrent = 0
var app = getApp()
var charge = 0
var uid = ''
Page({
    data:{
        flag: false,
        disabled: "",
        items: []
    },
    onLoad: function (options) {
        charge = 0
        uid = wx.getStorageSync('uid');
        lastCurrent = 0
        var that = this
        if(options.yue){
            this.setData({
                yue: options.yue
            })
        }
        wx.showLoading({
            title: '数据加载中...',
            mask: true
        })
        wx.request({
            url: getrecharge_url,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)
                var error_code = res.data.error_code
                if (error_code == '0') {
                    wx.showToast({
                        title: '加载成功!',
                        mask: true
                    })
                    var items = res.data.items
                    items[0].current = 'current'
                    items[0].color = 'color'
                    charge = items[0].price
                    that.setData({
                        items: items,
                        other: res.data.other
                    })
                } else {
                    wx.showToast({
                        title: '加载失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '加载失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }
        })
    },
    moneyInputEvent: function (e) {
        if(e.detail.value.length>0){
            var param= {}
            //还原旧值
            var str = `items[${lastCurrent}].current`
            var str2 = `items[${lastCurrent}].color`
            param[str] = ""
            param[str2] = ""
            charge = e.detail.value
            this.setData(param)
            this.setData({
                money: e.detail.value
            })
        }
    },
    recharge: function () {
        var that = this
        var charge = that.data.items[lastCurrent].price
        var requestMoney = 0
        var resFlag = ''
        if(that.data.money){
            requestMoney = that.data.money
            resFlag = 'other'
        }else{
            requestMoney = charge
            resFlag = 'common'
        }
        if(resFlag =='other'&&parseInt(that.data.money)<parseInt(that.data.other)){
            wx.showToast({
                title: '不能少于'+that.data.other,
                mask: true,
                image: '../../images/warn.png'
            })
        }else{
            that.setData({
                load: true,
                flag: true,
                disabled: "disabled"
            })
            if(wx.showLoading){
                wx.showLoading({
                    title: '请求支付中...',
                    mask: true
                })
            }
            app.getUserOpenId(function(err, openid) {
                if (!err) {
                    wx.request({
                        url: recharge_url,
                        data: {
                            openid,
                            uid: uid,
                            money: requestMoney
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function(res) {
                            console.log('unified order success, response is:', res)
                            var payargs = res.data
                            var type = typeof payargs
                            if(type == 'string'){
                                payargs = payargs.split('"')
                                if(wx.hideLoading){
                                    wx.hideLoading()
                                }
                                wx.requestPayment({
                                    nonceStr: payargs[7],
                                    package: payargs[11],
                                    signType: payargs[15],
                                    timeStamp: payargs[19],
                                    paySign: payargs[23],
                                    success:function(res){
                                        if(wx.vibrateLong){
                                            wx.vibrateLong()
                                        }
                                        wx.showToast({
                                            title: '支付成功!',
                                            mask: true
                                        })
                                        var pages = getCurrentPages()
                                        pages[0].onLoad()
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },
                                    fail:function(res){
                                    }
                                })
                            }else{
                                if(wx.hideLoading){
                                    wx.hideLoading()
                                }
                                wx.requestPayment({
                                    timeStamp: payargs.timeStamp,
                                    nonceStr: payargs.nonceStr,
                                    package: payargs.package,
                                    signType: payargs.signType,
                                    paySign: payargs.paySign,
                                    success:function(res){
                                        if(wx.vibrateLong){
                                            wx.vibrateLong()
                                        }
                                        wx.showToast({
                                            title: '支付成功!',
                                            mask: true
                                        })
                                        var pages = getCurrentPages()
                                        pages[0].onLoad()
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },
                                    fail:function(res){
                                    }
                                })
                            }
                        }, fail: function (err) {
                            wx.showToast({
                                title: '请求失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                            console.log(err)
                        }, complete: function (err) {
                            that.setData({
                                load: false,
                                flag: false,
                                disabled: ""
                            })
                            if(wx.hideLoading){
                                wx.hideLoading()
                            }
                        }
                    })
                } else {
                    console.log('err:', err)
                    wx.showToast({
                        title: '请求失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                    that.setData({
                        load: false,
                        flag: false,
                        disabled: ""
                    })
                    if(wx.hideLoading){
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    choosePrice: function (e) {
        var param= {}
        //还原旧值
        var str = `items[${lastCurrent}].current`
        var str2 = `items[${lastCurrent}].color`
        param[str] = ""
        param[str2] = ""
        param["money"] = ''
        this.setData(param)
        //设置新值
        var index = e.currentTarget.dataset.index
        lastCurrent = index
        var str = `items[${index}].current`
        var str2 = `items[${index}].color`
        param[str] = "current"
        param[str2] = "color"
        charge = this.data.items[index].price
        this.setData(param)
    }
})