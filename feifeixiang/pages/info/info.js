const host = require('../../config.js').service.host
const userdetail_url = require('../../config.js').service.userdetail_url
const userdetail_save_url = require('../../config.js').service.userdetail_save_url
const photo_url = require('../../config.js').service.photo_url
var util = require('../../utils/util2.js')
var bmap = require('../../libs/bmap-wx.min.js')
var originalData = []
var i = 0
var uid = ""
var app = getApp()

Page({
  data: {
      src:"https://"+host+"/data/upload/huiyuanzhongxin/2x/touxiang.png",
      src1:"https://"+host+"/data/upload/huiyuanzhongxin/2x/jiantou_icon.png",
      src2:"https://"+host+"/data/upload/huiyuanzhongxin/2x/tianjia_icon.png",
      region: [],
      childNum: 0,
      items: [],
      rgcData: {
          city: ''
      }
  }, onLoad: function (e) {
        var that = this
        wx.showLoading({
            title: '资料加载中...',
            mask: true
        })
        uid = wx.getStorageSync('uid');
        this.setData({
            end: util.formatTime(new Date()),
        })

        wx.request({
            url: userdetail_url,
            data: {
                uid: uid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var error_code = res.data.error_code
                if (error_code == '0') {
                    wx.showToast({
                        title: '资料加载成功!',
                        mask: true
                    })
                    var tel = res.data.moblie
                    var formatTel =  tel.substr(0, 3) + '****' + tel.substr(7)//格式化手机号
                    if(res.data.list==null || res.data.list==undefined || res.data.list==""){
                        res.data.list = []
                    }
                    i = res.data.list.length
                    that.setData({
                        nickname: res.data.nickname,
                        formatTel: formatTel,
                        tel: tel,
                        items: res.data.list,
                        childNum: res.data.list.length,
                        src: res.data.photo,
                        address: res.data.address,
                        shopid: res.data.shopid||''
                    })
                    if(res.data.city != "" && res.data.city != null && res.data.city != undefined){
                        that.setData({
                            'rgcData.city': res.data.city
                        })
                    }/*else if(app.globalData.shopname != "" && app.globalData.shopname != null && app.globalData.shopname != undefined){
                        that.setData({
                            'rgcData.city': app.globalData.shopname
                        })
                    }*/
                } else {
                    wx.showToast({
                        title: '资料加载失败!',
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



  },save: function () {
        var that = this
        var name = that.data.nickname
        var city = that.data.rgcData.city
        var shopid = that.data.shopid
        var childNum = that.data.childNum
        var items = that.data.items
        var nameTest=/^[\u4e00-\u9fa5]{2,6}$/
        var regId = /^\d{17}(\d|X|x)$/
        if(name==null||name==undefined||name==''){
            wx.showModal({
                showCancel: false,
                content: '昵称不能为空!',
                success: function(res) {
                }
            })
        }else if(childNum==0){
            wx.showModal({
                showCancel: false,
                content: '请至少添加一个孩子!',
                success: function(res) {
                }
            })
        }else {
            for(var i=0;i<items.length;i++){
                if(items[i].childName==null||items[i].childName==undefined||items[i].childName==''){
                    wx.showModal({
                        showCancel: false,
                        content: '孩子姓名不能为空!',
                        success: function(res) {
                        }
                    })
                }else if(!nameTest.test(items[i].childName)){
                    wx.showModal({
                        showCancel: false,
                        content: '孩子姓名不符合规范!',
                        success: function(res) {
                        }
                    })
                }else if(items[i].idNum==null||items[i].idNum==undefined||items[i].idNum==''){
                    wx.showModal({
                        showCancel: false,
                        content: '身份证号不能为空!',
                        success: function(res) {
                        }
                    })
                }else if(!regId.test(items[i].idNum)){
                    wx.showModal({
                        showCancel: false,
                        content: '请填写正确的身份证号码!',
                        success: function(res) {
                        }
                    })
                }else if(items[i].date==null||items[i].date==undefined||items[i].date==''){
                    wx.showModal({
                        showCancel: false,
                        content: '孩子生日不能为空!',
                        success: function(res) {
                        }
                    })
                }else if(i == items.length-1){
                    wx.showLoading({
                        title: '资料保存中...',
                        mask: true
                    })
                    for (var i=0;i<items.length;i++){
                        delete items[i].array
                    }
                    wx.request({
                        url: userdetail_save_url,
                        data: {
                            uid: uid,
                            name: name,
                            shopid: shopid,
                            childInfo: JSON.stringify(items)
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res)
                            var error_code = res.data.error_code
                            if (error_code == '0') {
                                if(res.data.red){
                                    wx.showModal({
                                        content: '资料完善成功,获得'+res.data.red+'元红包!'
                                    })
                                }else{
                                    wx.showToast({
                                        title: '保存成功!',
                                        mask: true
                                    })
                                }
                                var pages = getCurrentPages()
                                var j
                                for(var i=0;i<pages.length;i++){
                                    //返回页面的路径
                                    if(pages[i].route === "pages/vip/vip"){
                                        j = i;
                                        break;
                                    }
                                }
                                if(j!=undefined){
                                    pages[j].setData({
                                        loginText: res.data.nickname,
                                        wanshanText: '修改个人信息'
                                    })
                                }
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
        }

  }, bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }, nameInputEvent:function (e) {
        this.setData({
            nickname: e.detail.value
        })
  }, address: function () {
        wx.navigateTo({
            url: '../addmgr/addmgr'
        })
  }, city: function () {
        wx.navigateTo({
            url: '../location/location?city='+this.data.rgcData.city
        })
  }, touxiang: function () {
    var that = this
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            var tempFilePaths = res.tempFilePaths
            wx.showLoading({
                title: '头像上传中...',
                mask: true
            })
            wx.uploadFile({
                url: photo_url,
                filePath: tempFilePaths[0],
                name: 'photo',
                header: {'content-type': 'application/x-www-form-urlencoded'},
                formData:{
                    uid: uid
                },
                success: function(res){
                    var data = res.data
                    data = JSON.parse(data)
                    var error_code = data.error_code
                    console.log(res)
                    if (error_code == '0') {
                        wx.showToast({
                            title: '头像上传成功!',
                            mask: true
                        })
                        that.setData({
                            src: tempFilePaths
                        })
                        var pages = getCurrentPages()
                        var j = 0
                        for(var i=0;i<pages.length;i++){
                            //返回页面的路径
                            if(pages[i].route === "pages/vip/vip"){
                                j = i;
                                break;
                            }
                        }
                        pages[j].setData({
                            src2: tempFilePaths
                        })
                    }else{
                        wx.showToast({
                            title: '头像上传失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                    }
                }, fail: function (err) {
                    wx.showToast({
                        title: '上传失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                    console.log(err)
                }
            })
        }
    })
  }, tel: function () {
        wx.navigateTo({
          url: '../changetel/changetel?tel='+this.data.tel
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
        console.log(index)

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
        var childName = "items["+index+"].childName"
        param[childName] = e.detail.value
        this.setData(param)
  }, idNumInputEvent:function (e) {
        var param = {}
        var index = e.currentTarget.dataset.index
        var idNum = "items["+index+"].idNum"
        param[idNum] = e.detail.value
        this.setData(param)
  }
})
