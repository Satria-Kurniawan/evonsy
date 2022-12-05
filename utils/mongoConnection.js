/* This is a database connection function*/
import mongoose from "mongoose"

const connection = {} /* creating connection object*/

export default async function mongoDbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) return

  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI)

  connection.isConnected = db.connections[0].readyState

  console.log(`MongoDB Connected on host: ${db.connection.host}`)
}
