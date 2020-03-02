var fs = require('fs');
const exec = require('child_process').exec


exec('ruby example.rb', function(err, stdout, stderr) {

    let data =  fs.readFileSync("temp-ruby-kyle.txt"); 
    console.log(data);
});

