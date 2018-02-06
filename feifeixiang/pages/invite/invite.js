const host = require('../../config.js').service.host
const getsharered_url = require('../../config.js').service.getsharered_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/youli.png',
      src1: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_weixin.png',
      src2: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_pengyou.png',
      src3: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_erwm.png',
      src4: 'https://'+host+'/data/upload/order/share-img.png',
      display: "none"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  saveImage: function () {
    wx.saveImageToPhotosAlbum({
      success(res) {
        console.log(res)
      }
    })
  },
  previewImage: function () {
    wx.previewImage({
      urls:['https://'+host+'/data/upload/huiyuanzhongxin/2x/fx_erwm.png'],
    })
  },
  share: function () {
      var that = this
      if(!wx.canIUse('button.open-type.share')){
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低,请点击右上角分享或升级微信后分享!'
        })
        that.setData({
          display : 'block'
        })
      }
  },
  hideShare: function () {
    this.setData({
      display : 'none'
    })
  },  onShareAppMessage: function (res) {
    var uid = wx.getStorageSync('uid');
    var isPartner = wx.getStorageSync('isPartner');
    var path
    if(isPartner==true||isPartner=='true'){
      path = '/pages/index/index?partnerid='+uid
    }else{
      path = '/pages/index/index'
    }
    return {
      title: '飞飞象户外探索教育',
      path: path,
      imageUrl: 'https://'+host+'/data/upload/share.jpg',
      success: function(res) {
        console.log('res',res)
        if(uid){
          wx.request({
            url: getsharered_url,
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
              var title = '转发成功,获得'+res.data.red+'元转发红包!'
              if (error_code == '0') {
                wx.showModal({
                  showCancel: false,
                  content: title
                })
              }
            }, fail: function (err) {
              console.log(err)
            }
          })
        }else{
          wx.showModal({
            showCancel: false,
            content: '不登录无法获得转发红包哦'
          })
        }
      },
      fail: function(res) {
        console.log('转发失败',res)

      }
    }
  },
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