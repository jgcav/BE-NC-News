# JC News

## Summary

JC News is an API that interacts with a database and serves requested data to a user. It enables a user to view, amend and delete data related to news articles. The hosted API can be viewed by clicking [HERE](https://jc-news.herokuapp.com/api/).

## Setup Instructions

### If you would like to try out this API for yourself, please follow the instructions below:

You will require these minimum versions of Node.js and Postgres to run the project:

> `Node.js v17.1.0` and `Postgres v12.9`

#### **1. Fork and clone the repo**

Click on the Fork icon to create a forked version of the repo and clone it by clicking the green Code icon, copying the link under the HTTPS tab and pasting it into your terminal preceeded by 'git clone'. For example, the command you enter should look like this:

`git clone https://github.com/jgcav/BE-NC-News.git`

_Please note that the link you copy from github will contain your username in place of jgcav._

#### **2. Install dependencies**

Run the command `npm install` in your terminal.

#### **3. Creating env files**

You will need to have access to the necessary environment variables. In order to do this:

> 1. Create a new file named **.env.test**

> 2. Create a new file named **.env.development**

You will need to write `PGDATABASE=` in each of the files, followed immediately by their respective database names. The database names can be found in the **setup.sql** file in the **db** directory.

#### **4. Seed local database**

Run the following commands in your terminal:

`npm run setup-dbs` (to create the databases)
`npm run seed` (to seed the databases)

#### **5. Run tests**

To run tests, run the command `npm test app` in your terminal.

**6. Make requests**

For a list of all of the available endpoints, please visit https://jc-news.herokuapp.com/api/
