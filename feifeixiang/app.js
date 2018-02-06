const wxlogin_url = require('./config.js').service.wxlogin_url
//app.js
App({
  onLaunch: function(e) {
    //调用API从本地缓存中获取数据
    console.log(e);
    if(e.query.partnerid){
      this.globalData.partnerid = e.query.partnerid
    }
    if(e.query.pid){
      this.globalData.pid = e.query.pid
    }
    if(e.query.ptid){
      this.globalData.ptid = e.query.ptid
    }
    console.log('pid',this.globalData.pid)
    console.log('ptid',this.globalData.ptid)
    console.log('onlaunch',this.globalData)
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: null,
    shopname: null
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          console.log('授权成功',res)
          wx.showToast({
            title: '授权成功!',
            mask: true
          })
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail: function (obj) {
          if (wx.openSetting) {
            wx.openSetting({success:(res)=>{
                console.log('授权结果',res)
                if(res.authSetting['scope.userInfo'] == false){
                  wx.showToast({
                    title: '授权失败!',
                    mask: true,
                    image: '../../images/warn.png'
                  })
                  typeof cb == "function" && cb('fail')
                }else if(res.authSetting['scope.userInfo'] == true){
                  wx.showModal({
                    showCancel: false,
                    content: '授权成功,请点击登录!',
                    success: function(res) {
                    }
                  })
                  typeof cb == "function" && cb('success')
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低,无法重新打开授权,可以升级微信后重试,或在小程序历史列表删除本小程序后重试'
            })
            typeof cb == "function" && cb('fail')
          }
        }
      })
    }
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var openid = wx.getStorageSync('openid')
    var uid = wx.getStorageSync('uid')
    if (openid) {
      callback(null, openid,uid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: wxlogin_url,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              openid = res.data.openid
              wx.setStorageSync('openid',openid)
              callback(null, openid, res.data.uid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})
