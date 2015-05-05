/*jslint node: true */
/*jslint esnext: true*/

module.exports = {
    getRandomHexColor() {
     return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    makeUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};
