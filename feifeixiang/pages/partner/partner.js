const partner_url = require('../../config.js').service.partner_url
const host = require('../../config.js').service.host
var uid = ''
Page({

    /**
     * 页面的初始数据
     */
    data: {
      items: [
        {
          item: {
            id: 'name',
            text: '姓 名',
            placeholder: '您希望我们怎么称呼您',
            bindinput: 'nameInput',
            maxlength: 15,
            type: 'text'
          }
        },{
          item: {
            id: 'tel',
            text: '手 机',
            placeholder: '请输入您的手机号',
            bindinput: 'telInput',
            maxlength: 11,
            type: 'number'
          }
        },{
          item: {
            id: 'tel',
            text: '所在城市',
            placeholder: '您的业务所在的城市',
            bindinput: 'cityInput',
            maxlength: 15,
            type: 'text'
          }
        },{
          item: {
            id: 'tel',
            text: '打款账号',
            placeholder: '请输入您的银行账号',
            bindinput: 'cardInput',
            maxlength: 25,
            type: 'number'
          }
        }
      ]

    },
    buchongInput: function (e) {
        if(e.detail.cursor == 300){
          wx.showToast({
            title: '已达最大字数!',
            mask: true,
            image: '../../images/warn.png'
          })
        }
        this.setData({
            buchong: e.detail.value
        })
    }, nameInput: function (e) {
        this.setData({
            name: e.detail.value
        })
    }, telInput: function (e) {
        this.setData({
            tel: e.detail.value
        })
    }, cityInput: function (e) {
        this.setData({
            city: e.detail.value
        })
    }, cardInput: function (e) {
        this.setData({
            card: e.detail.value
        })
    }, finish: function () {
        var that = this
        uid = wx.getStorageSync('uid');
        var regName=/^[\u4e00-\u9fa5]{2,8}$/;
        var regMobile = /^1(3|4|5|7|8)\d{9}$/;
        var name = that.data.name||''
        var tel = that.data.tel||''
        var city = that.data.city||''
        var card = that.data.card||''
        var buchong = that.data.buchong||''
        if(uid){
            if(name == ""){
                wx.showToast({
                    title: '请输入姓名!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(tel == ""){
                wx.showToast({
                    title: '请输入电话!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(city == ""){
                wx.showToast({
                    title: '请输入城市!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(card == ""){
                wx.showToast({
                    title: '请输入卡号!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(!regName.test(name)){
                wx.showToast({
                    title: '姓名不合规范!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(!regMobile.test(tel)){
                wx.showToast({
                    title: '手机号有误!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else{
                wx.showLoading({
                    title: '信息提交中...',
                    mask: true
                })
                wx.request({
                    url: partner_url,
                    data: {
                        uid: uid,
                        moblie: tel,
                        name: name,
                        city: city,
                        accuont: card,
                        beizhu: buchong
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.hideLoading()
                            wx.showModal({
                                showCancel: false,
                                content: '提交成功,我们会尽快联系您!',
                                success: function(res) {
                                    if (res.confirm) {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }
                                }
                            })
                        } else {
                            wx.showToast({
                                title: '提交失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '提交失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                        console.log(err)
                    }
                })
            }

        }else{
            wx.showModal({
                title: '提示',
                content: '该功能需要先登录,立即登录?',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../login/login'
                        })
                    }
                }
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})