const driverDB = wx.cloud.database().collection("driver")
const DAPUnionDB = wx.cloud.database().collection("DAPUnion")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dbData: null, 
    id: "",
    // 是否为发车人
    isDriver: false,
    buttonMsg: "预约车主"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    console.log(options.id)
    driverDB.where({
      _id: options.id
    }).get().then( res => {
      console.log(res)
      that.setData({
        dbData: res.data[0],
        id: options.id
      })
      console.log(that.data.dbData)
    })

    DAPUnionDB.get({
      success: res => {
        console.log("dap", res)
        if(res.data.length >= 1){
          if(res.data[0].type == "driver"){
            
            if(res.data[0].typeid == options.id){
              that.setData({
                isDriver: true,
                buttonMsg: "取消行程"
              })
            }
            console.log(that.data.notDriver)
          }
        }
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
  /**
   * 监听修改按钮
   */
  fixed: function(){
    wx.navigateTo({
      url: '../driverFixed/driverFixed?id=' + this.data.id,
    })
  },

  /**
   * 监听预约车主按钮
   */
  appointment: function () {
    // 如果是发车人（取消行程）
    if(this.data.isDriver){
      driverDB.doc(this.data.id).remove({
        success: res => {
          DAPUnionDB.get({
            success: res => {
              console.log("DAP", res)
              const DAPId = res.data[0]._id
              DAPUnionDB.doc(DAPId).remove()
            }
          })

          wx.showToast({
            title: "取消成功",
            icon: 'success',
            duration: 500,
            mask: true
          }),
          wx.navigateBack({
            
          })
        }
      })
    }else{
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
          } else {
            wx.navigateTo({
              url: '../appointment/appointment?id=' + this.data.id,
            })
          }
        }
      })
    }
    
    
  },

  /**
   * 监听取消按钮
   */
  cancel: function(e){
    wx.navigateBack({
      
    })
  }
})