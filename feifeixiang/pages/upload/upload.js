const host = require('../../config.js').service.host
const url = require('../../config.js').service.url
const video_url = require('../../config.js').service.video_url
const photo_url = require('../../config.js').service.photo_url
const photo_uploadlive_url = require('../../config.js').service.photo_uploadlive_url
const uploadlive_url = require('../../config.js').service.uploadlive_url
var uid = ''
var pid = ''
var id = ''
var photoid =''
var j
var pages
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src1: 'https://'+host+'/data/upload/order/tj_bg.png',
    src2: 'https://'+host+'/data/upload/order/tj_img.png',
    videoSrc: 'https://'+host+'/data/upload/order/video.png',
    del: 'https://'+host+'/data/upload/order/del_img.png',
    photos: [],
    video: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid = wx.getStorageSync('uid');
    if(options.pid){
      pid = options.pid
      id = options.id
    }
    pages = getCurrentPages()
    for(var i=0;i<pages.length;i++){
      if(pages[i].route === "pages/livedetail/livedetail"){
        j = i;
        break;
      }
    }
  },delVideo: function () {
    this.setData({
      video: '',
      margin: ''
    })
  },
  chooseVideo: function() {
    if(this.data.photos.length>0){
      wx.showModal({
        showCancel: false,
        content: '单次直播不能同时上传图片和视频!'
      })
    }else if(this.data.video!=''&&this.data.video!=null&&this.data.video!=undefined){
      wx.showModal({
        showCancel: false,
        content: '单次直播最多上传一个视频!'
      })
    }else{
      var that = this
      wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 60,
        camera: 'back',
        success: function(res) {
          if(res.size>31457280){
            wx.showModal({
              showCancel: false,
              content: '视频不能大于30M!'
            })
          }else{
            that.setData({
              video: res.tempFilePath,
              margin: 'margin'
            })
          }
        }
      })
    }

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
  choosePhoto: function () {
    if(this.data.video!=''&&this.data.video!=null&&this.data.video!=undefined){
      wx.showModal({
        showCancel: false,
        content: '单次直播不能同时上传图片和视频!'
      })
    }else if(this.data.photos.length==9){
      wx.showModal({
        showCancel: false,
        content: '单次直播最多上传9张图片!'
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
          var big = false
          for(var i=0;i<res.tempFiles.length;i++){
              if(res.tempFiles[i].size>3145728){
                big = true
              }
          }
          if(big){
            wx.showModal({
              showCancel: false,
              content: '单张图片不能大于3M!'
            })
          }else if(photos.length>9){
            wx.showModal({
              showCancel: false,
              content: '单次直播最多上传9张图片!'
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
    if(this.data.value == undefined||this.data.value.length == 0){
      wx.showModal({
        showCancel: false,
        content: '请填写直播内容!'
      })
    }else{
      if(photos.length > 0){
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = photos.length; //总共个数
        var i = 0; //第几个
        photoid = ''//每次评价前把photoid清空
        wx.showLoading({
          title: '直播发布中...',
          mask: true
        })
        that.uploadImages(photos,successUp,failUp,i,length);
      }else if(that.data.video!=''){
        wx.showLoading({
          title: '直播发布中...',
          mask: true
        })
        wx.uploadFile({
          url: video_url,
          filePath: that.data.video,
          name: 'video',
          header: {'content-type': 'application/x-www-form-urlencoded'},
          formData:{
            uid: uid,
            pid: pid,
            value: that.data.value
          },
          success: function(res){
            var data = res.data
            data = JSON.parse(data)
            var error_code = data.error_code
            console.log(res)
            if (error_code == '0') {
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                content: '发布成功!',
                success: function(res) {
                  if (res.confirm) {
                    var options = {
                      id: id,
                      pid: pid
                    }
                    pages[j].onLoad(options)
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            }else{
              wx.showToast({
                title: '发布失败!',
                mask: true,
                image: '../../images/warn.png'
              })
            }
          }, fail: function (err) {
            wx.showToast({
              title: '发布失败!',
              mask: true,
              image: '../../images/warn.png'
            })
            console.log(err)
          }
        })
      }else{
        //不带图片和视频
        wx.showLoading({
          title: '直播发布中...',
          mask: true
        })
        wx.request({
          url: uploadlive_url,
          data: {
            uid: uid,
            pid: pid,
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
                showCancel: false,
                content: '发布成功!',
                success: function(res) {
                  if (res.confirm) {
                    var options = {
                      id: id,
                      pid: pid
                    }
                    pages[j].onLoad(options)
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '发布失败!',
                mask: true,
                image: '../../images/warn.png'
              })
            }
          }, fail: function (err) {
            wx.showToast({
              title: '发布失败!',
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
  input: function (e) {
    var value = e.detail.value
    var length = value.length
    if(length == 300){
      wx.showToast({
        title: '已达最大字数!',
        mask: true,
        image: '../../images/warn.png'
      })
    }
    this.setData({
      value: value,
    })
  },
  uploadImages(filePaths,successUp,failUp,i,length){
    var that = this
    wx.uploadFile({
      url: photo_uploadlive_url,
      filePath: filePaths[i],
      name: 'photo',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      formData:{
        uid: uid
      },
      success: (res) => {
        console.log('循环上传图片出参',res)
        var data = JSON.parse(res.data)
        photoid = photoid+data.photoid+','
        successUp++;
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
            //上传文字
            wx.request({
              url: uploadlive_url,
              data: {
                uid: uid,
                pid: 1,
                value: that.data.value,
                photoid: photoid
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
                    showCancel: false,
                    content: '发布成功!',
                    success: function(res) {
                      if (res.confirm) {
                        var options = {
                          id: id,
                          pid: pid
                        }
                        pages[j].onLoad(options)
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: '发布失败!',
                    mask: true,
                    image: '../../images/warn.png'
                  })
                }
              }, fail: function (err) {
                wx.showToast({
                  title: '发布失败!',
                  mask: true,
                  image: '../../images/warn.png'
                })
                console.log(err)
              }
            })
          }else{
            wx.showToast({
              title: '发布失败!',
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
  }
})