const getshop_url = require('../../config.js').service.getshop_url

var city = ''
var shopid = ''
var lng = ''
var lat = ''
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },onLoad: function (options) {
    var options = options||'';
    wx.showLoading({
      title: '店铺加载中...',
      mask: true
    })
    var that = this
      wx.request({
        url: getshop_url,
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
              city = res.data.array[0].shopname
              shopid = res.data.array[0].shopid
              lng = res.data.array[0].lng
              lat = res.data.array[0].lat
              that.setData({
                items: res.data.array,
                current: 0,
              })
            if(options.city){
              city = options.city
              console.log(city)
              for(var i=0;i<that.data.items.length;i++){
                if(that.data.items[i].shopname==city){
                  that.setData({
                    current: i
                  })
                  break;
                }
              }
            }
          } else {
              wx.showModal({
                  showCancel: false,
                  content: '获取店铺列表失败,请下拉刷新重试!',
                  success: function(res) {
                  }
              })
          }
        }, fail: function (err) {
              wx.showModal({
                  showCancel: false,
                  content: '获取店铺列表失败,请下拉刷新重试!',
                  success: function(res) {
                  }
              })
          console.log(err)
        }
      })

  }, onPullDownRefresh: function () {
    this.onLoad()
  },
  finish: function () {
    var forePage = ''
    var pages = getCurrentPages()
    var j = 0
    for(var i=0;i<pages.length;i++){
      //返回页面的路径
      if(pages[i].route === "pages/index/index"){
          j = i;
          forePage = 'index'
          break;
      }else if(pages[i].route === "pages/info/info"){
          j = i;
          forePage = 'info'
          break;
      }
    }
    if(forePage == 'index'){
        pages[j].setData({
            "rgcData.city": city,
            shopid: shopid,
            autoChoose: false,
            hideFailModal : true,
            hideCube: ""
        })
        pages[j].onPullDownRefresh()
        wx.navigateBack({
            delta: 1
        })
    }else if(forePage == 'info'){
        pages[j].setData({
            'rgcData.city': city,
            shopid: shopid
        })
        wx.navigateBack({
            delta: 1
        })
    }


  },
  choose: function (e) {
      var index = e.currentTarget.dataset.index
      city = this.data.items[index].shopname
      shopid = this.data.items[index].shopid
      lng = this.data.items[index].lng
      lat = this.data.items[index].lat
      this.setData({
        current: index
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }

})