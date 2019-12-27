// pages/all/all.js
const db = wx.cloud.database()
const driverDB = db.collection("driver")
const passengerDB = db.collection("passenger")
const DAPUnionDB = db.collection("DAPUnion")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    listData: [],
    passengerlistData: []
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
    
    this.init()
  },
  // 初始化页面
  init: function(){
    const that = this
    // 获取系统当前时间
    const time = new Date()
    const years = that.padStart(2, time.getFullYear())
    const month = that.padStart(2, time.getMonth() + 1)
    const day = that.padStart(2, time.getDate())
    that.setData({
      date: years + "-" + month + "-" + day,
    })

    // 初始化行车安排表格内容
    driverDB.get({
      success: res => {
        console.log(res)
        let list = []
        
        for(let i = 0; i < res.data.length; i++){
          // if(res.data[i].date == that.data.date){
          let listItem = {}
          listItem.time = res.data[i].date
          listItem.time += "\n" + res.data[i].time
          listItem.fromPos = res.data[i].fromPos
          listItem.toPos = res.data[i].toPos
          listItem.driver = res.data[i].name

          // 乘车人 id转姓名
          const subMemberIdArray = res.data[i].subMember
          let subMemberNameArray = []
          for (let i = 0; i < subMemberIdArray.length; i++) {
            passengerDB.doc(subMemberIdArray[i]).get({
              success: passengerRes => {
                console.log(i)
                console.log("乘客", passengerRes)
                subMemberNameArray.push(passengerRes.data.name)
                
              }
            })
          }
          setTimeout(function(){
            listItem.subMember = subMemberNameArray.join("、")
            console.log(listItem)
            list.push(listItem)
          }, 500)
          // listItem.subMember = subMemberNameArray.join("\n")
          // console.log(listItem)
          // list.push(listItem)
        }
        setTimeout(function () {
          list.sort(function (protoTypeName){
            // 递减顺序
            return function (object1, object2) {
              var val1 = object1[protoTypeName];
              var val2 = object2[protoTypeName];
              if (val1 > val2) {
                return -1;
              } else if (val1 < val2) {
                return 1;
              } else {
                return 0;
              }
            }
          }("time"))
          console.log(list)
          that.setData({
            listData: list
          })
        }, 500)
        // list.sort(this.compare("time"))
        // console.log(list)
        // that.setData({
        //   listData: list
        // })
    
      }
    })

    // 没有预约车位的乘客
    passengerDB.where({
      // 查询司机列为空的行
      driver: ""
    }).get({
      success: res => {
        console.log("没有预约车位", res)
        let list = []

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].date == that.data.date) {
            let listItem = {}
            listItem.time = res.data[i].time
            listItem.fromPos = res.data[i].fromPos
            listItem.toPos = res.data[i].toPos
            listItem.passenger = res.data[i].name

            console.log(listItem)
            list.push(listItem)
          }
        }
        list.sort(this.compare("time"))
        console.log(list)
        that.setData({
          passengerlistData: list
        })
      }
    })
    
  },  
  // sort对比函数
  compare: function(protoTypeName) {
    return function (object1, object2) {
      var val1 = object1[protoTypeName];
      var val2 = object2[protoTypeName];
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },

  /*
   * 日期选择器绑定
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      date: e.detail.value
    })
    // this.init()
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
    this.init()
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

  }
})