var WxParse = require('../../wxParse/wxParse.js');
const host = require('../../config.js').service.host
const zuling_url = require('../../config.js').service.zuling_url
const detail_url = require('../../config.js').service.detail_url
const shoucang_url = require('../../config.js').service.shoucang_url
const liuyan_url = require('../../config.js').service.liuyan_url
const dianzan_url = require('../../config.js').service.dianzan_url
const getsharered_url = require('../../config.js').service.getsharered_url
var uid
var pid
var text
var imgIndex = 0
var app = getApp()
var time
var optionsid
var isTiefen = ''
Page({
    data: {
        flag2: true,
        flag3: false,
        display: "none",
        disabled: "disabled",
        showScrollTop: false,
        scrollTopSrc:'https://'+host+'/data/upload/homepage/2x/hidaodingbu.png',
        zan2: 'http://'+host+'/data/upload/details/2x/zan_unclick.png',
        weixuan: "https://"+host+"/data/upload/details/2x/xinweixuanzhong_icon.png",
        yixuan: "https://"+host+"/data/upload/details/2x/xinxuanzhong_icon.png",
        src4: "https://"+host+"/data/upload/details/2x/jiantou_icon.png",
        shareSrc: 'https://'+host+'/data/upload/order/share-img.png',
        0: "https://"+host+"/data/upload/details/2x/star0@2x.png",
        1: "https://"+host+"/data/upload/details/2x/star1@2x.png",
        2: "https://"+host+"/data/upload/details/2x/star2@2x.png",
        3: "https://"+host+"/data/upload/details/2x/star3@2x.png",
        4: "https://"+host+"/data/upload/details/2x/star4@2x.png",
        5: "https://"+host+"/data/upload/details/2x/star5@2x.png",
        src6: "https://"+host+"/data/upload/details/2x/lvjiantou_icon.png",
        src8: "https://"+host+"/data/upload/details/2x/lv_icon.png",
        src9: "https://"+host+"/data/upload/details/2x/huang_icon.png",
        src10: "https://"+host+"/data/upload/details/2x/lan_icon.png",
        src11: "https://"+host+"/data/upload/details/2x/kefu_icon.png",
        srcShare: "https://"+host+"/data/upload/details/2x/fenxiang_icon.png",
        tzSrc: "https://"+host+"/data/upload/details/2x/tongzhi_icon.png",
        src12: "https://"+host+"/data/upload/details/2x/star",
        src13: "https://"+host+"/data/upload/details/2x/back.png",
        empty: "https://"+host+"/data/upload/details/2x/empty.png",
        select1: "selected",
        select2: "",
        select3: "",
        bg1: "",
        bg2: "",
        bg3: "",
        flag: "xiangqing",
        cantuanBgColor: "#6ad266",
        pingtuan: "拼团",
        qucantuan: "去参团",
        fifth: "全部活动",
        sixth: "活动主办方",
        faqipingtuan: "发起拼团",
        lijigoumai: "立即购买",
        huodongmane: "活动满额",
        pingtuanjieshu: "拼团结束",
    },onHide: function () {
        clearInterval(time)
    },onShow: function () {
        var that = this
        if(that.data.endtime){
            //倒计时
            var endtime = parseInt(that.data.endtime*1000)
            var now = new Date();
            var leftTime = endtime-now.getTime();
            var leftsecond = leftTime/1000;
            time = setInterval(
                function () {
                    if (leftsecond > 0) {
                        var hour = Math.floor(leftsecond/3600)
                        var minute = Math.floor((leftsecond-hour*3600)/60)
                        var second = Math.floor(leftsecond-hour*3600-minute*60)
                        if(hour == 0){
                            hour = "00"
                        }else if (hour <10){
                            hour = "0" + hour
                        }
                        if(minute == 0){
                            minute = "00"
                        }else if (minute <10){
                            minute = "0" + minute
                        }
                        if(second == 0){
                            second = "00"
                        }else if (second <10){
                            second = "0" + second
                        }
                        var countDown = "剩余 "+hour+":"+minute+":"+second+" 结束"
                        --leftsecond
                        that.setData({
                            time: countDown
                        })
                    } else {
                        clearInterval(time)
                        that.setData({
                            time: "倒计时已结束",
                            qucantuan: "拼团结束",
                            cantuanBgColor: "#cdcdcd",
                            flag3: "true"
                        })
                    }
                }, 1000)
        }
    },qucantuan: function () {
        uid = wx.getStorageSync('uid')
        if(uid!=''&&uid!=null&&uid!=undefined){
            var that = this
            var finalPrice
            if (isTiefen=='true'||isTiefen==true){
                finalPrice = that.data.mprice||0
                app.globalData.isPingtuan = ''
                app.globalData.isCantuan = 1
                app.globalData.title = that.data.title
                app.globalData.src = that.data.src
                app.globalData.ptItems = []
                wx.navigateTo({
                    url: '../order/index?ptTitle='+that.data.title+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                })
            }else if (isTiefen=='false'||isTiefen==false){
                finalPrice = that.data.price||0
                app.globalData.isPingtuan = ''
                app.globalData.isCantuan = 1
                app.globalData.title = that.data.title
                app.globalData.src = that.data.src
                app.globalData.ptItems = []
                wx.navigateTo({
                    url: '../order/index?ptTitle='+that.data.title+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '查询铁粉失败,请重新登录!',
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../login/login'
                            })
                        }
                    }
                })
            }
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
    },notice: function () {
        wx.navigateTo({
          url: '../notice/notice?nid=red'
        })
    },
    preview: function (e) {
        imgIndex = e.currentTarget.dataset.index

    },
    previewArr: function (e) {
        var index = e.currentTarget.dataset.index
        var photos = this.data.pjItems[index].img
        wx.previewImage({
            current: photos[imgIndex],
            urls: photos
        })
    },onPageScroll: function () {
        var that = this
        var query = wx.createSelectorQuery()
        query.select('#fifth').boundingClientRect()
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
    },
    zuling: function () {
        if(uid!=''&&uid!=null&&uid!=undefined){
            wx.showModal({
                content: '是否要租赁该产品?',
                success: function(res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: '请求中...',
                            mask: true
                        })
                        wx.request({
                            url: zuling_url,
                            data: {
                                uid: uid,
                                pid: pid
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                                console.log(res)
                                var error_code = res.data.error_code
                                if (error_code == '0') {
                                    wx.showModal({
                                        showCancel: false,
                                        content: '租赁成功,请到店领取!',
                                        success: function(res) {
                                        }
                                    })
                                } else if (error_code == '1'){
                                    wx.showModal({
                                        showCancel: false,
                                        content: '亲,您有产品正在租赁,无法同时租赁2个产品!',
                                        success: function(res) {
                                        }
                                    })
                                } else if (error_code == '2'){
                                    wx.showToast({
                                        title: '参数错误!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                } else if (error_code == '3'){
                                    wx.showModal({
                                        showCancel: false,
                                        content: '租赁产品,逾期将从账户余额自动扣除费用,余额应保证大于100元,您的余额不足!',
                                        success: function(res) {
                                        }
                                    })
                                } else if (error_code == '4'){
                                    wx.showModal({
                                        showCancel: false,
                                        content: '产品已下架或不存在!',
                                        success: function(res) {
                                        }
                                    })
                                } else if (error_code == '5'){
                                    wx.showToast({
                                        title: '库存不足!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                } else {
                                    wx.showToast({
                                        title: '租赁失败!',
                                        mask: true,
                                        image: '../../images/warn.png'
                                    })
                                }
                            }, fail: function (err) {
                                wx.showToast({
                                    title: '租赁失败!',
                                    mask: true,
                                    image: '../../images/warn.png'
                                })
                                console.log(err)
                            }
                        })
                    }
                }
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
    },
    share:function () {
        var that = this
        if(!wx.canIUse('button.open-type.share')){
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低,请点击右上角分享或升级微信后分享!',
                success: function(res) {
                    if (res.confirm) {
                        that.setData({
                            display : 'block'
                        })
                    }
                }
            })
        }
    },skipToLive: function () {
        wx.navigateTo({
          url: '../live/live'
        })
    },skipToTiefen: function () {
        wx.switchTab({
            url: '../tiefen/tiefen'
        })
    },skipToTiefen2: function () {
        wx.showModal({
            title: '提示',
            content: '购买铁粉会员年卡即可享受铁粉价,立即前往?',
            success: function(res) {
                if (res.confirm) {
                    wx.switchTab({
                        url: '../tiefen/tiefen'
                    })
                }
            }
        })

    }, hideShare: function () {
        this.setData({
            display : 'none'
        })
    }, onLoad: function (options) {
        optionsid = 0
        var that= this
        uid = wx.getStorageSync('uid');
        isTiefen = wx.getStorageSync('isTiefen')
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

        that.setData({
            uid: uid
        })
        if(options.id){
            optionsid = 1
            pid = options.id
            text = options.text
            if(uid!=null&&uid!=""&&uid!=undefined){
                var requestData = {
                    id: pid,
                    uid: uid
                }
            }else{
                var requestData = {
                    id: pid
                }
            }
            that.setData({
                hideCube: "",
                text: text
            })
            wx.request({
                url: detail_url,
                data: requestData,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var data = res.data
                    var error_code = data.error_code
                    if (error_code == '0') {
                        that.setData({
                            hideCube: "hideCube"
                        })
                        wx.showToast({
                            title: '加载成功!',
                            mask: true
                        })
                        if(data.travel == 1){
                            text = '添加出行人'
                        }
                        var starSrc = "https://"+host+"/data/upload/details/2x/star"+data.pingfen+"@2x.png";
                        if(data.baomingzhong=="活动报名中"){
                            that.setData({
                                bgColor: "#fe782f",
                            })
                        }else{
                            that.setData({
                                bgColor: "#cdcdcd",
                            })
                        }
                        if(data.ptItems!=null&&data.ptItems!=""&&data.ptItems!=undefined){
                            that.setData({
                                fanxian: data.ptprice,
                            })
                        }
                        that.setData({
                            title: data.title,
                            src: data.src,
                            miaoshu: data.miaoshu,
                            youhui: data.youhui,
                            price: data.price,
                            baomingzhong: data.baomingzhong,
                            yishou: data.yishou,
                            pingjiaNum: data.pingjiaNum,
                            liuyanNum: data.liuyannum,
                            zbName: data.zbName,
                            zbid: data.zbid,
                            zbphoto: data.zbphoto,
                            tfyh: parseInt(data.price)-parseInt(data.mprice),
                            zbMiaoshu: data.zbMiaoshu,
                            baomingrenshu: data.baomingrenshu,
                            huodongshuliang: data.huodongshuliang,
                            yonghupingjia: data.zbpingfen,
                            starSrc: starSrc,
                            zaoniao: data.zaoniao,
                            pjItems: data.pjItems,
                            lyItems: data.lyItems,
                            tcItems: data.tcItems,
                            ptItems: data.ptItems,
                            tipItems: data.tipItems,
                            isshoucang: data.isshoucang,
                            touxiangItems: data.touxiangItems,
                            qishu: data.qishu,
                            mprice: data.mprice,
                            article:  data.article,
                            qzsg:  data.qzsg,
                            stock:  data.stock,
                            day:  data.day,
                            red:  data.red,
                            cost:  data.cost
                        })
                        WxParse.wxParse('article', 'html', that.data.article, that,5);
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
        }else if(app.globalData.pid){
            var that = this
            pid = app.globalData.pid
            text = "冬令营"
            if(app.globalData.ptid){
                if(uid!=null&&uid!=""&&uid!=undefined){
                    var requestData = {
                        id: pid,
                        uid: uid,
                        ptid: app.globalData.ptid
                    }
                }else{
                    var requestData = {
                        id: pid,
                        ptid: app.globalData.ptid
                    }
                }
            }else{
                if(uid!=null&&uid!=""&&uid!=undefined){
                    var requestData = {
                        id: pid,
                        uid: uid
                    }
                }else{
                    var requestData = {
                        id: pid
                    }
                }
            }

            that.setData({
                hideCube: "",
                text: text
            })
            wx.request({
                url: detail_url,
                data: requestData,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var data = res.data
                    var error_code = data.error_code
                    if (error_code == '0') {
                        that.setData({
                            hideCube: "hideCube"
                        })
                        wx.showToast({
                            title: '加载成功!',
                            mask: true
                        })
                        if(data.travel == 1){
                            text = '添加出行人'
                        }
                        var starSrc = "https://"+host+"/data/upload/details/2x/star"+data.pingfen+"@2x.png";
                        if(data.baomingzhong=="活动报名中"){
                            that.setData({
                                bgColor: "#fe782f",
                            })
                        }else{
                            that.setData({
                                bgColor: "#cdcdcd",
                            })
                        }
                        if(data.ptItems!=null&&data.ptItems!=""&&data.ptItems!=undefined){
                            that.setData({
                                fanxian: data.ptprice,
                            })
                        }
                        that.setData({
                            title: data.title,
                            src: data.src,
                            miaoshu: data.miaoshu,
                            youhui: data.youhui,
                            price: data.price,
                            baomingzhong: data.baomingzhong,
                            yishou: data.yishou,
                            pingjiaNum: data.pingjiaNum,
                            liuyanNum: data.liuyannum,
                            zbName: data.zbName,
                            tfyh: parseInt(data.price)-parseInt(data.mprice),
                            zbMiaoshu: data.zbMiaoshu,
                            baomingrenshu: data.baomingrenshu,
                            huodongshuliang: data.huodongshuliang,
                            yonghupingjia: data.zbpingfen,
                            starSrc: starSrc,
                            zaoniao: data.zaoniao,
                            pjItems: data.pjItems,
                            lyItems: data.lyItems,
                            tcItems: data.tcItems,
                            ptItems: data.ptItems,
                            tipItems: data.tipItems,
                            isshoucang: data.isshoucang,
                            touxiangItems: data.touxiangItems,
                            qishu: data.qishu,
                            mprice: data.mprice,
                            article:  data.article,
                            qzsg:  data.qzsg,
                            stock:  data.stock,
                            day:  data.day,
                            red:  data.red,
                            cost:  data.cost,
                            nickname:  data.nickname,
                            ptsrc:  data.ptsrc,
                            chajiren:  data.chajiren,
                            endtime:  data.endtime
                        })
                        WxParse.wxParse('article', 'html', that.data.article, that,5);
                        if(time){
                            clearInterval(time)
                        }
                        that.onShow();
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
    },
    shoucang: function () {
        var that = this
        var way
        if(that.data.isshoucang == true){
            way = "quxiao"
        }else{
            way = "shoucang"
        }
        //发送收藏请求..
        wx.request({
            url: shoucang_url,
            data: {
                uid: uid,
                pid: pid,
                way: way
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
                        title: '操作成功!',
                        mask: true
                    })
                    if(way=="quxiao"){
                        that.setData({
                            isshoucang: ""
                        })
                    }else{
                        that.setData({
                            isshoucang: true
                        })
                    }

                } else {
                    wx.showToast({
                        title: '操作失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                wx.showToast({
                    title: '操作失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }
        })
    },
    xiangqing: function () {
        var that = this
        that.setData({
            flag: "xiangqing",
            select1: "selected",
            select2: "",
            select3: "",
            bg1: "selectedBg",
            bg2: "",
            bg3: ""
        })
        setTimeout(function () {
            that.setData({
                bg1: ''
            })
        },200)
    },
    pingjia: function () {
        var that = this
        this.setData({
            flag: "pingjia",
            select1: "",
            select2: "selected",
            select3: "",
            bg1: "",
            bg2: "selectedBg",
            bg3: ""
        })
        setTimeout(function () {
            that.setData({
                bg2: ''
            })
        },200)
    },
    liuyan: function () {
        var that = this
        this.setData({
            flag: "liuyan",
            select1: "",
            select2: "",
            select3: "selected",
            bg1: "",
            bg2: "",
            bg3: "selectedBg"
        })
        setTimeout(function () {
            that.setData({
                bg3: ''
            })
        },200)
    },
    liyanInputEvent: function (e) {
        var message = e.detail.value
        this.setData({
            message: message
        })
        if(message.length > 0){
            this.setData({
                flag2: false,
                disabled: ""
            })
        }else{
            this.setData({
                flag2: true,
                disabled: "disabled"
            })
        }
        if(message.length == 140){
            wx.showToast({
                title: '已达最大字数!',
                mask: true,
                image: '../../images/warn.png'
            })
        }
    },
    sendMessage: function () {
        var that = this
        var message = that.data.message
        that.setData({
            flag2: true,
            disabled: "disabled",
            loadFlag: true
        })
        wx.request({
            url: liuyan_url,
            data: {
                content: message,
                uid: uid,
                pid: pid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)
                var error_code = res.data.error_code
                if (error_code == '0') {
                    that.setData({
                        flag2: false,
                        disabled: "",
                        loadFlag: false
                    })
                    wx.showModal({
                        content: "您已成功留言,我们会尽快回复并通知您,客服回复后您的问题将展示在留言列表中",
                        showCancel: false
                    })
                } else {
                    that.setData({
                        flag2: false,
                        disabled: "",
                        loadFlag: false
                    })
                    wx.showToast({
                        title: '留言失败!',
                        mask: true,
                        image: '../../images/warn.png'
                    })
                }
            }, fail: function (err) {
                that.setData({
                    flag2: false,
                    disabled: "",
                    loadFlag: false
                })
                wx.showToast({
                    title: '留言失败!',
                    mask: true,
                    image: '../../images/warn.png'
                })
                console.log(err)
            }
        })

    },
    dianzan: function (e) {
        if(uid!=null&&uid!=""&&uid!=undefined){
            var that = this
            var index = e.currentTarget.dataset.index
            var pjItems = this.data.pjItems
            var param = {}
            var zan = pjItems[index].zan
            var dianzan = parseInt(pjItems[index].dianzan)
            var key = "pjItems["+index+"].zan"
            var key2 = "pjItems["+index+"].dianzan"
            if(zan == 'http://'+host+'/data/upload/details/2x/zan_unclick.png'){
                wx.request({
                    url: dianzan_url,
                    data: {
                        uid: uid,
                        pid: pjItems[index].id,
                        wap: 'dianzan'
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            param[key] = "http://"+host+"/data/upload/details/2x/zan_click.png"
                            param[key2] = dianzan+1
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
    skipToPingjia: function () {
        this.setData({
            flag: "pingjia",
            select1: "",
            select2: "selected",
            select3: ""
        })
        var query = wx.createSelectorQuery()
        query.select('#all').boundingClientRect()
        query.select('#seventh').boundingClientRect()
        query.select('#bottom').boundingClientRect()
        query.exec(function(res){
            wx.pageScrollTo({
                scrollTop: res[0].height-res[1].height-res[2].height
            })
        })
    },
    skipToLiuyan: function () {
        this.setData({
            flag: "liuyan",
            select1: "",
            select2: "",
            select3: "selected"
        })
        var query = wx.createSelectorQuery()
        query.select('#all').boundingClientRect()
        query.select('#seventh').boundingClientRect()
        query.select('#bottom').boundingClientRect()
        query.exec(function(res){
            wx.pageScrollTo({
                scrollTop: res[0].height-res[1].height-res[2].height
            })
        })
    },
    buyList: function () {
        wx.setNavigationBarTitle({
            title: '套餐选择'
        })
        this.setData({
            showTankuang: "block",
            hide: "hide"
        })
    },
    fanhui: function () {
        wx.setNavigationBarTitle({
            title: '活动详情'
        })
        this.setData({
            showTankuang: "none",
            hide: ""
        })
    },
    buyNow: function (e) {
        /*var index = e.currentTarget.dataset.index
        var ptTitle
        var id
        if(this.data.tcItems.length>0){
            ptTitle = this.data.tcItems[index].title
            id = this.data.tcItems[index].id
        }else if(this.data.ptItems3.length>0){
            ptTitle = this.data.ptItems3[index].title
            id = this.data.ptItems3[index].id
        }*/
            uid = wx.getStorageSync('uid')
            if(uid!=''&&uid!=null&&uid!=undefined){
                var that = this
                var finalPrice
                if (isTiefen=='true'||isTiefen==true){
                    finalPrice = that.data.mprice||0
                    app.globalData.isPingtuan = ''
                    app.globalData.title = that.data.title
                    app.globalData.src = that.data.src
                    app.globalData.ptItems = []
                    wx.navigateTo({
                        url: '../order/index?ptTitle='+that.data.title+'&src='+that.data.src+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                    })
                }else if (isTiefen=='false'||isTiefen==false){
                    finalPrice = that.data.price||0
                    app.globalData.isPingtuan = ''
                    app.globalData.title = that.data.title
                    app.globalData.src = that.data.src
                    app.globalData.ptItems = []
                    wx.navigateTo({
                        url: '../order/index?ptTitle='+that.data.title+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '查询铁粉失败,请重新登录!',
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../login/login'
                                })
                            }
                        }
                    })
                }
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
    },pingtuanNow: function () {
        uid = wx.getStorageSync('uid')
        if(uid!=''&&uid!=null&&uid!=undefined){
            var that = this
            var finalPrice
            if (isTiefen=='true'||isTiefen==true){
                finalPrice = that.data.mprice||0
                app.globalData.isPingtuan = 1
                app.globalData.title = that.data.title
                app.globalData.src = that.data.src
                app.globalData.ptItems = that.data.ptItems
                wx.navigateTo({
                    url: '../order/index?ptTitle='+that.data.title+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                })
            }else if (isTiefen=='false'||isTiefen==false){
                finalPrice = that.data.price||0
                app.globalData.isPingtuan = 1
                app.globalData.title = that.data.title
                app.globalData.src = that.data.src
                app.globalData.ptItems = that.data.ptItems
                wx.navigateTo({
                    url: '../order/index?ptTitle='+that.data.title+'&id='+pid+'&finalPrice='+finalPrice+'&text='+text
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '查询铁粉失败,请重新登录!',
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../login/login'
                            })
                        }
                    }
                })
            }
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
    }, onShareAppMessage: function () {
        var uid = wx.getStorageSync('uid');
        var isPartner = wx.getStorageSync('isPartner');
        if(optionsid == 1){
            var path
            if(isPartner==true||isPartner=='true'){
                path = '/pages/details/index?pid='+pid+'&partnerid='+uid
            }else{
                path = '/pages/details/index?pid='+pid
            }
            return {
                title: '飞飞象户外探索教育',
                path: path,
                success: function(res) {
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
                }
            }
        }else if(app.globalData.ptid){
            return {
                title: '拼团享优惠,一起来飞飞象拼团吧',
                path: '/pages/details/index?pid='+app.globalData.pid+'&ptid='+app.globalData.ptid,
                imageUrl: 'https://'+host+'/data/upload/share.jpg',
                success: function(res) {
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
                }
            }
        }
    }
})