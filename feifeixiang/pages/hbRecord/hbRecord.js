const host = require('../../config.js').service.host
const hbrecord_url = require('../../config.js').service.hbrecord_url
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
      current: 0
  },
    menuTap: function () {
        this.setData({
            current: 0
        })
    },
    menuTap1: function () {
        this.setData({
            current: 1
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      uid = wx.getStorageSync('uid');
      var that = this;
      wx.showLoading({
          title: '数据加载中...',
          mask: true
      })
      wx.request({
          url: hbrecord_url,
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
                  wx.showToast({
                      title: '加载成功!',
                      mask: true
                  })
                  that.setData({
                      zhichu: res.data.zhichu,
                      shouru: res.data.shouru
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