// pages/driver/driver.js
//获取应用实例
const app = getApp() 
const driverDB = wx.cloud.database().collection("driver")
const DAPUnionDB = wx.cloud.database().collection("DAPUnion")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

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
    DAPUnionDB.get({
      success: res => {
        if (res.data.length >= 1) {
          let msg = "你已经预约"
          if (res.data[0].type == "driver") {
            msg = "你已发车"
          }
          wx.showToast({
            title: msg,
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        
        }else{
          wx.navigateTo({
            url: '../driverPost/driverPost',
          })
        }
      }
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // 获取driver集合信息
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
  getUserInfo: function (e) {
    console.log(e)
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
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
  },

  /**
   * 删除当前item
   */
  deleteItem: function(e){
    const that = this
    const itemId = e.currentTarget.dataset.id
    console.log(itemId)


    driverDB.doc(itemId).remove({
      success: res => {
        DAPUnionDB.get({
          success: res => {
            console.log("DAP", res)
            const DAPId = res.data[0]._id
            DAPUnionDB.doc(DAPId).remove() 
          }
        })

        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 300,
          mask: true
        })
        setTimeout(function () {
          that.onLoad()
        }, 300)
      },
      fail: function (res) {
        console.log("删除失败1", res)
      }

    })
   


    
  }

})