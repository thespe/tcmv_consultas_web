Drop table if exists analisis_circulaciones;
Drop table if exists lineas;

CREATE Table analisis_circulaciones (
    Contrato varchar(16),
    Linea_Sitme smallint,
    Linea_Otrans varchar(16),
    Nombre_Linea varchar(200),
    Trayecto smallint,
    Expedición_Sitme_esperada_por_SAEGAL int,
    Expedición_OTRANS_esperada_por_SAEGAL varchar(26),
    Nombre_Expedición varchar(200),
    Dia date,
    Autobús_notificado_a_SAEGAL varchar(16),
    SalidaTeórica time,
    LlegadaTeórica time,
    Salida_Real_Informada time,
    Llegada_Real_Informada time,
    Paradas_Informadas smallint,
    ParadasTotales smallint,
    Circulacion_100Porcien_bajo_demanda varchar(200),
    Proveedor_SAE varchar(100),
    Pasajeros_durante_la_circulación smallint,
    Porcien_Fallo_información_de_paradas varchar(200),
    Criterio_1_Circulación_informada varchar(8),
    Criterio2_Detección_de_paradas_MayorQue70Porcien varchar(8)
);

CREATE Table lineas (
    Código_de_línea varchar(16),
    Numero_de_línea smallint,
    Nombre_de_línea varchar(200),
    Código_de_parada_origen varchar(18),
    Parada_origen varchar(100),
    Código_de_parada_destino varchar(18),
    Parada_destino varchar(100),
    Código_de_contrato varchar(10),
    Servizo_de_mobilidade varchar(50),
    Data_de_inicio date
);

COPY analisis_circulaciones
FROM
    