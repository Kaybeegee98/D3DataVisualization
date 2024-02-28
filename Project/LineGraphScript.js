function lineInit() {
    w = 600;
    h = 300;
    padding = 20;

    var dataset;

    d3.csv("Files/InflationRateSecondAttempt.csv", function(d) {        //Load in each CSV column into a different value
        return {
            date: d.Date,
            AustraliaValues: +d.AustraliaValues,
            EnglandValues: +d.EnglandValues,
            IndiaValues: +d.IndiaValues,
            ChinaValues: +d.ChinaValues,
            NewZealandValues: +d.NewZealandValues,
            PhilippinesValues: +d.PhilippinesValues,
            SouthAfricaValues: +d.SouthAfricaValues
        };
    }).then(function(data) {
        dataset = data;
        lineChart(dataset, w, h, padding);                              //Run Linechart() with inputed values
    });
}

function lineChart(data, w, h, padding) {
    console.log(data);

    var parseTime = d3.timeParse("%b-%y");                              //Create a solution for converting string to date
    var dates = [];
    for(let obj of data) {
        dates.push(parseTime(obj.date));                                //Iterate over all dates and push them to dates as a date
    }

    xScale = d3.scaleTime()
                .domain(d3.extent(dates))                               //Find the lowest and highest dates
                .range([0, w]);

    yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.EnglandValues + 1; })            //Scale from india values since india has the highest inflation rate
                ])
                .range([h, 0]);

    australialine = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.AustraliaValues)});        //Create the line using australian values

    englandline = d3.line()
                    .x(function(d) { return xScale(parseTime(d.date)); })
                    .y(function(d) { return yScale(d.EnglandValues)});      //Create the line using Engaland Values

    var svg = d3.select("#lineGraph")
                .append("svg")
                .attr("width", w + 2 * padding)
                .attr("height", h + 2 * padding);

    //Create Tooltip
    var tooltip = d3.select("#tooltip");

    var secondtooltip = d3.select("#secondtooltip");
    
    var tooltopDot = svg.append("circle")
                        .attr("r", 5)
                        .attr("fill", "#fc8781")
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0)
                        .attr("pointer-events", "none");

    var secondtooltipDot = svg.append("circle")
                        .attr("r", 5)
                        .attr("fill", "#fc8781")
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0)
                        .attr("pointer-events", "none");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("transform", "translate(20, " + padding/2 + ")")
        .attr("d", australialine)
        .attr("stroke", "blue");

    svg.append("path")
        .datum(data)
        .attr("class", "secondline")
        .attr("transform", "translate(20, " + padding / 2 + ")")
        .attr("d", englandline)
        .attr("stroke", "red");

    var xAxis = d3.axisBottom()
                    .scale(xScale);

    svg.append("g")
        .attr("transform", "translate(20, " + (h + (padding/2)) + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft()
        .ticks(10)
        .scale(yScale); 

    svg.append("g")
        .attr("transform", "translate(20 , 10)")                        //Position Y-Axis Correctly
        .call(yAxis);

    var informationText = d3.select("#unemploymentText");

    informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, we can see that at the start of 2018, <b>England</b> had a higher inflation rate than <b>Australia</b>. This could be an indication of why people were migrating over to <b>Australia</b>. Over the years, <b>England</b> had a consistently higher inflation rate, with the only time this not being the case in April of 2020. While another spike like this happened in July of 2021, since October of that same year, <b>Australia</b> has had a lower inflation rate. As of October 2022, <b>Australia</b> sits at an inflation rate of 7.3% while <b>England</b> sits at 11.1%.";
    console.log(informationText._groups[0][0].innerHTML);

    svg.append("rect")
        .attr("width", w + 2 * padding)
        .attr("height", h + 2 * padding)
        .style("opacity", 0)
        .style("pointer-events", "all")
        .on("touchmouse mousemove", function(event) {
            var choice = document.getElementById("lineSelect").value;
            console.log(choice);
            var mousePos = d3.pointer(event, this);
            
            var date = xScale.invert(mousePos[0]);

            var hoveredIndex;

            var year = date.getFullYear();
            var yearIndex;
            var monthIndex;

            switch(year) {
                case(2018):
                    yearIndex = 0;
                    break;
                case(2019):
                    yearIndex = 4;
                    break;
                case(2020):
                    yearIndex = 8;
                    break;
                case(2021):
                    yearIndex = 12;
                    break;
                case(2022):
                    yearIndex = 16;
                    break;
                default:
                    break;
            }

            if(date.getMonth() >= 0 && date.getMonth() < 3) {
                monthIndex = 0;
            }
            else if (date.getMonth() >= 3 && date.getMonth() < 6) {
                monthIndex = 1;
            }
            else if (date.getMonth() >= 6 && date.getMonth() < 9) {
                monthIndex = 2;
            }
            else{
                monthIndex = 3;
            }
            hoveredIndex = data[monthIndex + yearIndex];

            tooltopDot.style("opacity", 1)
                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                    .attr("cy", yScale(hoveredIndex.AustraliaValues))
                    .attr("transform", "translate(20, " + padding / 2 + ")");

            tooltip.style("display", "block")
                    .style("top", 3040 + "px")
                    .style("left", 600 + "px")

            secondtooltip.style("display", "block")
                    .style("top", 3100 + "px")
                    .style("left", 600 + "px")

            tooltip.select(".date")
                    .text("Australia " + hoveredIndex.date);

            tooltip.select(".percentage")
                    .text(hoveredIndex.AustraliaValues);

            switch(choice) {
                case "England":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.EnglandValues))
                                    .attr("transform", "translate(20," + padding / 2 + ")");

                    secondtooltip.select(".date")
                                .text("England " + hoveredIndex.date);
        
                    secondtooltip.select(".percentage")
                                .text(hoveredIndex.EnglandValues);
                    break;
        
                case "India":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.IndiaValues))
                                    .attr("transform", "translate(20, " + padding / 2 + ")");

                    secondtooltip.select(".date")
                                .text("India " + hoveredIndex.date);
        
                    secondtooltip.select(".percentage")
                                .text(hoveredIndex.IndiaValues);
                    break;
                
                case "China":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.ChinaValues))
                                    .attr("transform", "translate(20, " + padding / 2 + ")");

                    secondtooltip.select(".date")
                                    .text("China " + hoveredIndex.date);
            
                    secondtooltip.select(".percentage")
                                    .text(hoveredIndex.ChinaValues);
                    break;
        
                case "NewZealand":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.NewZealandValues))
                                    .attr("transform", "translate(20, " + padding / 2 + ")");

                    secondtooltip.select(".date")
                                    .text("New Zealnd " + hoveredIndex.date);
            
                    secondtooltip.select(".percentage")
                                    .text(hoveredIndex.NewZealandValues);
                    break;
                
                case "Philippines":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.PhilippinesValues))
                                    .attr("transform", "translate(20, " + padding / 2 + ")");

                    secondtooltip.select(".date")
                                    .text("Philippines " + hoveredIndex.date);
            
                    secondtooltip.select(".percentage")
                                    .text(hoveredIndex.PhilippinesValues);
                    break;
        
                case "SouthAfrica":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.SouthAfricaValues))
                                    .attr("transform", "translate(20, " + padding / 2 + ")");

                    secondtooltip.select(".date")
                                    .text("South Africa " + hoveredIndex.date);
            
                    secondtooltip.select(".percentage")
                                    .text(hoveredIndex.SouthAfricaValues);
                    break;
        
                default:
                    break;
            }
        })
        .on("mouseleave", function(){
            tooltopDot.style("opacity", 0);
            tooltip.style("display", "none");
            secondtooltipDot.style("opacity", 0);
            secondtooltip.style("display", "none");
        })
}

