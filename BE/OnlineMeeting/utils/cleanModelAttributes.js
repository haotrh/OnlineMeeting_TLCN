const cleanModelAttributes = (obj, attributes) => {
    attributes.forEach(attribute => delete obj.dataValues[attribute])
}

module.exports = { cleanModelAttributes }