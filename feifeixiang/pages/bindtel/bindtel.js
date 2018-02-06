const host = require('../../config.js').service.host
const sendmsg_url = require('../../config.js').service.sendmsg_url
const wxlogin_adduser_url = require('../../config.js').service.wxlogin_adduser_url
var nickname = ""
var photo = ""
var openid = ""
var codeIsSending = false
var app = getApp()

Page({
  data: {
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
  }, onLoad: function (options) {
    codeIsSending = false
      if(options.nickname){
        nickname = options.nickname
        photo = options.photo
        openid = options.openid
      }
  },telInputEvent: function(e){
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
  }, codeInputEvent: function (e) {
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
  }, getCode: function () {
        var that = this
        var moblie = this.data.moblie
        codeIsSending = true
        this.setData({
          load1: true,
          flag2: true,
          disable2: "disable"
        })
        wx.request({
          url: sendmsg_url,
          data: {
            moblie: moblie
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
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
          },//请求失败
          complete: function () {
          }//请求完成后执行的函数
        })
  }, finish: function () {
    this.setData({
      load2: true,
      flag3: true,
      disable3: "disable"
    })
    var that = this
    var moblie = this.data.moblie
    var code = this.data.code
    var requestData
    if(app.globalData.partnerid){
      requestData = {
        openid: openid,
        nickname: nickname,
        photo: photo,
        moblie: moblie,
        partnerid: app.globalData.partnerid,
        code: code
      }
    }else{
      requestData = {
        openid: openid,
        nickname: nickname,
        photo: photo,
        moblie: moblie,
        code: code
      }
    }
    wx.request({
      url: wxlogin_adduser_url,
      data: requestData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var error_code = res.data.error_code
        if (error_code == '0') {
          wx.showToast({
            title: '绑定成功!',
            mask: true
          })
          wx.setStorageSync('uid', res.data.uid)
          wx.setStorageSync('openid', openid)
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
         /* var pages = getCurrentPages()
          var j
          for(var i=0;i<pages.length;i++){
            //返回页面的路径
            if(pages[i].route == "pages/vip/vip"){
              j = i;
              break;
            }
          }
          var name = unescape(res.data.nickname.replace(/&#x/g,'%u').replace(/\\u/g,'%u').replace(/;/g,''))
          if(j!=undefined){
            pages[j].setData({
              tuichu: "退出",
              loginText: name,
              src2: photo
            })
          }

          wx.setStorageSync('name', name)
          wx.navigateBack({
            delta: 2
          })*/
        } else if (error_code == '2'){
          wx.showToast({
            title: '验证码错误!',
            mask: true,
            image: '../../images/warn.png'
          })
        } else if (error_code == '3'){
          wx.showModal({
            showCancel: false,
            content: '该手机号已被绑定!',
            success: function() {
            }
          })
        } else {
          wx.showToast({
            title: '绑定失败!',
            mask: true,
            image: '../../images/warn.png'
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '绑定失败!',
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