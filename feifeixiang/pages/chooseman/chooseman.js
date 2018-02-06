const host = require('../../config.js').service.host
const chuxingren_del_url = require('../../config.js').service.chuxingren_del_url
const chuxingren_url = require('../../config.js').service.chuxingren_url
var util = require('../../utils/util2.js')
var children = 0
var adult = 0
var uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
      flag: true,
      disable: "disable",
      curPage: "chooseman",
      src: "https://"+host+"/data/upload/order/xinzeng.png",
      src1: "https://"+host+"/data/upload/order/bianji.png",
      traveller: [],
      traveller2: [{
          name: "诺希",
          date: "1999-9-30",
          sex: "男",
          idCard: "320525199301000000",
          src: "https://"+host+"/data/upload/order/weixuan.png"
      },{
          name: "无心",
          date: "1999-7-26",
          sex: "男",
          idCard: "320525199301000888",
          src: "https://"+host+"/data/upload/order/weixuan.png"
        },{
          name: "诺希",
          date: "1990-8-26",
          sex: "男",
          idCard: "320525199301000000",
          src: "https://"+host+"/data/upload/order/weixuan.png"
      }]
  },del: function (e) {
        var index = e.currentTarget.dataset.index
        var that = this
        wx.showModal({
            content: '确定要删除该出行人吗?',
            success: function(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中...',
                        mask: true
                    })
                    wx.request({
                        url: chuxingren_del_url,
                        data: {
                            uid: uid,
                            id: that.data.traveller[index].id
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res)
                            var error_code = res.data.error_code
                            var traveller = that.data.traveller
                            traveller.splice(index,1)
                            if (error_code == '0') {
                                that.setData({
                                    traveller: traveller
                                })
                                wx.showToast({
                                    title: '删除成功!',
                                    mask: true
                                })
                            } else {
                                wx.showToast({
                                    title: '删除失败!',
                                    mask: true,
                                    image: '../../images/warn.png'
                                })
                            }
                        }, fail: function (err) {
                            wx.showToast({
                                title: '删除失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                            console.log(err)
                        }
                    })
                }
            }
        })
      },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      if(options.num1){
        var num1 = options.num1
        var num = options.num
        var title = "请选择成人"+num1+"名,儿童"+num+"名"
        if(num1 == "0"){
          title = "请选择儿童"+num+"名"
        }else if(num == "0"){
          title = "请选择成人"+num1+"名"
        }
          that.setData({
          num1: num1,
          num: num,
          title: title
        })
      }
      uid = wx.getStorageSync('uid');
          wx.showLoading({
              title: '数据加载中...',
              mask: true
          })
          wx.request({
              url: chuxingren_url,
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
                  var traveller = res.data.traveller
                  if (error_code == '0') {
                      for(var i=0;i<traveller.length;i++){
                          traveller[i].src = "https://"+host+"/data/upload/order/weixuan.png"
                      }
                      that.setData({
                          traveller: traveller
                      })
                      wx.showToast({
                          title: '加载成功!',
                          mask: true
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
  addman: function () {
    wx.redirectTo({
      url: '../editman/editman'
    })
  },
  gou: function (e) {
      //有成人和儿童分类时,提交按钮是否置灰的控制
      /*var num1 = this.data.num1
      var num = this.data.num
      var that = this
      var traveller = that.data.traveller
      var index = e.currentTarget.dataset.index
      var src = traveller[index].src
      if(src == "https://"+host+"/data/upload/order/yixuan.png"){
          src = "https://"+host+"/data/upload/order/weixuan.png"
          if(traveller[index].type == "成人"){
              adult--
          }else if(traveller[index].type == "儿童"){
              children--
          }
      }else if(src == "https://"+host+"/data/upload/order/weixuan.png"){
          src = "https://"+host+"/data/upload/order/yixuan.png"
          if(traveller[index].type == "成人"){
              adult++
          }else if(traveller[index].type == "儿童"){
              children++
          }
      }
      if(num1 == adult && num == children){
            that.setData({
                flag: false,
                disable: "",
            })
      }else{
          that.setData({
              flag: true,
              disable: "disable",
          })
      }

      var param = {}
      var src2 = "traveller["+index+"].src"
      param[src2] = src
      that.setData(param)*/
      var num = this.data.num
      var that = this
      var traveller = that.data.traveller
      var index = e.currentTarget.dataset.index
      var src = traveller[index].src
      if(src == "https://"+host+"/data/upload/order/yixuan.png"){
          src = "https://"+host+"/data/upload/order/weixuan.png"
          children--
      }else if(src == "https://"+host+"/data/upload/order/weixuan.png"){
          src = "https://"+host+"/data/upload/order/yixuan.png"
          children++
      }
      if(num == children){
          that.setData({
              flag: false,
              disable: "",
          })
      }else{
          that.setData({
              flag: true,
              disable: "disable",
          })
      }
      var param = {}
      var src2 = "traveller["+index+"].src"
      param[src2] = src
      that.setData(param)
  },
  edit: function (e) {
      var index = e.currentTarget.dataset.index
      var name = this.data.traveller[index].name
      var sex = this.data.traveller[index].sex
      var idCard = this.data.traveller[index].idCard
      var date = this.data.traveller[index].date
      var id = this.data.traveller[index].id
      wx.redirectTo({
          url: '../editman/editman?name='+name+"&id="+id+"&sex="+sex+"&idCard="+idCard+"&date="+date+"&curIndex="+index
      })
  },
    submit: function () {
        var traveller = this.data.traveller
        var checkedArr = []
        var adultArr = []
        var childArr = []
        for(var i=0;i<traveller.length;i++){
            if(traveller[i].src == "https://"+host+"/data/upload/order/yixuan.png"){
                checkedArr.push(traveller[i])
               /* if(traveller[i].type == "成人"){
                    adultArr.push(traveller[i].name)
                }else if(traveller[i].type == "儿童"){
                    childArr.push(traveller[i].name)
                }*/
            }
        }
        var pages = getCurrentPages()
        var j = 0
        for(var i=0;i<pages.length;i++){
            if(pages[i].route == "pages/order/index"){
                j = i;
                break;
            }
        }
        pages[j].setData({
            traveller: checkedArr
            /*adultArr: adultArr,
            childArr: childArr*/
        })
        wx.navigateBack({
            delta: 1
        })
    },
    onShow:function () {
        var that = this
        var num1 = that.data.num1
        var num = that.data.num
        var adult2 = 0
        var children2 = 0
        var traveller = that.data.traveller
        for(var i=0;i<traveller.length;i++){
            if(traveller[i].src == "https://"+host+"/data/upload/order/yixuan.png"){
                if(traveller[i].type == "成人"){
                    adult2++
                }else if(traveller[i].type == "儿童"){
                    children2++
                }
            }
            //根据date判断成人还是儿童
            var date = traveller[i].date
            var now = util.formatTime(new Date())
            var year = parseInt(now.split("-")[0])
            var month = parseInt(now.split("-")[1])
            var day = parseInt(now.split("-")[2])
            var year2 = parseInt(date.split("-")[0])
            var month2 = parseInt(date.split("-")[1])
            var day2 = parseInt(date.split("-")[2])
            var param = {}
            var type = "traveller["+i+"].type"
            if((year-year2)>18){
                param[type] = "成人"
                that.setData(param)
            }else if((year-year2)==18){
                if(month>month2){
                    param[type] = "成人"
                    that.setData(param)
                }else if(month == month2){
                    if(day>=day2){
                        param[type] = "成人"
                        that.setData(param)
                    }else{
                        param[type] = "儿童"
                        that.setData(param)
                    }
                }else{
                    param[type] = "儿童"
                    that.setData(param)
                }
            }else{
                param[type] = "儿童"
                that.setData(param)
            }
        }
        adult = adult2
        children = children2
        /*if(num1 == adult && num == children){
            that.setData({
                flag: false,
                disable: "",
            })
        }else{
            that.setData({
                flag: true,
                disable: "disable",
            })
        }*/
        if(num == children){
            that.setData({
                flag: false,
                disable: "",
            })
        }else{
            that.setData({
                flag: true,
                disable: "disable",
            })
        }
    }
})