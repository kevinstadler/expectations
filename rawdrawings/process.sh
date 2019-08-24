#!/bin/sh

for ((j = 0; j < 2; j++)); do
  for ((i = 0; i < 4; i++)); do
    # orig 260x400, output 80x142
    convert skellie$j$i.png -crop 224x400+18+0 +repage -resize 142x142 ../public/skellie$j$i.png
    convert ../public/skellie$j$i.png -flop ../public/skellie$j$((i+4)).png
    convert skellie$j$i.png -resize 40% thumb$j$i.png
    convert skellie$j$i.png -flop -resize 40% thumb$j$((i+4)).png
  done
done
