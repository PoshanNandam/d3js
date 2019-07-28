var arr = [];
fetch('http://localhost:3000/fundingData')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {

    var yr = 0,
      dt = 0;
    for (let i = 0; i < myJson.length; i++) {
      let len = myJson[i].Date.length;
      if (len === 9) {
        yr = myJson[i].Date.substring(5, 9)
        dt = myJson[i].Date.substring(3, 5)
      }
      if (len === 10) {
        yr = myJson[i].Date.substring(6, 10)
        dt = myJson[i].Date.substring(3, 5)
      }
      if (yr === "2017") {
        if (dt >= "01" && dt <= "08") {
          arr.push(myJson[i]);
        }
      }
    }

    console.log(arr);

    changePage(1);

  });

//pagination
var current_page = 1;
var records_per_page = 50;



function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}

function changePage(page) {
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var listing_table = "";
  var page_span = document.getElementById("page");

  // Validate page
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();



  for (var i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {


    listing_table += '<tr>'
    listing_table += '<td>' + (i + 1) + '</td>'
    listing_table += '<td>' + arr[i].StartupName + '</td>'
    listing_table += '<td>' + arr[i].IndustryVertical + '</td>'
    listing_table += '<td>' + arr[i].CityLocation + '</td>'
    listing_table += '<td>' + arr[i].Date + '</td>'
    listing_table += '<td>' + arr[i].AmountInUSD + '</td>'
    listing_table += '</tr>'

    document.getElementById('adding').innerHTML = listing_table
  }
  page_span.innerHTML = page;

  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }
}

function numPages() {
  return Math.ceil(arr.length / records_per_page)-1 ;
}