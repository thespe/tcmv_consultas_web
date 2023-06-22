const { Router } = require('express');
const { querynow, querygetAnalisis_circulaciones } = require('../controllers/task_controllers')
const router = Router();

const pool = require('../db').pool;

const fileUpload = require('express-fileupload');
const { exec } = require('child_process')

router.get('/', (req, res) => { res.send('ghhhhhhhh') });
router.get('/testquerynow2', querynow);
router.get('/testquery3', querygetAnalisis_circulaciones)

router.use(fileUpload());
router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const myFile = req.files.file;

  if (myFile.name.includes("SAEGAL") && myFile.name.includes(".xlsm")) {
    console.log("Se ha subido " + myFile.name)
    myFile.mv(`./uploads/SAEGAL-INF-InformeSemanal.xlsm`, function (err) {
      exec('powershell.exe -ExecutionPolicy Bypass -File .\\ps-procesar-xls.ps1') //para permitir subir ambos archivos en rápida sucesión debería separar procesar el informe semanal y anexos en dos scripts
      querygetAnalisis_circulaciones() //regenero json con datos nuevos; debería hacerlo esperar a que se termine de procesar
      if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
      }
    });

  } else if (myFile.name.includes("Anexos_Unificados") && myFile.name.includes(".xlsx")) {
    console.log("Se ha subido " + myFile.name)
    myFile.mv(`./uploads/Anexos_Unificados.xlsx`, function (err) {
      exec('powershell.exe -ExecutionPolicy Bypass -File .\\ps-procesar-xls.ps1')
      querygetAnalisis_circulaciones()
      if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
      }
    });

  } else {
    myFile.mv(`./uploads/${myFile.name}`, function (err) {
      //exec ('powershell.exe -ExecutionPolicy Bypass -File .\\ps-procesar-xls.ps1')
      if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
      }
    });
  }
  res.sendStatus(200);
});


router.get('*', (req, res) => {
  res.send('404')
});

module.exports = router;