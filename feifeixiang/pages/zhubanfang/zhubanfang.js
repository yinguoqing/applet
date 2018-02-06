const zbf_url = require('../../config.js').service.zbf_url
const host = require('../../config.js').service.host
Page({

  /**
   * 页面的初始数据
   */
  data: {
      num: 10,
      num2: 20,
      score: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      this.setData({
          id: options.id,
          zbName: options.zbName,
          zbphoto: options.zbphoto
      })
      wx.showLoading({
          title: '数据加载中...',
          mask: true
      })
      wx.request({
          url: zbf_url,
          data: {
              id: options.id
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
                      baomingNum: res.data.baomingNum,
                      pingjia: res.data.pingjia,
                      huodongNum: res.data.huodongNum,
                      items: res.data.items
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
  
  }
})