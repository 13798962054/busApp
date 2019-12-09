// pages/driver/driver.js
const driverDB = wx.cloud.database().collection("driver")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonMsg: "我要发车",
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    
    dbData: null
  },

  toDetail: function(e){
    console.log(e.currentTarget.dataset.variable)
    wx.navigateTo({
      url: '../driverDetail/driverDetail?id=' + e.currentTarget.dataset.variable,
      
    })
  },

  toDriverPost: function(){
    wx.navigateTo({
      url: '../driverPost/driverPost',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    driverDB.get({
      success: res => {
        this.setData({
          dbData: res.data
        })
      },
      fail: res => {
        console.log("设置dbData失败")
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
    this.onLoad()
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
   * 从云数据库提取数据
   */
  getDataFromCloud: function(){
    console.log("A")
    driverDB.get({
      success: res => {
        return res.data
      },
      fail: res => {
        return null
      }
    })
  },

  /**
   * 监听取消按钮
   */
  cancel: function(){
    wx.navigateBack({
      
    })
  }

})