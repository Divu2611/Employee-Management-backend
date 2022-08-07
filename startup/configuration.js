const config = require('config');

function configure(){
    const token = config.get('jwtPrivateKey');
    if(!token){
        console.log("FATAL Error: Not JWT Private Token provided");
        process.exit(1);
    }
}

exports.configure = configure;