const { UnauthorizedError } = require("../utils/errors")

class User {
    static async login (credentials) {
        //where user submits their email and password

        throw new UnauthorizedError("Invalid email/password")
    }

    static async register (credentials) {
        //
        
    }
}

module.exports = User