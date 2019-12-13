// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "sql-424ae6"
})
const db = cloud.database()
const driverDB = db.collection("driverDB")

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("in0000")
  console.log(event)
  driverDB.doc(event.id).update({
    data: {
      subMember: event.subMember,
      subBaggage: event.subBaggage,
      remake: event.remake,
      subSeat: event.subSeat
    },
    success: res => {
      console.log("云函数updateDriver更新成功", res)
    }
  })
}