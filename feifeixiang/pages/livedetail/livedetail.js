const host = require('../../config.js').service.host
const live_del_url = require('../../config.js').service.live_del_url
const zanshang_url = require('../../config.js').service.zanshang_url
const live_dianzan_url = require('../../config.js').service.live_dianzan_url
const live_pinglun_url = require('../../config.js').service.live_pinglun_url
const live_url = require('../../config.js').service.live_url
var imgIndex = 0
var gIndex = 0
var gPingjia = []
var gIndex2 = 0
var gDashang = []
var uid
var name
var liveid
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // moneyItems: ['1元','2元','3元','4元','5元','6元'],
      show: "show",
      showOther: false,
      isPinglun:false,
      // src: 'http://ffx.weiweitouzi.cn/data/upload/direct/20170926/15084790462.JPG',
      src2: 'http://'+host+'/app/template/wap/images/pinglun_img.png',
      src5: 'http://'+host+'/app/template/wap/images/live_del.png',
      zansrc2: 'http://'+host+'/data/upload/details/2x/zan_unclick.png',
      // title: '高端会所体验,在锻炼身体的同时,锻炼敏捷的思维,判断能力高端会所体验,在锻炼身体的同时,锻炼敏捷的思维,判断能力高端会所体验,在锻炼身体的同时,锻炼敏捷的思维,判断能力',
      // time: '08-09',
      // iszhubo: true,
      items22: [{
              id: 0,
              zhuboid: 3,
              pingjia: ['ss赞了一下','ss:不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦','zz赞了一下'],
              dashang: ['ss打赏了主播5元','saa打赏了主播2元'],
              src: 'http://ffx.weiweitouzi.cn/data/upload/user/20170928/15122996952.JPG',
              zansrc: 'http://'+host+'/data/upload/details/2x/zan_unclick.png',
              name: '张三',
              zannum: 3,
              date: '09-28 09:35',
              ismyzhibo: true,
              miaoshu: '描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多',
              img: [
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15143484428.JPG"]
            },{
              id: 1,
              zhuboid: 3,
              pingjia: ['ss赞了一下','ss:不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦不错哦','zz赞了一下'],
              dashang: ['ss打赏了主播5元','saa打赏了主播2元'],
              src: 'http://ffx.weiweitouzi.cn/data/upload/user/20170928/15122996952.JPG',
              zansrc: 'http://'+host+'/data/upload/details/2x/zan_unclick.png',
              name: '张三',
              zannum: 3,
              date: '09-28 09:35',
              ismyzhibo: true,
              miaoshu: '描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多',
              video: 'https://'+host+'/data/upload/live/20171010/15097011957.MP4'
            },{
              id: 2,
              zhuboid: 3,
              src: 'http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG',
              zansrc: 'http://'+host+'/data/upload/details/2x/zan_unclick.png',
              name: '李四',
              zannum: 8,
              date: '09-28 09:35',
              ismyzhibo: false,
              miaoshu: '描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多描述大大大大大多多多多多多多多多',
              img: [
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15143484428.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15117465897.JPG",
                "http://ffx.weiweitouzi.cn/data/upload/evaluate/20170905/15143484428.JPG"]
            }

    ]

  },upload: function () {
    wx.navigateTo({
      url: '../upload/upload?id='+this.data.id+'&pid='+this.data.pid
    })
  },del: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该条直播吗?',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
            mask: true
          })
          //发送删除请求,入参id,成功后删除数组元素
          var index = e.currentTarget.dataset.index
          var items = that.data.items
          var id = items[index].id
          wx.request({
            url: live_del_url,
            data: {
              id: id
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var error_code = res.data.error_code
              if (error_code == '0') {
                wx.showToast({
                  title: '删除成功!',
                  mask: true
                })
                items.splice(index,1)
                that.setData({
                  items: items
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

  },hideDashang: function () {
      this.setData({
        show: "show"
      })
  },clickRed: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    this.setData({
      currentRed: index
    })

    if(uid!=''&&uid!=null&&uid!=undefined){
      wx.showLoading({
        title: '请求支付中...',
        mask: true
      })

      app.getUserOpenId(function(err, openid) {
        if (!err) {
          var money = that.data.moneyItems[index]
          var moneyArr = money.split('元')
          money = moneyArr[0]
          wx.request({
            url: zanshang_url,
            data: {
              openid,
              uid: uid,
              money: money,
              liveid: liveid
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log('unified order success, response is:', res)
              var payargs = res.data
              var type = typeof payargs
              if(type == 'string'){
                payargs = payargs.split('"')
                if(wx.hideLoading){
                  wx.hideLoading()
                }
                wx.requestPayment({
                  nonceStr: payargs[7],
                  package: payargs[11],
                  signType: payargs[15],
                  timeStamp: payargs[19],
                  paySign: payargs[23],
                  success:function(res){
                    if(wx.vibrateLong){
                      wx.vibrateLong()
                    }
                    wx.showToast({
                      title: '赞赏成功!',
                      mask: true
                    })
                    that.setData({
                      show: "show"
                    })
                    gDashang = that.data.items[gIndex2].dashang||[]
                    var dashangText = that.data.name+' 打赏了'+that.data.moneyItems[index]
                    gDashang.push(dashangText)
                    var param = {}
                    var text = `items[${gIndex2}].dashang`
                    param[text] = gDashang
                    that.setData(param)
                  },
                  fail:function(res){
                  }
                })
              }else{
                if(wx.hideLoading){
                  wx.hideLoading()
                }
                wx.requestPayment({
                  timeStamp: payargs.timeStamp,
                  nonceStr: payargs.nonceStr,
                  package: payargs.package,
                  signType: payargs.signType,
                  paySign: payargs.paySign,
                  success:function(res){
                    if(wx.vibrateLong){
                      wx.vibrateLong()
                    }
                    wx.showToast({
                      title: '赞赏成功!',
                      mask: true
                    })
                    that.setData({
                      show: "show"
                    })
                    gDashang = that.data.items[gIndex2].dashang||[]
                    var dashangText = that.data.name+' 打赏了'+that.data.moneyItems[index]
                    gDashang.push(dashangText)
                    var param = {}
                    var text = `items[${gIndex2}].dashang`
                    param[text] = gDashang
                    that.setData(param)
                  },
                  fail:function(res){
                  }
                })
              }
            }, fail: function (err) {
              wx.showToast({
                title: '请求失败!',
                mask: true,
                image: '../../images/warn.png'
              })
              console.log(err)
            }, complete: function (err) {
              that.setData({
                load: false,
                flag: false,
                disabled: ""
              })
              if(wx.hideLoading){
                wx.hideLoading()
              }
            }
          })
        } else {
          console.log('err:', err)
          wx.showToast({
            title: '请求失败!',
            mask: true,
            image: '../../images/warn.png'
          })
          that.setData({
            load: false,
            flag: false,
            disabled: ""
          })
          if(wx.hideLoading){
            wx.hideLoading()
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '赞赏需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }

  },other: function () {
      this.setData({
        showOther: true
      })
  },choose: function () {
      this.setData({
        showOther: false
      })
  }, preview: function (e) {
    imgIndex = e.currentTarget.dataset.index
  },
  previewArr: function (e) {
    var index = e.currentTarget.dataset.index
    var photos = this.data.items[index].img
    wx.previewImage({
      current: photos[imgIndex],
      urls: photos
    })
  },hide:function () {
    this.setData({
      isPinglun: false
    })
  },
  pinglun: function (e) {
    if(uid!=''&&uid!=null&&uid!=undefined){
      this.setData({
        isPinglun: true
      })
      gIndex = e.currentTarget.dataset.index
      gPingjia = this.data.items[gIndex].pingjia||[]
    }else{
      wx.showModal({
        title: '提示',
        content: '评论请先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },
  pinglunInput: function (e) {
    var message = e.detail.value
    this.setData({
      message: message
    })
    if(message.length == 140){
      wx.showToast({
        title: '已达最大字数!',
        mask: true,
        image: '../../images/warn.png'
      })
    }
  },otherInput: function (e) {
    var message = e.detail.value
    this.setData({
      otherMoney: message
    })
  },confirm: function (e) {
    var that = this;
    if(uid!=''&&uid!=null&&uid!=undefined){
      wx.showLoading({
        title: '请求支付中...',
        mask: true
      })

      app.getUserOpenId(function(err, openid) {
        if (!err) {
          var money = that.data.otherMoney
          wx.request({
            url: zanshang_url,
            data: {
              openid,
              uid: uid,
              money: money,
              liveid: liveid
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log('unified order success, response is:', res)
              var payargs = res.data
              var type = typeof payargs
              if(type == 'string'){
                payargs = payargs.split('"')
                if(wx.hideLoading){
                  wx.hideLoading()
                }
                wx.requestPayment({
                  nonceStr: payargs[7],
                  package: payargs[11],
                  signType: payargs[15],
                  timeStamp: payargs[19],
                  paySign: payargs[23],
                  success:function(res){
                    if(wx.vibrateLong){
                      wx.vibrateLong()
                    }
                    wx.showToast({
                      title: '赞赏成功!',
                      mask: true
                    })
                    that.setData({
                      show: "show"
                    })
                    gDashang = that.data.items[gIndex2].dashang||[]
                    var dashangText = that.data.name+' 打赏了'+money+'元'
                    gDashang.push(dashangText)
                    var param = {}
                    var text = `items[${gIndex2}].dashang`
                    param[text] = gDashang
                    that.setData(param)
                  },
                  fail:function(res){
                  }
                })
              }else{
                if(wx.hideLoading){
                  wx.hideLoading()
                }
                wx.requestPayment({
                  timeStamp: payargs.timeStamp,
                  nonceStr: payargs.nonceStr,
                  package: payargs.package,
                  signType: payargs.signType,
                  paySign: payargs.paySign,
                  success:function(res){
                    if(wx.vibrateLong){
                      wx.vibrateLong()
                    }
                    wx.showToast({
                      title: '赞赏成功!',
                      mask: true
                    })
                    that.setData({
                      show: "show"
                    })
                    gDashang = that.data.items[gIndex2].dashang||[]
                    var dashangText = that.data.name+' 打赏了'+money+'元'
                    gDashang.push(dashangText)
                    var param = {}
                    var text = `items[${gIndex2}].dashang`
                    param[text] = gDashang
                    that.setData(param)
                  },
                  fail:function(res){
                  }
                })
              }
            }, fail: function (err) {
              wx.showToast({
                title: '请求失败!',
                mask: true,
                image: '../../images/warn.png'
              })
              console.log(err)
            }, complete: function (err) {
              that.setData({
                load: false,
                flag: false,
                disabled: ""
              })
              if(wx.hideLoading){
                wx.hideLoading()
              }
            }
          })
        } else {
          console.log('err:', err)
          wx.showToast({
            title: '请求失败!',
            mask: true,
            image: '../../images/warn.png'
          })
          that.setData({
            load: false,
            flag: false,
            disabled: ""
          })
          if(wx.hideLoading){
            wx.hideLoading()
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '赞赏需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },
  zanshang: function (e) {
    gIndex2 = e.currentTarget.dataset.index
    var index = e.currentTarget.dataset.index
    var zanshangSrc = this.data.items[index].src
    var zanshangName = this.data.items[index].name
    liveid = this.data.items[index].id
    this.setData({
      zanshangSrc: zanshangSrc,
      zanshangName: zanshangName,
      show: ''
    })
  },
  dianzan: function (e) {
    if(uid!=''&&uid!=null&&uid!=undefined){
      var that = this
      var param = {}
      var zanText = this.data.name+' 赞了一下'
      var index = e.currentTarget.dataset.index
      var items = this.data.items
      var zansrc = items[index].zansrc
      var id = items[index].id
      if(zansrc == 'http://'+host+'/data/upload/details/2x/zan_unclick.png'){
        //请求:点赞
        wx.request({
          url: live_dianzan_url,
          data: {
            uid: uid,
            id: id,
            zanText: zanText
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var error_code = res.data.error_code
            if (error_code == '0') {
              var pingjia = that.data.items[index].pingjia||[]
              var zannum = parseInt(items[index].zannum)
              pingjia.push(zanText)
              var text2 = `items[${index}].pingjia`
              var text3 = `items[${index}].zansrc`
              var text4 = `items[${index}].zannum`
              param[text2] = pingjia
              param[text3] = 'http://'+host+'/data/upload/details/2x/zan_click.png'
              param[text4] = zannum+1
              that.setData(param)
            } else {
              wx.showToast({
                title: '请求失败!',
                mask: true,
                image: '../../images/warn.png'
              })
            }
          }, fail: function (err) {
            wx.showToast({
              title: '请求失败!',
              mask: true,
              image: '../../images/warn.png'
            })
            console.log(err)
          }
        })

      }
    }else{
      wx.showModal({
        title: '提示',
        content: '点赞请先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },
  send: function () {
    var that = this
    var pinglunText = that.data.message||''
    var items = this.data.items
    var id = items[gIndex].id
    if(pinglunText!=''){
      wx.request({
        url: live_pinglun_url,
        data: {
          uid: uid,
          id: id,
          pinglunText: pinglunText
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          var error_code = res.data.error_code
          if (error_code == '0') {
            pinglunText = that.data.name+' '+pinglunText
            gPingjia.push(pinglunText)
            var param = {}
            var text = `items[${gIndex}].pingjia`
            param[text] = gPingjia
            param['message'] = ''
            that.setData(param)

          } else {
            wx.showToast({
              title: '请求失败!',
              mask: true,
              image: '../../images/warn.png'
            })
          }
        }, fail: function (err) {
          wx.showToast({
            title: '请求失败!',
            mask: true,
            image: '../../images/warn.png'
          })
          console.log(err)
        }
      })
    }else{
      wx.showModal({
        showCancel: false,
        content: '不能发送空白消息!',
        success: function(res) {
        }
      })
      this.setData({
        isPinglun: true
      })
    }
  },
  show: function () {
    this.setData({
      isPinglun: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      uid = wx.getStorageSync('uid');
      name = wx.getStorageSync('name');
      var that = this
      this.setData({
        uid: uid,
        name: name
      })
      if(options.id){
        this.setData({
          id: options.id,
          pid: options.pid,
        })
        if(uid!=''&&uid!=null&&uid!=undefined){
          var requestData = {
            uid: uid,
            id: options.id
          }
        }else{
          var requestData = {
            id: options.id
          }
        }
        wx.showLoading({
          title: '数据加载中...',
          mask: true
        })
        wx.request({
          url: live_url,
          data: requestData,
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
                moneyItems: data.moneyItems,
                src: data.src,
                title: data.title,
                time: data.time,
                iszhubo: data.iszhubo,
                items: data.items
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
          }, complete: function () {
            wx.hideLoading();
            wx.stopPullDownRefresh()
          }
        })
      }

  },
  checkDetail:function () {
    wx.navigateTo({
      url: '../details/index?id='+this.data.pid
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
      wx.showLoading({
        title: '页面刷新中...',
        mask: true
      })
      var options = {
        id: this.data.id,
        pid: this.data.pid
      }
      this.onLoad(options)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})