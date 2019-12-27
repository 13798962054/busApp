// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "bus-8848"
})
const db = cloud.database()
const driverDB = db.collection("driver")

// 云函数入口函数
exports.main = async (event, context) => {
  return await driverDB.doc(event.id).update({
    data: {
      subMember: event.subMember,
      subSeat: event.subSeat
    },
    success: res => {
      console.log("云函数updateDriver更新成功", res)
    }
  })
}