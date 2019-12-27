const db = wx.cloud.database()
const DAPUnionDB = db.collection("DAPUnion")
const driverDB = db.collection("driver")
const passengerDB = db.collection("passenger")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 发车人头像
    iconUrl: "",
    // 发车人姓名／约车人姓名
    name: "",
    // 发车人／约车人类型
    type: "",
    // id
    id: "",

    // 是否有发车/约车
    hasPost: false,

    //发车时间/约车时间
    timeTxt: "",
    time: "",
    // 起点／上车点
    fromPosTxt: "",
    fromPos: "",
    // 终点／下车点
    toPosTxt: "",
    toPos: "",
    // 行李
    baggageTxt: "",
    baggage: "",
    // 备注
    remakeTxt: "",
    remake: "",
    // 乘车人／司机
    driverTxt: "",
    driver: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    let nickName = ""
    let iconUrl = ""
    wx.getUserInfo({
      success: function (res) {
        const userInfo = res.userInfo
        nickName = userInfo.nickName
        iconUrl = userInfo.avatarUrl
        that.setData({
          name: nickName,
          iconUrl: iconUrl
        })
      }
    })    

    DAPUnionDB.get({
      success: res => {
        // 如果返回数组长度大于1
        if(res.data.length >= 1){
        
          res = res.data[0]
          if(res.type == "driver"){
            driverDB.doc(res.typeid).get({
              success: driverRes => {
                driverRes = driverRes.data
                driverDB.doc(res.typeid).get({
                  success: driverRes => {
                    driverRes = driverRes.data

                    const timeTxt = "发车时间"
                    let time = driverRes.date + " " + driverRes.time
                    const fromPosTxt = "起点"
                    let fromPos = driverRes.fromPos
                    const toPosTxt = "经停点"
                    let toPos = driverRes.toPos
                    const baggageTxt = "行李"
                    let baggage = driverRes.subBaggage
                    const remakeTxt = "备注"
                    let remake = driverRes.remake
                    let driverTxt = "乘车人"
                    let driver = driverRes.subMember

                    that.setData({
                      type: "driver",
                      id: res.typeid,
                      hasPost: true,
                      //发车时间/约车时间
                      timeTxt: timeTxt,
                      time: time,
                      // 起点／上车点
                      fromPosTxt: fromPosTxt,
                      fromPos: fromPos,
                      // 终点／下车点
                      toPosTxt: toPosTxt,
                      toPos: toPos,
                      // 行李
                      baggageTxt: baggageTxt,
                      baggage: baggage,
                      // 备注
                      remakeTxt: remakeTxt,
                      remake: remake,
                      // 乘车人／司机
                      driverTxt: driverTxt,
                      driver: driver
                    })
                  }
                })
              }
            })
          }else if(res.type == "passenger"){
            driverDB.doc(res.typeid).get({
              success: driverRes => {
                driverRes = driverRes.data

                const timeTxt = "发车时间"
                let time = driverRes.date + " " + driverRes.time
                const fromPosTxt = "起点"
                let fromPos = driverRes.fromPos
                const toPosTxt = "经停点"
                let toPos = driverRes.toPos
                const baggageTxt = "行李"
                let baggage = driverRes.subBaggage
                const remakeTxt = "备注"
                let remake = driverRes.remake
                let driverTxt = "乘车人"
                let driver = driverRes.subMember

                that.setData({
                  type: "passenger",
                  id: res.typeid,
                  hasPost: true,
                  //发车时间/约车时间
                  timeTxt: timeTxt,
                  time: time,
                  // 起点／上车点
                  fromPosTxt: fromPosTxt,
                  fromPos: fromPos,
                  // 终点／下车点
                  toPosTxt: toPosTxt,
                  toPos: toPos,
                  // 行李
                  baggageTxt: baggageTxt,
                  baggage: baggage,
                  // 备注
                  remakeTxt: remakeTxt,
                  remake: remake,
                  // 乘车人／司机
                  driverTxt: driverTxt,
                  driver: driver
                })
              }
            })
          }else if(res.type == "passengerWaiting"){
            passengerDB.doc(res.typeid).get({
              success: passengerRes => {
                passengerRes = passengerRes.data

                const timeTxt = "约车时间"
                let time = passengerRes.date + " " + passengerRes.time
                const fromPosTxt = "上车点"
                let fromPos = passengerRes.fromPos
                const toPosTxt = "下车点"
                let toPos = passengerRes.toPos
                const baggageTxt = "行李"
                let baggage = passengerRes.baggage
                const remakeTxt = "备注"
                let remake = passengerRes.remake
                let driverTxt = "司机"
                let driver = ""

                that.setData({
                  type: "passengerWaiting",
                  id: res.typeid,
                  hasPost: true,
                  //发车时间/约车时间
                  timeTxt: timeTxt,
                  time: time,
                  // 起点／上车点
                  fromPosTxt: fromPosTxt,
                  fromPos: fromPos,
                  // 终点／下车点
                  toPosTxt: toPosTxt,
                  toPos: toPos,
                  // 行李
                  baggageTxt: baggageTxt,
                  baggage: baggage,
                  // 备注
                  remakeTxt: remakeTxt,
                  remake: remake,
                  // 乘车人／司机
                  driverTxt: driverTxt,
                  driver: driver
                })
              }
            })
          }else{
            this.init()
          }
        }else{
          this.init()
        }
      }
    })  
  },

  // 初始化
  init: function(){
    this.setData({
      hasPost: false,
      //发车时间/约车时间
      timeTxt: "",
      time: "",
      // 起点／上车点
      fromPosTxt: "",
      fromPos: "",
      // 终点／下车点
      toPosTxt: "",
      toPos: "",
      // 行李
      baggageTxt: "",
      baggage: "",
      // 备注
      remakeTxt: "",
      remake: "",
      // 乘车人／司机
      driverTxt: "",
      driver: ""
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
    this.onLoad()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 删除driver集合中的对应乘车成员
   */
  deletePassengerFromDriver: function (driverId, passengerId) {
    console.log("in deletePassengerFromDriver")
    console.log(driverId)
    console.log(passengerId)
    // 获取driver集合
    driverDB.doc(driverId).get({
      success: driverRes => {
        console.log("deletePassengerFromDriver", driverRes)
        // 删除一个乘客后的座位数
        const subSeat = driverRes.data.subSeat - 1
        // 获取当前预约人员
        const subMember = driverRes.data.subMember
        // 删除成员
        for (let i = 0; i < subMember.length; i++) {
          console.log(subMember)
          if (subMember[i] == passengerId) {
            console.log("yes ")
            subMember.splice(i, 1)
          }
        }
        console.log(subMember)
        // 利用云函数更新当前driver集合
        wx.cloud.callFunction({
          name: "deletePassengerFromDriver",
          data: {
            id: driverId,
            subMember: subMember,
            subSeat: subSeat
          },
          success: cloudRes => {
            console.log("云更新成功", cloudRes)
          },
          fail: cloudRes => {
            console.log("云更新失败", cloudRes)
          }
        })
      }
    })
  },
  // 监听取消按钮
  cancel: function(){
    console.log("out")
    if(this.data.type == "driver"){
      console.log("in")
      console.log(this.data.id)
      driverDB.doc(this.data.id).remove().then(res1 => {
        DAPUnionDB.get().then(res2 => {
          DAPUnionDB.doc(res2.data[0]._id).remove().then(res3 => {
            wx.showToast({
              title: '已取消',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            this.onLoad()
          })
        })
      })
    }else if(this.data.type == "passenger"){
      // driver的id，用来做后续driver表的更新
      console.log(this.data.id)
      DAPUnionDB.get({
        success: res2 => {
          console.log("DAP", res2)
          // 更新driver集合
          this.deletePassengerFromDriver(res2.data[0].typeid, res2.data[0].passengerid)
          // 删除passenger表对应内容
          passengerDB.doc(res2.data[0].passengerid).remove()
          const DAPId = res2.data[0]._id
          DAPUnionDB.doc(DAPId).remove({
            success: res3 => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })
              this.onLoad()
            }
          })
        }
      })              
      

    }else if(this.data.type == "passengerWaiting"){
      passengerDB.doc(this.data.id).remove().then(res1 => {
        DAPUnionDB.get().then(res2 => { 
          DAPUnionDB.doc(res2.data[0]._id).remove().then(res3 => {
            wx.showToast({
              title: '已取消',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            this.onLoad()
          })
        })
      })
    }
  },

})