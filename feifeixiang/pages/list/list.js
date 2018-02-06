const host = require('../../config.js').service.host
const list_url = require('../../config.js').service.list_url
const order_tea_url = require('../../config.js').service.order_tea_url

var uid
var m
var price = 0;
var borderIndex = 0;
var isTiefen = ''

// var itemAll = [].concat(item1,item2,item3,item4,item5,item6,item7);//更新: 全部

// 用来存储高度的数组
// var dataheith = [0];
var arrAll = [];

// 左侧id
var linheightid = 0;

// var items2 = [item1,item2,item3,item4,item5,item6,item7]

Page({
  data: {
    price: 0,
    minusSrc: "../../images/jianshao.png",
    plusSrc: "../../images/tianjia.png",
    scroll: "scroll",
    display: "none",
    emptySrc: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/empty.png',
    // 页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/jiantou.png',
    src1: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/jt_up.png',
    src2: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/empty.png',
  },
  // 滑动切换tab
  bindChange: function( e ) {
    var that = this;
    var scrollLeft = e.detail.current>=3 ? 300 : 0;
    that.setData({
      currentTab: e.detail.current,
      scrollLeft: scrollLeft,
      linheightid: 0,
      intoid: "id0",
      text: that.data.items[e.detail.current]['content']
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
        display: 'none',
        linheightid: 0,
        intoid: "id0",
        text: that.data.items[e.target.dataset.current]['content']
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
onLoad: function(options) {
    price = 0
    uid = wx.getStorageSync('uid');
    isTiefen = wx.getStorageSync('isTiefen');
    if(isTiefen == true||isTiefen == 'true'){
      var viptime = wx.getStorageSync('viptime')
      var now = new Date().getTime()
      var date = parseInt(viptime)*1000
      if(now > date){
        //铁粉过期
        isTiefen = false
        wx.getStorageSync('isTiefen',false)
        wx.removeStorageSync('viptime')
      }
    }
    var that = this;
    that.setData({
      hideCube: ""
      })
    var j
    if(options.text){
      that.setData({
        text: options.text
      })
      wx.request({
        url: list_url,
        data: {
          shopid: options.shopid
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
            var array0 = res.data.array0
            var array1 = res.data.array1
            var array2 = res.data.array2
            var array3 = res.data.array3
            // var array4 = res.data.array4
            // var array5 = res.data.array5
            var array6 = res.data.array6

            /*var keys0 = [];
            var keys1 = [];
            var keys5 = [];

            for (var p1 in array0) {
              if (array0.hasOwnProperty(p1))
                keys0.push(p1);
            }
            for (var p1 in array1) {
              if (array1.hasOwnProperty(p1))
                keys1.push(p1);
            }
            for (var p1 in array5) {
              if (array0.hasOwnProperty(p1))
                keys5.push(p1);
            }
            var arr0 = []
            var arr1 = []
            var arr5 = []
            for(var i=0;i<keys0.length;i++){
                arr0.push(array0[keys0[i]])
            }
            for(var i=0;i<keys1.length;i++){
                arr1.push(array1[keys1[i]])
            }
            for(var i=0;i<keys5.length;i++){
                arr5.push(array5[keys5[i]])
            }*/
            var items2 = []
            items2.push(array0)
            items2.push(array1)
            items2.push([array2])
            items2.push([array3])
            // items2.push([array4])
            // items2.push(array5)
            items2.push([array6])
            that.setData({
              items: res.data.items,
              items2: items2
            })
            for(var i=0;i<that.data.items.length;i++){
              if(options.text == that.data.items[i].content){
                j=i
              }
              if('请喝茶' == that.data.items[i].content){
                m=i
              }
            }
            that.setData({
              currentTab: j
            })
            var length = [];
            for (var i = 0; i < items2.length; i++) {
              if(items2[i]!=null&&items2[i][0]!=null){
                if(items2[i][0].rightdata){
                  length.push(items2[i][0].rightdata.length)
                }
              }
            }

            setTimeout(function () {
              if (wx.createSelectorQuery) {
                wx.createSelectorQuery().selectAll('.right>.border').boundingClientRect(function(rects){
                  var heightArr = []
                  var start = 0
                  var end = length[0]
                  for (var i = 0; i < length.length; i++) {
                    var arr = rects.slice(start,end)
                    heightArr.push(arr)
                    start = end
                    end = start+length[i+1]
                  }
                  for (var i = 0; i < heightArr.length; i++) {
                    var height = 0
                    var arr2 = [0]
                    for (var j = 0; j < heightArr[i].length; j++) {
                      height += heightArr[i][j].height
                      arr2.push(height);
                    }
                    arrAll.push(arr2)
                  }
                }).exec()
              }
            },1000)
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

    }

    // 获取系统信息
    wx.getSystemInfo({
      success: function( res ) {
        var ratio = 750/res.windowWidth
       /* // 计算每个分类开始的高度:150rpx/屏幕比例
        var indexheight = 0
        for (var i = 0; i < data.length; i++) {
          indexheight += (data[i].length * 200/ratio+84/ratio);
          // console.log("每类的长度", data[i].length);
          dataheith.push(indexheight);
          // console.log("高度数组", dataheith)
        }*/
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          ratio: ratio,
          linheightid: linheightid
        })
      }
    });
  },
  // 左侧点击事件
  clickbtn: function (e) {
    var that = this;
    // console.log("你点击的ID为：", e.target.id);
    linheightid = e.target.id;
    // console.log(typeof id)
    this.setData({
      intoid: "id" + linheightid,
      linheightid: linheightid,
      scroll: ""
    });
    // 阻止scroll冒泡
    setTimeout(function () {
      that.setData({
        scroll: "scroll"
      });
    }, 500)
  },
  // 滚动触发
  scroll: function (e) {
    var count = 0
    var currentTab = this.data.currentTab
    for (var i = 0; i <= currentTab; i++) {
      if(this.data.items2[i][0]){
        if(this.data.items2[i][0].rightdata){
          count++
        }
      }

    }
    // console.log(e);
    var scrolltop = e.detail.scrollTop;
    for (var i = 1; i < arrAll[count-1].length; i++) {
      if (scrolltop <= arrAll[count-1][i]) {
        // console.log(i);
        // console.log(scrolltop)
        if (linheightid != (i-1)) {
          linheightid = i - 1
          this.setData({
            linheightid: linheightid
          })
        }
        break
      }
    }
  },
  reduce: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var items2 = that.data.items2
    setTimeout(function () {
      var count = items2[m][0].rightdata[borderIndex].data[index].count
      if(isTiefen == true||isTiefen == 'true'){
        var money = parseInt(items2[m][0].rightdata[borderIndex].data[index].tiefen)
      }else{
        var money = parseInt(items2[m][0].rightdata[borderIndex].data[index].yuanjia)
      }
      if(count >= 1){
        count--
      }
      price -= money
      var param = {}
      var str = `items2[${m}][0].rightdata[${borderIndex}].data[${index}].count`
      param[str] = count
      param['price'] = price
      that.setData(param)
    },100)
  },
  plus: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var items2 = that.data.items2
    setTimeout(function () {
        var count = items2[m][0].rightdata[borderIndex].data[index].count
        if(isTiefen == true||isTiefen == 'true'){
          var money = parseInt(items2[m][0].rightdata[borderIndex].data[index].tiefen)
        }else{
          var money = parseInt(items2[m][0].rightdata[borderIndex].data[index].yuanjia)
        }
        count++
        price += money
        var param = {}
        var str = `items2[${m}][0].rightdata[${borderIndex}].data[${index}].count`
        param[str] = count
        param['price'] = price
        that.setData(param)
    },100)
  },
  borderTap: function (e) {
    borderIndex = e.currentTarget.dataset.index
  },
  pay: function () {
      if(uid!=''&&uid!=null&&uid!=undefined){
        var that = this
        var teaItems = [];
        var teaItems2 = [];
        var rightdata = this.data.items2[m][0].rightdata
        for(var i=0;i<rightdata.length;i++){
          if(rightdata[i].data){
            for(var j=0;j<rightdata[i].data.length;j++){
              if(rightdata[i].data[j].count>0){
                var tea = {}
                var tea2 = {}
                tea['id'] = rightdata[i].data[j].id
                tea['num'] = rightdata[i].data[j].count
                teaItems.push(tea)
                tea2['name'] = rightdata[i].data[j].title
                tea2['num'] = rightdata[i].data[j].count
                if(isTiefen == true||isTiefen == 'true'){
                  var money = rightdata[i].data[j].tiefen
                }else{
                  var money = rightdata[i].data[j].yuanjia
                }
                tea2['price'] = money*rightdata[i].data[j].count
                teaItems2.push(tea2)
              }
            }
          }
        }
          wx.showLoading({
            title: '下单中...',
            mask: true
          })
          wx.request({
            url: order_tea_url,
            data: {
              uid: uid,
              items:JSON.stringify(teaItems)
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              var error_code = res.data.error_code
              if (error_code == '0') {
                wx.navigateTo({
                  url: `../pay/pay?orderid=${res.data.orderid}&text=${that.data.text}&time=${res.data.time}&price=${res.data.price}&hongbao=${res.data.hongbao}&teaItems2=${JSON.stringify(teaItems2)}`
                })
              } else {
                wx.showToast({
                  title: '下单失败!',
                  mask: true,
                  image: '../../images/warn.png'
                })
              }
            }, fail: function (err) {
              wx.showToast({
                title: '下单失败!',
                mask: true,
                image: '../../images/warn.png'
              })
              console.log(err)
            }
          })
      }else{
        wx.showModal({
        title: '提示',
        content: '购买需要先登录,立即登录?',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  }
})
