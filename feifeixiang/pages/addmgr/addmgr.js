const address_url = require('../../config.js').service.address_url
const address_status_url = require('../../config.js').service.address_status_url
const address_del_url = require('../../config.js').service.address_del_url
const host = require('../../config.js').service.host

var label = '设为默认'
var value = ''
var uid = ''
Page({
  data: {
      items11: [
    {id: 0 ,name: '张三', moblie: "15062446023", region: ["北京市","北京市","丰台区"], add: "大直村", label: label},
    {id: 1 ,name: '李四', moblie: "15062446023", region: ["北京市","北京市","东城区"], add: "", label: label, checked: true},
    {id: 2 ,name: '王五', moblie: "13814802941", region: ["山西省","太原市","小店区"], add: "大直村", label: label},
    {id: 3 ,name: '刘六', moblie: "15062446023", region: ["江苏省","苏州市","相城区"], add: "三山村", label: label},
    {id: 4 ,name: '钱多', moblie: "15062446023", region: ["苏州市","工业园区"], add: "大直村", label: label},
    {id: 5 ,name: '赵六', moblie: "15062446023", region: ["北京市","县","密云县"], add: "大直村", label: label}
],
      src: 'https://'+host+'/data/upload/huiyuanzhongxin/2x/empty.png'
  }, onShow: function () {
        var that = this
        wx.showLoading({
            title: '地址加载中...',
            mask: true
        })
        uid = wx.getStorageSync('uid');
        //uid获取地址
        wx.request({
            url: address_url,
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
                var rows = res.data.rows||[]
                if (error_code == '0') {
                    wx.showToast({
                        title: '地址加载成功!',
                        mask: true
                    })
                    for(var i=0;i<rows.length;i++) {
                        if(rows[i].checked == true){
                            value = i;
                            rows[i].label = '默认地址'
                        }else{
                            rows[i].label = '设为默认'
                        }
                    }
                    that.setData({
                        items: rows
                    })
                } else {
                    wx.showToast({
                        title: '地址加载失败!',
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
  }, radioChange: function(e) {
        var that = this
        var param = {}
        var index
        if(e.detail.value){
            for(var i=0;i<that.data.items.length;i++){
                if(this.data.items[i].id == e.detail.value){
                    index = i
                    break;
                }
            }
        }else{
            index = e.currentTarget.dataset.index
        }

        wx.request({
            url: address_status_url,
            data: {
                uid: uid,
                id: that.data.items[index].id
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var error_code = res.data.error_code
                if (error_code == '0') {
                    //还原旧label
                    if(value == '0'||(value!=''&&value!=null&&value!=undefined)){
                        var string = "items["+value+"].label"
                        var string2 = "items["+value+"].checked"
                        param[string] = "设为默认"
                        param[string2] = false
                    }
                    //设置新label
                    if(e.detail.value){
                        for(var i=0;i<that.data.items.length;i++){
                            if(that.data.items[i].id == e.detail.value){
                                value = i
                                break;
                            }
                        }
                    }else{
                        value = e.currentTarget.dataset.index
                    }
                    var string3 = "items["+value+"].label"
                    var string4 = "items["+value+"].checked"
                    param[string3] = "默认地址"
                    param[string4] = true
                    that.setData(param)
                    var pages = getCurrentPages()
                    var j
                    for(var i=0;i<pages.length;i++){
                        if(pages[i].route === "pages/info/info"){
                            j = i;
                            break;
                        }
                    }
                    if(j!=undefined){
                        pages[j].setData({
                            address: that.data.items[value].add
                        })
                    }
                }
            }, fail: function (err) {
                console.log('设为默认异常',err)
            }
        })
  }, edit: function(e) {
        var index = e.currentTarget.dataset.index
        var items = this.data.items
        var name = items[index].name
        var moblie = items[index].moblie
        var region = items[index].region
        var add = items[index].add
        var id = items[index].id
        wx.navigateTo({
            url: '../addmgrdetail/addmgrdetail?name='+name+'&moblie='+moblie+'&region0='+region[0]+'&region1='+region[1]+'&region2='+region[2]+'&add='+add+'&id='+id
        })
  }, del: function(e) {
        var that = this
        wx.showModal({
            content: '确定要删除该地址吗?',
            success: function(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中...',
                        mask: true
                    })
                    var items = that.data.items
                    var index = e.currentTarget.dataset.index
                    var id = items[index].id
                    wx.request({
                        url: address_del_url,
                        data: {
                            uid: uid,
                            id: id
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res)
                            var error_code = res.data.error_code
                            if (error_code == '0') {
                                wx.showToast({
                                    title: '删除成功!',
                                    mask: true
                                })
                                items.splice(index, 1);
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
  }
})