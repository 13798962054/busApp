const driverDB = wx.cloud.database().collection("driver")
const passengerDB = wx.cloud.database().collection("passenger")
const settingDB = wx.cloud.database().collection("appSetting")
const DAPUnionDB = wx.cloud.database().collection("DAPUnion")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    name: "",
    dbData: "",
    // 行李
    baggageArray: [],
    baggageIndex: 0,
    baggageFinal: [],

    fromToArray: [],
    multiArray: [[], []],
    multiIndex: [0, 0],
    // 约车人图标路径
    iconUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getUserInfo({
      success: function (res) {
        const userInfo = res.userInfo
        that.setData({
          name: userInfo.nickName,
          iconUrl: userInfo.avatarUrl
        })
        
      }
    })

    // 从云数据库获取Setting数据
    settingDB.get({
      success: res => {
        res = res.data[0]
        that.setData({
          baggageArray: res.baggage
        })
      }
    })

    driverDB.where({
      _id: options.id
    }).get().then(res => {
      console.log(res)
      let tempFromTo = []
      tempFromTo.push(res.data[0].fromPos)
      for(let i = 0; i < res.data[0].parkingGroup.length; i++){
        tempFromTo.push(res.data[0].parkingGroup[i])
      } 
      tempFromTo.push(res.data[0].toPos)
      let tempMulti = [[], []]
      // 起点删除最后一个
      for(let i = 0; i < tempFromTo.length - 1; i++)
        tempMulti[0].push(tempFromTo[i])
      
      // 终点删除最后一个
      for (let i = 1; i < tempFromTo.length; i++)
        tempMulti[1].push(tempFromTo[i])
      
      // tempMulti[1].shift()
      that.setData({
        dbData: res.data[0],
        id: options.id,
        fromToArray: tempFromTo,
        multiArray: tempMulti
      })
      console.log(that.data.dbData)
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
   * 上下车选择器
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.fromToArray.slice(data.multiIndex[0] + 1)
      data.multiIndex[1] = 0;
      break;
    }
    console.log(data.multiIndex);
    this.setData(data);
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
   * 表单提交
   */
  formSubmit: function(e){
    const that = this
    const name = e.detail.value.name
    const input = e.detail.value.input
    let currentMember = []
    let currentBaggage = []
    let subSeat = 0
    
    driverDB.doc(that.data.id).get({
      success: function(res){
        subSeat = res.data.subSeat
        const seat = res.data.seat
        // 时间
        const time = res.data.time
        // 日期
        const date = res.data.date

        if(subSeat < seat){
          subSeat++
          console.log(subSeat)
          // 行李
          currentMember = res.data.subMember
          currentMember.push(name)
          currentBaggage = res.data.subBaggage
          for (let i = 0 ; i < that.data.baggageFinal.length; i++){
            currentBaggage.push(that.data.baggageFinal[i])
          }
          // 备注
          let currentRemake = res.data.remake + name + "：" + input + "\n"

          console.log("------")
          console.log(that.data.id)
          console.log(currentMember)
          console.log(currentBaggage)
          console.log(currentRemake)


          wx.cloud.callFunction({
            name: "updateDriver",
            data: {
              id: that.data.id,
              subMember: currentMember,
              subBaggage: currentBaggage,
              remake: currentRemake,
              subSeat: subSeat
            },
            success: res => {
              console.log("update success", res)
              DAPUnionDB.add({
                data: {
                  type: "passenger",
                  typeid: that.data.id
                },
                success: res => {
                  console.log("DAP su", res)
              
                  passengerDB.add({
                    data: {
                      name: name,
                      iconUrl: that.data.iconUrl,
                      fromPos: that.data.multiArray[0][that.data.multiIndex[0]],
                      toPos: that.data.multiArray[1][that.data.multiIndex[1]],
                      date: date,
                      time: time,
                      baggage: that.data.baggageFinal,
                      remake: input
                    },
                    success: res => {
                      console.log("pas succ", res)
                      wx.showToast({
                        title: "约车成功",
                        icon: 'success',
                        duration: 300,
                        mask: true
                      })
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '../driverDetail/driverDetail?id=' + that.data.id,

                        })
                      }, 300)
                    },
                    fail: res => {
                      console.log("pas fail", res)
                    }
                  })
                },
                fail: res => {
                  console.log("DAPfail", res)
                }
              })   
            },
            fail: res => {
              wx.showToast({
                title: "约车失败",
                icon: 'loading',
                duration: 700,
                mask: true
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '../driverDetail/driverDetail?id=' + that.data.id,

                })
              }, 300)
            }
          })
        }
        else{
          wx.showToast({
            title: "已满",
            icon: 'fail',
            duration: 600,
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 600)
        }
        
      },

      fail: function(res){
        console.log("没有发车信息", res)
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