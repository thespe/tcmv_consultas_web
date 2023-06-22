SELECT
    an.Nombre_Linea AS "Expedición",
    --para la misma línea an.nombre_expedición está en mayúsculas en un sentido y en minúsculas en otro
    CASE
        WHEN an.trayecto IN ('11', '21', '31', '41', '51', '61', '71', '81', '91') THEN 'IDA' --más eficiente que char con wildcard
        WHEN an.trayecto IN ('12', '22', '32', '42', '52', '62', '72', '82', '92') THEN 'VUELTA'
    END AS "Sentido",
    an.contrato AS "Contrato",
    an.linea_sitme AS "Línea Sitme",
    an.linea_otrans AS "Línea OTRANS",
    an.Expedición_Sitme_esperada_por_SAEGAL AS "Expedición Sitme esperada por SAEGAL",
    an.Expedición_OTRANS_esperada_por_SAEGAL AS "Expedición OTRANS esperada por SAEGAL",
    an.salidateórica AS "Hora de salida (oferta)",
    an.salida_real_informada AS "Hora de salida (SAE)",
    an.llegadateórica AS "Hora de llegada (oferta)",
    an.llegada_real_informada AS "Hora de llegada (SAE)",
    CASE
        WHEN (an.llegada_real_informada - an.llegadateórica) < '0' THEN an.llegadateórica - an.llegada_real_informada
        ELSE an.llegada_real_informada - an.llegadateórica
    END AS "Diferencia",
    COALESCE(lat1_an.parada_origen, lat2_an.parada_destino) AS "Nombre de la parada",
    COALESCE(
        lat1_an.Código_de_parada_origen,
        lat2_an.Código_de_parada_destino
    ) AS "Ordinal de la parada",
    an.llegadateórica - an.salidateórica AS "Tiempo a origen (oferta)",
    an.llegada_real_informada - an.salida_real_informada AS "Tiempo a origen (SAE)",
    CONCAT(
        lat1_an.minsalidasae,
        lat2_an.minsalidasae,
        '-',
        lat1_an.maxllegadasae,
        lat2_an.maxllegadasae
    ) AS "Hora de paso (oferta)",
    CONCAT(
        lat1_an.minsalidareal,
        lat2_an.minsalidareal,
        '-',
        lat1_an.maxllegadareal,
        lat2_an.maxllegadareal
    ) AS "Hora de paso (SAE)"
FROM
    analisis_circulaciones an
    JOIN lineas li ON an.Linea_Otrans = li.Código_de_línea
    LEFT JOIN (
        SELECT
            lat1_an.Nombre_expedición,
            lat1_an.Trayecto,
            lat1_li.Parada_origen,
            lat1_li.Código_de_parada_origen,
            MIN(lat1_an.SalidaTeórica) AS minsalidasae,
            MAX(lat1_an.LlegadaTeórica) AS maxllegadasae,
            MIN(lat1_an.Salida_Real_Informada) AS minsalidareal,
            MAX(lat1_an.Llegada_Real_Informada) AS maxllegadareal
        FROM
            analisis_circulaciones AS lat1_an
            JOIN lineas AS lat1_li ON lat1_an.Linea_Otrans = lat1_li.Código_de_línea
        WHERE
            lat1_an.Trayecto IN ('11', '21', '31', '41', '51', '61', '71', '81', '91')
        GROUP BY
            lat1_an.Nombre_expedición,
            lat1_an.Trayecto,
            lat1_li.Parada_origen,
            lat1_li.Código_de_parada_origen
    ) AS lat1_an ON an.nombre_expedición = lat1_an.nombre_expedición
    AND an.Trayecto = lat1_an.Trayecto
    LEFT JOIN (
        SELECT
            lat2_an.Nombre_expedición,
            lat2_an.Trayecto,
            lat2_li.Parada_destino,
            lat2_li.Código_de_parada_destino,
            MIN(lat2_an.SalidaTeórica) AS minsalidasae,
            MAX(lat2_an.LlegadaTeórica) AS maxllegadasae,
            MIN(lat2_an.Salida_Real_Informada) AS minsalidareal,
            MAX(lat2_an.Llegada_Real_Informada) AS maxllegadareal
        FROM
            analisis_circulaciones AS lat2_an
            JOIN lineas AS lat2_li ON lat2_an.Linea_Otrans = lat2_li.Código_de_línea
        WHERE
            lat2_an.Trayecto IN ('12', '22', '32', '42', '52', '62', '72', '82', '92')
        GROUP BY
            lat2_an.Nombre_expedición,
            lat2_an.Trayecto,
            lat2_li.Parada_destino,
            lat2_li.Código_de_parada_destino
    ) AS lat2_an ON an.nombre_expedición = lat2_an.nombre_expedición
    AND an.Trayecto = lat2_an.Trayecto
LIMIT
    500