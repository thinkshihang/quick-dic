module.exports = {
    getValues: function (obj) {
        let values = []
        Object.keys(obj).forEach(function (key) {
console.log("3333 " + key + ", " + obj[key])
            values.push(obj[key])
console.log("4444")
        })

        return values
    }
}
