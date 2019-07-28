fetch('http://localhost:3000/fundingData')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var cities = new Map();
    for (let i = 0; i < myJson.length; i++) {
      if (myJson[i].AmountInUSD != "") {
        if (cities.has(myJson[i].CityLocation)) {
          cities.set(myJson[i].CityLocation, parseFloat(cities.get(myJson[i].CityLocation)) + parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
        } else {
          cities.set(myJson[i].CityLocation, parseFloat(myJson[i].AmountInUSD.replace(/,/g, '')))
        }
      }
    }
    const citySort = new Map([...cities.entries()].sort((a, b) => b[1] - a[1]));
    console.log(citySort)
    var arr = [];
    var co = 0;
    for (let [key, value] of citySort) {
      if (co === 6) break;
      arr.push(value
      // {
      //   name: `${key}`,
      //   value: `${value}`,
      // }
      )
      co++;
    }
    console.log(arr)
    var scale = d3.scale.linear()
      .domain([0, 1000000000])
      .range([0, 100])

    console.log(arr);

    d3.select(".plot1")
      .selectAll("section")
      .data(arr)
      .enter()
      .append("section")
      .style("width", function(d) { return scale(d) + 'px' })
      .text(function(d) { return d; });
  });