# menipage
Website that I constructed for my wife on our first year together. It contains images of us enjoying life and cute messages.

## Test the application
To quickly test this project you can easily run:
```bash
docker-compose -f docker-compose.yml -f docker-compose-test.yml up
```
> main page will be on port 80
> admin page will be on port 8080
> backend will be on port 80

## Installation
1. You will need to properly set up your server with:
  - A FQDN
  - A sub-domain for each page:
    1. Subdomain for the backend server: apimenapage.santosaj.com
    2. Subdomain for the frontend admin page: adminmenapage.santosaj.com
    3. Subdomain for the frontend main page: menapage.santosaj.com
  - A server application properly configured, either Nginx or Apache.

2. You need to permanently set the VUE environmental variables and node variable that will be needed. You can change it for a specific user in the `~/.bashrc` file or for the whole system in `/etc/environment`. These are the variables that need to be set:
  - `NODE_ENV=production` to indicate Node that you are working in a production environment.
  - `VUE_APP_ADMIN_OUTDIR` Build directory for the admin page. Indicates the directory where the index.html and frontend files for the admin page will be placed.
  - `VUE_APP_MENAPAGE_OUTDIR` Build directory for the mena page. Indicates the directory where the index.html and frontend files for the main page (menapage) will be placed.
  - `VUE_APP_BACKEND` contains the backend URL endpoint.
Example to set these variables:
> To set this variable for a specific user 
```bash
echo 'VUE_APP_ADMIN_OUTDIR=/var/www/admin-menapage.santosaj.com' >> ~/.bashrc"
```
> To set this variable system wide
```bash
sudo bash -c "echo 'VUE_APP_BACKEND=https://apimenapage.santosaj.com/' >> /etc/environment"
```

3. Build the project 
cd to the project source location and run do the following:
```bash
npm config set -g production false
```
> This is to allow node to install not only production packages but also some development packages listed in the `package.json`. These packages will be needed for the build.

```bash
npm install
``` 
> To install packages listed in the `package.json` file.
```bash
npm run build
```
> To build the project.