const { Op, fn, col, where, literal, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const seqClient = require('./sequelizeClient');
const User = require("../models/user");
const Color = require("../models/color");
const Category = require("../models/category");
const Pot = require("../models/pot");
const Overview = require("../models/overview");
const Transaction = require("../models/transaction");

class DB {
    constructor() {
        this.client = seqClient;
        this.dbConnectionIsAvailable = false;
    }

    async init() {
        let result = await this.verifyDbConnection();
        
        if (result) {
            result = await this.initDB();

            return result;
        }
        else {
            return {success:false, message:"DB connection is not available."}
        }
    }

    isAvailable() {
        return this.dbConnectionIsAvailable;
    }

    async verifyDbConnection() {
        try {
            let result = false;
            await this.client.authenticate()
                .then(res => {
                    result = true;
                })
                .catch(e => {
                })
            
            this.dbConnectionIsAvailable = result;

            return result;
        }
        catch(e) {
            this.dbConnectionIsAvailable = false;
            return false;
        }
    }

    async initializeAssociations() {
        // Initialize associations between models
        Color.hasMany(Pot, {
            foreignKey: 'color_id',
            onDelete: 'CASCADE',
            as: 'pc'
        });

        Pot.belongsTo(Color, {
            foreignKey: 'color_id',
            onDelete: 'CASCADE',
            as: 'cp'
        });

        User.hasMany(Overview, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            as: 'uo'
        });

        Overview.belongsTo(User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            as: 'ou'
        });

        User.hasMany(Transaction, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            as: 'ut'
        });

        Transaction.belongsTo(User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            as: 'tu'
        });

        Category.hasMany(Transaction, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
            as: 'ct'
        });

        Transaction.belongsTo(Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
            as: 'tc'
        });
    }

    async initDB() {
        try {
            const result = await this.initTables(false);

            return result;
        } 
        catch (e) {
            return {success:false, message:'Creating DB tables failed.'};
        }
    }

    async initTables(recreateTables) {
        try {
            await this.client.sync({force: recreateTables});  // create all tables from models
            if (!recreateTables)
                await this.initializeAssociations();

            if (recreateTables)
                await this.insertData();

            return {success:true, message:'All associations initialized and tables created successfully'};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async insertData() {
        // ***************** USERS ************************************
        console.log("Insert users data");

        let users = [
            {
                "id": 1,
                "name": "Nil Darson",
                "email":"user1@users.com",
                "password":"user1",
                "image": "user1.jpg"
            },
            {
                "id": 2,
                "name": "John Kelly",
                "email":"user2@users.com",
                "password":"user2",
                "image": "user2.jpg"
            },
            {
                "id": 3,
                "name": "Sara Kite",
                "email":"user3@users.com",
                "password":"user3",
                "image": "user3.jpg"
            },
            {
                "id": 4,
                "name": "Roger Brown",
                "email":"user4@users.com",
                "password":"user4",
                "image": "user4.jpg"
            },
            {
                "id": 5,
                "name": "Jenifer Miles",
                "email":"user5@users.com",
                "password":"user5",
                "image": "user5.jpg"
            }
        ]

        for (let i=0; i<users.length; i++) {
            users[i].password = await this.hashPassword(users[i].password);
            await this.insertRecord(User, users[i]);
        }

        // ***************** CATEGORIES ************************************
        console.log("Insert categories data");

        const categories = [
            {
                "id":1,
                "name":"Entertainment"
            },
            {
                "id":2,
                "name":"Bills"
            },
            {
                "id":3,
                "name":"Groceries"
            },
            {
                "id":4,
                "name":"Dining Out"
            },
            {
                "id":5,
                "name":"Transportation"
            },
            {
                "id":6,
                "name":"Personal Care"
            },
            {
                "id":7,
                "name":"Education"
            },
            {
                "id":8,
                "name":"Lifestyle"
            },
            {
                "id":9,
                "name":"Shopping"
            },
            {
                "id":10,
                "name":"General"
            }
        ];

        for (let i=0; i<categories.length; i++) {
            await this.insertRecord(Category, categories[i]);
        }

        // ***************** COLORS ************************************
        console.log("Insert colors data");

        const colors = [
            {
                "id": 1,
                "name":"Green"
            },
            {
                "id": 2,
                "name":"Yellow"
            },
            {
                "id": 3,
                "name":"Cyan"
            },
            {
                "id": 4,
                "name":"Navy"
            },
            {
                "id": 5,
                "name":"Red"
            },
            {
                "id": 6,
                "name":"Purple"
            },
            {
                "id": 7,
                "name":"Turquoise"
            },
            {
                "id": 8,
                "name":"Brown"
            },
            {
                "id": 9,
                "name":"Magenta"
            },
            {
                "id": 10,
                "name":"Blue"
            },
            {
                "id": 11,
                "name":"Grey"
            },
            {
                "id": 12,
                "name":"Army"
            },
            {
                "id": 13,
                "name":"Pink"
            }
        ];

        for (let i=0; i<colors.length; i++) {
            await this.insertRecord(Color, colors[i]);
        }

        // ***************** POTS ************************************
        console.log("Insert pots data");

        const pots = [
            {
                "id":1,
                "title":"Savings",
                "target":2000,
                "saved":159,
                "color_id": 8
            },
            {
                "id":2,
                "title":"Gift",
                "target":60,
                "saved":40,
                "color_id": 10
            },
            {
                "id":3,
                "title":"Holiday",
                "target":1440,
                "saved":531,
                "color_id": 2
            },
            {
                "id":4,
                "title":"Concert Ticket",
                "target":150,
                "saved":110,
                "color_id": 3
            },
            {
                "id":5,
                "title":"New Laptop",
                "target":1000,
                "saved":10,
                "color_id": 13
            }
        ];

        for (let i=0; i<pots.length; i++) {
            await this.insertRecord(Pot, pots[i]);
        }

        // ***************** OVERVIEW ************************************
        console.log("Insert overview data");

        const overviews = [
            {
                "user_id": 1,
                "amount": 75.50,
                "date":"2024-08-18"
            },
            {
                "user_id": 2,
                "amount": -55.50,
                "date":"2023-12-25"
            },
            {
                "user_id": 3,
                "amount": -42.30,
                "date":"2024-11-29"
            },
            {
                "user_id": 4,
                "amount": 120.00,
                "date":"2025-03-01"
            },
            {
                "user_id": 5,
                "amount": -65.00,
                "date":"2025-02-02"
            }
        ];

        for (let i=0; i<overviews.length; i++) {
            await this.insertRecord(Overview, overviews[i]);
        }

        // ***************** TRANSACTIONS ************************************
        console.log("Insert transactions data");

        const transactions = [
            {
                "id":1,
                "user_id":2,
                "category_id": "3",
                "date": "2024-08-12",
                "amount":69
            },
            {
                "id":2,
                "user_id":5,
                "category_id": "3",
                "date": "2024-10-25",
                "amount":-119.50
            },
            {
                "id":3,
                "user_id":3,
                "category_id": "1",
                "date": "2025-06-11",
                "amount":175.00
            },
            {
                "id":4,
                "user_id":1,
                "category_id": "9",
                "date": "2023-05-05",
                "amount":240
            },
            {
                "id":5,
                "user_id":4,
                "category_id": "2",
                "date": "2025-01-17",
                "amount":-50.22
            },
            {
                "id":6,
                "user_id":5,
                "category_id": "7",
                "date": "2024-09-14",
                "amount":488.9
            },
            {
                "id":7,
                "user_id":3,
                "category_id": "7",
                "date": "2024-11-01",
                "amount":-111.22
            },
            {
                "id":8,
                "user_id":4,
                "category_id": "6",
                "date": "2025-02-22",
                "amount":22.1
            },
            {
                "id":9,
                "user_id":1,
                "category_id": "2",
                "date": "2024-12-17",
                "amount":603
            },
            {
                "id":10,
                "user_id":2,
                "category_id": "8",
                "date": "2024-06-16",
                "amount":-289.45
            },
            {
                "id":11,
                "user_id":1,
                "category_id": "8",
                "date": "2024-05-30",
                "amount":47
            },
            {
                "id":12,
                "user_id":5,
                "category_id": "3",
                "date": "2025-07-07",
                "amount":-771.24
            },
            {
                "id":13,
                "user_id":3,
                "category_id": "6",
                "date": "2025-03-03",
                "amount":33.33
            },
            {
                "id":14,
                "user_id":3,
                "category_id": "2",
                "date": "2024-08-08",
                "amount":44.0
            },
            {
                "id":15,
                "user_id":4,
                "category_id": "6",
                "date": "2023-10-13",
                "amount":271.6
            },
            {
                "id":16,
                "user_id":1,
                "category_id": "3",
                "date": "2025-06-01",
                "amount":-407.33
            },
            {
                "id":17,
                "user_id":2,
                "category_id": "8",
                "date": "2024-05-02",
                "amount":500
            },
            {
                "id":18,
                "user_id":2,
                "category_id": "4",
                "date": "2024-06-06",
                "amount":-99.9
            },
            {
                "id":19,
                "user_id":4,
                "category_id": "9",
                "date": "2025-04-16",
                "amount":370.00
            },
            {
                "id":20,
                "user_id":5,
                "category_id": "3",
                "date": "2025-05-12",
                "amount":-490.21
            },
            {
                "id":21,
                "user_id":1,
                "category_id": "5",
                "date": "2025-02-20",
                "amount":411
            },
            {
                "id":22,
                "user_id":2,
                "category_id": "9",
                "date": "2025-03-03",
                "amount":61.6
            },
            {
                "id":23,
                "user_id":1,
                "category_id": "4",
                "date": "2024-11-11",
                "amount":350.8
            },
            {
                "id":24,
                "user_id":5,
                "category_id": "5",
                "date": "2023-12-29",
                "amount":166
            },
            {
                "id":25,
                "user_id":3,
                "category_id": "4",
                "date": "2024-12-12",
                "amount":-57.55
            }
        ];

        for (let i=0; i<transactions.length; i++) {
            await this.insertRecord(Transaction, transactions[i]);
        }
    }

    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password, hasPassword) {
        const result = await bcrypt.compare(password, hasPassword)

        return result;
    }

    async login(email, password) {
        const user = await User.findOne(
            { where: {email: email} }
        );

        const userPassword = user?.dataValues?.password;

        const correctPassword = userPassword ? await this.comparePassword(password, userPassword) : false;

        if (correctPassword) 
            return user
        else
            return false;
    }

    async getUserById(id) {
        let user = await User.findOne(
            { where: {id: id} }
        );

        user = user?.dataValues || false;

        if (user) 
            return user
        else
            return false;
    }

    async signup(data) {

        return await this.insertRecord(User, data);
    }

    async insertRecord(model, data) {
        const now = new Date();
        data.createdAt = now;
        data.updatedAt = now;

        const result = await model.create(data);

        return result;
    }

    async updateRecord(model, data) {
        const now = new Date();
        data.updatedAt = now;

        const result = await model.update(
            data, 
            {
                where: {id: data.id},
            },
        );
        
        return result;
    }

    async deleteRecord(model, data) {
        const result = await model.destroy(
            {
                where: {id: data.id},
            },
        );
        
        return result;
    }

    async userEmailExist(email) {
        const result = await User.findOne(
            { where: {email: email} },
        );

        return result?.dataValues ?? false;
    }

    async getAllColors() {
        const result = await this.getAllRecords(Color);

        return result ?? false;
    }

    async getAllOverviews() {
        const result = await this.getAllRecords(Overview);

        return result ?? false;
    }

    async getAllCategories() {
        const result = await this.getAllRecords(Category);

        return result ?? false;
    }

    async getAllRecords(model) {
            const result = await model.findAll({
                order:[['id', 'ASC']]
            });

            return result.map(rec => rec.dataValues);
    }

    async query(model, query) {
        const result = await model.findAll(query);

        return result;
    }

    async sqlSelectQuery(query, params=[]) {
        const result = await seqClient.query(query, {
            replacements: params,
            type: QueryTypes.SELECT
        });

        return result ?? [];
    }
/*

    async update(model=null, data={}) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            if (!data.id)
                return {success:false, message:'id key is missing'};

            const result = await model.update(
                data, 
                {
                    where: {id: data.id},
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async delete(model=null, id=null) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            if (!id)
                return {success:false, message:`id key is missing`};

            const result = await model.destroy(
                {
                    where: {id: id},
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async get(model=null, id=null) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            let filter = {raw: true};
            if (parseInt(id))
                filter = {
                            where: {
                                id: id
                            },
                            raw: true,
                        };

            const result = await model.findAll(
                filter,
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSession(lectureId=null) {
        try {
            const exist = await this.recordExist(Lecture, lectureId);
            if (!exist)
                return {success:false, message:`Lecture id ${lectureId} not exist`};

            let filter = {
                raw: true,
                order: [['session_time', 'ASC']]
            };

            if (parseInt(lectureId))
                filter.where = {
                                   lecture_id: lectureId
                               };

            const result = await LectureSession.findAll(
                filter,
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async addSession(lectureId, sessionTime, capacity) {
        try {
            const exist = await this.recordExist(Lecture, lectureId);
            if (!exist)
                return {success:false, message:`Lecture id ${lectureId} not exist`};

            const result = await LectureSession.create(
                {
                    lecture_id:lectureId, 
                    session_time:sessionTime,
                    capacity: capacity
                },
            );
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async updateSession(data={}) {
        try {
            if (!data.id)
                return {success:false, message:'Session id key is missing'};

            const result = await LectureSession.update(
                data, 
                {
                    where: {
                        id: data.id
                    },
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async deleteSession(id=null, lectureId=null) {
        try {
            let filter = {};
            if (parseInt(lectureId)) {
                filter = {
                    where: {
                        lecture_id: lectureId
                    }
                };
            }

            if (parseInt(id)) {
                filter = {
                    where: {
                        id: id
                    }
                };
            }

            const result = await LectureSession.destroy(
                filter,
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async registerStudent(studentId, sessionId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const sessionExist = await this.recordExist(LectureSession, sessionId);
            if (!sessionExist)
                return {success:false, message:`Lecture session id ${sessionId} not exist`};

            const studentSessionExist = await StudentLecture.findOne(
                {   
                    where: {
                        student_id: studentId,
                        session_id: sessionId
                    }
                },
            );

            if (studentSessionExist)
                return {success:false, message:`Student ${studentId} already registered for this lecture`};

            const registredStudents = await StudentLecture.findOne({
                attributes: [
                    [this.client.fn('COUNT', this.client.col('student_id')), 'students_count'],
                    [this.client.col('ls.capacity'), 'capacity'],
                ],
                include: [
                    {
                        model: LectureSession,
                        as: 'ls',
                        attributes: [],
                        where: {
                            id: sessionId
                        }
                    },
                ],
                group: [
                    'session_id',
                    "ls.capacity",
                    "ls.id"
                ],
                nest: true,
                raw: true,
            });

            if (registredStudents) {
                if (registredStudents.capacity == parseInt(registredStudents.students_count))
                    return {success:false, message:`Registration for session ${sessionId} is full`};
            }

            const result = await StudentLecture.create(
                {
                    student_id:studentId, 
                    session_id:sessionId, 
                },
                { 
                    raw: true,
                }
            );
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async unRegisterStudent(studentId, sessionId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const studentSessionExist = await StudentLecture.findOne(
                { where: {
                    student_id: studentId},
                    session_id: sessionId
                },
            );

            if (!studentSessionExist)
                return {success:false, message:`Student id ${studentId} is not register to this session`};

            const result = await StudentLecture.destroy(
                {
                    where: {
                        student_id: studentId,
                        session_id: sessionId,
                    }
                },
                { raw: true }
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getStudentLectures(studentId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const result = await StudentLecture.findAll(
                {
                    attributes: [
                        'session_id',
                        [this.client.col('ls.session_time'), 'session_time'],
                        [this.client.col('ls.l.name'), 'lecture_name'],
                    ],
                    where: {
                        student_id: studentId,
                    },
                    include: [{
                        model: LectureSession,
                        as: 'ls',
                        attributes: [],
                        include: [{
                            model: Lecture,
                            as: 'l',
                            attributes: []
                        }]
                    }],
                    raw: true,
                    nest: true,
                }
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSessionStudents(sessionId) {
        try {
            const sessionExist = await this.recordExist(LectureSession, sessionId);
            if (!sessionExist)
                return {success:false, message:`Session id ${sessionId} not exist`};

            const result = await StudentLecture.findAll(
                {
                    attributes:[
                        [this.client.col('s.id'), 'student_id'],
                        [this.client.col('s.first_name'), 'first_name'],
                        [this.client.col('s.last_name'), 'last_name'],
                    ],
                    where: {
                        session_id: sessionId,
                    },
                    include: [{
                        model: Student,
                        as: 's',
                        attributes: [],
                    }],
                    raw: true,
                    nest: true,
                }
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSessionsInfo() {
        try {
            const result = await Lecture.findAll({
                attributes: [
                    [this.client.col('ls.id'), 'session_id'],
                    ['name', 'lecture_name'],
                    [this.client.col('ls.session_time'), 'session_time'],
                    [this.client.col('ls.capacity'), 'capacity'],
                    [this.client.fn('COUNT', this.client.col('ls.sl.id')), 'students_count']
                ],
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    required: true,
                    include: [
                      {
                        model: StudentLecture,
                        as: 'sl',
                        attributes: [],
                      }
                    ]
                  }
                ],
                group: [
                  'Lecture.id',
                  'ls.id'
                ],
                order: [['lecture_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getStudentsInfo() {
        try {
            const result = await StudentLecture.findAll({
                attributes: [
                  [this.client.col('s.id'), 'student_id'],
                  [this.client.col('s.first_name'), 'first_name'],
                  [this.client.col('s.last_name'), 'last_name'],
                  [this.client.col('ls.l.name'), 'lecture_name'],
                  [this.client.col('ls.session_time'), 'session_time'],
                ],
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    include: [
                      {
                        model: Lecture,
                        as: 'l',
                        attributes: [],
                      },
                    ]
                  },
                  {
                    model: Student,
                    as: 's',
                    attributes: [],
                  }
                ],
                order: [['first_name', 'ASC'], ['last_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getFullSessions() {
        try {
            const result = await LectureSession.findAll({
                attributes: [
                  ['id', 'session_id'],
                  'capacity',
                  'session_time',
                  [this.client.col('l.name'), 'lecture_name'],
                ],
                include: [
                  {
                    model: Lecture,
                    as: 'l',
                    attributes: [],
                    required: true,
                  },
                  {
                    model: StudentLecture,
                    as: 'sl',
                    attributes: [],
                    required: false,
                  },
                ],
                group: [
                    "LectureSession.id",
                    "l.name",
                    "l.id",
                ],
                having: this.client.literal('COUNT("sl"."student_id") >= "LectureSession"."capacity"'),
                order: [['lecture_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async searchSessions(fieldName, text) {
        try {
            const searchText = `%${text}%`;

            let whereObj = {};
            let fnVar = '';
            switch (fieldName) {
                case 'name':
                    whereObj = {
                        [fieldName] : { [Op.like]: searchText },
                    };
                    break;

                case 'date':
                    whereObj = where(
                        fn('TO_CHAR', col('Lecture.createdAt'), 'YYYY-MM-DD'),
                        { [Op.like]: searchText }
                      );
                    break;
            }

            const result = await Lecture.findAll({
                attributes: [
                    ['id', 'lecture_id'],
                    ['name', 'lecture_name'],
                    'createdAt',
                    [this.client.col('ls.id'), 'session_id'],
                    [this.client.col('ls.capacity'), 'capacity'],
                ],
                where: whereObj,
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    required: true,
                  },
                ],
                order: [['name', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }
    
    async test() {
        try {
            const result = await Student.findAll({
                attributes: [
                    ['id', 'student_id'],
                    'first_name',
                    'last_name',
                    [this.client.col('sl.ls.l.id'), 'lecture_id'],
                    [this.client.col('sl.ls.l.name'), 'lecture_name'],
                    [this.client.fn('COUNT', this.client.col('sl.id')), 'sessions_count']
                ],
                include: [
                  {
                    model: StudentLecture,
                    as: 'sl',
                    attributes: [],
                    required: true,
                    include:[
                        {
                            model: LectureSession,
                            as: 'ls',
                            attributes:[],
                            required: true,
                            as: 'ls',
                            include:[
                                {
                                    model: Lecture,
                                    as: 'l',
                                    attributes:[],
                                    required: true,
                                },
                            ],
                        },
                    ],
                  },
                ],
                group: ['Student.id', 'sl.ls.l.id'],
                order: [['sessions_count', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }
*/
}

module.exports = { DB: new DB() };
