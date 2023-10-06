Dim objShell
Set objShell = WScript.CreateObject("WScript.Shell")

Dim workingDirectory
workingDirectory = "C:\Users\yande\Desktop\applications\NodeJS\carrot-discord-bot"  ' Ganti dengan direktori tempat bot Anda berada

objShell.Run "cmd /c cd """ & workingDirectory & """ && npm start", 0, False

Set objShell = Nothing
