//This is for Lachie's Bar Graph Script

function barInit() {

    d3.csv("Files/NetMigration.csv").then(function (data) {
        console.log(data);
        migrationData = data;
        barChart(migrationData);
    });

    function barChart() {
        var w = 600; // Width
        var h = 500; //height
        var barpadding = 4;
        var margin = { top: 40, right: 20, bottom: 20, left: 50 };

        var svg = d3.select("#barGraph")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
        //     .attr("transform", "translate(50, 0)"); // Shift the chart to the right by 50 pixels
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var middleX = (w / 2);

        var xScale = d3.scaleBand()
            .domain(migrationData.map(d => d.Year))
            .range([0, w - barpadding * migrationData.length]);



        // Create the y-scale
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(migrationData, d => d.Net_Overseas_Migration_Thousands)])
            .range([h - barpadding * 2, 0]);
        console.log(yScale);

        //Create x-axis
        var xAxis = d3.axisBottom()
            .scale(xScale);
        svg.append("g")
            .attr("transform", "translate(0, " + (h - barpadding * 2) + ")")
            .call(xAxis);

        //Create the y-axis
        var yAxis = d3.axisLeft()
            .scale(yScale);


        svg.append("g")
            .attr("transform", "translate(" - (barpadding) + ",0)")
            .call(yAxis);


        //Append rectangles for bar chart
        svg.selectAll("rect")
            .data(migrationData)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScale(d.Year); // Add half of the padding to center the bars
            })

            .attr("y", function (d) {
                if (d.Net_Overseas_Migration_Thousands >= 0) {
                    return yScale(d.Net_Overseas_Migration_Thousands);
                } else {
                    return yScale(0); // Position the negative bars at the baseline (yScale(0))
                }
            })



            .attr("height", function (d) {
                return Math.abs(yScale(d.Net_Overseas_Migration_Thousands) - yScale(0));
            })



            
            .attr("width", xScale.bandwidth() - barpadding) // Use bandwidth to calculate the bar width with padding

            .attr("fill", function (d) {
                return "rgb(0,0, " + Math.round(d.Net_Overseas_Migration_Thousands * 10) + ")";
            })
            .on("mouseover", function (event,d) {
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth()/6;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 14 ;
                svg.append("text")
                .attr("id", "tooltip1")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("fill", "black")
                .text(d.Net_Overseas_Migration_Thousands);  
                console.log(d.Net_Overseas_Migration_Thousands)  
            d3.select(this).attr("fill", "orange");
            })
            .on("mouseout", function (d) {
                d3.select("#tooltip1").remove()

                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("fill", "blue");
            })
           .append("title")
            .text(function (d) {
                return "This value of " + d.Year +" is " + d.Net_Overseas_Migration_Thousands;
            });


        svg.append("text")
            .attr("x", middleX)
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .text("Net Overseas Migration To Australia (Thousands)");
    }

}

