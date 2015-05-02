/*jslint node: true */
/*jslint esnext: true*/

module.exports = {
    getRandomHexColor() {
     return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
};
