var util = require('../../utils/util2.js')
const host = require('../../config.js').service.host
const url = require('../../config.js').service.url
var i = 1//从后台拿取当前孩子数目
Page({
  data: {
    src1:"https://"+host+"/data/upload/huiyuanzhongxin/2x/jiantou_icon.png",
    src2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/tianjia_icon.png",
    items: [{
      array: ['男','女'],
      index: 0,
      date: ""
    }],
    childNum: 1
  }, onLoad: function (e) {
    this.setData({
      end: util.formatTime(new Date()),
    })
  }, bindPickerChange: function(e) {
    var param = {}
    var value = e.currentTarget.dataset.index
    var index = "items["+value+"].index"
    param[index] = e.detail.value
    this.setData(param)
  }, bindDateChange: function(e) {
    var param = {}
    var value = e.currentTarget.dataset.index
    var date = "items["+value+"].date"
    param[date] = e.detail.value
    this.setData(param)
  }, addClick: function () {
    var num = this.data.childNum
    num++
    var param = {}
    var array = "items["+i+"].array"
    var index = "items["+i+"].index"
    var date = "items["+i+"].date"
    param[array] = ['男','女']
    param[index] = 0
    param[date] = ""
    param["childNum"] = num
    this.setData(param)
    i++;
  }, del: function (e) {
    var num = this.data.childNum
    num--
    var index = e.currentTarget.dataset.index;
    var list = this.data.items;
    list.splice(index, 1);
    this.setData({
      items: list,
      childNum: num
    })
    i--;
  }, childNameInputEvent: function (e) {
    var param = {}
    var index = e.currentTarget.dataset.index
    console.log(index)
    var childName = "items["+index+"].childName"
    param[childName] = e.detail.value
    this.setData(param)
  }, idNumInputEvent:function (e) {
    var param = {}
    var index = e.currentTarget.dataset.index
    console.log(index)
    var idNum = "items["+index+"].idNum"
    param[idNum] = e.detail.value
    this.setData(param)
  }
})
