const { UnauthorizedError, BadRequestError } = require("../utils/errors")
const db = require("../db")
const { c } = require("tar")

class User {
    
    static async login (credentials) {
        //where user submits their email and password

        throw new UnauthorizedError("Invalid email/password")
    }

    static async register (credentials) {
        const requireFields = ["id", "email", "password", "first_name", "last_name", "location"]
        requireFields.forEach((field) => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        }) 

        if (credentials.email.indexOf('@') <= 0) {
            throw new BadRequestError("Invalid email.")
        }

        const existingUser = await User.fetchUserByEmail(credentials.email)

        if (existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const lowercasedEmail = credentials.email.toLowerCase()

        const result = await db.query(`
            INSERT INTO users (
                id,
                email,
                password,
                first_name,
                last_name,
                location,
                date
            )
            VALUE ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, create_at;
        `, [lowercasedEmail, credentials.id, credentials.password, credentials.first_name, credentials.last_name, credentials.location, credentials.date])

        const user = result.rows[0]

        return user
    }

    static async fetchUserByEmail(email) {
        const result = await db.query(
          `SELECT id,
                  email, 
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  location,
                  date              
               FROM users
               WHERE email = $1`,
          [email.toLowerCase()]
        )
    
        const user = result.rows[0]
    
        return user
      }
}

module.exports = User