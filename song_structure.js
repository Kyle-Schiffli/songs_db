var fs = require('fs');
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;




// let path = './all_bands/ABBA.json'
// let data =  JSON.parse(fs.readFileSync(path));


/*
 
     #    #     #    #    #       #     # ####### #     # #######     #####  ####### #     #  #####  
    # #   ##    #   # #   #        #   #       #   #   #  #          #     # #     # ##    # #     # 
   #   #  # #   #  #   #  #         # #       #     # #   #          #       #     # # #   # #       
  #     # #  #  # #     # #          #       #       #    #####       #####  #     # #  #  # #  #### 
  ####### #   # # ####### #          #      #        #    #                # #     # #   # # #     # 
  #     # #    ## #     # #          #     #         #    #          #     # #     # #    ## #     # 
  #     # #     # #     # #######    #    #######    #    #######     #####  ####### #     #  #####  
                                                                                                     
 
*/
function analyze_songs(json_data){
    let song_ids = Object.keys(json_data)
    let all_words_by_artist = {};

    let elements = [];
    let all_words = [];
    let number_of_lines_hash = {};
    let structure = {};
    let elements_count = 0;
    let line_word_count_hash = {};
    let song_count = 0; //total # of songs

    song_ids.forEach( function(id){
        song_count += 1;
        let song_title = json_data[id].title;
        let song_artist = json_data[id].artist;
        let song_album = json_data[id].album;
        let song_lyrics = json_data[id].lyrics;
    // get all words used
        let = lyrics_array = song_lyrics.split(" ");
        all_words.push(lyrics_array);
    // end get all words

    // get song structure
    let pre_structure = song_lyrics.match(/(?<=\[).+?(?=\])/g) || [];
    if (pre_structure == null){
        return;
    }
    
    let lyrics_by_category = song_lyrics.match(/(?<=\]).+?(?=\[)/gs) || [];
        let song_structure = pre_structure.map(function(str, index){
            let new_str = str;
            let colon = str.indexOf(":");
            if (colon >= 0){
                new_str = str.slice(0, colon);
            }
            return new_str;
        });
        elements.push(song_structure);

        let word_breakdown = {};
        let section_counter = {};

        song_structure.forEach(function(section, index){
            if(song_structure.length > 0){
                let section_content = lyrics_by_category[index];
                    if (typeof section_content !== "undefined"){
                        var replace = section_content.replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
                        section_content = replace;
                    };

                if (section_content != undefined){
                    let lines_array = (section_content.split("\n"));
                    let number_of_lines = lines_array.length;

                    if (number_of_lines_hash.hasOwnProperty(section)){
                        number_of_lines_hash[section].push(number_of_lines);
                    } else {
                        number_of_lines_hash[section] = [number_of_lines];
                    };

                    if (section_counter.hasOwnProperty(section)){
                        section_counter[section] += 1;
                    } else {
                        section_counter[section] = 1;
                    };

                    let word_by_line_array =[];
                    lines_array.forEach(function(line){word_by_line_array.push(line.split(" "));});
    //iterate through each 
                    word_by_line_array.forEach(function(array, line_number){
                        let line_word_count = array.length;

                        if (section_counter[section] < 2){
                            if (line_word_count_hash[section]){
                                line_word_count_hash[section].push([line_number, line_word_count]);
                            } else {
                                line_word_count_hash[section] = [[line_number, line_word_count]];
                            };
    //iterate through each
                            array.forEach(function(word, position){ 
                                let current = word.toLowerCase();
                                let beginning_word = false;
                                let end_word = false;
                                let word_before = "";
                                let two_before = "";
                                let word_after = "";
                                let two_after = "";
                                // get word before/after
                                if (position > 0){
                                    word_before = array[position - 1].toLowerCase();
                                } else{
                                    word_before = "n/a";
                                    beginning_word = true;
                                };
                                if (position > 1){
                                    two_before = array[position -2].toLowerCase();
                                };
                                if (position < array.length - 1){
                                    word_after = array[position + 1].toLowerCase();
                                } else {
                                    word_after = "n/a";
                                    end_word = true;
                                };
                                if (position < array.length - 2){
                                    two_after = array[position + 2].toLowerCase();
                                };

                                if (word_breakdown.hasOwnProperty(current)){
                                    word_breakdown[current].push({word: current, artist: song_artist, album: song_album, title: song_title, section: section, line_number: line_number, position: position, word_before: word_before, two_before: two_before,  word_after: word_after, two_after: two_after, beginning_word: beginning_word, end_word: end_word});
                                } else {
                                    word_breakdown[current] =[{word: current, artist: song_artist, album: song_album, title: song_title, section: section, line_number: line_number, position: position, word_before: word_before, two_before: two_before,  word_after: word_after, two_after: two_after, beginning_word: beginning_word, end_word: end_word}]; 
                                };
                            }); //word position loop end
                        }; //end if statment

                    }); //word_by_line_array loop

                }; //end of if statment
            }; //end of if

            // number of uniq words is word_breakdown.keys.count
            // break #to get just first song
            // puts word_breakdown.keys.count

        Object.keys(word_breakdown).forEach(function(key){
                if (all_words_by_artist.hasOwnProperty(key)){
                    all_words_by_artist[key].push(word_breakdown[key]);
                    all_words_by_artist[key] = _.flattenDeep(all_words_by_artist[key]);
                } else {
                    all_words_by_artist[key] = [word_breakdown[key]];
                };
        });
    // end of song structure 
    // line_word_count_hash => array of word counts by line in each section  section => [[line#, count]]
    // number_of_lines_hash => section => [# of lines]
    // all_words_by_artist  word => [title, section, line, word_number]

        });// end of song_structure loop

    structure[song_title] = line_word_count_hash;


    }); //song id loop end

    let uniq_structures = elements.map(function(array){
        return array.join("--");
    });

    return [all_words_by_artist, uniq_structures, song_count];
};
/*
 
  ####### #     # #     #  #####  ####### ### ####### #     #  #####  
  #       #     # ##    # #     #    #     #  #     # ##    # #     # 
  #       #     # # #   # #          #     #  #     # # #   # #       
  #####   #     # #  #  # #          #     #  #     # #  #  #  #####  
  #       #     # #   # # #          #     #  #     # #   # #       # 
  #       #     # #    ## #     #    #     #  #     # #    ## #     # 
  #        #####  #     #  #####     #    ### ####### #     #  #####  
                                                                      
 
*/
//word: array, array, array
function top_words(all_words_by_artist){ 
    let count_array = [];

    for (var word in all_words_by_artist){
        count_array.push([word, all_words_by_artist[word]]);
    };

    var sortedArray = count_array.sort(function(a, b) { return a[1] - b[1]; });

    return count_array;
};

