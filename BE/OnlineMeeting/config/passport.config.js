const authConfig = require('./auth.config');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const userSerivce = require('../services/user.service');
const { tokenTypes } = require('./token.config');

const jwtOptions = {
    secretOrKey: authConfig.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = await userSerivce.getUserByEmail(payload.email);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
