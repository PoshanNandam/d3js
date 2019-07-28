fetch('http://localhost:3000/rajyasabha')
  .then(response => {
    return response.json()
  })
  .then(datas => {
    let count = 0;
    var map1 = new Map();
    var starred_map = new Map();
    for (var i = 0; i < datas.length; i++) {
      if (!map1.has(datas[i].ministry)) map1.set(datas[i].ministry, 1);
      else map1.set(datas[i].ministry, map1.get(datas[i].ministry) + 1);

      if (!starred_map.has(datas[i].ministry)){
        if(datas[i].question_type === "STARRED") {
          starred_map.set(datas[i].ministry, 1);
        }
      }
      else {
        if(datas[i].question_type === "STARRED") { 
          starred_map.set(datas[i].ministry, starred_map.get(datas[i].ministry) + 1);
        }
      }
      
    }
    var arr_name = [];
    var arr_value = [];
    var get_entries = starred_map.entries();
    for (var ele of get_entries) {
      arr_value.push(ele[1])
      // {
      //   name: `${ele[0]}`,
      //   value: `${ele[1]}`,
      // })
    }
    // var uncount = map1.get("HEALTH AND FAMILY WELFARE") - count
    // console.log(map1.get("HEALTH AND FAMILY WELFARE") - count)


    var scale = d3.scale.linear()
      .domain([0, 100])
      .range([0, 500])

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