@echo off
echo ==========================================
echo 🚀 CONSTRUYENDO Y SUBIENDO FRONTEND (Ana Felix)
echo ==========================================
echo.

set DOCKER_USER=anafelix
set IMAGE_NAME=agropacayales-frontend
set TAG=1.0

echo [+] Construyendo imagen Docker del Frontend...
docker build -t %DOCKER_USER%/%IMAGE_NAME%:%TAG% .

if %ERRORLEVEL% neq 0 (
    echo ❌ ERROR en la construccion.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [+] Subiendo imagen a Docker Hub (%DOCKER_USER%/%IMAGE_NAME%:%TAG%)...
docker push %DOCKER_USER%/%IMAGE_NAME%:%TAG%

echo.
echo ==========================================
echo ✅ PROCESO COMPLETADO PARA ANA FELIX
echo ==========================================
pause
