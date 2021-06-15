# menipage
Website that I constructed for my wife on our first year together. It contains images of us enjoying life and cute messages.

## Test the application
To quickly test this project you can easily run:
```bash
docker-compose -f docker-compose.yml -f docker-compose-test.yml up
```

## Installation
1. You will need to properly set up your server with:
  - A FQDN
  - A sub-domain for each page:
    1. Subdomain for the backend server: apimenapage.santosaj.com
    2. Subdomain for the frontend admin page: adminmenapage.santosaj.com
    3. Subdomain for the frontend main page: menapage.santosaj.com
  - A server application properly configured, either Nginx or Apache.

2. You need to permanently set the VUE environmental variable that is needed for the API request. This variable contains the apiendpoint:
```bash
sudo bash -c "echo 'VUE_APP_BACKEND=https://apimenapage.santosaj.com/' >> /etc/environment"
```

3. Build the project 
```bash
npm run build
```
