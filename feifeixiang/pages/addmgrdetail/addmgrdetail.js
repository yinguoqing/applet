const host = require('../../config.js').service.host
const address_save_url = require('../../config.js').service.address_save_url
var addid
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src:"https://"+host+"/data/upload/huiyuanzhongxin/2x/jiantou_icon.png",
    region: [],
    flag: true,
    disable: "disable",
    canIUse: wx.canIUse('picker.mode.region')
  },onLoad: function (options) {
    addid = options.id||''
    if(options.name){
      var regArr = []
      regArr[0] = options.region0 == "undefined" ? "" : options.region0
      regArr[1] = options.region1 == "undefined" ? "" : options.region1
      regArr[2] = options.region2 == "undefined" ? "" : options.region2
      this.setData({
        name: options.name,
        moblie: options.moblie,
        region: regArr,
        add: options.add,
        flag: false,
        disable: ""
      })
    }
  }, bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    var region = this.data.region
    var moblie = this.data.moblie
    var add = this.data.add
    var name = this.data.name
    if (moblie != "" && moblie != undefined && moblie != null && name != "" && name != undefined && name != null && add != "" && add != undefined && add != null && region != "" && region != undefined && region != null) {
      this.setData({
        flag: false,
        disable: ""
      })
    }else{
      this.setData({
        flag: true,
        disable: "disable"
      })
    }
  }, nameInputEvent: function (e) {
    this.setData({
      name:e.detail.value
    })
    var moblie = this.data.moblie
    var add = this.data.add
    var name = this.data.name
    var region = this.data.region
    if (moblie != "" && moblie != undefined && moblie != null && name != "" && name != undefined && name != null && add != "" && add != undefined && add != null && (!this.data.canIUse||(region != "" && region != undefined && region != null))) {
        this.setData({
          flag: false,
          disable: ""
        })
      }else{
        this.setData({
          flag: true,
          disable: "disable"
        })
      }
  }, telInputEvent: function (e) {
    this.setData({
      moblie:e.detail.value
    })
    var moblie = this.data.moblie
    var add = this.data.add
    var name = this.data.name
    var region = this.data.region
    if (moblie != "" && moblie != undefined && moblie != null && name != "" && name != undefined && name != null && add != "" && add != undefined && add != null && (!this.data.canIUse||(region != "" && region != undefined && region != null))) {
        this.setData({
          flag: false,
          disable: ""
        })
      }else{
        this.setData({
          flag: true,
          disable: "disable"
        })
      }
  }, addInputEvent: function (e) {
    this.setData({
      add:e.detail.value
    })
    var moblie = this.data.moblie
    var add = this.data.add
    var name = this.data.name
    var region = this.data.region
    if (moblie != "" && moblie != undefined && moblie != null && name != "" && name != undefined && name != null && add != "" && add != undefined && add != null && (!this.data.canIUse||(region != "" && region != undefined && region != null))) {
        this.setData({
          flag: false,
          disable: ""
        })
      }else{
        this.setData({
          flag: true,
          disable: "disable"
        })
      }

  }, save: function (e) {
    var region = []
    if(this.data.canIUse){
      region = this.data.region
    }
    var moblie = this.data.moblie
    var add = this.data.add
    var name = this.data.name
    var uid = wx.getStorageSync('uid')
    var nameTest=/^[\u4e00-\u9fa5]{2,6}$/
    var regMobile = /^1(3|4|5|7|8)\d{9}$/
    if(!nameTest.test(name)){
      wx.showToast({
        title: '姓名不规范!',
        mask: true,
        image: '../../images/warn.png'
      })
    }else if(!regMobile.test(moblie)){
      wx.showToast({
        title: '手机号码有误!',
        mask: true,
        image: '../../images/warn.png'
      })
    }else{
      wx.showLoading({
        title: '地址保存中...',
        mask: true
      })
      var requestData
      if(addid != ''){
        requestData = {
          name: name,
          moblie: moblie,
          city: region,
          address: add,
          uid: uid,
          id: addid
        }
      }else{
        requestData = {
          name: name,
          moblie: moblie,
          city: region,
          address: add,
          uid: uid
        }
      }
      wx.request({
        url: address_save_url,
        data: requestData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var error_code = res.data.error_code
          if (error_code == 0) {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '地址保存成功!',
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
              title: '保存失败!',
              mask: true,
              image: '../../images/warn.png'
            })
          }
        }, fail: function (err) {
          wx.showToast({
            title: '保存失败!',
            mask: true,
            image: '../../images/warn.png'
          })
          console.log(err)
        }
      })
    }
  }
})