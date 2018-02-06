const getuserinfo_url = require('../../config.js').service.getuserinfo_url
const login_nickname_url = require('../../config.js').service.login_nickname_url
Page({
  data:{
    load2: false,
    flag3: true,
    disable3: "disable",
  }, onLoad: function (e) {
    this.setData({
      moblie: e.moblie
    })
  }, nicknameInputEvent: function(e){
    this.setData({
      nickname:e.detail.value
    })
    var nickname = this.data.nickname
    if (nickname == "" || nickname == undefined || nickname == null) {
      this.setData({
        flag3: true,
        disable3: "disable"
      })
    }else {
      this.setData({
        flag3: false,
        disable3: ""
      })
    }
  },create: function () {
      this.setData({
        load2: true,
        flag3: true,
        disable3: "disable"
      })
      var moblie = this.data.moblie
      var nickname = this.data.nickname
      var requestData
      if(app.globalData.partnerid){
        requestData = {
          moblie: moblie,
          nickname: nickname,
          partnerid: app.globalData.partnerid
        }
      }else {
        requestData = {
          moblie: moblie,
          nickname: nickname
        }
      }
      wx.request({
        url: login_nickname_url,
        data: requestData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, success: function (res) {
          var error_code = res.data.error_code
          var uid = res.data.uid
          if (error_code == '0') {
            wx.setStorageSync('uid', uid);
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
              delta: 3
            })
            /*wx.reLaunch({
              url: '../vip/vip'
            })*/
            /*if(uid!=""&&uid!=null&&uid!=undefined){
              var pages = getCurrentPages()
              var j = 0
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
                    wx.setStorageSync('name', res.data.nickname)
                    wx.setStorageSync('isTiefen', res.data.isTiefen)
                    wx.setStorageSync('isPartner', res.data.isPartner)
                    if(res.data.isTiefen == true||res.data.isTiefen == 'true'){
                      wx.setStorageSync('viptime', res.data.viptime)
                    }
                    wx.navigateBack({
                      delta: 3
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
          } else{
            wx.showToast({
              title: '创建失败!',
              mask: true,
              image: '../../images/warn.png'
            })
          }
        }, fail: function (err) {
          wx.showToast({
            title: '创建失败!',
            mask: true,
            image: '../../images/warn.png'
          })
          console.log(err)
        }
      })
    }
})