function lineSelectGraph() {
    var choice = document.getElementById("lineSelect").value;

    update(choice);
}

function update(choice){
    var dataset;
    var informationText = d3.select("#unemploymentText");

    d3.csv("Files/InflationRateSecondAttempt.csv", function(d) {
        return {
            date: d.Date,
            AustraliaValues: +d.AustraliaValues,
            EnglandValues: +d.EnglandValues,
            IndiaValues: +d.IndiaValues,
            ChinaValues: +d.ChinaValues,
            NewZealandValues: +d.NewZealandValues,
            PhilippinesValues: +d.PhilippinesValues,
            SouthAfricaValues: +d.SouthAfricaValues
        };
    }).then(function (data){
        dataset = data;
    })

    var parseTime = d3.timeParse("%b-%y");

    englandline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.EnglandValues)});

    indialine = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.IndiaValues)});
    
    chinaline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.ChinaValues)});
        
    newzealandline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.NewZealandValues)});
        
    philippinesline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.PhilippinesValues)});
        
    southafricaline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.SouthAfricaValues)});

    var secondline;
    switch(choice) {
        case "England":
            secondline = englandline;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, we can see that at the start of 2018, <b>England</b> had a higher inflation rate than <b>Australia</b>. This could be an indication of why people were migrating over to <b>Australia</b>. Over the years, <b>England</b> had a consistently higher inflation rate, with the only time this not being the case in April of 2020. While another spike like this happened in July of 2021, since October of that same year, <b>Australia</b> has had a lower inflation rate. As of October 2022, <b>Australia</b> sits at an inflation rate of 7.3% while <b>England</b> sits at 11.1%.";
            break;

        case "India":
            secondline = indialine;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, it is clear to see that <b>Australia</b> has had a consistently lower inflation rate than <b>India</b>. The largest gap was in October of 2020 when <b>Australia</b> sat at 0.7% inflation while <b>India</b> sat at 7.61%. Due to COVID-19 hitting its prime in the year 2021, the inflation rates began to be comparable, with July of that year seeing <b>Australia’s</B> inflation rate increase to 3.8% while <b>India’s</> dropped to 5.59%. As of October 2022, <b>India</b> has gotten a lower inflation rate, sitting at 6.77% when compared to <b>Australia’s</b> 7.3%.";
            break;
        
        case "China":
            secondline = chinaline;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, we can see that <b>Australia</b> and <b>China</b> have occasionally swapped which country has the lower inflation rate. For most of 2019 and 2020, <b>Australia</b> had the lower inflation rate, with its highest being 2.2% in April 2020. As of the end of 2020 (specifically October), this changed however as <b>Australia</b> had an inflation rate of 0.7% while China was at 0.5%. This swap has continued till the last recorded date (October 2022) when <b>China</b> has an inflation rate of 2.1% compared to <b>Australia’s</b> 7.3%.";
            break;

        case "NewZealand":
            secondline = newzealandline;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, <b>Australia</b> and <b>New Zealand</b> have had a consistently equivalent inflation rates. Up until around July 2020, they had a new identical inflation rate, usually only around 0.2% off of each other. As stated above, in July 2020 <b>Australia’s</b> inflation rate dropped to 0.3% while <b>New Zealand’s</b> state was at 1.5%. While <b>New Zealand</b> did briefly have a lower inflation rate on July 2021, it increased again throughout 2021 and most of 2022, peaking at 7.3% in July of 2022. Currently, both <b>Australia</b> and <b>New Zealand</b> sit around the same inflation rate of 7.3% (as of October 2022).";
            break;
        
        case "Philippines":
            secondline = philippinesline;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, up until July 2019, <b>Australia</b> had a much lower inflation rate than <b>The Philippines</b>. The largest gap during this time can be seen in October 2018, when <b>The Philippines</b> sat at an inflation rate of 6.7% compared to <b>Australia’s</b> 1.9%. For the majority of the COVID-19 outbreaks (2020 and 2021), <b>The Philippines’</b> inflation rate did not lower. This meant that during the majority of these 2 years, <b>Australia</b> had a consistently lower inflation rate than <b>The Philippines</b>. Starting from July of 2021, the inflation rates become mostly comparable, with the rates currently sitting at 7.7% for <b>The Philippines</b> and 7.3% for <b>Australia</b>.";
            break;

        case "SouthAfrica":
            secondline = southafricaline;
            informationText._groups[0][0].innerHTML = "<b>Analysing the graph</b>, we can see that <b>Australia</b> has very consistently had a lower inflation rate than <b>South Africa</b>. The difference between these countries' inflation rates has also been consistent over the years. Before 2020 the difference in inflation rates was around 3%, with an example being April 2019. During this time, <b>South Africa</b> had an inflation rate of 4.3% compared to <b>Australia’s</b> inflation of 1.3%. Throughout COVID-19 and after it (2020 - 2022), there have only been a few times these inflation rates have been similar. The closest they’ve been was in October 2022 when <b>South Africa</b> had an inflation rate of 7.6% compared to <b>Australia’s</b> 7.3%.";
            break;

        default:
            secondline = australialine;
            informationText._groups[0][0].innerHTML = "Error: This message should not be here";
            break;
    }

    var svg = d3.select("#lineGraph")
                .transition();

    svg.select(".secondline")
        .duration(750)
        .attr("d", secondline);
}