require "json"
require "pry"
file = File.open "C:/Users/test account/Desktop/coding/LyricsGenius(1.27)/LyricsGenius(1.27)/LyricsGenius/lyricsgenius/band_lyrics/all_bands/Death Cab For Cutie.json"
# file = File.open "/Users/kyle2/Desktop/dev/LyricsGenius(1.26)/LyricsGenius/lyricsgenius/band_lyrics/all_bands/Billy Joel.json"

data = JSON.load file
file.close


=begin
 
     #    #     #    #    #       #     # ####### #######     #####  ####### #     #  #####  
    # #   ##    #   # #   #        #   #       #  #          #     # #     # ##    # #     # 
   #   #  # #   #  #   #  #         # #       #   #          #       #     # # #   # #       
  #     # #  #  # #     # #          #       #    #####       #####  #     # #  #  # #  #### 
  ####### #   # # ####### #          #      #     #                # #     # #   # # #     # 
  #     # #    ## #     # #          #     #      #          #     # #     # #    ## #     # 
  #     # #     # #     # #######    #    ####### #######     #####  ####### #     #  #####  
                                                                                             
 
=end

song_ids = data.keys
all_words_by_artist = {}
#"title"
#"artist"
#"album"
#"lyrics"
#puts data["0"]["title"]
puts "------------------------------"
puts "     "
puts "      "
elements = []
all_words = []
number_of_lines_hash = {}
structure = {}
elements_count = 0
line_word_count_hash = {}
song_ids.each {|id|

    song_title = data[id]["title"]
    song_artist = data[id]["artist"]
    song_album = data[id]["album"]
    song_lyrics = data[id]["lyrics"]

#get all words used
    lyrics_array = song_lyrics.split(" ")
    all_words << lyrics_array

#end get all words

#get song structure
    song_structure = song_lyrics.scan(/(?<=\[).+?(?=\])/)
    lyrics_by_category = song_lyrics.scan(/(?<=\]).+?(?=\[)/m)

    reverse = song_lyrics.reverse
    cut = reverse.index("]")
    if cut
        last_section = reverse[0..(cut - 1)].reverse
        lyrics_by_category << last_section
    end

    song_structure.each {|str| 
        colon = str.index(":")
        if colon
            str.slice!(colon..-1)
        end
    }

    elements << song_structure
 
    word_breakdown = {}
    section_counter = {}
    song_structure.each_with_index {|section, index|
        special =  ["?", "<", ">", "?", "[", "]", "}", "{", "=", "-", ")", "(", "*", "&", "^", "%", "$", "#", "`", "~", "{", "}"]
        section_content = lyrics_by_category[index]
        special.each {|char| section_content = section_content.gsub(char, "")}

        lines_array = (section_content.split("\n")).reject { |c| c.empty? }
        number_of_lines = lines_array.size

        if number_of_lines_hash[section]
            number_of_lines_hash[section] << number_of_lines
        else
            number_of_lines_hash[section] = [number_of_lines]
        end

        if section_counter[section]
            section_counter[section] +=1
        else
            section_counter[section] = 1
        end

        words_by_line_array = lines_array.map {|line| line.split(" ")}
            words_by_line_array.each_with_index {|array, line_number|
            line_word_count = array.count

            if section_counter[section] < 2
                if  line_word_count_hash[section] 
                    line_word_count_hash[section] << [line_number, line_word_count]
                else
                    line_word_count_hash[section] = [[line_number, line_word_count]]
                end

                array.each_with_index {|word, position|
                    current = word.downcase
                    beginning_word = false
                    end_word = false

                    #get word before/after
                    if position > 0
                        word_before = array[position - 1].downcase
                    else
                        word_before = "n/a"
                        beginning_word = true
                    end
                    if position > 1
                        two_before = array[position -2].downcase
                    end
                    if position < array.count - 1
                        word_after = array[position + 1].downcase
                    else
                        word_after = "n/a"
                        end_word = true
                    end
                    if position < array.count - 2
                        two_after = array[position + 2].downcase
                    end
                    
                    if word_breakdown[current]
                        word_breakdown[current] << [song_title, section, line_number, position, word_before, two_before,  word_after, two_after, beginning_word, end_word]
                    else
                        word_breakdown[current] = [song_title, section, line_number, position, word_before, two_before,  word_after, two_after, beginning_word, end_word]
                    end
                }

            end
    
            }
        }
        #number of uniq words is word_breakdown.keys.count
        # break #to get just first song
        # puts word_breakdown.keys.count
        
        word_breakdown.keys.each {|key|
            if all_words_by_artist[key]
                all_words_by_artist[key] << word_breakdown[key]
            else
                all_words_by_artist[key] = [word_breakdown[key]]
            end
        }
       
#end of song structure 
# line_word_count_hash => array of word counts by line in each section  section => [[line#, count]]
# number_of_lines_hash => section => [# of lines]
#  all_words_by_artist  word => [title, section, line, word_number]

    structure[song_title] = line_word_count_hash
}

