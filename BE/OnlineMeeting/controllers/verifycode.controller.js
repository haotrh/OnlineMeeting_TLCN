const nodemailer =  require('nodemailer');
const crypto = require("crypto");
const db = require("../models");
const VerifyCode = db.verifycode;
const User = db.user;

var transporter =  nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'testmail.trustme@gmail.com', //server mail
        pass: 'Talatama66#*' //server mail password
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

exports.verify = async(req, res) => {
    User.update(
        {
            isVerified: 1
        },
        {
            where: {
                username: req.body.username,
                email: req.body.email
            }
        }
    )
    .then(_ => {
        res.send({ message: 200 }); 
    })
    .catch(err => {
        res.send({ message: err.message });
    });
}

exports.sendMail = async(req, res) => {
    const n = crypto.randomInt(0, 1000000);
    const verifyCode = n.toString().padStart(6, "0");
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <span style="color: black">Vefify Code: ${verifyCode}</span>
            </div>
        </div>
    `;

    var mainOptions = { 
        from: 'Online Meeting Verification',
        to: req.body.email,
        subject: 'Verification Code',
        text: 'Your text is here',
        html: content
    }

    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            res.status(500).send({ message: err.message });
        } else {
            console.log('Message sent: ' +  info.response);
            VerifyCode.upsert(
            {
                username: req.body.username,
                email: req.body.email,
                verifycode: verifyCode
            },
            {
                username: req.body.username,
                email: req.body.email
            })
            .then(_ => {
                res.send({ message: 200 }); 
            })
            .catch(err => {
                res.send({ message: err.message });
            });
        }
    });
}
