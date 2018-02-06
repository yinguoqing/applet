const host = require('../../config.js').service.host
const getallorder_url = require('../../config.js').service.getallorder_url
const delorder_url = require('../../config.js').service.delorder_url
const continuepay_url = require('../../config.js').service.continuepay_url
const tuikuan_url = require('../../config.js').service.tuikuan_url
const queren_url = require('../../config.js').service.queren_url

//index.js
//获取应用实例
var app = getApp()
var item1 = []
var item2 = []
var item3 = []
var item4 = []
var item5 = []
var itemAll = []
var items2 = []
var uid

Page({
  data: {
    display: "none",
    // 页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/jiantou.png',
    src1: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/jt_up.png',
    src2: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/empty.png',
    birthPic: 'https://'+host+'/data/upload/homepage/2x/birth.png',
    items: [{
        id: 0,
        content: '全部'
      },{
        id: 1,
        content: '待付款'
      },{
        id: 2,
        content: '未出行'
      },{
        id: 3,
        content: '待评价'
      },{
        id: 4,
        content: '租赁订单'
      },{
        id: 5,
        content: '退款订单'
      }]
  },
    onShow: function () {
/*
        var that = this
        //倒计时
        function countDown() {
            var num = 0
            for(var i = 0;i<that.data.items2[1].length;i++) {
                var endTime = that.data.items2[1][i].endTime//从后台拿取wx.request...
                var now = new Date();
                var leftTime = endTime - now.getTime();
                var leftsecond = parseInt(leftTime / 1000);
                var param ={}
                var str = `items2[1][${i}].time`;
                var str2 = `items2[0][${i}].time`;

                if (leftsecond > 0) {
                    var hour = Math.floor(leftsecond / 3600)
                    var minute = Math.floor((leftsecond - hour * 3600) / 60)
                    var second = Math.floor(leftsecond - hour * 3600 - minute * 60)
                    if (hour == 0) {
                        hour = "00"
                    } else if (hour < 10) {
                        hour = "0" + hour
                    }
                    if (minute == 0) {
                        minute = "00"
                    } else if (minute < 10) {
                        minute = "0" + minute
                    }
                    if (second == 0) {
                        second = "00"
                    } else if (second < 10) {
                        second = "0" + second
                    }
                    var countDown = "支付剩余时间 " + hour + ":" + minute + ":" + second
                    --leftsecond
                    param[str] = countDown
                    param[str2] = countDown
                    that.setData(param)
                } else {
                    num++;
                    console.log(num)
                    param[str] = "已过期"
                    param[str2] = "已过期"
                    that.setData(param)
                    //所有订单都过期后,定时器停止
                    if(num == that.data.items2[1].length){
                        clearInterval(time)
                    }
                }
            }
        }
        countDown();
        var time = setInterval(countDown, 1000)*/
    },
  onLoad: function(options) {
      items2 = []
      var options = options||'';
      uid = wx.getStorageSync('uid');
      var that = this;
      if(options.currentTab){
            that.setData({
                currentTab: options.currentTab
            })
      }
        // 获取系统信息
        wx.getSystemInfo({
          success: function( res ) {
            that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight
            })
          }
        });
      if(uid!=''&&uid!=null&&uid!=undefined){
          wx.showLoading({
              title: '数据加载中...',
              mask: true
          })
          wx.request({
              url: getallorder_url,
              data: {
                  uid: uid
              },
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

                      item1 = data.item0||[];//待付款
                      item2 = data.item1||[];//未出行
                      item3 = data.item2||[];//待评价
                      item4 = data.lease||[];//租赁订单
                      item5 = data.item3||[];//退款订单
                      //创建用于循环的数组,循环添加标题
                      var loopArr = []
                      loopArr.push(item1)
                      loopArr.push(item2)
                      loopArr.push(item3)
                      loopArr.push(item4)
                      loopArr.push(item5)
                      //status: 1-未支付，2-已支付，3-已完成,4-已过期,5-退款中,6-已评价，7-已退款
                      //zlstatus: 1-未归还，2-已归还
                      //yystatus: 2-预约请确认
                      for(var i=0;i<5;i++){
                          for(var j=0;j<loopArr[i].length;j++){
                              var status = loopArr[i][j].status
                              var zlstatus = loopArr[i][j].zlstatus
                              var yystatus = loopArr[i][j].yystatus
                              var type = ''
                              if(status == 1){
                                  type = '付款中'
                              }else if(status == 2){
                                  type = '请确认'
                              }else if(status == 3){
                                  type = '已确认'
                              }else if(status == 4){
                                  type = '未支付'
                              }else if(status == 5){
                                  type = '退款中'
                              }else if(status == 6){
                                  type = '已评价'
                              }else if(status == 7){
                                  type = '已退款'
                              }else if(zlstatus == 1){
                                  type = '租赁中'
                              }else if(zlstatus == 2){
                                  type = '已归还'
                              }else if(yystatus == 2){
                                  type = '未出行'
                              }
                              switch(i){
                                  case 0: item1[j].type = type;
                                          break;
                                  case 1: item2[j].type = type;
                                          break;
                                  case 2: item3[j].type = type;
                                          break;
                                  case 3: item4[j].type = type;
                                          break;
                                  case 4: item5[j].type = type;
                                          break;

                              }
                          }
                      }

                      itemAll = [].concat(item1,item2,item3,item4,item5);//全部
                      items2.push(itemAll)
                      items2.push(item1);//待付款
                      items2.push(item2);//未出行
                      items2.push(item3);//待评价
                      items2.push(item4);//租赁订单
                      items2.push(item5);//退款订单

                      that.setData({
                          items2: items2
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
      }
  },
  // 滑动切换tab
  bindChange: function( e ) {
      var that = this;
      var scrollLeft = e.detail.current>=3 ? 200 : 0;
      that.setData({
          currentTab: e.detail.current,
          scrollLeft: scrollLeft
      });
  },
  // 点击tab切换
  swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab == e.target.dataset.current ) {
          return false;
      }else{
          that.setData({
              currentTab: e.target.dataset.current,
              display: 'none'
          })


      }
  },
  clickJt: function () {
      this.setData({
        display: 'block'
      })
  },
  clickJt1: function () {
      this.setData({
        display: 'none'
      })
  },
  hideMenu: function () {
      this.setData({
        display: 'none'
      })
  },
  catch: function () {
    
  },
  cancel: function (e) {
      var that = this
      wx.showModal({
        content: '订单删除后无法恢复,确定删除吗?',
        success: function(res) {
          if (res.confirm) {
              wx.showLoading({
                  title: '删除中...',
                  mask: true
              })
              var index = e.currentTarget.dataset.index;
              var orderid = item1[index].orderid
              wx.request({
                  url: delorder_url,
                  data: {
                      orderid: orderid
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
                          item1.splice(index, 1);//更新: 付款中
                          itemAll = [].concat(item1,item2,item3,item4,item5);//更新: 全部
                          that.setData({
                              'items2[0]': itemAll,
                              'items2[1]': item1
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
    pay: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var orderid = item1[index].orderid
        wx.showLoading({
            title: '订单查询中...',
            mask: true
        })
        wx.request({
            url: continuepay_url,
            data: {
                orderid: orderid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var error_code = res.data.error_code
                if (error_code == '0') {
                    wx.showToast({
                        title: '查询成功!',
                        mask: true
                    })
                    var title = res.data.title
                    var date = res.data.date
                    var price = res.data.price
                    var hongbao = res.data.hongbao
                    if(res.data.teaItems){
                        wx.navigateTo({
                            url: `../pay/pay?orderid=${orderid}&text=请喝茶&time=${res.data.date}&hongbao=${hongbao}&price=${price}&teaItems2=${JSON.stringify(res.data.teaItems)}`
                        })
                    }else{
                        wx.navigateTo({
                            url: `../pay/pay?title=${title}&date=${date}&price=${price}&hongbao=${hongbao}&orderid=${orderid}`
                        })
                    }

                } else {
                    wx.showToast({
                        title: '查询失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '查询失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }
        })
       /* //支付成功
        var index = e.currentTarget.dataset.index;
        item1[index].type = '请确认'
        delete item1[index].endTime
        item2.push(item1[index]);//移入: 未出行
        item1.splice(index, 1);//移出: 付款中
        itemAll = [].concat(item1,item2,item3,item4,item5);//更新: 全部
        that.setData({
            'items2[0]': itemAll,
            'items2[1]': item1,
            'items2[2]': item2
        })*/
    },
      tuikuan: function (e) {
        var that = this;
        wx.showModal({
          content: '确定要申请退款吗?',
          success: function(res) {
            if (res.confirm) {
                var index = e.currentTarget.dataset.index;
                if(that.data.currentTab == 0){
                    index = index - item1.length
                }
                wx.showLoading({
                    title: '申请退款中...',
                    mask: true
                })
                wx.request({
                    url: tuikuan_url,
                    data: {
                        uid: uid,
                        orderid: item2[index].orderid
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.hideLoading()
                            wx.showModal({
                                showCancel: false,
                                content: '申请退款成功,请等待管理员处理!'
                            })
                            item2[index].type = '退款中'
                            item2[index].status = 5
                            item5.push(item2[index]);//移入: 退款订单
                            item2.splice(index, 1);//移出: 未出行
                            itemAll = [].concat(item1,item2,item3,item4,item5);//更新: 全部
                            that.setData({
                                'items2[0]': itemAll,
                                'items2[2]': item2,
                                'items2[5]': item5
                            })
                            that.setData({
                                currentTab: 5
                            })
                        } else {
                            wx.showToast({
                                title: '申请退款失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '申请退款失败!',
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
      qxYuyue: function (e) {
          //取消预约接口没做,暂时不需要
        var that = this
        wx.showModal({
          content: '取消预约后无法恢复,确定取消吗?',
          success: function(res) {
            if (res.confirm) {
                var index = e.currentTarget.dataset.index;
                if(that.data.currentTab == 0){
                    index = index - item1.length
                }
                wx.showLoading({
                    title: '取消预约中...',
                    mask: true
                })
                wx.request({
                    url: url,
                    data: {
                        uid: uid,
                        orderid: item2[index].orderid,
                        c: 'qxyuyue'
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.showToast({
                                title: '取消预约成功!',
                                mask: true
                            })
                            item2.splice(index, 1);//移出: 未出行
                            itemAll = [].concat(item1,item2,item3,item4,item5);//更新: 全部
                            that.setData({
                                'items2[0]': itemAll,
                                'items2[2]': item2
                            })
                        } else {
                            wx.showToast({
                                title: '取消预约失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '取消预约失败!',
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
        qupingjia: function (e) {
            var that = this;
            var index = e.currentTarget.dataset.index;
            if(that.data.currentTab == 0){
                index = index - item1.length -  item2.length
            }
            wx.navigateTo({
                url: '../pingjia/pingjia?orderid='+item3[index].orderid
            })
        },
        queren:function (e) {
            var that = this
            wx.showModal({
                content: '确认完成订单后无法退款,确认完成吗?',
                success: function (res) {
                    if (res.confirm) {
                        var index = e.currentTarget.dataset.index;
                        if(that.data.currentTab == 0){
                            index = index - item1.length
                        }
                        wx.showLoading({
                            title: '确认完成中...',
                            mask: true
                        })
                        wx.request({
                            url: queren_url,
                            data: {
                                orderid: item2[index].orderid
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                                var error_code = res.data.error_code
                                if (error_code == '0') {
                                    wx.showToast({
                                        title: '确认成功!',
                                        mask: true
                                    })
                                    item2[index].type = '已确认'
                                    item2[index].status = 3
                                    item3.push(item2[index]);//移入: 待评价
                                    item2.splice(index, 1);//移出: 未出行
                                    itemAll = [].concat(item1,item2,item3,item4,item5);//更新: 全部
                                    that.setData({
                                        'items2[0]': itemAll,
                                        'items2[2]': item2,
                                        'items2[3]': item3,
                                    })
                                    that.setData({
                                        currentTab: 3
                                    })
                                } else {
                                    wx.showToast({
                                        title: '确认失败!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                }
                            }, fail: function (err) {
                                wx.showToast({
                                    title: '确认失败!',
                                    mask: true,
                                    image: '../../images/warn.png'
                                })
                                console.log(err)
                            }
                        })
                    }
                }
            })
        }

})
