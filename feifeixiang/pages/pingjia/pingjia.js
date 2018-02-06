const host = require('../../config.js').service.host
const photo_pingjia_url = require('../../config.js').service.photo_pingjia_url
const pingjia_url = require('../../config.js').service.pingjia_url
var uid
var photoid = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
      stars:[{
        id: 0,
        src: 'https://'+host+'/data/upload/order/xing_w.png',
      },{
        id: 1,
        src: 'https://'+host+'/data/upload/order/xing_w.png',
      },{
        id: 2,
        src: 'https://'+host+'/data/upload/order/xing_w.png',
      },{
        id: 3,
        src: 'https://'+host+'/data/upload/order/xing_w.png',
      },{
        id: 4,
        src: 'https://'+host+'/data/upload/order/xing_w.png',
      }],
      src1: 'https://'+host+'/data/upload/order/tj_bg.png',
      src2: 'https://'+host+'/data/upload/order/tj_img.png',
      del: 'https://'+host+'/data/upload/order/del_img.png',
      photos: [],
      // photos:[{
      //     id: 0,
      //     src: 'https://'+host+'/data/upload/order/tj_bg.png',
      // },{
      //     id: 1,
      //     src: 'https://'+host+'/data/upload/order/tj_bg.png',
      // },{
      //     id: 2,
      //     src: 'https://'+host+'/data/upload/order/tj_bg.png',
      // },{
      //     id: 31,
      //     src: 'https://'+host+'/data/upload/order/tj_bg.png',
      // }],
      // holder: `活动还满意吗?孩子收获大吗?有什么想对飞飞象或者举办方说的吗?写满15字才是好同志`,
      num: 15,
      display: 'block'
  },
  input: function (e) {
      var value = e.detail.value
      var length = value.length
      var num = 15
      num = length>num?0:num-length
      this.setData({
        num: num,
        value: value,
      })
      if(length == 0){
          this.setData({
              display: 'block'
          })
      }else{
          this.setData({
              display: 'none'
          })
      }
  },
    tapStar: function (e) {
        var index = e.currentTarget.dataset.index
        var param = {}
        var src = `stars[${index}].src`
        var score = index+1
        for(var i=0;i<=index;i++){
            var src = `stars[${i}].src`
            param[src] = 'https://'+host+'/data/upload/order/xing_y.png'
        }
        for(var i=4;i>index;i--){
            var src = `stars[${i}].src`
            param[src] = 'https://'+host+'/data/upload/order/xing_w.png'
        }
        param['score'] = score
        this.setData(param)
    },
    //多个图片上传方法
    uploadImages(filePaths,successUp,failUp,i,length){
        var that = this
        wx.uploadFile({
            url: photo_pingjia_url,
            filePath: filePaths[i],
            name: 'photo',
            header: {'content-type': 'application/x-www-form-urlencoded'},
            formData:{
                uid: uid
            },
            success: (res) => {
                successUp++;
                var data = JSON.parse(res.data)
                photoid = photoid+data.photoid+','
            },
            fail: (res) => {
                failUp ++;
            },
            complete: () => {
                i ++;
                if(i == length)
                {
                    if(successUp == length){
                        photoid = photoid.substr(0,photoid.length-1)
                        //上传评分和评价
                        wx.request({
                            url: pingjia_url,
                            data: {
                                uid: uid,
                                orderid: that.data.orderid,
                                photoid: photoid,
                                score: that.data.score,
                                value: that.data.value
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                                console.log(res)
                                var error_code = res.data.error_code
                                if (error_code == '0') {
                                    var pages = getCurrentPages()
                                    var j
                                    for(var i=0;i<pages.length;i++){
                                        if(pages[i].route === "pages/allorder/allorder"){
                                            j = i;
                                            break;
                                        }
                                    }
                                    wx.hideLoading()
                                    wx.showModal({
                                        content: "您已成功评价,管理员审核后会显示在该产品的评价列表中,并获得好评红包",
                                        showCancel: false,
                                        success: function(res) {
                                            if (res.confirm) {
                                                if(j!=undefined){
                                                    pages[j].onLoad()
                                                    pages[j].setData({
                                                        currentTab: 3
                                                    })
                                                }
                                                wx.navigateBack({
                                                    delta: 1
                                                })
                                            }else{
                                                if(j!=undefined){
                                                    pages[j].onLoad()
                                                    pages[j].setData({
                                                        currentTab: 3
                                                    })
                                                }
                                                wx.navigateBack({
                                                    delta: 1
                                                })
                                            }
                                        }
                                    })


                                } else {
                                    wx.showToast({
                                        title: '评价失败!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                }
                            }, fail: function (err) {
                                wx.showToast({
                                    title: '评价失败!',
                                    mask: true,
                                    image: '../../images/warn.png'
                                })
                                console.log(err)
                            }
                        })
                    }else{
                        wx.showToast({
                            title: '评价失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                    }

                }
                else
                {  //递归调用uploadImages函数
                    that.uploadImages(filePaths,successUp,failUp,i,length);
                }
            },
        });
    },

      choosePhoto: function () {
          if(this.data.photos.length>9){
              wx.showToast({
                  title: '最多上传9张图片',
                  mask: true,
                  image: '../../images/warn.png'
              })
          }else{
              var that = this
              wx.chooseImage({
                  //count: 1, // 默认9
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: function(res) {
                      var tempFilePaths = res.tempFilePaths
                      var photos = that.data.photos
                      photos = photos.concat(tempFilePaths)
                      if(photos.length>9){
                          wx.showToast({
                              title: '最多传9张',
                              mask: true,
                              image: '../../images/warn.png'
                          })
                      }else{
                          that.setData({
                              photos: photos
                          })
                      }
                  }
              })
          }

    },
    finish: function () {
        var that = this
        var photos = that.data.photos
        if(this.data.score == undefined){
            wx.showToast({
                title: '请点星标打分!',
                mask: true,
                image: '../../images/warn.png'
            })
        }else if(this.data.value == undefined||this.data.value.length == 0){
            wx.showToast({
                title: '请填写评价!',
                mask: true,
                image: '../../images/warn.png'
            })
        }else if(this.data.num > 0){
            wx.showToast({
                title: '评价需满15字!',
                mask: true,
                image: '../../images/warn.png'
            })
        }else{
            //评价请求...
            if(photos.length > 0){
                var successUp = 0; //成功个数
                var failUp = 0; //失败个数
                var length = photos.length; //总共个数
                var i = 0; //第几个
                photoid = ''//每次评价前把photoid清空
                wx.showLoading({
                    title: '评价发布中...',
                    mask: true
                })
                that.uploadImages(photos,successUp,failUp,i,length);
            }else{
                //不带图片的评价
                wx.showLoading({
                    title: '评价发布中...',
                    mask: true
                })
                wx.request({
                    url: pingjia_url,
                    data: {
                        uid: uid,
                        orderid: that.data.orderid,
                        score: that.data.score,
                        value: that.data.value
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.hideLoading()
                            wx.showModal({
                                content: "您已成功评价,管理员审核后会显示在该产品的评价列表中,并获得好评红包",
                                showCancel: false
                            })
                            var pages = getCurrentPages()
                            var j
                            for(var i=0;i<pages.length;i++){
                                if(pages[i].route === "pages/allorder/allorder"){
                                    j = i;
                                    break;
                                }
                            }
                            if(j!=undefined){
                                pages[j].onLoad()
                                pages[j].setData({
                                    currentTab: 3
                                })
                            }
                            wx.navigateBack({
                                delta: 1
                            })
                        } else {
                            wx.showToast({
                                title: '评价失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '评价失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                        console.log(err)
                    }
                })
            }

        }
    },
    preview: function (e) {
        var index = e.currentTarget.dataset.index
        var photos = this.data.photos
        wx.previewImage({
            current: photos[index], // 当前显示图片的链接
            urls: photos// 需要预览的图片链接列表
        })
    },
    del: function (e) {
        var index = e.currentTarget.dataset.index
        var photos = this.data.photos
        photos.splice(index,1)
        this.setData({
            photos: photos
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      uid = wx.getStorageSync('uid');
      if(options.orderid){
          this.setData({
              orderid: options.orderid
          })
      }
      this.setData({
            hideCube: "",
            hide2: "hide2"
        })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.setData({
          hideCube: "hideCube",
          hide2: ""
      })
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