const pool = require('../db').pool;
const fs = require('fs');

const querygetAnalisis_circulaciones = async (req, res) => {
    // Elimina datos anteriores, vuelve a crear tablas
    // no se puede utilizar rutas relativas con COPY TO, este arreglo funciona
    await pool.query(fs.readFileSync('./src/queries/drop,create,copy.sql').toString()
        + "'" + __dirname + "\\..\\..\\uploads\\SAEGAL-INF-InformeSemanal_Analisis_circulaciones.csv' DELIMITER ';' CSV Header ENCODING 'LATIN1'; COPY lineas FROM '" + __dirname + "\\..\\..\\uploads\\Anexos_Unificados_Lineas.csv' DELIMITER ';' CSV Header;"
    )

    var result = await pool.query(fs.readFileSync('./src/queries/getAnalisis_circulaciones.sql').toString())
    // Presenta el resultado a la tabla; por defecto React no admite datos fuera de su src
    fs.writeFile("./client/src/pages/data.json", JSON.stringify(result.rows), (err) => { if (err) { console.log(err); } });

    // Vuelve a generar el resultado y lo guarda como .csv para poder descargar
    // Por simplicidad coloco el archivo de una manera accesible por React
    // no se puede utilizar rutas relativas en COPY TO
    await pool.query(fs.readFileSync('./src/queries/copyAnalisis_circulaciones.sql').toString() + "'" + __dirname + "\\..\\..\\client\\src\\pages\\tabla.csv' DELIMITER ';' CSV HEADER ENCODING 'LATIN1'")
    //res.json(result.rows)
}

const querynow = async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    //res.json({info:{result}}) -- así retorna todo
    res.json(result.rows[0].now)
}

module.exports = {
    querynow,
    querygetAnalisis_circulaciones
}

