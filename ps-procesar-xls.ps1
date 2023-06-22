$excelArchivo1Nombre = "SAEGAL-INF-InformeSemanal"
$extensiónArchivo1 = ".xlsm"
$excelArchivo2Nombre = "Anexos_Unificados"
$extensiónArchivo2 = ".xlsx"

$carpetaorigen = ($pwd.ToString()+'\uploads\')
$carpetadestino = ($pwd.ToString()+'\uploads\')
$subcarpetatemporal = "T1-csvs\"

New-Item $carpetadestino$subcarpetatemporal -ItemType directory

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open($carpetaorigen + $excelArchivo1Nombre + $extensiónArchivo1)
foreach ($ws in $wb.Worksheets)
{
    $ws.SaveAs($carpetadestino + $subcarpetatemporal + $excelArchivo1Nombre + "_" + $ws.Name +".csv",62,$useDefault,$useDefault,$false,$false,$false,$useDefault,$useDefault,$true) 
}
$wb = $excel.Workbooks.Open($carpetaorigen + $excelArchivo2Nombre + $extensiónArchivo2)
foreach ($ws in $wb.Worksheets)
{
    $ws.SaveAs($carpetadestino + $subcarpetatemporal + $excelArchivo2Nombre + "_" + $ws.Name +".csv",62,$useDefault,$useDefault,$false,$false,$false,$useDefault,$useDefault,$true)
}
$excel.Quit()

# En este archivo sobran las primeras filas para que se pueda importar los datos en postgre
# Existe COPY FROM PROGRAM 'powershell ...', pero por defecto cmd utiliza CP850 que pgsql no puede tratar
$file = $carpetaorigen + $subcarpetatemporal + "SAEGAL-INF-InformeSemanal_Análisis_circulaciones.csv"
get-content $file | select -Skip 19 | set-content "$file-temp"
move "$file-temp" $file -Force

# Con move-item no cambian los permisos, si se utilizaría C:\temp para la carpeta daría error 42501 al intentar importar
# Elimino las tildes por error 58P01 al intentar importar
Copy-Item -path $carpetadestino$subcarpetatemporal\* -Include $excelArchivo1Nombre*_Análisis_circulaciones.csv $carpetadestino$excelArchivo1Nombre'_Analisis_circulaciones.csv' -Force
Copy-Item -path $carpetadestino$subcarpetatemporal\* -Include $excelArchivo2Nombre*_Líneas.csv $carpetadestino$excelArchivo2Nombre'_Lineas.csv' -Force

Start-Sleep -Seconds 2 # a veces excel tarda en apagarse así que uno de los archivos siguen en uso y no se pueden eliminar
Remove-item $carpetadestino$subcarpetatemporal -recurse

