const { ValidationError, UniqueConstraintError } = require("sequelize");
const { TypeEmpl, Centre, Employe } = require("../../db/sequelize");
const bcrypt = require('bcrypt');

const multer  = require('multer')
const path= require('path');

const storage= multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "Images");
    },
    filename: (req, file, cb) =>{
      cb(null, Date.now() + path.extname(file.originalname))  
    }
})
const upload = multer({ storage: storage })

//  console.log(__basedir);
module.exports = (app) => {
    app.post('/api/roqya_ci/create_employe',upload.single('image'), (req, res) => {
        let centreBody = req.body;
        let { idCentre, idTypeEmploye, employe } = centreBody;
        let centre, type_employe, newEmploye;
          console.log(req.file);
         console.log(centreBody);

        bcrypt.hash(employe.password, 10).then(hash =>{
            
            let cretedEmplay= {
               ...employe,
                image: req.file? `http://localhost:3000/Images/${req.file.filename}`: null,
               password: hash 
            }

            return Employe.create(cretedEmplay).then(data =>{
                newEmploye = data;
                console.log(newEmploye);
                return Centre.findByPk(idCentre)
    
            })
            .then(data =>{
                centre = data;
               return centre.addEmploye(newEmploye)
            }).then(data =>{
               return res.json(newEmploye);
            })
            .catch(error => {
    
                if (error instanceof ValidationError) {
                  return  res.status(404).json({ message: error.message, data: error })
                }
                if (error instanceof UniqueConstraintError) {
                    res.status(4040).json({ message: error.message, data: error })
                }
                let message = `un petit problème avec le server réessayez dans un instant`;
                res.json({ message: error, data: message })
    
            })
    

        })
        

    })
}

