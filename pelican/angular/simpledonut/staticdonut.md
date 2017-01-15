This static donut chart illustrates how to store data
in JSON format to load in a donut chart and visualize
with D3.

<br />
<br />

This data shows statistics about death records from the United States in 
2014, in particular the ratio of males to females whose death records 
were tagged with these particular ICD 10 codes. The ICD 10 codes indicate
circumstances present at time of death, though not necessarily 
the cause of death. In this case, the death records are limited to 
those tagged with T401, heroin poisoning.

<br/>
<br/>

Remember that D3 thinks about a single dictionary or JSON array
as a single data observation - as opposed to the normal approach
of using keys to store data labels, and values to store the data itself,
and bundling everything into a single dictionary.

<br/>
<br/>

The D3 donut chart is bound to underlying JSON data based on 
the index "label" (which is used to label each piece) 
and the index "value" (which is used to determine size of each piece).

<pre style="font-size: 8px;">
[
    {
        "label" : "M",
        "value" : 15
    },
    {
        "label" : "F",
        "value" : 4
    }
]
</pre>

D3 renders this data structure into the donut chart on the left.  

