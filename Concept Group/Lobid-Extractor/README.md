===============
Lobid-Extractor
===============

Takes the lobid dump of westphalia and extracts all the gnd uris and then downloads the rdf files associated.

### Use: ###

  * run the extractorScript which will take all *.nt files and extract the GND URIs into the out.txt
  * the resulting file out.txt now contains all GND uris
  * run dl-gnd.py this will take some time. Afterwards check errors.txt. If there are any lines in it, delete these lines in out.txt and run again.
  * use post-to-sesame.py to fill your triple store
