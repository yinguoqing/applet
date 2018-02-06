const host = require('../../config.js').service.host
const myshoucang_url = require('../../config.js').service.myshoucang_url
const shoucang_url = require('../../config.js').service.shoucang_url
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    uid = wx.getStorageSync('uid');
    if(uid!=''&&uid!=null&&uid!=undefined){
      wx.showLoading({
        title: '数据加载中...',
        mask: true
      })
      wx.request({
        url: myshoucang_url,
        data: {
          uid: uid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          var error_code = res.data.error_code
          if (error_code == '0') {
            wx.showToast({
              title: '加载成功!',
              mask: true
            })
            that.setData({
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
  cancel: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var list = this.data.items;
    var pid = list[index].id
    list.splice(index, 1);
    // 发请求,成功后展示新列表
    wx.request({
      url: shoucang_url,
      data: {
        uid: uid,
        pid: pid,
        way: "quxiao"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var error_code = res.data.error_code
        if (error_code == '0') {
          wx.showToast({
            title: '操作成功!',
            mask: true
          })
          that.setData({
            items: list
          })
        } else {
          wx.showToast({
            title: '操作失败!',
            mask: true,
            image: '../../images/warn.png'
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '操作失败!',
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