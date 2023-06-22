Creado 29.5-6.6, sin modificar desde entonces. Viene sin datos por privacidad. Quizás debería crear unos dummy compatibles para poder comprobar funcionamiento.
	Instrucciones
0. Asumo tener node.js y PostgreSQL
1. Colocar el proyecto en C:\ o similar
2. Ejecutar el .bat
3. Subir Anexos_Unificados*.xlsx, esperar a que se termine de procesar: si todavía existe .\uploads\T1-csvs
4. Subir SAEGAL-INF-InformeSemanal*.xlsm, -||-
5. Subir cualquiera de los dos otra vez porque no se espera a terminar de procesar los archivos con generar el .json que utiliza la tabla, esto debería estar aparte
Los headers de la tabla se generan dinámicamente en función de los datos en .\client\src\pages\data.json. Se puede introducir cualquier BD en el .json manualmente.

	Problemas conocidos
- subir otro archivo sin esperar a que termine el script PS crashes backend
- no se espera con redirigir hasta que haya terminado el script PS
- no se espera con intentar generar un data.json actualizado -||-
- no se comprueba si existen SAEGAL*.csv y Anexos*.csv mayores de 1kb antes de intentar actualizar data.json y redirigir
- Tiempo a origen (SAE) no aparece en la página, pero sí en todo lo demás

	Lista de deseos
- otras queries sobre los datos
- separar el procesamiento de xlsx y xlsm en dos scripts
- mover la función de descarga a otro archivo
- mover tabla.csv descargable a una página en backend
- pasar de COPY a \copy para que se necesite menos permisos
- eliminar la necesidad de pulsar "upload"
- ignorar la ausencia de .csvs en vez de requerir archivos vacíos
- ui
- poder subir ambos archivos a la vez
- opción de subir un csv o json cualquiera para hacer uso de la dinamicidad
- opción de filtrado o búsqueda en tabla
- cambiar de tabla sin perder funcionalidad para mejor rendimiento: esta es inutilizable si se muestra los 51k resultados
- pg-promise para concesión de sintaxis de conexión
- aparte de poder atender a usuarios secuencialmente sin problemas, poder atender a múltiples simultáneamente: usuario$n y BBDD$n
