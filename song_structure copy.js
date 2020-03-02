
//song_title, section, line_number, position, word_before, two_before,  word_after, two_after, beginning_word, end_word]

// [word, word_after, two_after]

function zip(array1, array2){
    var result=[];
    array1.forEach(function(o,i){
    result.push(o);
    result.push(array2[i]);
    });
    return result
}

function flatten_line_word_hash(line_word_count_hash){
    let fixed_hash = {};
    for (var key in line_word_count_hash) {
        var flat = line_word_count_hash[key].flat
        var even = [];
        var odd = [];

        flat.forEach(function(value, index){
            if (index % 2 === 0){
                even.push(value);
            } else {
                odd.push(value);
            };
            fixed_hash[key] = even.zip(even, odd);
        });
    };
    return fixed_hash;
};

function  group_line_words_count(hash){ //groups line position hash into section arrays, 
    new_hash = {};
    for (var key in hash){
        var value = hash[key];
        var current_group = [];
        new_hash[key] = [];
        value.forEach(function(pair, index){
            var next_pair = index + 1
            if (value[next_pair] && pair[0] < value[next_pair][0]){ //issue with begining?
                current_group.push(pair);
            } else {
                new_hash[key].push(current_group);
                current_group = [];
            };
        });
    };
    return new_hash;
}; 

function pick_structure(choices){ //choices is array of structure strings seperated by space
    let weighted_choices = choices; //weighted towards top 10 popular structures 
    weighted_choices.forEach(function(value, index){
        if (index < 10) {
            weighted_choices.push(value);
            weighted_choices.push(value);
        };
    });

    return weighted_choices[Math.floor(Math.random() * weighted_choices.length)]; //replaces .sample ?? if works
};

function pick_number_of_lines(new_structure, minus_verse_numbers, structure_keys, number_of_lines_hash) {
    var result = {};
    var result_array = [];
    for (element in structure_keys){
        var potential = [];
        for (key in number_of_lines_hash){
            if (key.includes(element)){
                potential.push(number_of_lines_hash[key]);
            };
        };
        result[element] = (potential.flat)[Math.floor(Math.random() * weighted_choices.length)]; //replaces .sample ?? if works
    };
    minus_verse_numbers.forEach(function(section, index){
        result_array.push([new_structure[index], result[section][0]]);
    });
    return result_array;
};

function pick_number_of_words(section_line, grouped) { //pick number of words in each line
};