for file in *.nt; do
	#echo "$file"
	java LineExtractor "$file"
	cat out.txt >> results.txt
done
mv results.txt out.txt
split -l 5000 out.txt out_split
for file in out_split* do
	echo "$file"
	python dl-gnd.py "$file"
done
