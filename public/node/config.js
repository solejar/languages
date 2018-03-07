let config = {}

config.email = {}
config.mongo = {}

config.email.account = process.env.EMAIL_ACCT||"none";
config.email.password = process.env.EMAIL_PWD||"1234";
config.email.service = process.env.EMAIL_SERVICE||"gmail";

config.mongo.db =
{
    'ru': {
        url: 'ds257848.mlab.com:57848',

    },
    'app': {
        url: 'ds257858.mlab.com:57858'
    }
}

config.mongo.dbUser = process.env.MONGO_DBUSER||"sean";
config.mongo.dbPassword = process.env.MONGO_DBPWD||"1234";

module.exports = config;
