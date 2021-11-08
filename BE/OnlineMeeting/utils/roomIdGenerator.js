var randomstring = require("randomstring");

const roomIdGenerator = () => {
    return randomstring.generate({ length: 3, charset: 'alalphabetic', capitalization: "lowercase" })
        + '-' + randomstring.generate({ length: 4, charset: 'alalphabetic', capitalization: "lowercase" })
        + "-" + randomstring.generate({ length: 3, charset: 'alalphabetic', capitalization: "lowercase" })
}

module.exports = roomIdGenerator