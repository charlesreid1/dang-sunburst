# Letters Webapp

This contains Angular webapps for visualizing the English language
letter frequency data set.

## Data Files

The following files are related to raw data or generation of 
processed data:

* ```ngrams2.csv``` - raw data from [Peter Norvig](http://norvig.com/mayzner.html)

* ```bigrams.py``` - processes bigram data file to generate nested hierarchy

* ```bigrams.json``` - contains output of ```bigrams.py```

## Plain

The plain files are for drawing a plain sunburst chart. These files are:

* ```plain.html``` - contains the HTML scaffolding

* ```plain_modcontrol.js``` - contains the module and controller for the plain sunburst chart

* ```plain_sunburst.js``` - contains the Angular directives that draw the chart and populate chart information.




