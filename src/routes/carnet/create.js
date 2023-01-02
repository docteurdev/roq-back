const { ValidationError, UniqueConstraintError } = require("sequelize");
const { Patient, Centre } = require("../../db/sequelize")

module.exports= (app) =>{
    app.post('/api/roqya_ci/carnet_create', (req, res) =>{
        const {centreId, patient} = req.body;
        let newPatient, centre;
        
        const patientSecure={
            ...patient, 
            code_patient:`rqya${patient.contact.slice(3, 7)}`,
            password:`${centreId}${patient.nom.slice(0,1)}${patient.contact.slice(0, 2)}`
        }
       return Patient.create(patientSecure)
      .then(data =>{
        newPatient = data;
        return Centre.findByPk(centreId)

    }).then(data =>{
        if(!data){

            const  message=`selectionnez le centre du nouveau patient`;
            return res.status(404).json({message})
     
        }
        centre = data;
        centre.addCarnet(newPatient)
        const  message=`vous avez ajouter un nouveau patient`;
        return res.json({message, data: newPatient})
       })
       .catch(error =>{
            if(error instanceof ValidationError){

              return  res.json({message: error, data: error.message})
            }
            if(error instanceof UniqueConstraintError){

               return res.json({message: error, data: error.message})
            }
            const  message=`veuillez réessayer dans un instant`;
            return res.json({message: error, data: message})
    
       })
    })
}