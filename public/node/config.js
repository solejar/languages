let config = {
    email: {
        account: process.env.EMAIL_ACCT||"none",
        password: process.env.EMAIL_PWD||"1234",
        service: process.env.EMAIL_SERVICE||"gmail"
    },
    mongo: {
        db: {
            ru: {
                url: 'ds257848.mlab.com:57848',

            },
            app: {
                url: 'ds257858.mlab.com:57858'
            }
        },
        dbUser: process.env.MONGO_DBUSER||"sean",
        dbPassword: process.env.MONGO_DBPWD||"1234"
    },
    app: {
        JWTSecretOrKey: process.env.JWT_SECRET||'1234'
    }
};

module.exports = config;
