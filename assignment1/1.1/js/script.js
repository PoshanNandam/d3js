fetch('http://localhost:3000/rajyasabha')
  .then(response => {
    return response.json()
  })
  .then(datas => {
    // Work with JSON data here
    let count = 0;
    var map1 = new Map();
    for (var i = 0; i < datas.length; i++) {
      if (!map1.has(datas[i].ministry)) map1.set(datas[i].ministry, 1);
      else map1.set(datas[i].ministry, map1.get(datas[i].ministry) + 1);

      if (datas[i].ministry === "HEALTH AND FAMILY WELFARE")
        if (datas[i].question_type === "STARRED") count++;
    }
    var arr_name = [];
    var arr_value = [];
    var get_entries = map1.entries();
    for (var ele of get_entries) {
      arr_value.push(ele[1])
      // {
      //   name: `${ele[0]}`,
      //   value: `${ele[1]}`,
      // })
    }
    
    var scale = d3.scale.linear()
      .domain([0, 900])
      .range([0, 800])

    console.log(arr_value);

    d3.select(".plot1")
      .selectAll("section")
      .data(arr_value)
      .enter()
      .append("section")
      .style("width", function(d) { return scale(d) + 'px' })
      .text(function(d) { return d; });

  })
  .catch(err => {
    // Do something for an error here
  });