kyle = "kyle was here"

out_file = File.new("temp-ruby-kyle.txt", "w")
out_file.puts(kyle)
out_file.close