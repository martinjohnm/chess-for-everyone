


import express from "express"

import { BE_URL } from "@repo/common/config"
import db from "@repo/db/client"

const app = express()

console.log(BE_URL);

app.get("/", (req, res) => {
    res.json({
        message :"hello world"
    })
})

app.listen(3000)