// pages/driverPost/driverPost.js
const db = wx.cloud.database()
const driverDB = db.collection("driver")
const settingDB = db.collection("appSetting")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 发车人姓名
    name: "owen",
    // 车型
    carStyleIndex: 0,
    carStyleArray: [],
    // 发车点
    fromIndex: 0,
    fromArray: [],
    // 经停点
    toIndex: 0,
    toArray: [],
    toCheckGroup: [],
    // 发车时间
    date: '',
    time: '',
    // 座位
    seatIndex: 0,
    seatArray: [],
    // 已预约座位
    subSeat: 0,
    // 已预约行李
    subBaggage: ""
  },

  padStart: function (len, str) {
    str += ""   
    for (let i = str.length; i < len; i++) {
      str = "0" + str
    }
    return str
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    
    // 获取系统当前时间
    const time = new Date()
    const years = that.padStart(2, time.getFullYear())
    const month = that.padStart(2, time.getMonth() + 1)
    const day = that.padStart(2, time.getDate())
    const hours = that.padStart(2, time.getHours())
    let minutes = that.padStart(2, time.getMinutes())

    that.setData({
      date: years + "-" + month + "-" + day,
      time: hours + ":" + minutes
    })



    // 从云数据库获取Setting数据
    settingDB.get({
      success: res => {
        res = res.data[0]
        this.setData({
          carStyleArray: res.cars,
          fromArray: res.from,
          toArray: res.parkingPoint,
          seatArray: res.carSeat
        })
      }
    })

    // 经停点，Array变Object

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

  /*
   * 车型选择器绑定
   */
  bindCarStylePickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      carStyleIndex: e.detail.value,
      seatIndex: e.detail.value
    })
  },
  /*
   * 发车点选择器绑定
   */
  bindFromPickerChange: function (e) {
    this.setData({
      fromIndex: e.detail.value
    })
  },

  /*
   * 经停点复选框选择器绑定
   */
  toCheckboxChange: function(e){
    console.log(e.detail.value)
  },

  /*
   * 发车日期选择器绑定
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /*
   * 发车时间选择器绑定
   */
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /*
   * 座位选择器绑定
   */
  bindSeatPickerChange: function (e) {
    this.setData({
      seatIndex: e.detail.value
    })
  },

  /**
   * 发布按钮监听器
   */
  check: function (e) {
    const that = this.data
    driverDB.add({
      data: {
        name: that.name,
        carStyle: that.carStyleArray[that.carStyleIndex],
        fromPos: that.fromArray[that.fromIndex],
        toPos: that.toArray[that.toIndex],
        date: that.date,
        time: that.time,
        seat: that.seatArray[that.seatIndex],
        subSeat: that.subSeat,
        subBaggage: that.subBaggage
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 300,
          mask: true
        })
        setTimeout(function(){
          wx.navigateBack({

          })
        },300)
        
      }
    })
  },

  /**
   * 取消按钮监听器
   */
  cancel: function (e) {
    console.log(e)
    wx.navigateBack({
      
    })
  },
})