const yewu_url = require('../../config.js').service.yewu_url
const host = require('../../config.js').service.host
var uid = ''
Page({

  /**
   * 页面的初始数据
   */
    /*,{
      item: {
        id: 'tel',
        text: '所在城市',
        placeholder: '您的业务所在的城市',
        bindinput: 'cityInput',
        maxlength: 15,
        type: 'text'
      }
    }*/
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
  buchongInput: function (e) {
    this.setData({
      buchong: e.detail.value
    })
    if(e.detail.cursor == 300){
      wx.showModal({
        showCancel: false,
        content: '已达到最大字数限制!',
        success: function(res) {
        }
      })
    }
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
  cityInput: function (e) {
    this.setData({
      city: e.detail.value
    })
  },
  finish: function () {
    var that = this
    uid = wx.getStorageSync('uid');
    var regName=/^[\u4e00-\u9fa5]{2,8}$/;
    var regMobile = /^1(3|4|5|7|8)\d{9}$/;
    var name = that.data.name
    var tel = that.data.tel
    if(uid){
      if(!regName.test(name)){
        wx.showToast({
          title: '姓名不合规范!',
          mask: true,
          image: '../../images/warn.png'
        })
      }else if(!regMobile.test(tel)){
        wx.showToast({
          title: '号码有误!',
          mask: true,
          image: '../../images/warn.png'
        })
      }else{
        wx.showLoading({
          title: '信息提交中...',
          mask: true
        })
        wx.request({
          url: yewu_url,
          data: {
            uid: uid,
            moblie: tel,
            name: name
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var error_code = res.data.error_code
            if (error_code == '0') {
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                content: '提交成功!',
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            } else if (error_code == '2') {
              wx.showToast({
                title: '信息提交过了!',
                mask: true
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
      }

    }else{
      wx.showModal({
        title: '提示',
        content: '该功能需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
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