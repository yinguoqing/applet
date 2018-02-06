const host = require('../../config.js').service.host
const order_url = require('../../config.js').service.order_url
const getorderinfo_url = require('../../config.js').service.getorderinfo_url

var detail1= []
var detailStr1 = ""
var detail2 = []
var detailStr2 = ""
var index = 0
var index1 = 0
var index2 = 0
var index3 = 0
var title = ""
var uid
var pid
var isPingtuan = ""
var app = getApp()
Page({
    data: {
        checked: false,
        xuanze: true,
        placeholder: "请备注您的需求",
        num: 0,
        num1: 0,
        bednum: 0,
        name: "",
        tel: "",
        tips: "",
        /*child: 200,
        adult: 400,*/
        price: 0,
        traveller: [],
        src: "https://"+host+"/data/upload/order/jianshao.png",
        src1: "https://"+host+"/data/upload/order/tianjia.png",
        src2: "https://"+host+"/data/upload/order/biaoqian.png",
        src3: "https://"+host+"/data/upload/order/weixuan.png",
    },tiaokuan: function () {
        if(this.data.text == '冬令营'||this.data.text == '夏令营'){
            wx.navigateTo({
                url: '../notice/notice?nid=8'
            })
        }else{
            wx.navigateTo({
                url: '../notice/notice?nid=5'
            })
        }

    },shixiang: function () {
        wx.navigateTo({
            url: '../notice/notice?nid=6'
        })
    },
    onLoad: function(options) {
        index3 = 0
        var that = this
        title = options.ptTitle
        uid = wx.getStorageSync('uid');
       if(options.ptTitle){
           wx.setNavigationBarTitle({
               title: options.ptTitle
           })
           isPingtuan = app.globalData.isPingtuan||''
           pid = options.id,
           this.setData({
               id: options.id,
               text: options.text,
               finalPrice: options.finalPrice
           })
           if(wx.hideLoading){
               wx.showLoading({
                   title: '数据加载中...',
                   mask: true
               })
           }
           wx.request({
               url: getorderinfo_url,
               data: {
                   uid: uid,
                   pid: pid
               },
               method: 'POST',
               header: {
                   'content-type': 'application/x-www-form-urlencoded'
               },
               success: function (res) {
                   var data = res.data
                   var error_code = data.error_code
                   if (error_code == '0') {
                       that.setData({
                           hongbao: parseInt((data.hongbao||0)),
                           yue: parseInt((data.red||0)),
                           riqi: data.riqi,
                           citys: data.citys,
                           addbed: data.addbed||0,
                           yhcost: data.yhcost||0,
                           addressArr: data.citys[0].address,
                           'citys[0].click': 'click'
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
       /*this.setData({
           // 'riqi[0].detail[0].show': 'show',
           addressArr: this.data.citys[0].address,
           'citys[0].click': 'click'
       })*/
        // if(options.ptTitle){
        //     this.setData({
        //         ptTitle: options.ptTitle,
        //         riqi: options.riqi
        //     })
        // }
      // var that = this
      // wx.request({
      //   url: 'https://'+host+'/index.php?m=xcx&c=getType&id='+options.id,
      //   method: 'GET',
      //   data: {},
      //   header: {
      //     'Accept': 'application/json'
      //   },
      //   success: function(res) {
      //     // that.setData({
      //     //   brandList: res.data.data
      //     // });
      //   }
      // })

    },
    onShow: function () {
    },
    onReady: function () {
        if(wx.hideLoading){
            wx.hideLoading()
        }
    },
    catch: function (e) {
        console.log(e)
    },
    reduce: function () {
        var that = this
        var num = parseInt(that.data.num)
        var bednum = parseInt(that.data.bednum)
        var addbed = parseInt(that.data.addbed)
        var finalPrice = parseInt(that.data.finalPrice)
        if(this.data.yhcost){
            finalPrice = finalPrice - parseInt(this.data.yhcost)
        }
        var src = that.data.src3
        var hongbao = parseInt(that.data.hongbao)
        num = num > 0 ? num-1 : 0
        var flag = num > 0 ? false : true
        var price = num*finalPrice+bednum*addbed
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            num : num,
            xuanze : flag,
            price : price
        })
    },
    plus: function () {
        var that = this
        var num = parseInt(that.data.num)
        var finalPrice = parseInt(that.data.finalPrice)
        if(this.data.yhcost){
            finalPrice = finalPrice - parseInt(this.data.yhcost)
        }
        var bednum = parseInt(that.data.bednum)
        var addbed = parseInt(that.data.addbed)
        var src = that.data.src3
        var hongbao = parseInt(that.data.hongbao)
        num++
        var flag = num > 0? false : true
        var price = num*finalPrice+bednum*addbed
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            num : num,
            xuanze : flag,
            price : price
        })
    },
    reduceBed: function () {
        var that = this
        var num = parseInt(that.data.num)
        var finalPrice = parseInt(that.data.finalPrice)
        if(this.data.yhcost){
            finalPrice = finalPrice - parseInt(this.data.yhcost)
        }
        var bednum = parseInt(that.data.bednum)
        var addbed = parseInt(that.data.addbed)
        var src = that.data.src3
        var hongbao = parseInt(that.data.hongbao)
        bednum = bednum > 0 ? bednum-1 : 0
        var price = num*finalPrice+bednum*addbed
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            bednum : bednum,
            price : price
        })
    },
    plusBed: function () {
        var that = this
        var num = parseInt(that.data.num)
        var finalPrice = parseInt(that.data.finalPrice)
        if(this.data.yhcost){
            finalPrice = finalPrice - parseInt(this.data.yhcost)
        }
        var bednum = parseInt(that.data.bednum)
        var addbed = parseInt(that.data.addbed)
        var src = that.data.src3
        var hongbao = parseInt(that.data.hongbao)
        bednum++;
        var price = num*finalPrice+bednum*addbed
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            bednum : bednum,
            price : price
        })
    },
    reduce1: function () {
        var num= this.data.num
        var num1= this.data.num1
        var adult = this.data.adult
        var child = this.data.child
        var src = this.data.src3
        var hongbao = this.data.hongbao
        num1 = num1 > 0 ? num1-1 : 0
        var flag = (num > 0 || num1 > 0) ? false : true
        var price = num1*adult+num*child
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            num1 : num1,
            xuanze : flag,
            price : price
        })
    },
    plus1: function () {
        var num = this.data.num
        var num1 = this.data.num1
        var adult = this.data.adult
        var child = this.data.child
        var src = this.data.src3
        var hongbao = this.data.hongbao
        num1++
        var flag = (num > 0 || num1 > 0) ? false : true
        var price = num1*adult+num*child
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            price = price-hongbao
            price = price>0?price:0
        }
        this.setData({
            num1 : num1,
            xuanze : flag,
            price : price
        })
    },
    choose: function () {
        var num1 = this.data.num1
        var num = this.data.num
        wx.navigateTo({
          url: '../chooseman/chooseman?num1='+num1+"&num="+num
        })
    },
    chooseDate:function (e) {
        var that = this
        /*setTimeout(function () {
            var param = {}
            //还原旧值
            var showStr1 = detailStr1+"["+index2+"].show"
            param[showStr1] = ""
            //设置新值
            index2 = e.currentTarget.dataset.index
            var showStr2 = detailStr2+"["+index2+"].show"
            param[showStr2] = detail2[index2].show == "show" ? "" : "show"
            that.setData(param)
        },100)*/
        var param = {}
        //还原旧值
        var showStr1 = "riqi["+index+"].show"
        param[showStr1] = ""
        //设置新值
        index = e.currentTarget.dataset.index
        var showStr2 = "riqi["+index+"].show"
        param[showStr2] = that.data.riqi[index].show == "show" ? "" : "show"
        that.setData(param)
    },
    /*chooseAll: function (e) {
        var riqi = this.data.riqi
        detail1 = riqi[index1].detail
        detailStr1 = "riqi["+index1+"].detail"
        index1 = e.currentTarget.dataset.index
        detail2 = riqi[index1].detail
        detailStr2 = "riqi["+index1+"].detail"
    },*/
    tipsInputEvent: function (e) {
        var message = e.detail.value
        this.setData({
            tips: message
        })
        if(message.length == 140){
            wx.showToast({
                title: '已达到最大字数!',
                mask: true,
                image: '../../images/warn.png'
            })
        }
    },
    xuanhongbao: function () {
        var num = parseInt(this.data.num)
        var bednum = parseInt(this.data.bednum)
        var src = this.data.src3
        var hongbao = parseInt(this.data.hongbao)
        var price = this.data.price
        if(src == "https://"+host+"/data/upload/order/yixuan.png"){
            src = "https://"+host+"/data/upload/order/weixuan.png"
            price = num==0&&bednum==0?price:price+hongbao
            this.setData({
                src3: src,
                price: price
            })
        }else if(src == "https://"+host+"/data/upload/order/weixuan.png") {
            src = "https://"+host+"/data/upload/order/yixuan.png"
            price = num==0&&bednum==0?price:price-hongbao
            price = price>0?price:0
            this.setData({
                src3: src,
                price: price
            })
        }
    },
    hongbaotips: function () {
        var hongbao = this.data.hongbao
        wx.showModal({
            showCancel: false,
            content: '红包须满'+hongbao+'才可用!'
        })
    },
    click:function (e) {
        var param = {}
        //还原旧值
        var clickOld = `citys[${index3}].click`;
        param[clickOld] = ""
        //设置新值
        index3 = e.currentTarget.dataset.index
        var addressArr = this.data.citys[index3].address
        this.setData({
            addressArr: addressArr
        })
        var click = `citys[${index3}].click`;
        param[click] = "click"
        this.setData(param)
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    nameInputEvent: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    telInputEvent: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    checkboxChange: function (e) {
        var value = e.detail.value
        if (value.length>0){
            this.setData({
                checked: true
            })
        }else{
            this.setData({
                checked: false
            })
        }
    },
    pay: function () {
        if(this.data.text=='冬令营'||this.data.text=='夏令营'){
            var that = this
            var traveller = this.data.traveller
            var price = this.data.price
            var yhcost = this.data.yhcost||''
            var riqi = this.data.riqi
            var num = this.data.num
            var bednum = this.data.bednum
            var citys = this.data.citys
            var hongbao = this.data.hongbao
            var src3 = this.data.src3
            var name = this.data.name
            var tel = this.data.tel
            var checked = this.data.checked
            var tips = this.data.tips
            var index = this.data.index
            var dateid = ""
            var date = ""
            var city = ""
            var address = this.data.addressArr[index]
            //校验
            var regName=/^[\u4e00-\u9fa5]{2,6}$/
            var regMobile = /^1(3|4|5|7|8)\d{9}$/
            //使用的红包
            var isred
            if(src3 == "https://"+host+"/data/upload/order/weixuan.png"){
                hongbao = 0
                isred = 0
            }else {
                isred = 1
            }
            // var checked = this.data.checked
            // console.log(checked)

            //时间赋值
            if(riqi){
                for(var i = 0;i<riqi.length;i++){
                    if(riqi[i].show == "show"){
                        dateid = riqi[i].id;
                        date = riqi[i].date;
                        break;
                    }
                }
            }

            //城市赋值
            for(var i = 0;i<citys.length;i++){
                if(citys[i].click == "click"){
                    city = citys[i].city;
                    break;
                }
            }
            if(traveller.length == 0){
                wx.showToast({
                    title: '请选择出行人!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(traveller.length != num){
                wx.showModal({
                    showCancel: false,
                    content: '选择的儿童数量和当前已选的儿童数不一致!',
                    success: function() {
                    }
                })
            }else if(name == ""){
                wx.showToast({
                    title: '请输入姓名!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(tel == ""){
                wx.showToast({
                    title: '请输入手机号!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(!regName.test(name)){
                wx.showToast({
                    title: '姓名不合规范!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(!regMobile.test(tel)){
                wx.showToast({
                    title: '手机号码有误!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(riqi&&(dateid == "")){
                wx.showToast({
                    title: '请选择时间!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(city == ""){
                wx.showToast({
                    title: '请选择城市!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(address == undefined){
                wx.showModal({
                    showCancel: false,
                    content: '请选择上车地点!'
                })
            }else if(checked == false){
                wx.showModal({
                    showCancel: false,
                    content: '须同意合同条款,才可下单!'
                })
            }else{
                wx.showLoading({
                    title: '生成订单中...',
                    mask: true
                })
                var manid = []
                for(i=0;i<traveller.length;i++){
                    manid.push(traveller[i].id)
                }
                if(app.globalData.isCantuan == 1){
                    if(app.globalData.ptid){
                        var requestData = {
                            uid: uid,
                            pid: pid,
                            manid: manid,
                            num: num,
                            bednum: bednum,
                            name: name,
                            moblie: tel,
                            dateid: dateid,
                            city: city,
                            address: address,
                            isred : isred,
                            beizhu : tips,
                            ptid: app.globalData.ptid
                        }
                    }

                }else{
                    var requestData = {
                        uid: uid,
                        pid: pid,
                        manid: manid,
                        num: num,
                        bednum: bednum,
                        name: name,
                        moblie: tel,
                        dateid: dateid,
                        city: city,
                        address: address,
                        isred : isred,
                        beizhu : tips,
                        pingtuan: isPingtuan
                    }
                }


                wx.request({
                    url: order_url,
                    data: requestData,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.showToast({
                                title: '订单生成成功!',
                                mask: true
                            })
                            var orderid = res.data.orderid
                            wx.navigateTo({
                                url: `../pay/pay?title=${title}&date=${date}&pid=${pid}&yhcost=${yhcost}&price=${price}&hongbao=${hongbao}&orderid=${orderid}`
                            })
                        }else if(error_code == '1'){
                            wx.showToast({
                                title: '库存不足!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }else {
                            wx.showToast({
                                title: '订单生成失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '订单生成失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                        console.log(err)
                    }
                })
            }
        }else if(this.data.text=='添加出行人'||this.data.text=='创意手工'){
            var that = this
            var price = this.data.price
            var riqi = this.data.riqi
            var num = this.data.num
            var yhcost = this.data.yhcost||''
            var traveller = this.data.traveller
            var hongbao = this.data.hongbao
            var src3 = this.data.src3
            var checked = this.data.checked
            var tips = this.data.tips
            var dateid = ""
            var date = ""
            //使用的红包
            var isred
            if(src3 == "https://"+host+"/data/upload/order/weixuan.png"){
                hongbao = 0
                isred = 0
            }else {
                isred = 1
            }
            // var checked = this.data.checked
            // console.log(checked)

            //时间赋值
            if(riqi){
                for(var i = 0;i<riqi.length;i++){
                    if(riqi[i].show == "show"){
                        dateid = riqi[i].id;
                        date = riqi[i].date;
                        break;
                    }
                }
            }

            if(traveller.length == 0){
                wx.showToast({
                    title: '请选择出行人!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(traveller.length != num){
                wx.showModal({
                    showCancel: false,
                    content: '选择的儿童数量和当前已选的儿童数不一致!',
                    success: function() {
                    }
                })
            }else if(riqi&&(dateid == "")){
                wx.showToast({
                    title: '请选择时间!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(checked == false){
                if(that.data.text=='创意手工'){
                    wx.showModal({
                        showCancel: false,
                        content: '须同意注意事项,才可下单!'
                    })
                }else{
                    wx.showModal({
                        showCancel: false,
                        content: '须同意合同条款,才可下单!'
                    })
                }
            }else{
                wx.showLoading({
                    title: '生成订单中...',
                    mask: true
                })
                var manid = []
                for(i=0;i<traveller.length;i++){
                    manid.push(traveller[i].id)
                }
                var requestData = {
                    uid: uid,
                    pid: pid,
                    manid: manid,
                    num: num,
                    dateid: dateid,
                    isred : isred,
                    beizhu : tips,
                    pingtuan: isPingtuan
                }

                wx.request({
                    url: order_url,
                    data: requestData,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.showToast({
                                title: '订单生成成功!',
                                mask: true
                            })
                            var orderid = res.data.orderid
                            wx.navigateTo({
                                url: `../pay/pay?title=${title}&date=${date}&price=${price}&hongbao=${hongbao}&orderid=${orderid}`
                            })
                        } else if(error_code == '1'){
                            wx.showToast({
                                title: '库存不足!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        } else {
                            wx.showToast({
                                title: '订单生成失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '订单生成失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                        console.log(err)
                    }
                })
            }
        }else {
            var that = this
            var yhcost = this.data.yhcost||''
            var price = this.data.price
            var riqi = this.data.riqi
            var num = this.data.num
            var hongbao = this.data.hongbao
            var src3 = this.data.src3
            var checked = this.data.checked
            var tips = this.data.tips
            var dateid = ""
            var date = ""
            var isred

            //使用的红包
            if(src3 == "https://"+host+"/data/upload/order/weixuan.png"){
                hongbao = 0
                isred = 0
            }else {
                isred = 1
            }
            // var checked = this.data.checked
            // console.log(checked)

            //时间赋值
            if(riqi){
                for(var i = 0;i<riqi.length;i++){
                    if(riqi[i].show == "show"){
                        dateid = riqi[i].id;
                        date = riqi[i].date;
                        break;
                    }
                }
            }
            if(num == 0){
                wx.showToast({
                    title: '请选择数量!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(riqi&&(dateid == "")){
                wx.showToast({
                    title: '请选择时间!',
                    mask: true,
                    image: '../../images/warn.png'
                })
            }else if(checked == false){
                wx.showModal({
                    showCancel: false,
                    content: '须同意合同条款,才可下单!'
                })
            }else{
                wx.showLoading({
                    title: '生成订单中...',
                    mask: true
                })
                var requestData = {
                    uid: uid,
                    pid: pid,
                    num: num,
                    dateid: dateid,
                    isred : isred,
                    beizhu : tips,
                    pingtuan: isPingtuan
                }

                wx.request({
                    url: order_url,
                    data: requestData,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        console.log(res)
                        var error_code = res.data.error_code
                        if (error_code == '0') {
                            wx.showToast({
                                title: '订单生成成功!',
                                mask: true
                            })
                            var orderid = res.data.orderid
                            wx.navigateTo({
                                url: `../pay/pay?title=${title}&date=${date}&price=${price}&hongbao=${hongbao}&orderid=${orderid}`
                            })
                        }else if(error_code == '1'){
                            wx.showToast({
                                title: '库存不足!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }else {
                            wx.showToast({
                                title: '订单生成失败!',
                                mask: true,
                                image: '../../images/warn.png'
                            })
                        }
                    }, fail: function (err) {
                        wx.showToast({
                            title: '订单生成失败!',
                            mask: true,
                            image: '../../images/warn.png'
                        })
                        console.log(err)
                    }
                })
            }
        }

    }

})