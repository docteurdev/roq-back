const { Patient, RendezVous } = require("../../db/sequelize")

module.exports = (app) => {
    app.post('/login/patient', (req, res) => {
        const patient = req.body;
         console.log(patient);
        Patient.findOne(
            {
                where: {
                    centreId: patient.centreId,
                    code_patient: patient.id,
                    nom: patient.nom,
                    password: patient.password
                    
                },
                include: [{ model: RendezVous }]
            }
        ).then(data => {
            if (!data) {
                let message = `Vous n'est pas inscrit dans la base de donnée de ce centre`;

                return res.status(404).json({ data: message })
            }

            return res.json(data)
        })
            .catch(error => {
                let message = `un problème a surgi lors de l'opération`;
                res.status(404).json({ message: error, data: message })

            })
    })
}