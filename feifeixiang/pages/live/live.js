const host = require('../../config.js').service.host
const livelist_url = require('../../config.js').service.livelist_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items11: [{
      id:0,
      src: "https://"+host+"/data/upload/details/2x/picture_2.png",
      src2: "https://"+host+"/data/upload/details/2x/price_new.png",
      title: "毕业季,我们的青春不散场",
      num: 132,
      date:'08-09',
      biaoqian: "直播中"
    },{
      id:1,
      src: "https://"+host+"/data/upload/details/2x/picture_2.png",
      src2: "https://"+host+"/data/upload/details/2x/price_hui.png",
      title: "毕业季,我们的青春不散场",
      pingtuan: "拼团最高返300元",
      yuanjia: 400,
      tiefen: 300,
      num: 200,
      biaoqian: "已结束"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*wx.requestPayment({
      'timeStamp': '1507773613',
      'nonceStr': 'e6wm79o6ueoyrv0u3js7wzlbjovflx76',
      'package': 'prepay_id=wx201710121000133c1a9104130972345775',
      'signType': 'MD5',
      'paySign': '5ADCE62003B28999B83C6E4505160224',
      'success':function(res){
        console.log(1,res)
      },
      'fail':function(res){
        console.log(2,res)

      }
    })*/
   /* wx.requestPayment({
      'timeStamp': '1507727671',
      'nonceStr': 'k5z7wnfnv8zyza7sb622rsvgbroeiicx',
      'package': 'prepay_id=wx20171011211431ad973fed870561533014',
      'signType': 'MD5',
      'paySign': '2761C2107C70D93E911FB141D8347FAD',
      'success':function(res){
        console.log(1,res)
      },
      'fail':function(res){
        console.log(2,res)

      }
    })*/
    var that = this
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    wx.request({
      url: livelist_url,
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