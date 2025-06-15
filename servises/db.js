const { Op, fn, col, where, literal } = require('sequelize');
const bcrypt = require('bcrypt');
const seqClient = require('./sequelizeClient');
const User = require("../models/user");
const Color = require("../models/color");
const Category = require("../models/category");

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
        // Student.hasMany(StudentLecture, {
        //     foreignKey: 'student_id',
        //     onDelete: 'CASCADE',
        //     as: 'sl'
        // });

        // Lecture.hasMany(LectureSession, {
        //     foreignKey: 'lecture_id',
        //     onDelete: 'CASCADE',
        //     as: 'ls'
        // });

        // LectureSession.hasMany(StudentLecture, {
        //     foreignKey: 'session_id',
        //     onDelete: 'CASCADE',
        //     as: 'sl'
        // });

        // StudentLecture.belongsTo(Student, {
        //     foreignKey: 'student_id',
        //     onDelete: 'CASCADE',
        //     as: 's'
        // });

        // StudentLecture.belongsTo(LectureSession, {
        //     foreignKey: 'session_id',
        //     onDelete: 'CASCADE',
        //     as: 'ls'
        // });

        // LectureSession.belongsTo(Lecture, {
        //     foreignKey: 'lecture_id',
        //     onDelete: 'CASCADE',
        //     as: 'l'
        // });
    }

    async initDB() {
        try {
            const result = await this.createTables(false);

            return result;
        } 
        catch (e) {
            return {success:false, message:'Creating DB tables failed.'};
        }
    }

    async createTables(recreateTables = false) {
        try {
            await this.initializeAssociations();
            
            await this.client.sync({force: recreateTables});  // create all tables from models

            if (recreateTables) {
                await this.insertData(1);
                await this.insertData(2);
                await this.insertData(3);
            }

            return {success:true, message:'All associations initialized and tables created successfully'};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async insertData(n) {
        switch (n) {
            case 1:
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
                break;

            case 2:
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
                break;

            case 3:
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
                break;
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

    async userEmailExist(email) {
        const result = await User.findOne(
            { where: {email: email} },
        );

        return result?.dataValues ?? false;
    }

    async getAllRecords(model) {
        try {
            const result = await model.findAll();

            return result.map(rec => rec.dataValues);
        } 
        catch (e) {
            return e.message;
        }
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
