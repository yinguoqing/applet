const baochang_url = require('../../config.js').service.baochang_url
const host = require('../../config.js').service.host
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      item: {
        id: 'name',
        text: '姓 名',
        placeholder: '您希望我们怎么称呼您',
        bindinput: 'nameInput',
        maxlength: 15,
        type: 'text'
      }
    },{
      item: {
        id: 'tel',
        text: '手 机',
        placeholder: '请输入您的手机号',
        bindinput: 'telInput',
        maxlength: 11,
        type: 'number'
      }
    }]

  },
  nameInput: function (e) {
    this.setData({
        name: e.detail.value
    })
  },
  telInput: function (e) {
    this.setData({
        tel: e.detail.value
    })
  },
  finish: function () {
    if(uid!=''&&uid!=null&&uid!=undefined){
      var that = this;
      wx.showLoading({
        title: '请求中...',
        mask: true
      })
      wx.request({
        url: baochang_url,
        data: {
          uid: uid,
          name: that.data.name,
          tel: that.data.tel
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      uid = wx.getStorageSync('uid');
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