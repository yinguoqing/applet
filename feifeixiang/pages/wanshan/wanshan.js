const host = require('../../config.js').service.host
const url = require('../../config.js').service.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/youli.png',
    src1: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_weixin.png',
    src3: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_erwm.png',
    src4: 'https://'+host+'/data/upload/order/share-img.png',
    display: "none"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.wsgrxx_red){
        this.setData({
          wsgrxx_red: options.wsgrxx_red
        })
      }
  },
  wanshan: function () {
    wx.navigateTo({
      url: '../info/info'
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