//Event listeners
let query = document.querySelector("input");
const button = document.querySelector("button");
const form = document.getElementById("form1");
const titleContainer = document.getElementById("titleContainer")
const summaryContainer = document.getElementById("summaryContainer")
const URLcontainer = document.getElementById("URLcontainer")
const debutContainer = document.getElementById("debutContainer")
const suggestionHeader = document.getElementById("suggestionHeader")
const suggestionContainer = document.getElementById("suggestionContainer")
let blankMSG = document.getElementById("blankMSG")
const errorMessage2 = document.getElementById("errorMessage2")
let loadBut = document.getElementsByClassName("buttonload")
let img = document.createElement('img');

//Form with default behaviour prevented, in an async function
form.addEventListener('submit', async function (e) {
   e.preventDefault();

   let searchTerm = query.value;
   let loadingBar = document.createElement("h1").innerHTML = "Loading";
   errorMessage2.classList.add('button');
   errorMessage2.append(loadingBar)

   if (searchTerm === "") {
      errorMessage2.innerText = "Search Cannot Be blank";
      errorMessage2.classList.remove('button');

   } else {
      errorMessage2.innerHTML = "Loading";
   }

   //Making call to the tvMaze API (using Axios), catching any errors. Timeouts to incremently display returned data on page.

   const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}
   `);
   console.log(res);
   try {
      img.src = res.data[0].show.image.medium;
   } catch {
      img.src = "";
      console.log("No show!")
      setTimeout(function () {
         errorMessage2.innerHTML = "No matching Show";

      }, 3400)
      setTimeout(function () {
         errorMessage2.innerHTML = "";
      }, 7000)
   }
   setTimeout(function () {
      errorMessage2.classList.remove("button");
      errorMessage2.innerText = "";

   }, 2400)
   setTimeout(function () {
      blankMSG.prepend(img);
   }, 2700)
   setTimeout(function () {
      errorMessage2.innerText = "";
      errorMessage2.classList.remove('button');

      showTitle = res.data[0].show.name;
      showSummary = res.data[0].show.summary.replace(/<\/?[^>]+>/gi, '');
      showDebut = `Premiered: ${res.data[0].show.premiered}`;
      showURL = res.data[0].show.url;
      reccomendedTitle = "Looking for one of these instead?"

      titleContainer.append(showTitle);
      summaryContainer.append(showSummary);
      URLcontainer.append(showURL);
      debutContainer.append(showDebut);
      suggestionHeader.prepend(reccomendedTitle);

      suggestions(res.data);

      console.log(res.data);
   }, 3000)
})
//Creates a Div showing related shows to the search term.Looping over ther results of shows.
const suggestions = (shows) => {
   for (let show of shows) {
      console.log(show.show.name);
      let suggestionDiv = document.createElement('img');
      suggestionDiv.src = show.show.image.medium;
      suggestionDiv.innerText = show.show.name;
      suggestionDiv.value = show.show.name;
      suggestionDiv.prem = show.show.premiered;
      suggestionDiv.img = show.show.url;
      suggestionDiv.summary = show.show.summary.replace(/<\/?[^>]+>/gi, '');
      suggestionContainer.append(suggestionDiv);

      //Listens for clicks in the suggestions div, that targets the closest elements of the page, then displays the data from that show.
      suggestionDiv.addEventListener('click', (e) => {

         let text = e.target.value;
         query.value = "";
         titleContainer.innerHTML = e.target.value;
         summaryContainer.innerHTML = e.target.summary;
         showURL.src = e.target.src;
         debutContainer.innerHTML = e.target.prem;
         URLcontainer.innerHTML = e.target.img;
         img.src = e.target.src;

         //Scrolls backs to top of page to show newly selceted show from the div
         (function smoothscroll() {
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
               window.requestAnimationFrame(smoothscroll);
               window.scrollTo(0, currentScroll - (currentScroll / 25));
            }
         })();

      });

   }
}


//Event listener the clears the form, when requesting a new search
button.addEventListener('click', function () {
   if (titleContainer !== "") {
      titleContainer.innerText = "";
   }

   if (summaryContainer !== "") {
      summaryContainer.innerText = "";
   }

   if (URLcontainer !== "") {
      URLcontainer.innerText = "";
   }

   if (debutContainer !== "") {
      debutContainer.innerText = "";
   }

   if (blankMSG !== "") {
      blankMSG.innerText = "";
   }

   if (suggestionContainer !== "") {
      suggestionContainer.innerText = "";
      suggestionHeader.innerText = "";
   }
})
