const bcrypt = require("bcryptjs");

const users = [
    {
        name : "Jatin",
        email: "jatin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        
    },
    {
        name : "demo",
        email: "demo@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        
    },

]


module.exports = users;