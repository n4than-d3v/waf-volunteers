# Update VPS

This is a script used to update the VPS with the latest version of main

```cd ..
cd opt/waf-volunteers
git clone
cd api
dotnet publish -c Release -o out
cp /opt/appsettings.json /opt/waf-volunteers/api/out
cd ..
cd portal
ng build --configuration production
systemctl restart nginx
systemctl restart waf-api```
