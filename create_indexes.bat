@echo off
echo ==========================================
echo   Configuracao de Indices do Firestore
echo ==========================================
echo.
echo Este script vai usar suas credenciais de usuario (Dono)
echo para criar os indices necessarios, contornando o erro 403.
echo.
echo 1. Voce precisara fazer login no navegador se ainda nao estiver logado.
echo 2. O indice sera criado com base no arquivo firestore.indexes.json.
echo.
pause
cd backend
call npx firebase-tools login
call npx firebase-tools deploy --only firestore:indexes
echo.
echo ==========================================
echo   Concluido! Verifique o console acima.
echo ==========================================
pause
