const host = require('../../config.js').service.host
const partner_info_url = require('../../config.js').service.partner_info_url
const getsharered_url = require('../../config.js').service.getsharered_url
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src1: "https://"+host+"/data/upload/huiyuanzhongxin/2x/shouyi.png",
    src2: "https://"+host+"/data/upload/huiyuanzhongxin/2x/fs.png",
    moreSrc: "https://"+host+"/data/upload/huiyuanzhongxin/2x/more.png"
  },share: function () {
    if(!wx.canIUse('button.open-type.share')){
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低,请点击右上角分享或升级微信后分享!'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid = wx.getStorageSync('uid');
    var that = this;
   /* this.setData({
          yitixian: 1008,
          weitixian: 588,
          fansNum: 2000,
          spend: 262622,
          guize: `您可以通过分享链接邀请其他新用户加入,一旦TA通过您的邀请成为飞飞象的新用户,那么TA未来在飞飞象的所有消费都可以持续为你带来收益。具体邀请方式：点击"我要赚钱"分享链接给您的好友即可成为您粉丝。粉丝下单后，你将获得TA购买商品金额的返佣，收益金将在您的好友支付成功厚显示在您的账户`,
          about: `您赚取的收益可以直接提现,提现的金额为10的整数倍,会定期打到您申请成为合伙人时提交的账户`,

        })*/
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    wx.request({
      url: partner_info_url,
      data: {
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data
        var error_code = data.error_code
        if (error_code == '0') {
          wx.showToast({
            title: '加载成功!',
            mask: true
          })
          that.setData({
            yitixian: data.getcash,
            weitixian: data.yue,
            fansNum: data.fans,
            spend: data.fanscost,
            tiaokuan: data.tiaokuan
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