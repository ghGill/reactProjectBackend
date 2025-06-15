const { DB } = require("../servises/db");

class userController {
    constructor() {
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;

            const user = await DB.login(email, password);

            if (user)
                res.status(200).json({success:true, user:user});
            else
                res.status(500).json({success:false, message:"Invalid email or password."});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async signup(req, res) {
        try {
            const data = req.body;

            const {email} = data;

            if (!email)
                res.status(500).json({success:false, message:"User email is required."});

            const emailExist = await DB.userEmailExist(email);
            if (emailExist) {
                res.status(500).json({success:false, message:"This email is already associated with an account."});
                return;
            }

            data.password = await DB.hashPassword(data.password);

            await DB.signup(data);

            res.status(200).json({success:true, user:data});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new userController();
