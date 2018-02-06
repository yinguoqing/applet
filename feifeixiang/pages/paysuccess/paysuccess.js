const host = require('../../config.js').service.host
const getptid_url = require('../../config.js').service.getptid_url
var uid = ''
var pid = ''
var app = getApp()
var isPingtuan = ''
Page({
    /**
     * 页面的初始数据
     */
    data: {
        src: "https://"+host+"/data/upload/order/success.png",
        src2: "https://"+host+"/data/upload/order/share-img.png",
        orderid: "",
        display: "none",
        ptid: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        isPingtuan = app.globalData.isPingtuan||''
        this.setData({
            isPingtuan: isPingtuan
        })
        if(isPingtuan != 1){
            wx.hideShareMenu()
        }
        var that = this
        uid = wx.getStorageSync('uid');
        pid = options.pid
        this.setData({
            orderid: options.orderid,
            price: options.price

        })
        if(options.teaItems){
            this.setData({
                teaItems: JSON.parse(options.teaItems),
            })
        }else{
            that.setData({
                title:app.globalData.title,
                src1: app.globalData.src
            })
            //有ptid或isPingtuan == 1 两种情况下是拼团
            if(options.ptid){
                that.setData({
                    ptid: options.ptid,
                    ptItems:　app.globalData.ptItems
                })
            }else if(isPingtuan == 1){
                that.setData({
                    ptItems:　app.globalData.ptItems
                })
                wx.showLoading({
                    title: '数据加载中...',
                    mask: true
                })
                wx.request({
                    url: getptid_url,
                    data: {
                        uid: uid,
                        orderid: options.orderid
                    },
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
                            that.setData({
                                ptid: res.data.ptid
                            })
                        } else {
                            wx.showModal({
                                showCancel: false,
                                content: '加载失败,请下拉刷新重新获取拼团id,否则无法成功拼团!'
                            })
                        }
                    }, fail: function (err) {
                        wx.showModal({
                            showCancel: false,
                            content: '加载失败,请下拉刷新重新获取拼团id,否则无法成功拼团!'
                        })
                        console.log(err)
                    }
                })
            }
        }
    },onPullDownRefresh: function () {
        if(isPingtuan == 1){
            var that = this
            wx.showLoading({
                title: '页面刷新中...',
                mask: true
            })
            wx.request({
                url: getptid_url,
                data: {
                    uid: uid,
                    orderid: that.data.orderid
                },
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
                        that.setData({
                            ptid: res.data.ptid
                        })
                    } else {
                        wx.showModal({
                            showCancel: false,
                            content: '加载失败,请下拉刷新重新获取拼团id,否则无法成功拼团!'
                        })
                    }
                }, fail: function (err) {
                    wx.showModal({
                        showCancel: false,
                        content: '加载失败,请下拉刷新重新获取拼团id,否则无法成功拼团!'
                    })
                    console.log(err)
                }, complete: function () {
                    wx.hideLoading();
                    wx.stopPullDownRefresh()
                }
            })
        }

    }, sure: function () {
        wx.showModal({
            content: '确认完成后将跳转至首页,若要查看订单请进入个人中心',
            success: function(res) {
                if (res.confirm) {
                    wx.switchTab({
                        url: '../index/index'
                    })
                }
            }
        })
    }, share: function () {
        var that = this
        if(wx.canIUse('button.open-type.share')){

        }else{
            that.setData({
                display : 'block'
            })
        }
    },
    hideShare: function () {
        this.setData({
            display : 'none'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
            var that = this
            return {
                title: '我在飞飞象购买了产品,一起来拼团享优惠吧',
                path: '/pages/details/index?pid='+pid+'&ptid='+that.data.ptid,
                imageUrl: 'https://'+host+'/data/upload/share.jpg',
                success: function(res) {
                    console.log('sharePid',pid)
                    console.log('sharePtid',that.data.ptid)
                },
                fail: function(res) {
                }
            }
        }
})