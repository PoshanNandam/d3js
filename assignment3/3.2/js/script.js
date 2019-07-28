fetch('http://localhost:3000/fundingData')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson.length)
    var year15 = new Map(),
      year16 = new Map(),
      year17 = new Map();
    var year = new Set();
    var yr;
    var counts15 = 0,
      counts16 = 0,
      counts17 = 0;
    for (let i = 0; i < myJson.length; i++) {
      let len = myJson[i].Date.length;
      if (len === 9) yr = myJson[i].Date.substring(5, 9)
      if (len === 10) yr = myJson[i].Date.substring(6, 10)
      year.add(yr)
      if (yr === "2015") {
        counts15++
        if (myJson[i].AmountInUSD != "") {
          if (!year15.has(myJson[i].InvestorsName)) {
            year15.set(myJson[i].InvestorsName, parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')));
          } else {
            if (myJson[i].AmountInUSD === "") continue;
            year15.set(myJson[i].InvestorsName, (year15.get(myJson[i].InvestorsName)) + parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
          }
        }
      }

      if (yr === "2016") {
        counts16++
        if (myJson[i].AmountInUSD != "") {
          if (!year16.has(myJson[i].InvestorsName)) {
            year16.set(myJson[i].InvestorsName, parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')));
          } else {
            year16.set(myJson[i].InvestorsName, parseFloat(year16.get(myJson[i].InvestorsName)) + parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
          }
        }
      }
      if (yr === "2017") {
        counts17++
        if (myJson[i].AmountInUSD != "") {
          if (!year17.has(myJson[i].InvestorsName)) {
            year17.set(myJson[i].InvestorsName, parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')));
          } else {
            year17.set(myJson[i].InvestorsName, parseFloat(year17.get(myJson[i].InvestorsName)) + parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
          }
        }
      }
    }
    // console.log(counts15 + " " + counts16 + " " + counts17)
    const yearSort15 = new Map([...year15.entries()].sort((a, b) => b[1] - a[1]));
    // console.log("----2015---")
    // console.log(yearSort15);
    const yearSort16 = new Map([...year16.entries()].sort((a, b) => b[1] - a[1]));
    // console.log("----2016---")
    // console.log(yearSort16);
    const yearSort17 = new Map([...year17.entries()].sort((a, b) => b[1] - a[1]));
    // console.log("----2017---")
    // console.log(yearSort17);
    var arr15 = [];
    var arr16 = [];
    var arr17 = [];
    var co = 0;
    for (let [key, value] of yearSort15) {
      if (co === 3) break;
      arr15.push(value
        // {
        // name: `${key}`,
        // value: `${value}`,
        // }
      )
      co++;
    }
    co = 0;
    for (let [key, value] of yearSort16) {
      if (co === 3) break;
      arr16.push(value
        // {
        // name: `${key}`,
        // value: `${value}`,
        // }
      )
      co++;
    }
    co = 0;
    for (let [key, value] of yearSort17) {
      if (co === 3) break;
      arr17.push(value
        // {
        //   name: `${key}`,
        //   value: `${value}`,
        // }
      )
      co++
    }
    co = 0;
    console.log(arr15);
    console.log(arr16);
    console.log(arr17);

    var arr = []

    // for (var i = 0; i < 3; i++) {
    //   arr.push(
    //   {
    //     label: '2015',
    //     values: arr15
    //   }
    //   )
    // }
    var data = {
      labels: [
        '2015', '2016', '2017',
        
      ],
      series: [{
          label: '2015',
          values: arr15
        },
        {
          label: '2016',
          values: arr16
        },
        {
          label: '2017',
          values: arr17
        },
      ]
    };

    var chartWidth = 300,
      barHeight = 20,
      groupHeight = barHeight * data.series.length,
      gapBetweenGroups = 10,
      spaceForLabels = 150,
      spaceForLegend = 150;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i = 0; i < data.labels.length; i++) {
      for (var j = 0; j < data.series.length; j++) {
        zippedData.push(data.series[i].values[j]);
      }
    }

    // Color scale
    var color = d3.scale.category20();
    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scale.linear()
      .domain([0, d3.max(zippedData)])
      .range([0, chartWidth]);

    var y = d3.scale.linear()
      .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat('')
      .tickSize(0)
      .orient("left");

    // Specify the chart area and dimensions
    var chart = d3.select(".chart")
      .attr("width", spaceForLabels + chartWidth + spaceForLegend)
      .attr("height", chartHeight);

    // Create bars
    var bar = chart.selectAll("g")
      .data(zippedData)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
      });

    // Create rectangles of the correct width
    bar.append("rect")
      .attr("fill", function(d, i) { return color(i % data.series.length); })
      .attr("class", "bar")
      .attr("width", x)
      .attr("height", barHeight - 1);

    // Add text label in bar
    // bar.append("text")
    //   .attr("x", function(d) { return x(d) - 3; })
    //   .attr("y", barHeight / 2)
    //   .attr("fill", "red")
    //   .attr("dy", ".35em")
    //   .text(function(d) { return d; });

    // Draw labels
    bar.append("text")
      .attr("class", "label")
      .attr("x", function(d) { return -10; })
      .attr("y", groupHeight / 2)
      .attr("dy", ".35em")
      .text(function(d, i) {
        if (i % data.series.length === 0)
          return data.labels[Math.floor(i / data.series.length)];
        else
          return ""
      });

    chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
      .call(yAxis);

    // Draw legend
    // var legendRectSize = 18,
    //   legendSpacing = 4;

    // var legend = chart.selectAll('.legend')
    //   .data(data.series)
    //   .enter()
    //   .append('g')
    //   .attr('transform', function(d, i) {
    //     var height = legendRectSize + legendSpacing;
    //     var offset = -gapBetweenGroups / 2;
    //     var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
    //     var vert = i * height - offset;
    //     return 'translate(' + horz + ',' + vert + ')';
    //   });

    // legend.append('rect')
    //   .attr('width', legendRectSize)
    //   .attr('height', legendRectSize)
    //   .style('fill', function(d, i) { return color(i); })
    //   .style('stroke', function(d, i) { return color(i); });

    // legend.append('text')
    //   .attr('class', 'legend')
    //   .attr('x', legendRectSize + legendSpacing)
    //   .attr('y', legendRectSize - legendSpacing)
    //   .text(function(d) { return d.label; });
  });