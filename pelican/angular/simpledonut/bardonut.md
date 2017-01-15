This is a donut chart with a bar chart, showing you how to link 
different charts together with buttons and things. 

<br />
<br />

This data shows statistics about death records from the United States in 
2014, in particular the ratio of males to females whose death records 
were tagged with these particular ICD 10 codes. The ICD 10 codes indicate
circumstances present at time of death, though not necessarily 
the cause of death. 

<br/>
<br/>

Here, we bundle bar and donut plot data together by ICD 10 code.
When the user picks an ICD 10 code using buttons, we filter the data
plotted by the bar and donut plots.

<pre style="font-size: 8px;">
[
    {
        "code": "T510"},
        "donut": 
            [
                {"value": 17, "label": "M"}, 
                {"value": 4, "label": "F"}
            ]
    },
    {
        "code": "Y14"},
        "donut": 
            [
                {"value": 1, "label": "M"}, 
                {"value": 3, "label": "F"}
            ]
    },
    {
        "code": "S328"},
        "donut": 
            [
                {"value": 2, "label": "M"}, 
                {"value": 3, "label": "F"}
            ]
    },
    
    ...
]
</pre>

Once we filter on "code", we get the "donut" array, and pass it to the D3 pie chart object,
which renders the d ata structure into the donut chart on the left.  

