const {Client} = require('pg');
const client = new Client({
    host:"209.209.40.79",
    user:"BOLX2021",
    port:19392,
    password:"bolx@@!!",
    database:"MAI_QC"
})
module.exports=client;