@echo off
echo Memeriksa keberadaan plantuml.jar...
if not exist "plantuml.jar" (
    echo Mengunduh plantuml.jar dari GitHub releases...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/plantuml/plantuml/releases/download/v1.2024.4/plantuml-1.2024.4.jar' -OutFile 'plantuml.jar'"
)

echo.
echo Merender semua file .puml menjadi .png...
FOR /R %%G IN (*.puml) DO (
    echo Merender: %%~nG.puml
    java -jar plantuml.jar -tpng "%%G"
)

echo.
echo Semua diagram berhasil dirender!
