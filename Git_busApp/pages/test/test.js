// pages/test/test.js
const driverDB = wx.cloud.database().collection("driver")
Page({
  
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let a = 0
    var promise = new Promise(function (resolve, reject) {
      let i = 0
      for (; i < 10; i++) {
        driverDB.get({
          success: res => {
            a++
            console.log(a)
          }
        })
      }
      if (i == 9) {
        resolve("va");
      } else {
        reject("error");
      }
    });

    promise.then(function (value) {
      console.log(a)
    }, function (value) {
      // failure
    });
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

  }
})