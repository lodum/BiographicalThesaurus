for file in *.nt; do
	echo "$file"
	java LineExtractor "$file"
	cat out.txt >> results.txt
done
