const db = require("../models");
const VerifyCode = db.verifycode;
const controller = require("../controllers/verifycode.controller");

checkVerifyCodeExpired = (req, res, next) => {
    VerifyCode.findOne({
        where: {
            email: req.body.email
        }})
        .then(verify => {
            if (!verify) {
                res.status(404).send({ message: "Failed! Verify code expired!" });
                return;
            }
            else {
                const expiredTime = new Date(verify.updatedAt).getTime()
                const currentTime = Date.now().getTime()
                if(currentTime > (expiredTime + 2*60*60*1000)) { //expire in 2h
                    res.status(404).send({ message: "Failed! Verify code expired!" });
                    return;
                }
            }
            next();
        });
}

checkVerifyCode = (req, res, next) => {
    VerifyCode.findOne({
        where: {
            email: req.body.email
        }})
        .then(verify => {
            if (!verify) {
                res.status(404).send({ message: "Failed! Wrong code!" });
                return;
            }
            else {
                if(verify.verifycode != req.body.verifycode) { //expire in 2h
                    res.status(404).send({ message: "Failed! Wrong code!" });
                    return;
                }
            }
            next();
        })
}

const verifyCode = {
    checkVerifyCodeExpired: checkVerifyCodeExpired,
    checkVerifyCode: checkVerifyCode
};

module.exports = verifyCode;