const tiaokuan_url = require('../../config.js').service.tiaokuan_url
const host = require('../../config.js').service.host
var WxParse = require('../../wxParse/wxParse.js');


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
    var nid = ''
    if(options.nid){
      nid = options.nid
      that.setData({
        nid: nid
      })
    }
    switch(nid)
    {
      case 'red':
        wx.setNavigationBarTitle({
          title: '红包说明'
        })
        break;
      case '1':
        wx.setNavigationBarTitle({
          title: '关于飞飞象'
        })
        break;
      case '2':
        wx.setNavigationBarTitle({
          title: '拼团说明'
        })
        break;
      case '3':
        wx.setNavigationBarTitle({
          title: '飞飞象新闻'
        })
        break;
      case '4':
        wx.setNavigationBarTitle({
          title: '合伙人条款'
        })
        break;
      case '5':
        wx.setNavigationBarTitle({
          title: '合同条款'
        })
        break;
      case '6':
        wx.setNavigationBarTitle({
          title: '注意事项'
        })
        break;
      case '7':
        wx.setNavigationBarTitle({
          title: '用户须知'
        })
        break;
      case '8':
        wx.setNavigationBarTitle({
          title: '合同条款'
        })
        break;
    }
  if(nid == 'red'){
    var items = [{
        "title": "获得红包方式",
        "content": ['1. 您可以通过活动详情里"分享"分享,分享成功即可获得红包','2. 您可以通过个人中心的"分享红包"功能分享,分享成功即可获得红包','3. 您可以通过个人中心的"完善信息"功能完善个人信息,完善成功后即可获得红包','4. 您可以通过个人中心的"好评红包"功能评价您已消费的订单,评价通过审核后即可获得红包']
      }]
      this.setData({
        items: items
      })
  }else{
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    wx.request({
      url: tiaokuan_url,
      data: {
        nid: nid
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
          // that.setData({
          //   items: res.data.items
          // })
            WxParse.wxParse('article', 'html', res.data.items[0].content, that,5);


          /*for(var i=0;i<that.data.items.length;i++){
            var param = {}
            var str = 'items['+i+'].content'
            var arr =  that.data.items[i].content.split("\r\n")
            for(var j=0;j<arr.length;j++){
              arr[j] = arr[j].replace("<br>","")
            }
            param[str] = arr
            that.setData(param)

          }*/
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