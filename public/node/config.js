const config = {
    email: {
        account: process.env.EMAIL_ACCT||"none",
        password: process.env.EMAIL_PWD||"1234",
        service: process.env.EMAIL_SERVICE||"gmail"
    },
    mongoUrls: {
        ru: "mongodb://" + (process.env.MONGO_DBUSER||"sean") + ":" + (process.env.MONGO_DBPWD||"1234")+ "@ds257858.mlab.com:57858/ru",
        app: "mongodb://" + (process.env.MONGO_DBUSER||"sean") + ":" + (process.env.MONGO_DBPWD||"1234")+ "@ds257848.mlab.com:57848/app"
    },
    app: {
        JWTSecretOrKey: process.env.JWT_SECRET||"1234"
    }
};

module.exports = config;
