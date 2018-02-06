const host = require('../../config.js').service.host
const index_url = require('../../config.js').service.index_url
const getsharered_url = require('../../config.js').service.getsharered_url
var cur = 0
var app = getApp()
// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../libs/bmap-wx.min.js')
var originalData = []
var second = "热门主题"
var third = "附近活动推荐"
var fourth = "为您推荐"
var fifth = "往期活动"
var arrayData =  []
var uid = ''
Page({
  data: {
    showEmpty: false,
    indicatorDots: true,
    autoplay: false,
    interval: 2500,
    duration: 500,
    autoChoose: true,
    rgcData: {
      city: "未知",
      formatted_address: "定位中..."
    },
    second: second,
    third: third,
    fourth: fourth,
    fifth: fifth,
    emptySrc: 'https://ffx.weiweitouzi.cn/data/upload/huiyuanzhongxin/2x/empty.png',
    src:'https://ffx.weiweitouzi.cn/data/upload/homepage/2x/banner.png',
    src2:'https://ffx.weiweitouzi.cn/data/upload/homepage/2x/middle banner.png',
    scrollTopSrc:'https://ffx.weiweitouzi.cn/data/upload/homepage/2x/hidaodingbu.png',
    showScrollTop: false,
  }, imgChange: function(e) {
    cur = e.detail.current
    if(arrayData.length>8){
      this.setData({
        array: arrayData.slice(8*cur,8*(cur+1))
      })
    }
  }, chooseCity: function () {
      wx.navigateTo({
        url: '../location/location?city='+this.data.rgcData.city
      })
  }, search: function () {
      wx.navigateTo({
        url: '../search/search?shopid='+this.data.shopid
      })
  }, refresh: function () {
    var that = this
    that.setData({
      animation: "animation"
    }) 
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          longitude : res.longitude,
          latitude : res.latitude
        })
      }
    })
    var BMap = new bmap.BMapWX({
      ak: 'ilmtFnInNw3yoXGB6etlhRTFgrOt8uPy'
    })
    var fail = function(data) {
      that.setData({
        animation: "",
        "rgcData.formatted_address": "未知",
      })
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userLocation'] == false){
            wx.openSetting({success:(res)=>{console.log(res);}})
          }
        }
      })
      wx.showToast({
        title: '定位失败!',
        mask: true,
        image: '../../images/warn.png'
      })
    }
    var success = function(data) {
      originalData = data.originalData;
      var formatted_address = originalData.result.formatted_address;
      that.setData({
        "rgcData.formatted_address": formatted_address,
        animation: ""
      })
      wx.showToast({
        title: '定位成功!',
        mask: true
      })
    }
    BMap.regeocoding({
      fail: fail,
      success: success
    })
  } ,onLoad: function () {
    uid = wx.getStorageSync('uid');
    //确认是机主在使用小程序
    /*wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: '123456',
      authContent: '请用指纹解锁',
      success(res) {
        wx.showToast({
          title: '解锁成功!',
          mask: true
        })
        console.log(res)
      }
    })*/
    var that = this
    that.setData({
      hideCube: ""
    })

    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
          that.setData({
            longitude : res.longitude,
            latitude : res.latitude,
            autoLocation : true
          })
        console.log(res.longitude)
        console.log(res.latitude)
      },
      fail:function () {
          that.setData({
            longitude : "120.717498",
            latitude : "31.324019",
            autoLocation: false
          })
      }, complete: function () {
        var requestData
        if(that.data.autoChoose){
          requestData = {
            lng : that.data.longitude,
            lat : that.data.latitude
          }
        }else{
          requestData = {
            lng : that.data.longitude,
            lat : that.data.latitude,
            shopid: that.data.shopid
          }
        }
        wx.request({
          url: index_url,
          data: requestData,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var error_code = res.data.error_code
            if (error_code == '0') {
              that.setData({
                hideCube: "hideCube"
              })
              if(!that.data.autoLocation){
                if(that.data.hideFailModal){
                  wx.showToast({
                    title: '加载成功!',
                    mask: true
                  })
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '自动定位失败,已为您选择默认店铺!',
                    showCancel: false,
                    success: function(res) {
                    }
                  })
                }
              }else{
                wx.showToast({
                  title: '加载成功!',
                  mask: true
                })
              }

              arrayData = res.data.array||[]
              if(arrayData.length == 0){
                that.setData({
                  showEmpty: true
                })
              }else{
                that.setData({
                  showEmpty: false
                })
              }
              var imgUrls = []
              for(var i=0;i<Math.ceil(arrayData.length/8);i++) {
                imgUrls.push(i)
              }
              if(arrayData.length>8){
                that.setData({
                  array: arrayData.slice(8*cur,8*(cur+1))
                })
              }else{
                that.setData({
                  array: arrayData
                })
              }
              that.setData({
                imgUrls: imgUrls
              })
              that.setData({
                shopid: res.data.shopid,
                array2: res.data.array2||[],
                array3: res.data.array3||[],
                array4: res.data.array4||[],
                array5: res.data.array5||[],
                'rgcData.city': res.data.shopname
              })
              app.globalData.shopname = res.data.shopname
            } else {
              that.setData({
                hideCube: "hideCube"
              })
              wx.showToast({
                title: '加载失败!',
                mask: true,
                image: '../../images/warn.png'
              })
            }
          }, fail: function (err) {
            that.setData({
              hideCube: "hideCube"
            })
            wx.showToast({
              title: '加载失败!',
              mask: true,
              image: '../../images/warn.png'
            })
            console.log(err)
          }
        })
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })


    var BMap = new bmap.BMapWX({
      ak: 'ilmtFnInNw3yoXGB6etlhRTFgrOt8uPy'
    })
    var fail = function(data) {
      that.setData({
        animation: "",
        "rgcData.formatted_address": "未知",
      })
    }
    var success = function(data) {
      originalData = data.originalData;
      var formatted_address = originalData.result.formatted_address;
      that.setData({
        "rgcData.formatted_address": formatted_address,
        animation: ""
      })
    }
    BMap.regeocoding({
      fail: fail,
      success: success
    })
  },
  onPullDownRefresh: function () {
    var that = this
    wx.showLoading({
      title: '页面刷新中...',
      mask: true
    })
    that.onLoad()
    /*//请求新数据..
    wx.request({
      url: index_url,
      data: {
        lng: that.data.longitude,
        lat: that.data.latitude
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var error_code = res.data.error_code
        if (error_code == '0') {
          that.setData({
            hideCube: "hideCube"
          })
          wx.showToast({
            title: '加载成功!',
            mask: true
          })
          arrayData = res.data.array
          var imgUrls = []
          for(var i=0;i<Math.ceil(arrayData.length/8);i++) {
            imgUrls.push(i)
          }
          if(arrayData.length>8){
            that.setData({
              array: arrayData.slice(8*cur,8*(cur+1))
            })
          }
          that.setData({
            imgUrls: imgUrls
          })
          that.setData({
            array2: res.data.array2,
            array3: res.data.array3,
            array4: res.data.array4,
            array5: res.data.array5,
            'rgcData.city': res.data.shopname
          })
        } else {
          that.setData({
            hideCube: "hideCube"
          })
          wx.showToast({
            title: '加载失败!',
            mask: true,
            image: '../../images/warn.png'
          })
        }
      }, fail: function (err) {
        that.setData({
          hideCube: "hideCube"
        })
        wx.showToast({
          title: '服务器异常,加载失败!',
          mask: true,
          image: '../../images/warn.png'
        })
        console.log(err)
      }, complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })*/
  },onShow: function () {
    if(!wx.hideLoading){
      wx.showModal({
        showCancel: false,
        content: '当前微信版本过低,大部分功能无法使用,请升级至最新版本后重试!',
        success: function(res) {
          if (res.confirm) {
          }
        }
      })
    }
  },
  onPageScroll: function () {
    var that = this
    var query = wx.createSelectorQuery()
    query.select('#fourth').boundingClientRect()
    query.exec(function(res){
      if(res[0].top < 0){
          that.setData({
            showScrollTop: true
          })
      }else{
          that.setData({
            showScrollTop: false
          })
      }
    })
  },
  scrollTopClick: function () {
      wx.pageScrollTo({
        scrollTop: 0
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
  },dingzhi: function () {
    if(uid!=''&&uid!=null&&uid!=undefined){
      wx.navigateTo({
        url: '../baochang/baochang'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '该功能需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },party: function () {
      if(uid!=''&&uid!=null&&uid!=undefined){
          wx.navigateTo({
            url: '../party/party'
          })
      }else{
          wx.showModal({
            title: '提示',
            content: '该功能需要先登录,立即登录?',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login'
                })
              }
            }
          })
      }
  },checkNear: function () {
      wx.navigateTo({
        url: '../near/index?location='+this.data.rgcData.formatted_address+'&longitude='+this.data.longitude+'&latitude='+this.data.latitude+'&shopid='+this.data.shopid
      })
  }
})