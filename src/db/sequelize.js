const {Sequelize, DataTypes} = require('sequelize');

const CentreModel = require('../models/Centre');
const PatientModel = require('../models/Patient');
const EmployeModel = require('../models/Employe');
const TypeEmployeModel = require('../models/typeEmploye');
const RdvModel = require('../models/Rdv');

const sequelize = new Sequelize(process.env.DB_NAME || 'roqya_app', process.env.DB_USER ||'root', process.env.DB_PASSWORD ||'root', {
    host:process.env.HOST || 'localhost',
    port:process.env.PORT || 3306,
    dialect: 'mysql',
    // dialectOptions: {
    //   timezone: 'Etc/GMT-2',
    // },
     logging: false
  })

  const Centre = CentreModel(sequelize, DataTypes);
  const Patient = PatientModel(sequelize, DataTypes);
  const Employe = EmployeModel(sequelize, DataTypes);
  const TypeEmpl = TypeEmployeModel(sequelize, DataTypes);
  const RendezVous = RdvModel(sequelize, DataTypes);
 
  // relationship centre_patient
  Centre.hasMany(Patient);
  Patient.belongsTo(Centre);
  

  // relationship centre_employe

   Centre.hasMany(Employe);
   Employe.belongsTo(Centre);

  // relationship typeemploye_employe

  // TypeEmpl.hasMany(Employe);
  // Employe.belongsTo(TypeEmpl);
  
  // relationship RendezVous Patient
  Patient.hasMany(RendezVous, {
    foreignKey:'CarnetId',
    constraints: false,
    // scope: {
    //   CarnetId: 'Carnet'
    // }
  });
   RendezVous.belongsTo(Patient, {foreignKey: 'CarnetId', constraints: false})

   

  // relationship patient_employe;
  const activeEmploye = sequelize.define('active_employe',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: DataTypes.STRING,
        autoIncrement: true,

    }
  },{
    timestamps: false,
  })

  // Employe.belongsToMany(Patient,{through: activeEmploye});
  // RendezVous.belongsToMany(Employe,{through: activeEmploye});



  const connectDb = () =>{
     return sequelize.sync({}).then(_ =>{

     }).then(data =>{

     })

  }

  sequelize.authenticate()
            .then(_ => console.log("t'es connecté à roqya_app"))
            .catch(error => console.log(error));


            module.exports= {connectDb, Centre, Patient, Employe, TypeEmpl, RendezVous};