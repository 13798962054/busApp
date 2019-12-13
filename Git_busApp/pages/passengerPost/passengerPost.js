// pages/driverPost/driverPost.js
const db = wx.cloud.database()
const passengerDB = db.collection("passenger")
const settingDB = db.collection("appSetting")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 发车人头像
    iconUrl: "",
    // 发起人姓名
    name: "",
    // 出发点
    fromIndex: 0,
    fromArray: [],
    // 终点
    toIndex: 0,
    toArray: [],
    // 出发时间
    date: '',
    time: '',
    // 行李
    baggageArray: [],
    baggageIndex: 0,
    baggageFinal: [],
    // 备注
    textArea: ""
    
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
        that.setData({
          fromArray: res.from,
          toArray: res.to,
          baggageArray: res.baggage
        })
      }
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
   * 出发点选择器绑定
   */
  bindFromPickerChange: function (e) {
    this.setData({
      fromIndex: e.detail.value
    })
  },

  /*
   * 终点选择器绑定
   */
  bindToPickerChange: function (e) {
    this.setData({
      toIndex: e.detail.value
    })
  },

  /*
   * 出发日期选择器绑定
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /*
   * 出发时间选择器绑定
   */
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /*
   * 行李选择器绑定
   */
  bindBaggagePickerChange: function (e) {
   
    let currentBaggageFinal = this.data.baggageFinal
    let currentBaggage = this.data.baggageArray[e.detail.value]
    currentBaggageFinal.push(currentBaggage)
    console.log()
    this.setData({
      baggageFinal: currentBaggageFinal
    })
    console.log(this.data.baggageFinal)
  },
  /**
   *  备注
   */
  bindTextAreaChange: function(e) {
    this.setData({
      textArea: e.detail.value
    })
  },
  /**
   * 发布按钮监听器
   */
  check: function (e) {
    const that = this.data
    passengerDB.add({
      data: {
        name: that.name,
        iconUrl: that.iconUrl,
        fromPos: that.fromArray[that.fromIndex],
        toPos: that.toArray[that.toIndex],
        date: that.date,
        time: that.time,
        baggage: that.baggageFinal,
        remake: that.textArea
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 300,
          mask: true
        })
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 300)

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