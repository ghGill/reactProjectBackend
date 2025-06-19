const { DB } = require("../servises/db");
const Overview = require("../models/overview");
const User = require("../models/user");

class overviewController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            const overviewDataQuery = {
                attributes: [
                    'id',
                    'user_id', 
                    'amount', 
                    'date',
                    [DB.client.col('ou.name'), 'name'],
                    [DB.client.col('ou.image'), 'image'],
                ],
                include: [
                    {
                        model: User,
                        as: 'ou',
                        attributes: [],
                    },
                ],
                nest: true,
                raw: true,
            };

            const overviews = await DB.query(Overview, overviewDataQuery);
    
            res.status(200).json({success:true, overviews:overviews});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new overviewController();
