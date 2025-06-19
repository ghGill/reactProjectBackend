const { DB } = require("../servises/db");

class categoryController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            const categories = await DB.getAllCategories();
    
            res.status(200).json({success:true, categories:categories});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new categoryController();