uniq_structures = (elements.map {|array| array.join("--")}).uniq

=begin
 
 '########:'##::::'##:'##::: ##::'######::'########:'####::'#######::'##::: ##::'######::
  ##.....:: ##:::: ##: ###:: ##:'##... ##:... ##..::. ##::'##.... ##: ###:: ##:'##... ##:
  ##::::::: ##:::: ##: ####: ##: ##:::..::::: ##::::: ##:: ##:::: ##: ####: ##: ##:::..::
  ######::: ##:::: ##: ## ## ##: ##:::::::::: ##::::: ##:: ##:::: ##: ## ## ##:. ######::
  ##...:::: ##:::: ##: ##. ####: ##:::::::::: ##::::: ##:: ##:::: ##: ##. ####::..... ##:
  ##::::::: ##:::: ##: ##:. ###: ##::: ##:::: ##::::: ##:: ##:::: ##: ##:. ###:'##::: ##:
  ##:::::::. #######:: ##::. ##:. ######::::: ##::::'####:. #######:: ##::. ##:. ######::
 ..:::::::::.......:::..::::..:::......::::::..:::::....:::.......:::..::::..:::......:::
 
=end

def top_words(all_words_by_artist)
    count_hash = {}
    total_count = 0
    all_words_by_artist.each{|word, details|
        count_hash[word] = details.flatten.count
        total_count += details.flatten.count
    }

    sorted = count_hash.sort_by{|word, count| count}.reverse
    sorted.each_with_index{|array, index| sorted[index] << array[1].to_f/total_count.to_f}
    return sorted
end

def flatten_line_word_hash(line_word_count_hash)
    fixed_hash = {}
     line_word_count_hash.each{|k, v|
        flat = v.flatten
        even = []
        odd = []
        
        flat.each_with_index{|value, index|
            if index.even?
                even << value
            else
                odd << value
            end
        }
        fixed_hash[k] = even.zip(odd)
    
     }
    
     return fixed_hash
    
    end

def group_line_words_count(hash)  #groups line position hash into section arrays, 
    new_hash = {}
    hash.each {|k, v|
        current_group =[]
        new_hash[k] = []
            v.each_with_index{|pair, index|
                next_pair = index + 1
                if v[next_pair] && pair[0] < v[next_pair][0]
                    current_group << pair
                else
                    new_hash[k] << current_group
                    current_group = []
                end
            }
    }
    return new_hash
end

def pick_structure(choices) #choices is array of structure strings seperated by space
    weighted_choices = choices #weighted towards top 10 popular structures 
    choices.each_with_index {|value, index|
        if index < 10
            weighted_choices << value
            weighted_choices << value
        end
    }

    return weighted_choices.sample
end

def pick_number_of_lines(new_structure, minus_verse_numbers, structure_keys, number_of_lines_hash) 
    #pick number of lines in each section
    result = {}
    result_array = []
    structure_keys.each {|element|
    potential = []
        number_of_lines_hash.each_key {|key|
            if key.include?(element)
                potential << number_of_lines_hash[key]
            end
        }
        result[element] = (potential.flatten).sample(1)
    }
    minus_verse_numbers.each_with_index {|section, index|
        result_array << [new_structure[index], result[section][0]]
    }
    return result_array
end

