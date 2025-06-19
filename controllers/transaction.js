const { DB } = require("../servises/db");
const Transaction = require("../models/transaction");
const Category = require("../models/category");
const User = require("../models/user");

class transactionController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            const transactionDataQuery = {
                attributes: [
                    'id', 
                    'date', 
                    'amount', 
                    'user_id',
                    'category_id',
                    [DB.client.col('tu.name'), 'name'],
                    [DB.client.col('tu.image'), 'image'],
                    [DB.client.col('tc.name'), 'category'],
                ],
                include: [
                    {
                        model: User,
                        as: 'tu',
                        attributes: [],
                    },
                    {
                        model: Category,
                        as: 'tc',
                        attributes: [],
                    },
                ],
                nest: true,
                raw: true,
            };

            const transactions = await DB.query(Transaction, transactionDataQuery);
    
            res.status(200).json({success:true, transactions:transactions});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getCountByCategory(req, res) {
        try {
            const transactionDataQuery = {
                attributes:[
                    ['id', 'cat_id'],
                    [DB.client.fn('COUNT', DB.client.col('category_id')), 'total']
                ],
                include: [
                    {
                        model: Transaction,
                        as: 'ct',
                        attributes:[]
                    }
                ],
                group: ['cat_id'],
                order:['cat_id'],
                nest: true,
                raw: true,
            };

            const transactions = await DB.query(Category, transactionDataQuery);
    
            res.status(200).json({success:true, transactions:transactions});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getTransactions(req, res) {
        const { catid, sortid, page, limit } = req.params;

        const where = (catid === '999') ? {} : {category_id:catid};

        let sortBy = '';
        switch (parseInt(sortid)) {
            case 1: // latest
                sortBy = ['date', 'DESC']
                break;

            case 2: // oldest
                sortBy = ['date', 'ASC']
                break;

            case 3: // A to Z
                sortBy = ['name', 'ASC']
                break;

            case 4: // Z to A
                sortBy = ['name', 'DESC']
                break;

            case 5: // Highest amount
                sortBy = ['amount', 'DESC']
                break;

            case 6: // Lowest amount
                sortBy = ['amount', 'ASC']
                break;
        }

        try {
            const transactionDataQuery = {
                attributes:[
                    'id',
                    'category_id',
                    'user_id',
                    'amount',
                    'date',
                    [DB.client.col('tu.name'), 'name'],
                    [DB.client.col('tu.image'), 'image'],
                    [DB.client.col('tc.name'), 'category'],
                ],
                include: [
                    {
                        model: User,
                        as: 'tu',
                        attributes: [],
                    },
                    {
                        model: Category,
                        as: 'tc',
                        attributes: [],
                    },
                ],
                where: where,
                order: [sortBy],
                limit: limit,
                offset: (page-1) * limit,
                nest: true,
                raw: true,
            };

            const transactions = await DB.query(Transaction, transactionDataQuery);
    
            res.status(200).json({success:true, transactions:transactions});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getTransactionsSql(req, res) {
        const { catid, sortid, page, limit } = req.params;

        const where = (catid === '999') ? '' : `WHERE category_id = ${catid}`;

        let sortBy = '';
        switch (parseInt(sortid)) {
            case 1: // latest
                sortBy = 'date DESC'
                break;

            case 2: // oldest
                sortBy = 'date ASC'
                break;

            case 3: // A to Z
                sortBy = 'name ASC'
                break;

            case 4: // Z to A
                sortBy = 'name DESC'
                break;

            case 5: // Highest amount
                sortBy = 'amount DESC'
                break;

            case 6: // Lowest amount
                sortBy = 'amount ASC'
                break;
        }

        try {
            const query = `
                SELECT t.*, u.name FROM "Transactions" t
                LEFT JOIN "Users" u ON u.id = t.user_id
                ${where}
                ORDER BY ${sortBy} 
                LIMIT ${limit}
                OFFSET ${(page-1) * limit}
            `;

            const transactions = await DB.sqlSelectQuery(query);
    
            res.status(200).json({success:true, transactions:transactions});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async add(req, res) {
        try {
            const data = req.body;

            const transaction = await DB.insertRecord(Transaction, data);
    
            res.status(200).json({success:true, transaction:transaction});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new transactionController();
