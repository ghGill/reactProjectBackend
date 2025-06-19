const { DB } = require("../servises/db");
const Pot = require("../models/pot");
const Color = require("../models/color");

class potController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            const potsDataQuery = {
                attributes: [
                    'id', 
                    'title', 
                    'target', 
                    'saved',
                    'color_id',
                    [DB.client.col('cp.name'), 'color'],
                ],
                include: [
                    {
                        model: Color,
                        as: 'cp',
                        attributes: [],
                    },
                ],
                nest: true,
                raw: true,
            };

            const pots = await DB.query(Pot, potsDataQuery);
    
            res.status(200).json({success:true, pots:pots});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async add(req, res) {
        try {
            const data = req.body;

            const pot = await DB.insertRecord(Pot, data);
    
            res.status(200).json({success:true, pot:pot});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async update(req, res) {
        try {
            const data = req.body;

            const pot = await DB.updateRecord(Pot, data);
    
            res.status(200).json({success:true, pot:pot});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async delete(req, res) {
        try {
            const data = req.body;

            await DB.deleteRecord(Pot, data);
    
            res.status(200).json({success:true});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new potController();
