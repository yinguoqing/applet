const host = require('../../config.js').service.host
const search_url = require('../../config.js').service.search_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://'+host+'/data/upload/homepage/2x/search.png',

  },searchInput: function (e) {
      this.setData({
        keyword: e.detail.value
      })
  },search: function () {
    var that = this;
    wx.showLoading({
      title: '数据搜索中...',
      mask: true
    })
    wx.request({
      url: search_url,
      data: {
        shopid: that.data.shopid||'',
        keyword: that.data.keyword||''
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var error_code = res.data.error_code
        if (error_code == '0') {
          wx.showToast({
            title: '搜索成功!',
            mask: true
          })
          that.setData({
            items: res.data.items
          })
        } else {
          wx.showToast({
            title: '搜索失败!',
            mask: true,
            image: '../../images/warn.png'
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '搜索失败!',
          mask: true,
          image: '../../images/warn.png'
        })
        console.log(err)
      }
    })
  },
  onLoad: function (options) {
      if(options.shopid){
          this.setData({
            shopid: options.shopid
          })
      }
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