def pick_number_of_words(section_line, grouped) #pick number of words in each line
    #section_line = [["verse 1", 8, ["Verse 2", 8, ["Chorus", 3 ]     
    #---- [[section(Str), line count(int)]]
    #grouped is th line and word count for every section of every song by artist
    #grouped = {"Verse 1" => [[[0,7], [1,11], [2,11]]]}  {section => [[[line, word_count], [line, word_count]]]}

    result_array = []
    section_line.each {|array| #interating through each section of the new song
        section = array[0]
        number_of_lines = array[1]
        potential_word_count = []

        grouped[section].each {|group_array|  #gets and iterates through every matching section by artist (ie. All verse 1 by artist)
            if group_array.count == number_of_lines #check for matching line count in section
                potential_word_count << group_array
            end

            if potential_word_count.empty?  #if no matching line count in that section, check for matching in any section
                grouped.each_value{|value|
                    if value.count == number_of_lines
                        potential_word_count << value
                    end
                }
            end
        }
        selection = potential_word_count.sample(1)
        if selection.empty? #if nothing found, do random
           selection = Array(3..12).sample(1)
        end

        result_array << [section, number_of_lines, selection]
    }
 
    return result_array
end

def song_matrix(section_line_words) #create song matrix of all the word positions, line positions, sections
    #section_line_words [[section, # of lines, [[[position],[position], [position]]] or* ["empty"] ]]
    matrix_hash = {}
    section_line_words.each {|value|
     section = value[0]
     line_count = value[1]
     array =  value[2].flatten
     matrix = []
        line_count = 0
        array.each_with_index{|element, index|
            if element != "empty"
                if index % 2 == 0
                    line_count = element
                else
                    Array(0..element).each{|number| matrix << [line_count, number] }
                end
            else
                matrix << value
            end
        }
        matrix_hash[section] = matrix
    }
    return matrix_hash

end

def choose_words_and_display(matrix_hash, all_words_by_artist)
    display = []
    matrix_hash.each{|song_part, word_positions|

        exact_match = {}
        position_match = {}
        result = []

        word_positions.each {|position|
            matrix_line = position[0]
            matrix_word = position[1]
            exact_match[position] = []
            position_match[position] = []

            all_words_by_artist.each{|word, array|
                song = array[0][0][0]
                section = array[0][0][1]
                line = array[0][0][2]
                word_spot = array[0][0][3]

                if matrix_line == line && matrix_word == word_spot
                    if song_part == section
                        exact_match[position] << [word, line, word_spot]
                    else
                        position_match[position] << [word, line, word_spot]
                    end
                end
            }
            picked_word = exact_match[position].sample(1) || position_match[position].sample(1)
            #position_match[position].sample(1)
            if matrix_word == 0
                result << [["\n"]]
            end
            result << picked_word
        }
    display = result.map {|word| 
            if !word.empty?
                "#{word[0][0]}"
            end
        }
        print "\n"
        print "#{song_part}"
        print "\n"
        print display.join(" ")
        print "\n"
    }
end



=begin
 
   #####  ######  #######    #    ####### #######     #####  ####### #     #  #####        #    ######  ######  
  #     # #     # #         # #      #    #          #     # #     # ##    # #     #      # #   #     # #     # 
  #       #     # #        #   #     #    #          #       #     # # #   # #           #   #  #     # #     # 
  #       ######  #####   #     #    #    #####       #####  #     # #  #  # #  ####    #     # ######  ######  
  #       #   #   #       #######    #    #                # #     # #   # # #     #    ####### #       #       
  #     # #    #  #       #     #    #    #          #     # #     # #    ## #     #    #     # #       #       
   #####  #     # ####### #     #    #    #######     #####  ####### #     #  #####     #     # #       #       
                                                                                                                
 
=end

print top_words(all_words_by_artist)

exit

new_structure = pick_structure(uniq_structures).split("--")
#gets new structure

minus_verse_numbers = new_structure.map {|element| element.gsub(/\s\d+/, '') } 
#strips numbers from structure

structure_keys = minus_verse_numbers.uniq 
#gets uniq elements of new structure

grouped = group_line_words_count(flatten_line_word_hash(line_word_count_hash)) 
#groups line position hash into section arrays

section_line = pick_number_of_lines(new_structure, minus_verse_numbers, structure_keys, number_of_lines_hash)
#pick number of lines in each section\

section_line_words = pick_number_of_words(section_line, grouped)
#pick number of words in each line

matrix_hash = song_matrix(section_line_words)
#create song matrix of all the word positions, line positions, sections

choose_words_and_display(matrix_hash, all_words_by_artist)#
#choose which words go in each position, and print results

