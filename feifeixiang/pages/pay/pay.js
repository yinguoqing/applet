const host = require('../../config.js').service.host
const wxpay_url = require('../../config.js').service.wxpay_url
const pay_url = require('../../config.js').service.pay_url
var app = getApp()
var orderid = ''
var uid
var isHecha = false
var pid = ''
Page({
/**
 * 页面的初始数据
 */
    data: {
        wxValue: '微信',
        yueValue: '余额',
        wxChecked: true,
        curSelect: '微信',
        display: false,
        src: "https://"+host+"/data/upload/order/weixin.png",
        src1: "https://"+host+"/data/upload/order/yue1.png",
        jtSrc:"https://"+host+"/data/upload/homepage/2x/jiantou.png"
    },jtClick: function () {
        if(this.data.jtSrc=="https://"+host+"/data/upload/homepage/2x/jiantou.png"){
            this.setData({
                jtSrc:"https://"+host+"/data/upload/homepage/2x/jt_up.png",
                display: true
            })
        }else{
            this.setData({
                jtSrc:"https://"+host+"/data/upload/homepage/2x/jiantou.png",
                display: false
            })
        }


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        isHecha = false
        uid = wx.getStorageSync('uid');
        var hongbao = options.hongbao||0
        var yuanjia = parseInt(options.price)+parseInt(hongbao)
        pid = options.pid||''
        if(options.yhcost){
            yuanjia = yuanjia + parseInt(options.yhcost)
        }
        orderid = options.orderid
        if(options.title){
              this.setData({
                  title: options.title,
                  date: options.date,
                  price: options.price,
                  hongbao: hongbao,
                  yhcost: options.yhcost,
                  yuanjia: yuanjia
              })
        }else if(options.text){
            isHecha = true
            this.setData({
                orderid: options.orderid,
                text: options.text,
                time: options.time,
                hongbao: hongbao,
                price: options.price,
                yuanjia: yuanjia,
                teaItems: JSON.parse(options.teaItems2)
            })
        }
    },
    radioChange: function (e) {
        this.setData({
            curSelect: e.detail.value
        })
    },
    weixin: function (e) {
        console.log(e)
        this.setData({
            wxChecked: true,
            yueChecked: false,
            curSelect: '微信',
        })
    },
    yue: function () {
        this.setData({
            yueChecked: true,
            wxChecked: false,
            curSelect: '余额',
        })
    },
    pay: function () {
        if(wx.reLaunch){
            var self = this
            var curSelect = this.data.curSelect
            if(curSelect == '微信'){
                self.setData({
                    loading: true,
                    disabled: true,
                    hui: 'hui'
                })
                if(wx.showLoading){
                    wx.showLoading({
                        title: '请求支付中...',
                        mask: true
                    })
                }
                // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
                // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
                app.getUserOpenId(function(err, openid) {
                    if (!err) {
                        wx.request({
                            url: wxpay_url,
                            data: {
                                openid,
                                uid: uid,
                                orderid: orderid
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
                                            if(isHecha){
                                                wx.reLaunch({
                                                    url: '../paysuccess/paysuccess?orderid='+orderid+'&teaItems='+JSON.stringify(self.data.teaItems)+'&price='+self.data.price
                                                })
                                            }else{
                                                wx.reLaunch({
                                                    url: '../paysuccess/paysuccess?orderid='+orderid+'&pid='+pid+'&price='+self.data.price
                                                })
                                            }
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
                                            if(isHecha){
                                                wx.reLaunch({
                                                    url: '../paysuccess/paysuccess?orderid='+orderid+'&teaItems='+JSON.stringify(self.data.teaItems)+'&price='+self.data.price
                                                })
                                            }else{
                                                wx.reLaunch({
                                                    url: '../paysuccess/paysuccess?orderid='+orderid+'&pid='+pid+'&price='+self.data.price
                                                })
                                            }
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
                                self.setData({
                                    loading: false,
                                    disabled: false,
                                    hui: ''
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
                        self.setData({
                            loading: false,
                            disabled: false,
                            hui: ''
                        })
                        if(wx.hideLoading){
                            wx.hideLoading()
                        }
                    }
                })
            }else if(curSelect == '余额'){
                wx.showModal({
                    content: '确认支付吗?',
                    success: function(res) {
                        if (res.confirm) {
                            self.setData({
                                loading: true,
                                disabled: true,
                                hui: 'hui'
                            })
                            if(wx.showLoading){
                                wx.showLoading({
                                    title: '请求支付中...',
                                    mask: true
                                })
                            }
                            wx.request({
                                url: pay_url,
                                data: {
                                    uid: uid,
                                    orderid: orderid
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                success: function (res) {
                                    console.log(res)
                                    var error_code = res.data.error_code
                                    var ptid = res.data.ptid||''
                                    if (error_code == '0') {
                                        wx.showToast({
                                            title: '支付成功!',
                                            mask: true
                                        })
                                        if(wx.vibrateLong){
                                            wx.vibrateLong()
                                        }
                                        if(isHecha){
                                            wx.reLaunch({
                                                url: '../paysuccess/paysuccess?orderid='+orderid+'&teaItems='+JSON.stringify(self.data.teaItems)+'&price='+self.data.price
                                            })
                                        }else{
                                            wx.reLaunch({
                                                url: '../paysuccess/paysuccess?orderid='+orderid+'&ptid='+ptid+'&pid='+pid+'&price='+self.data.price
                                            })
                                        }
                                    } else if(error_code == '1'){
                                        wx.showToast({
                                            title: '余额不足!',
                                            mask: true,
                                            image: '../../images/warn.png'
                                        })
                                    } else {
                                        wx.showToast({
                                            title: '支付失败!',
                                            mask: true,
                                            image: '../../images/warn.png'
                                        })
                                    }
                                }, fail: function (err) {
                                    wx.showToast({
                                        title: '支付失败!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                    console.log(err)
                                },complete: function () {
                                    self.setData({
                                        loading: false,
                                        disabled: false,
                                        hui: ''
                                    })
                                }
                            })
                        }
                    }
                })

            }
        }else{
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '当前微信版本过低,请升级至最新版本后重试',
                success: function() {
                }
            })
        }

    }
})