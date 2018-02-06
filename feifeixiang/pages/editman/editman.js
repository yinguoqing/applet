var util = require('../../utils/util2.js')
const host = require('../../config.js').service.host
const chuxingren_add_url = require('../../config.js').service.chuxingren_add_url
var uid
Page({
  data: {
      src1:"https://"+host+"/data/upload/huiyuanzhongxin/2x/jiantou_icon.png",
      src2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/tianjia_icon.png",
      array: ['男','女'],
      index: "0",
      date: "",
      flag: true,
      disable: "disable",
  }, onLoad: function (options) {
        uid = wx.getStorageSync('uid');
      var that = this
      that.setData({
        end: util.formatTime(new Date()),
      })
      if(options.name){
        wx.setNavigationBarTitle({
          title: '编辑出行人'
        })
        var name = options.name
        var id = options.id
        var date = options.date
        var sex = options.sex == "男" ? "0" : "1"
        var idCard = options.idCard
        var curIndex = options.curIndex
        that.setData({
          name: name,
          id: id,
          date: date,
          index: sex,
          idNum: idCard,
          curIndex: curIndex,
          flag: false,
          disable: ""
        })
      }else{
        wx.setNavigationBarTitle({
          title: '添加出行人'
        })
      }
  }, bindPickerChange: function(e) {
      this.setData({
        index: e.detail.value
      })
      var date = this.data.date
      var idNum = this.data.idNum
      var index = this.data.index
      var name = this.data.name
      if (idNum != "" && idNum != undefined && idNum != null && name != "" && name != undefined && name != null && index != "" && index != undefined && index != null && date != "" && date != undefined && date != null) {
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
  }, bindDateChange: function(e) {
      this.setData({
        date: e.detail.value
      })
      var date = this.data.date
      var idNum = this.data.idNum
      var index = this.data.index
      var name = this.data.name
      if (idNum != "" && idNum != undefined && idNum != null && name != "" && name != undefined && name != null && index != "" && index != undefined && index != null && date != "" && date != undefined && date != null) {
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
        name: e.detail.value
      })
      var date = this.data.date
      var idNum = this.data.idNum
      var index = this.data.index
      var name = this.data.name
      if (idNum != "" && idNum != undefined && idNum != null && name != "" && name != undefined && name != null && index != "" && index != undefined && index != null && date != "" && date != undefined && date != null) {
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
  }, idNumInputEvent:function (e) {
      this.setData({
        idNum: e.detail.value
      })
      var date = this.data.date
      var idNum = this.data.idNum
      var index = this.data.index
      var name = this.data.name
      if (idNum != "" && idNum != undefined && idNum != null && name != "" && name != undefined && name != null && index != "" && index != undefined && index != null && date != "" && date != undefined && date != null) {
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
  }, save: function () {
      var that = this;
      var date = this.data.date
      var idCard = this.data.idNum
      var sex = this.data.index == "0" ? "男" : "女"
      var name = this.data.name
      var id
      var curIndex = this.data.curIndex
      var nameTest=/^[\u4e00-\u9fa5]{2,6}$/
      var regId = /^\d{17}(\d|X|x)$/
      if(!nameTest.test(name)){
        wx.showToast({
          title: '姓名合规范!',
          mask: true,
          image: '../../images/warn.png'
        })
      }else if(!regId.test(idCard)){
        wx.showToast({
          title: '身份证号有误!',
          mask: true,
          image: '../../images/warn.png'
        })
      }else{
          //向后台保存..
          wx.showLoading({
              title: '数据保存中...',
              mask: true
          })
          var requestData
          if(that.data.id){
              requestData = {
                  uid: uid,
                  name: name,
                  id: that.data.id,
                  idCard: idCard,
                  sex: sex,
                  date: date
              }
          }else{
              requestData = {
                  uid: uid,
                  name: name,
                  idCard: idCard,
                  sex: sex,
                  date: date
              }
          }
          wx.request({
              url: chuxingren_add_url,
              data: requestData,
              method: 'POST',
              header: {
                  'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                  console.log(res)
                  var error_code = res.data.error_code
                  if (error_code == '0') {
                      id = res.data.id
                      wx.showToast({
                          title: '保存成功!',
                          mask: true
                      })
                      /*wx.redirectTo({
                          url: '../chooseman/chooseman'
                      })*/
                      wx.navigateBack({
                          delta: 1
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
