var util = require('../../utils/util2.js')
const host = require('../../config.js').service.host
const party_url = require('../../config.js').service.party_url
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid = wx.getStorageSync('uid');
    this.setData({
      end: util.formatTime(new Date()),
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  numInputEvent: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  childInputEvent: function (e) {
    this.setData({
      child: e.detail.value
    })
  },
  manInputEvent: function (e) {
    this.setData({
      man: e.detail.value
    })
  },
  telInputEvent: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  textInput: function (e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  finish: function () {
    if(uid!=''&&uid!=null&&uid!=undefined){
      var that = this;
      wx.showLoading({
        title: '请求中...',
        mask: true
      })
      wx.request({
        url: party_url,
        data: {
          uid: uid,
          date: that.data.date,
          num: that.data.num,
          child: that.data.child,
          man: that.data.man,
          tel: that.data.tel,
          beizhu: that.data.beizhu
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var error_code = res.data.error_code
          if (error_code == '0') {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '信息提交成功,请等待管理员联系!',
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
    }else{
      wx.showModal({
        title: '提示',
        content: '该功能需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }else {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
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