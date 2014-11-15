@ECHO OFF

%~d0
CD "%~dp0"

copy talks_fallback.json ..\CordovaBootstrapKnockout\CordovaBootstrapKnockout\scripts\
copy talks_fallback.json ..\CordovajQueryMobile\CordovajQueryMobile\scripts\
copy talks_fallback.json ..\CordovaKendoUiMobile\CordovaKendoUiMobile\scripts\

pause