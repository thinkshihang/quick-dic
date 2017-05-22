module.exports = {
    getValues: function (obj) {
        let values = []
        Object.keys(obj).forEach(function (key) {
            values.push(obj[key])
        })
        return values
    }
}
