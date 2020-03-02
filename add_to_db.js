var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/songs";
let root = 'C:/Users/test account/Desktop/coding/LyricsGenius(1.27)/LyricsGenius(1.27)/song_db/all_bands/'
var files = fs.readdirSync(root);

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("songs");
        files.forEach( function(path) {
            let artist = path.replace(".json", "");
            try {
                let data =  JSON.parse(fs.readFileSync(root + path));
                var myobj = { artist: artist, json_data: data};
                dbo.collection("artists").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                });
            }
            catch(error) {
              console.log(artist);
            }
        });
        db.close();
});


