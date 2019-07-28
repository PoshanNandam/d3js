fetch('http://localhost:3000/fundingData')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var amount = parseFloat(0),
      amount1 = parseFloat(0);
    var map = new Map();
    var check = new Set();
    for (var i = 0; i < myJson.length; i++) {
      if (myJson[i].AmountInUSD != "") {
        let str = myJson[i].InvestmentType;
        str = str.toLowerCase();
        str = str.replace(/\s/g, "")
        // console.log(str)
        if (!check.has(str)) {
          check.add(str)
          map.set(myJson[i].InvestmentType, parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')));
        } else {
          map.set(myJson[i].InvestmentType, (map.get(myJson[i].InvestmentType)) + parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
        }
      }
    }
    console.log(check)
    console.log(map);

    var arr = []
    var get_entries = map.entries();
    for (var ele of get_entries) {
      if (`${ele[1]}` != "NaN") {
        arr.push({
          InvestmentType: `${ele[0]}`,
          AmountInUSD: `${(ele[1])}`,
        })
      }
    }
    console.log(arr)

    /*Pie*/
    var width = 750,
      height = 500;
    var colors = d3.scaleOrdinal(d3.schemeDark2);
    var svg = d3.select(".pie")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    var div = d3.select(".pie").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var details = arr;
    var data = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.AmountInUSD;
      })(details);


    var segments = d3.arc()
      .innerRadius(0)
      .outerRadius(200)


    var sections = svg.append("g")
      .attr("transform", "translate(250,250)")
      .selectAll("path")
      .data(data);
    sections.enter()
      .append("path")
      .attr("d", segments)
      .attr("fill", function(d) {
        return colors(d.data.AmountInUSD);
      })
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.InvestmentType)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    var content = d3.select("g")
      .selectAll("text")
      .data(data);
    content.enter()
      .append("text")
      .each(function(d) {
        var center = segments.centroid(d);
        d3.select(this)
          .attr("x", center[0])
          .attr("y", center[1])
      });
      
    var legends = svg.append("g")
      .attr("transform", "translate(500,100)")
      .selectAll(".legends").data(data);

    var legend = legends.enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + (i + 1) * 30 + ")";
      });

    legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function(d) {
        return colors(d.data.AmountInUSD);
      });

    legend.append("text")
      .text(function(d) {
        return d.data.InvestmentType;
      })
      .attr("fill", function(d) {
        return colors(d.data.AmountInUSD);
      })
      .attr("x", 30)
      .attr("y", 20);



  });