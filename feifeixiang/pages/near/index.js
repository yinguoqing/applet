const host = require('../../config.js').service.host
const searchnear_url = require('../../config.js').service.searchnear_url

var longitude
var latitude
var shopid
var bmap = require('../../libs/bmap-wx.min.js')
var originalData = []
Page({
    data: {
        src: 'https://'+host+'/data/upload/homepage/2x/search.png'
    },searchInput: function (e) {
        this.setData({
            keyword: e.detail.value
        })
    },search: function () {
        var that = this;
        wx.showLoading({
            title: '数据搜索中...',
            mask: true
        })
        wx.request({
            url: searchnear_url,
            data: {
                shopid: shopid,
                lng: longitude,
                lat: latitude,
                keyword: that.data.keyword||''
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var error_code = res.data.error_code
                if (error_code == '0') {
                    wx.showToast({
                        title: '搜索成功!',
                        mask: true
                    })
                    that.setData({
                        items: res.data.items
                    })
                } else {
                    wx.showToast({
                        title: '搜索失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '搜索失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }
        })
    },onLoad: function(options) {
        var that = this
        if(options.location){
            that.setData({
                location: options.location
            })
            longitude = options.longitude
            latitude = options.latitude
            shopid = options.shopid
        }else{
            that.setData({
                location: '未知'
            })
        }

    },refresh: function () {
        var that = this
        that.setData({
            animation: "animation"
        })
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                longitude = res.longitude
                latitude = res.latitude
            }
        })
        var BMap = new bmap.BMapWX({
            ak: 'ilmtFnInNw3yoXGB6etlhRTFgrOt8uPy'
        })
        var fail = function(data) {
            that.setData({
                animation: "",
                location: "未知",
            })
            wx.openSetting({success:(res)=>{console.log(res);}})
            wx.showToast({
                title: '定位失败!',
                mask: true,
                image: '../../images/warn.png'
            })
        }
        var success = function(data) {
            originalData = data.originalData;
            var addressComponent = originalData.result.addressComponent;
            var formatted_address = originalData.result.formatted_address;
            that.setData({
                location: formatted_address,
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
    }
})