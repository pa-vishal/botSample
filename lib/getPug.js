const fetch = require("node-fetch");

////////////////////////////////////////////////////////////////////////////////

function getPug(theCommand, forMe, callback) {

    fetch(`http://pugme.herokuapp.com/random`)
        .then(response => {
            if (response.status !== 200 && response.status !== 404) {
                let errMsg = `HTML status code error ` + response.status;
                throw errMsg;
            } else {
                return response.json();
            }
        })
        .then(body => {
            console.log(body);
            if (body) {                
                let myResults = body;
                callback(null, myResults);
            } else {
                let myResults = "404";
                callback(null, myResults);
            }
        })
        .catch(err => callback(err));
}
module.exports.getPug = getPug;