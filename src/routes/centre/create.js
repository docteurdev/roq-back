const { ValidationError, UniqueConstraintError } = require("sequelize");
const { Centre } = require("../../db/sequelize")
const bcript = require('bcrypt');

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
const upload = multer({storage: storage})


module.exports = (app) => {
  app.post('/api/roqya_ci/create_center',upload.single('image'), (req, res) => {

    console.log("the filesssss",req.file);
    console.log("the boooodyyy",req.body);

    const centreINfos= req.body;

    const port = process.env.PORT || 3000

    bcript.hash(centreINfos.password, 10)
       .then(hash => {

        let newCentre = {
          ...centreINfos,
          logo: req.file? `http://localhost:${port} /Images/${req.file.filename}`: null,
          password: hash
        };

        return Centre.create(newCentre).then(centre => {
          let message = `le centre ${centre.nom} est ajouté`;
         return res.json({ message, data: centre })
        }).catch(error => {
          if (error instanceof ValidationError) {
           return res.status(404).json({ message: error.message, data: error })
          }
          if (error instanceof UniqueConstraintError) {
            return res.status(4040).json({ message: error.message, data: error })
          }
          let message = `un petit problème avec le server réessayez dans un instant`;
          res.json({ message: error, data: message })
        })


      })


  })
}