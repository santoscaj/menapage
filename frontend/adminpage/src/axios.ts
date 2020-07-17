import axios from 'axios'
require('dotenv').config({path: '../.env'})

axios.defaults.baseURL = process.env.VUE_APP_BACKEND

// axios.defaults.baseURL = 'https://apimenapage.santosaj.com/'

