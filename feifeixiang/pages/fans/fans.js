const host = require('../../config.js').service.host
const partner_fans_url = require('../../config.js').service.partner_fans_url
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*fans: 20,
    items:[{
      name: "小明",
      photo:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
      date: "2017.08.09 12:09"
    },{
      name: "小明",
      photo:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
      date: "2017.08.09 12:09"
    },{
      name: "小明",
      photo:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
      date: "2017.08.09 12:09"
    },{
      name: "小明",
      photo:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
      date: "2017.08.09 12:09"
    }]*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    uid = wx.getStorageSync('uid');
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    wx.request({
      url: partner_fans_url,
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
            fans: res.data.fans,
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