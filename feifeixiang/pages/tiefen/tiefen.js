const host = require('../../config.js').service.host
const url = require('../../config.js').service.url
const tiefen_url = require('../../config.js').service.tiefen_url
const checktiefen_url = require('../../config.js').service.checktiefen_url
var uid
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
       src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/wodeyikatong_icon.png',
       price: 100
  },
    finish: function () {
        uid = wx.getStorageSync('uid');
        var that = this
        if(wx.showLoading){
            wx.showLoading({
                title: '请求支付中...',
                mask: true
            })
        }
        app.getUserOpenId(function(err, openid) {
            if (!err) {
                wx.request({
                    url: tiefen_url,
                    data: {
                        openid,
                        uid: uid
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
                                        title: '铁粉开通成功!',
                                        mask: true
                                    })
                                    that.checktiefen()
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
                                        title: '铁粉开通成功!',
                                        mask: true
                                    })
                                    that.checktiefen()
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

    },checktiefen: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        wx.request({
            url: checktiefen_url,
            data: {
                uid: uid
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
                    wx.setStorageSync('isTiefen', res.data.isTiefen);
                    if(res.data.isTiefen == true||res.data.isTiefen == 'true'){
                        wx.setStorageSync('viptime', res.data.viptime);
                    }
                    that.setData({
                        isTiefen: wx.getStorageSync('isTiefen'),
                        viptime:  wx.getStorageSync('viptime')
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
    },onShow: function () {
          var that = this
          var isTiefen = wx.getStorageSync('isTiefen');
          var viptime = wx.getStorageSync('viptime');
          uid = wx.getStorageSync('uid');
          if(uid!=''&&uid!=null&&uid!=undefined){
                 if(isTiefen == false||isTiefen == 'false'){
                          that.setData({
                              isTiefen: isTiefen
                          })
                  }else if(isTiefen == true||isTiefen == 'true'){
                         if(viptime){
                             var now = new Date().getTime()
                             var date = parseInt(viptime)*1000
                             if(now < date){
                                 that.setData({
                                     isTiefen: isTiefen,
                                     viptime: viptime
                                 })
                             }else{
                                 wx.setStorageSync('isTiefen',false);
                                 wx.removeStorageSync('viptime')
                                 that.setData({
                                     isTiefen: false
                                 })
                             }

                         }
                  }else{
                         that.checktiefen()
                  }
          }else{
              wx.showModal({
                  title: '提示',
                  content: '开通或续费铁粉需要先登录,立即登录?',
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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