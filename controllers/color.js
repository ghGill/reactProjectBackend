const { DB } = require("../servises/db");

class colorController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            const colors = await DB.getAllColors();
    
            res.status(200).json({success:true, colors:colors});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new colorController();
