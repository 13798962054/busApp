// pages/passenger/passenger.js
//获取应用实例
const app = getApp()
const driverDB = wx.cloud.database().collection("driver")
const passengerDB = wx.cloud.database().collection("passenger")
const DAPUnionDB = wx.cloud.database().collection("DAPUnion")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    buttonMsg: "我要约车",
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',

    dbData: null
  },
  /**
   * 点击前往详细页面
   */
  toDetail: function (e) {
    wx.navigateTo({
      url: '../passengerDetail/passengerDetail?id=' + e.currentTarget.dataset.variable,

    })
  },

  /**
   * 监听我要约车按钮
   */
  toPassengerPost: function () {
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
            url: '../passengerPost/passengerPost',
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

    passengerDB.get({
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
    if (e.detail.userInfo) {
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
  getDataFromCloud: function () {
    console.log("A")
    passengerDB.get({
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
  cancel: function () {
    wx.navigateBack({

    })
  },

  /**
   * 删除driver集合中的对应乘车成员
   */
  deletePassengerFromDriver: function(driverId, passengerId){
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
        for(let i = 0 ; i < subMember.length ; i++){
          console.log(subMember)
          if(subMember[i] == passengerId){
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

  /**
   * 删除当前item
   */
  deleteItem: function (e) {
    const that = this
    const itemId = e.currentTarget.dataset.id
    console.log(itemId)
    passengerDB.doc(itemId).remove({
      success: res => {
        DAPUnionDB.get({
          success: res => {
            console.log("DAP", res)
            const driverId = res.data[0].typeid
            const passengerId = res.data[0].passengerid
            that.deletePassengerFromDriver(driverId, passengerId)
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
        console.log("删除失败", res)
      }

    })
  }

})