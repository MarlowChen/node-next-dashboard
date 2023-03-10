#  node-next-dashboard

A simple NodeJs and NextJs full stack backend that can be cross-platform and supports various operating systems, and can be deployed using Docker.

##  Motivation

 - RWD Dashboard ui design 
 - offline map
 - full role and permission design
 - High performance, capable of exporting as static files for front-end and back-end separation.
 - It is possible to package and encrypt

##  Main tech

**Front-End**

 - ReactJs
 - NextJs 
 - Mui - ui lib
 - Yup - verification form

**Back-End**
 - NodeJs
 - ExpressJs - restful api lib
 - Sequelize - database ORM
 - passport - auth middleware
 - node-cache 
 - worker_threads - nodejs multithreading

**Other**
 - Ncc - compiling nodejs 
 - Pkg- Package your Node._js_


##  Usage

### Installation
    npm install
    
### Usage

    npm run dev

### Usage Pack 

The **global ncc** must be installed first 
[ncc](https://github.com/vercel/ncc)

    npm i -g @vercel/ncc


### run

    npm run ncc-run

### build

    npm run ncc-build

    node .\build\index.js


補充：若要打包可以到build之後的folder使用pkg進行打包，
可以產生一個完整的執行檔(任何os) 直接執行

    http://localhost:3001/

default account : Admin
default password : 1234

## .env

PROJECT_SECRET 用於Jwt認證，
NEXT_PUBLIC_WEATHER_KEY用於地圖天氣Api ，使用openweathermap
[openweathermap](https://openweathermap.org/)


##  Caveats

因為是從商業使用的SourceCode搬運，並且移除直播相關與Schedule相關技術與邏輯，
所以有很多沒有注意的Code，請見諒。