function word_sort(array){
    var sortedArray = array.sort(function(a, b) { return b[1] - a[1]; });

    return sortedArray;
};


function get_words_by_all(){
    words_by_all_artists = {};
    all_artist_word_count = 0;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("songs");
      dbo.collection("song_data").find({}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        var result_count = result.length;
        var progress_count = 0; //# of artists
        let total_song_count = 0; //total # of songs
        for (var element in result){
            var artist = result[element].artist;
            var songs = result[element].address;

            let analyze_song_result = analyze_songs(songs);
            all_words_by_artist = analyze_song_result[0];
            uniq_structures = analyze_song_result[1];
            let song_count = analyze_song_result[2];
            total_song_count += song_count;

            let current_words_array_count = top_words(all_words_by_artist);

            current_words_array_count.forEach(function(array){
            let word = array[0];
            let count = array[1];

            if(words_by_all_artists.hasOwnProperty(word)){
                words_by_all_artists[word] += count;
            } else {
                words_by_all_artists[word] = count;
            };
            all_artist_word_count += count;
            });
            progress_count += 1;
            console.log(`${progress_count}  of  ${result_count} artists`);
        };

        // console.log(all_artist_word_count);
        // console.log(total_song_count);

        db.close();
      });
    });
    return words_by_all_artists;
};

function add_to_db (){ //***under construction ****
    words_by_all_artists = {};
    all_artist_word_count = 0;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("songs");
      dbo.collection("song_data").find({}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        var result_count = result.length;
        var progress_count = 0; //# of artists
        let total_song_count = 0; //total # of songs
        for (var element in result){
            var artist = result[element].artist;
            var songs = result[element].address;

            let analyze_song_result = analyze_songs(songs);
            all_words_by_artist = analyze_song_result[0];

            for (word in all_words_by_artist) { //iterate through every word
               var array_of_objects = (all_words_by_artist[word]); //get array of locations for each word
               var myobj = { _id: word.toLowerCase(), word: word.toLowerCase()};

                    var query_result = dbo.collection("all_words").findOne({word: word});
                    console.log(query_result);
                    if (query_result.length > 0){
                        console.log("word exists");

                    } else {
                        // console.log("word no exists");
                        console.log(myobj);
                        dbo.collection("all_words").insertOne(myobj, function(err, res) {
                            if (err) throw err;
                            console.log("1 document inserted into all_words");
                        });
                    };

                var myobj = array_of_objects;
                dbo.collection("word_locations").insertMany(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("documents inserted into word_locations");
                });

            };

            progress_count += 1;
            console.log(`${progress_count}  of  ${result_count} artists`);
        };

        db.close();
      });
    });
    return words_by_all_artists;
};


/*
 
     #    ######  ######  
    # #   #     # #     # 
   #   #  #     # #     # 
  #     # ######  ######  
  ####### #       #       
  #     # #       #       
  #     # #       #       
                          
 
*/

console.log("--------------------");
console.log("  ");
console.log("  ");
// get_words_by_all();
add_to_db();