// resize header to size of browser window
var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
};

// set modal time delay before loading
setTimeout(function () {
    $("#demo-modal").modal();
}, 500);

document.addEventListener("DOMContentLoaded", function () {
    ready(() => {
        document.querySelector(".header").style.height = window.innerHeight + "px";
    });
});

var text;

// jquery method to wait for a click
$("#rosterdata").click(function(event) {
    text = $(event.target).text();
    getPlayerData(text);
})
function player(name, number, age) {
    this.name = name;
    this.number = number;
    this.age = age;
}

function getPlayerData(player) {
    var id = getPlayedID(player);

    if (id === undefined) {
        document.getElementById("playerinfo").innerHTML = "Player not found";
        return;
    }

    var playerURL = "https://statsapi.web.nhl.com/api/v1/people/" + id + "?hydrate=stats(splits=statsSingleSeason)/";

    $.ajax({
        url: playerURL,
        method: "GET",
        async: false
    }).done(function (player_data) {
        console.log(player_data);

        document.getElementById("playerinfo").innerHTML =  "#" + player_data.people[0].primaryNumber + " ";
        document.getElementById("playerinfo").innerHTML += player + " | ";
        document.getElementById("playerinfo").innerHTML += "Birthplace: " + player_data.people[0].birthCity + ", "
        var country = getCountry(player_data.people[0].birthCountry);
        document.getElementById("playerinfo").innerHTML += country + " ";
        document.getElementById("playerinfo").innerHTML += "<img src='Flags/" + country + ".png' width=30><br>"; 
        document.getElementById("playerinfo").innerHTML += "GP: " + player_data.people[0].stats[0].splits[0].stat.games + " ";
        document.getElementById("playerinfo").innerHTML += "Goals: " + player_data.people[0].stats[0].splits[0].stat.goals + " ";
        document.getElementById("playerinfo").innerHTML += "Assists: " + player_data.people[0].stats[0].splits[0].stat.assists + " ";
    });
}

/**
 * this function uses the jQuery ajax method to get information
 * about a teams roster.
 */

function getRoster() {
    //get the team name from the html document
    document.getElementById("rosterdata").innerHTML = "";
    document.getElementById("playerinfo").innerHTML = "";

    //get the team name in from the html fourm
    var team = document.getElementById("rosterin").value;
    //split the team name on each space
    var splitTeam = team.toLowerCase().split(" ");

    //loop through the string and uppercase the first letter of each word
    for (var i = 0; i < splitTeam.length; i++) {
        splitTeam[i] = splitTeam[i].charAt(0).toUpperCase() + splitTeam[i].substring(1);
    }
    //now rejoin the string together
    team = splitTeam.join(" ");

    //map each team to the team id
    const TeamID = new Map([
        ["New Jersey Devils", 1],
        ["New York Rangers", 3],
        ["New York Islanders", 2],
        ["Philadelphia Flyers", 4],
        ["Pittsburgh Penguins", 5],
        ["Boston Bruins", 6],
        ["Buffalo Sabres", 7],
        ["Montreal Canadiens", 8],
        ["Habs", 8],
        ["Montreal", 8],
        ["Canadiens", 8],
        ["Ottawa Senators", 9],
        ["Toronto Maple Leafs", 10],
        ["Leafs", 10],
        ["Carolina Hurricanes", 12],
        ["Florida Panthers", 13],
        ["Tampa Bay Lightning", 14],
        ["Washington Capitals", 15],
        ["Chicago Blackhawks", 16],
        ["Detroit Red Wings", 17],
        ["Nashville Predators", 18],
        ["St Louis Blues", 19],
        ["Calgary Flames", 20],
        ["Colorado Avalanche", 21],
        ["Edmonton Oilers", 22],
        ["Vancouver Canucks", 23],
        ["Anaheim Ducks", 24],
        ["Dallas Stars", 25],
        ["Los Angeles Kings", 26],
        ["San Jose Sharks", 28],
        ["Columbus Blue Jackets", 29],
        ["Minnesota Wild", 30],
        ["Winnipeg Jets", 52],
        ["Arizona Coyotes", 53],
        ["Vegas Golden Knights", 54],
        ["Seattle Kraken", 55],
    ]);

    //get the teams id from the map
    var teamID = TeamID.get(team);

    //build the api url
    var rosterURL = "https://statsapi.web.nhl.com/api/v1/teams/" + teamID + "/roster/";
    const player_ids = [];
    const player_names = [];
    const player_ages = [];
    const player_numbers = [];

    //start the ajax call
    // this call just collects information to use later
    $.ajax({
        url: rosterURL,
        method: "GET",
        async: false
    }).done(function (rosterData) {

        // determine how many players the team has 
        var teamSize = Object.keys(rosterData.roster).length;

        for (var i = 0; i < teamSize; i++) {

            player_ids[i] = rosterData.roster[i].person.id;
            player_names[i] = rosterData.roster[i].person.fullName;
            player_ages[i] = rosterData.roster[i].person.currentAge;
            player_numbers[i] = rosterData.roster[i].primaryNumber;
        }
    });

    var player_objects = [];

    for (var i = 0; i < player_ids.length; i++) {

        player_objects[i] = new player(player_names[i], player_numbers[i], player_numbers[i]);
    }
    const base_url = "https://statsapi.web.nhl.com/api/v1/people/";

    var player_links = [];

    for (var i = 0; i < player_ids.length; i++) {
        player_links[i] = base_url + player_ids[i];
    }
    var result = "";
    for (var i = 0; i < player_ids.length; i++) {
        result = result + "<label>" + player_names[i] + "</label> | ";
    }
    document.getElementById("rosterdata").innerHTML = result;
}

//this function uses the ajax jquery method to get data about the playoffs
function getPlayoffs() {
    //each time the button is pressed, reset the html element to be empty
    document.getElementById("playoffrecords").innerHTML = " ";

    //get the year the user wants to search for from the html page
    var playoffYear = document.getElementById("playoffin").value;

    //check if valid playoff year, or if the user enters something that is not a number
    if (playoffYear >= 2023 || playoffYear <= 1930 || isNaN(playoffYear)) {
        document.getElementById("playoffrecords").innerHTML = "Please enter a valid year";
        return;
    }
    //set up the values for the api call
    var endYear = playoffYear;
    playoffYear--;
    var year = playoffYear + "" + endYear;
    var playoffURL = "https://statsapi.web.nhl.com/api/v1/tournaments/playoffs?expand=round.series,schedule.game.seriesSummary&season=" + year;

    //call the api with the url using the GET method
    $.ajax({
        url: playoffURL,
        method: "GET",
    }).done(function (playoffData) {
        document.getElementById("playoffrecords").innerHTML += "<b>Quarter Finals" + "<br><br>";

        //loop through each round (quarters, semi, confrence final, finals)
        //and then display the returned content
        for (var i = 0; i < 8; i++) {
            document.getElementById("playoffrecords").innerHTML += playoffData.rounds[0].series[i].names.matchupName;
            document.getElementById("playoffrecords").innerHTML += "=>" + playoffData.rounds[0].series[i].currentGame.seriesSummary.seriesStatus +"<br>";
        }
        document.getElementById("playoffrecords").innerHTML += "<br><b>Semi Finals" + "<br><br>";
        for (var i = 0; i < 4; i++) {
            document.getElementById("playoffrecords").innerHTML +=playoffData.rounds[1].series[i].names.matchupName;
            document.getElementById("playoffrecords").innerHTML +="=>" +playoffData.rounds[1].series[i].currentGame.seriesSummary.seriesStatus +"<br>";
        }
        document.getElementById("playoffrecords").innerHTML +="<br><b>Conference Finals" + "<br><br>";
        for (var i = 0; i < 2; i++) {
            document.getElementById("playoffrecords").innerHTML += playoffData.rounds[2].series[i].names.matchupName;
            document.getElementById("playoffrecords").innerHTML +="=>" +playoffData.rounds[2].series[i].currentGame.seriesSummary.seriesStatus +"<br>";
        }
        document.getElementById("playoffrecords").innerHTML += "<br><b>Stanley Cup Finals" + "<br><br>";
        //since the last round only has 2 teams we don't need a loop
        document.getElementById("playoffrecords").innerHTML +=playoffData.rounds[3].series[0].names.matchupName;
        document.getElementById("playoffrecords").innerHTML +="=>" +playoffData.rounds[3].series[0].currentGame.seriesSummary.seriesStatus +"<br>";
    });
}
//check the console for date click event
//Fixed day highlight
//Added previous month and next month view
//code to create and control a calendar
function CalendarControl() {
    const calendar = new Date();
    const calendarControl = {
        localDate: new Date(),
        prevMonthLastDate: null,
        calWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        calMonthName: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        daysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        firstDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
        },
        lastDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
        },
        firstDayNumber: function () {
            return calendarControl.firstDay().getDay() + 1;
        },
        lastDayNumber: function () {
            return calendarControl.lastDay().getDay() + 1;
        },
        getPreviousMonthLastDate: function () {
            let lastDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                0
            ).getDate();
            return lastDate;
        },
        navigateToPreviousMonth: function () {
            calendar.setMonth(calendar.getMonth() - 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToNextMonth: function () {
            calendar.setMonth(calendar.getMonth() + 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToCurrentMonth: function () {
            let currentMonth = calendarControl.localDate.getMonth();
            let currentYear = calendarControl.localDate.getFullYear();
            calendar.setMonth(currentMonth);
            calendar.setYear(currentYear);
            calendarControl.attachEventsOnNextPrev();
        },
        displayYear: function () {
            let yearLabel = document.querySelector(".calendar .calendar-year-label");
            yearLabel.innerHTML = calendar.getFullYear();
        },
        displayMonth: function () {
            let monthLabel = document.querySelector(
                ".calendar .calendar-month-label"
            );
            monthLabel.innerHTML = calendarControl.calMonthName[calendar.getMonth()];
        },
        selectDate: function (e) {
            console.log(
                `${e.target.textContent} ${
                    calendarControl.calMonthName[calendar.getMonth()]
                } ${calendar.getFullYear()}`
            );
            getSchedule(
                calendar.getFullYear(),
                calendarControl.calMonthName[calendar.getMonth()],
                e.target.textContent
            );
        },
        plotSelectors: function () {
            document.querySelector(
                ".calendar"
            ).innerHTML += `<div class="calendar-inner"><div class="calendar-controls">
          <div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
          <div class="calendar-year-month">
          <div class="calendar-month-label"></div>
          <div>-</div>
          <div class="calendar-year-label"></div>
          </div>
          <div class="calendar-next"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
          </div>
          <div class="calendar-today-date">Today: 
            ${calendarControl.calWeekDays[calendarControl.localDate.getDay()]}, 
            ${calendarControl.localDate.getDate()}, 
            ${
                            calendarControl.calMonthName[calendarControl.localDate.getMonth()]
                        } 
            ${calendarControl.localDate.getFullYear()}
          </div>
          <div class="calendar-body"></div></div>`;
        },
        plotDayNames: function () {
            for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
            }
        },
        plotDates: function () {
            document.querySelector(".calendar .calendar-body").innerHTML = "";
            calendarControl.plotDayNames();
            calendarControl.displayMonth();
            calendarControl.displayYear();
            let count = 1;
            let prevDateCount = 0;

            calendarControl.prevMonthLastDate =
                calendarControl.getPreviousMonthLastDate();
            let prevMonthDatesArray = [];
            let calendarDays = calendarControl.daysInMonth(
                calendar.getMonth() + 1,
                calendar.getFullYear()
            );
            // dates of current month
            for (let i = 1; i < calendarDays; i++) {
                if (i < calendarControl.firstDayNumber()) {
                    prevDateCount += 1;
                    document.querySelector(
                        ".calendar .calendar-body"
                    ).innerHTML += `<div class="prev-dates"></div>`;
                    prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
                } else {
                    document.querySelector(
                        ".calendar .calendar-body"
                    ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
                }
            }
            //remaining dates after month dates
            for (let j = 0; j < prevDateCount + 1; j++) {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
            }
            calendarControl.highlightToday();
            calendarControl.plotPrevMonthDates(prevMonthDatesArray);
            calendarControl.plotNextMonthDates();
        },
        attachEvents: function () {
            let prevBtn = document.querySelector(".calendar .calendar-prev a");
            let nextBtn = document.querySelector(".calendar .calendar-next a");
            let todayDate = document.querySelector(".calendar .calendar-today-date");
            let dateNumber = document.querySelectorAll(".calendar .dateNumber");
            prevBtn.addEventListener(
                "click",
                calendarControl.navigateToPreviousMonth
            );
            nextBtn.addEventListener("click", calendarControl.navigateToNextMonth);
            todayDate.addEventListener(
                "click",
                calendarControl.navigateToCurrentMonth
            );
            for (var i = 0; i < dateNumber.length; i++) {
                dateNumber[i].addEventListener(
                    "click",
                    calendarControl.selectDate,
                    false
                );
            }
        },
        highlightToday: function () {
            let currentMonth = calendarControl.localDate.getMonth() + 1;
            let changedMonth = calendar.getMonth() + 1;
            let currentYear = calendarControl.localDate.getFullYear();
            let changedYear = calendar.getFullYear();
            if (
                currentYear === changedYear &&
                currentMonth === changedMonth &&
                document.querySelectorAll(".number-item")
            ) {
                document.querySelectorAll(".number-item")[calendar.getDate() - 1].classList.add("calendar-today");
            }
        },
        plotPrevMonthDates: function (dates) {
            dates.reverse();
            for (let i = 0; i < dates.length; i++) {
                if (document.querySelectorAll(".prev-dates")) {
                    document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
                }
            }
        },
        plotNextMonthDates: function () {
            let childElemCount =
                document.querySelector(".calendar-body").childElementCount;
            //7 lines
            if (childElemCount > 42) {
                let diff = 49 - childElemCount;
                calendarControl.loopThroughNextDays(diff);
            }

            //6 lines
            if (childElemCount > 35 && childElemCount <= 42) {
                let diff = 42 - childElemCount;
                calendarControl.loopThroughNextDays(42 - childElemCount);
            }
        },
        loopThroughNextDays: function (count) {
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    document.querySelector( ".calendar-body").innerHTML += `<div class="next-dates">${i}</div>`;
                }
            }
        },
        attachEventsOnNextPrev: function () {
            calendarControl.plotDates();
            calendarControl.attachEvents();
        },
        init: function () {
            calendarControl.plotSelectors();
            calendarControl.plotDates();
            calendarControl.attachEvents();
        },
    };
    calendarControl.init();
}
//create a new calendar to use later
const calendarControl = new CalendarControl();

/**
 * this function uses the functions above to get the schedule
 * for any given day the user clicks on
 */
function getSchedule(year, month, day) {
    //reset the page each time the function is called
    document.getElementById("datedisplay").innerHTML = "";

    document.getElementById("datedisplay").innerHTML += "<b>Schedule for " + month + " " + day + ", " + year + "<br><br>";
    //map to convert month to the numerical equivalent
    const MonthNumber = new Map([
        ["Jan", 1],
        ["Feb", 2],
        ["Mar", 3],
        ["Apr", 4],
        ["May", 5],
        ["Jun", 6],
        ["Jul", 7],
        ["Aug", 8],
        ["Sep", 9],
        ["Oct", 10],
        ["Nov", 11],
        ["Dec", 12],
    ]);
    //convert month to a number using a map
    var monthNum = MonthNumber.get(month);
    var scheduleURL = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=" + year + "-" + monthNum + "-" + day + "&endDate=" + year +"-" + monthNum + "-" + day;

    //start the ajax call to the api
    $.ajax({
        url: scheduleURL,
        method: "GET",
    }).done(function (scheduleData) {
        //get the number of games that day
        var games = scheduleData.totalGames;

        //check if no games are scheduled for the given day
        if (games == 0) {
            document.getElementById("datedisplay").innerHTML += "No games scheduled for today.";
        }
        //start to loop through all the games on the given day
        for (var i = 0; i < games; i++) {
            //set up variables for the winning team and number of goals
            var winningTeam = "";
            var winningGoals = "";
            var loosingGoals = "";
            var gameStatus = scheduleData.dates[0].games[i].status.abstractGameState;

            //determine which team won the game (i.e. score more goals)
            if (
                scheduleData.dates[0].games[i].teams.away.score >
                scheduleData.dates[0].games[i].teams.home.score
            ) {
                //if the game is not tied and the away team is winning
                winningTeam = scheduleData.dates[0].games[i].teams.away.team.name;
                winningGoals = scheduleData.dates[0].games[i].teams.away.score;
                loosingGoals = scheduleData.dates[0].games[i].teams.home.score;
            } else if (
                scheduleData.dates[0].games[i].teams.away.score == 0 &&
                scheduleData.dates[0].games[i].teams.home.score == 0
            ) {
                //this checks if the game is live and is tied 0-0
                if (gameStatus == "Live") {
                    //in this case the goals are the same so both are set to 0
                    winningGoals = 0;
                    loosingGoals = 0;
                    winningTeam = "Tie game";
                }
            } else if (
                scheduleData.dates[0].games[i].teams.away.score ==
                scheduleData.dates[0].games[i].teams.home.score
            ) {
                //this checks if the game is tied, but not a 0-0 tie
                winningTeam = "Tie game";
                winningGoals = scheduleData.dates[0].games[i].teams.home.score;
                loosingGoals = scheduleData.dates[0].games[i].teams.home.score;
            } else {
                //if the game is not tied and the home team is winning
                winningTeam = scheduleData.dates[0].games[i].teams.home.team.name;
                loosingGoals = scheduleData.dates[0].games[i].teams.away.score;
                winningGoals = scheduleData.dates[0].games[i].teams.home.score;
            }
            //display the obtained data on the html page
            
            // this block bolds the score of the team that won the game
            if (scheduleData.dates[0].games[i].teams.away.score > scheduleData.dates[0].games[i].teams.home.score) {
                datedisplay.innerHTML += `<b> ${scheduleData.dates[0].games[i].teams.away.score} </b>`;
            } else {
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.score;
            }

            datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.away.team.name + ".png' width=30>";

            let awayot = 0;
            let homeot = 0;

            // fixes games (mostly playoff) that showed overtime records as 'undefined'
            if (scheduleData.dates[0].games[i].teams.away.leagueRecord.ot != undefined) {
                awayot = scheduleData.dates[0].games[i].teams.away.leagueRecord.ot;

            } else if(scheduleData.dates[0].games[i].teams.home.leagueRecord.ot != undefined) {
                homeot = scheduleData.dates[0].games[i].teams.home.leagueRecord.ot
            }
    
            document.getElementById("datedisplay").innerHTML +=scheduleData.dates[0].games[i].teams.away.team.name + "(" + scheduleData.dates[0].games[i].teams.away.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.away.leagueRecord.losses + "," + awayot + ")" + "<br>";
            
            // this block bolds the score of the team that won the game
            if (scheduleData.dates[0].games[i].teams.away.score < scheduleData.dates[0].games[i].teams.home.score) {
                datedisplay.innerHTML += `<b> ${scheduleData.dates[0].games[i].teams.home.score} </b>`;
            } else {
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.score;
            }

            document.getElementById("datedisplay").innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.home.team.name + ".png' width=30>" + "" + scheduleData.dates[0].games[i].teams.home.team.name + "(" + scheduleData.dates[0].games[i].teams.home.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.home.leagueRecord.losses + "," + homeot + ")" + ""  + "<br>";

            var gameTime = "";
            document.getElementById("datedisplay").innerHTML += winningGoals + "-" + loosingGoals + " " + winningTeam + " " + "(" + gameStatus + ") <br>";

            //if the game hasn't started yet it will be in a preview state
            if (gameStatus == "Preview") {
                //get the time the game starts at from the api
                gameTime = scheduleData.dates[0].games[i].gameDate;

                //uses the JavaScript split method to remove the date portion of the date
                const timeArray = gameTime.split("T");
                //now use split to remove the Z at the end of the string
                const timeArray2 = timeArray[1].split("Z");

                //now convert the time from 24 hour military time to 12 hour
                const militaryTime = timeArray2[0];
                //finally create a new Date object to convert the time to the users local time zone
                const timeString12hr = new Date("1970-01-01T" + militaryTime + "Z").toLocaleString("en-US", {
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                });

                //finally display the results on the html page
                document.getElementById("datedisplay").innerHTML += " " + timeString12hr + "<br>";
            } else {
                //if the game has already started, just print out a blank line
                document.getElementById("datedisplay").innerHTML += "<br>";
            }
        }
    });
}
/**
 * this function uses the ajax jQuery method to obtain data about a draft year
 */
function draft() {
    //reset the page on each call to the function
    document.getElementById("draftdata").innerHTML = "";

    //get the round and year in from the html document
    var round = document.getElementById("roundin").value;
    var year = document.getElementById("yearin").value;

    var currentTime = new Date();
    var currentYear = currentTime.getFullYear();

    //error checking to make sure the round number is valid
    if (round > 7 || round < 1 || isNaN(round)) {
        document.getElementById("draftdata").innerHTML = "Invalid round number.";
        return;
    }
    //error checking to make sure the year is valid
    if (year > currentYear || year < 1970 || isNaN(year)) {
        document.getElementById("draftdata").innerHTML = "Invalid year.";
        return;
    }
    //create a table, heading and body for later
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    //append the head and body to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    //create the headings for the table and then add to table
    document.getElementById("body").appendChild(table);
    let row_1 = document.createElement("tr");
    let heading_1 = document.createElement("th");
    heading_1.innerHTML = "Pick";
    let heading_2 = document.createElement("th");
    heading_2.innerHTML = "Name";
    let heading_3 = document.createElement("th");
    heading_3.innerHTML = "Team";
    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    thead.appendChild(row_1);

    //this is the URL to the API on
    var draftURL = "https://statsapi.web.nhl.com/api/v1/draft/" + year;

    //start the ajax call, set async to false so data can be obtained in the function
    $.ajax({
        async: false,
        url: draftURL,
        method: "GET",
    }).done(function (draftData) {
        var pickHolder = 1;
        var pickNumber = pickHolder * round;
        console.log(pickNumber);
        //the api uses 0-6 for round numbers instead of 1-7 so subtract one
        round--;

        //counter variable
        let i = 0;

        //since the are currently 32 teams
        //start the main loop
        while (i < 32) {
            //create a row
            let row = document.createElement("tr");

            //create a holder for the pick, player name and team
            let pickNum = document.createElement("td");
            let player = document.createElement("td");
            let team = document.createElement("td");

            //set the data of each uses the data from the api
            pickNum.innerHTML = pickHolder;
            player.innerHTML = draftData.drafts[0].rounds[round].picks[i].prospect.fullName;

            var teamName = draftData.drafts[0].rounds[round].picks[i].team.name;

            //now append it to the table
            row.appendChild(pickNum);
            row.appendChild(player);

            //add the team logo
            team.innerHTML = "<img src='Logos/" + teamName + ".png' width=30>" + teamName;
            row.appendChild(team);
            tbody.appendChild(row);

            //increment counter and the pick number
            i++;
            pickHolder++;
        }
    });
}
/**
 * this function reloads the page when called.
 */
function reloadPage() {
    window.location.reload();
}
//define an object to represent a team with their points, wins, losses and ot
function team(name, points, wins, losses, ot, gp) {
    this.name = name;
    this.points = points;
    this.wins = wins;
    this.losses = losses;
    this.ot = ot;
    this.gp = gp;
}
//this function uses arrays.sort with a small modification
//to sort the teams based on points
function sortByKey(array) {
    return array.sort(function (a, b) {
        var x = a.points;
        var y = b.points;

        if (x == y) {
            return x.gp - y.gp;
        }

        return x < y ? -1 : x > y ? 1 : 0;
    });
}
function getOverallStandings () {

    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    table.appendChild(thead);
    table.appendChild(tbody);

    // Adding the entire table to the body tag
    document.getElementById("body").appendChild(table);
    let row_1 = document.createElement("tr");
    let heading_1 = document.createElement("th");
    heading_1.innerHTML = "Team";
    let heading_2 = document.createElement("th");
    heading_2.innerHTML = "Points";
    let heading_3 = document.createElement("th");
    heading_3.innerHTML = "GP";
    let heading_4 = document.createElement("th");
    heading_4.innerHTML = "Wins";
    let heading_5 = document.createElement("th");
    heading_5.innerHTML = "Losses";
    let heading_6 = document.createElement("th");
    heading_6.innerHTML = "OTL";
    let heading_7 = document.createElement("th");
    heading_7.innerHTML = "Goals For";
    let heading_8 = document.createElement("th");
    heading_8.innerHTML = "Goals Against"

    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    row_1.appendChild(heading_4);
    row_1.appendChild(heading_5);
    row_1.appendChild(heading_6);
    row_1.appendChild(heading_7);
    row_1.appendChild(heading_8);
    thead.appendChild(row_1);

    var overall = "https://statsapi.web.nhl.com/api/v1/standings/byLeague/";

    $.ajax({
        url: overall,
        method: "GET",
    }).done(function (standings) {

        console.log(standings);
        for (var i = 0; i < 31; i++) {

            let row = document.createElement("tr");
            let team = document.createElement("td");
            let gp = document.createElement("td");
            let wins = document.createElement("td");
            let loss = document.createElement("td");
            let ot = document.createElement("td");
            let point = document.createElement("td");
            let goalsfor = document.createElement("td");
            let goalsagainst = document.createElement("td");

            team.innerHTML += "<img src='Logos/" + standings.records[0].teamRecords[i].team.name + ".png' width=30>" + standings.records[0].teamRecords[i].team.name;
            point.innerHTML += standings.records[0].teamRecords[i].points;
            gp.innerHTML += standings.records[0].teamRecords[i].gamesPlayed;
            wins.innerHTML += standings.records[0].teamRecords[i].leagueRecord.wins;
            loss.innerHTML += standings.records[0].teamRecords[i].leagueRecord.losses;
            ot.innerHTML += standings.records[0].teamRecords[i].leagueRecord.ot;
            goalsfor.innerHTML += standings.records[0].teamRecords[i].goalsScored; 
            goalsagainst.innerHTML += standings.records[0].teamRecords[i].goalsAgainst;

            row.appendChild(team);
            row.appendChild(point);
            row.appendChild(gp);
            row.appendChild(wins);
            row.appendChild(loss);
            row.appendChild(ot);
            row.appendChild(goalsfor);
            row.appendChild(goalsagainst);
            tbody.appendChild(row);

        }
    });
}
function getWildCardStandings () {

    var wildcard = "https://statsapi.web.nhl.com/api/v1/standings/wildCardWithLeaders/";

    $.ajax({
        url: wildcard,
        method: "GET",
    }).done(function (standings) {
        console.log(standings);

        for (var i = 0; i < 3; i++) {
            document.getElementById("metroseeds").innerHTML += "<img src='Logos/" + standings.records[2].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("metroseeds").innerHTML += standings.records[2].teamRecords[i].team.name + " ";
            document.getElementById("metroseeds").innerHTML += standings.records[2].teamRecords[i].points + "<br>";
        }
        for (var i = 0; i < 3; i++) {
            document.getElementById("atlanticseeds").innerHTML += "<img src='Logos/" + standings.records[3].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("atlanticseeds").innerHTML += standings.records[3].teamRecords[i].team.name + " ";
            document.getElementById("atlanticseeds").innerHTML += standings.records[3].teamRecords[i].points + "<br>";
        }
        
        for (var i = 0; i < 2; i++) {
            document.getElementById("eastwildcard").innerHTML += "<img src='Logos/" + standings.records[0].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("eastwildcard").innerHTML += standings.records[0].teamRecords[i].team.name + " ";
            document.getElementById("eastwildcard").innerHTML += standings.records[0].teamRecords[i].points + "<br>";           
        }
        document.getElementById("eastwildcard").innerHTML += "<hr style=width:300% color=black>";

        for (var i = 2; i < 10; i++) {
            document.getElementById("eastwildcard").innerHTML += "<img src='Logos/" + standings.records[0].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("eastwildcard").innerHTML += standings.records[0].teamRecords[i].team.name + " ";
            document.getElementById("eastwildcard").innerHTML += standings.records[0].teamRecords[i].points + "<br>";           
        }

        for (var i = 0; i < 3; i++) {
            document.getElementById("pacificseeds").innerHTML += "<img src='Logos/" + standings.records[4].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("pacificseeds").innerHTML += standings.records[4].teamRecords[i].team.name + " ";
            document.getElementById("pacificseeds").innerHTML += standings.records[4].teamRecords[i].points + "<br>";           
        }
        for (var i = 0; i < 3; i++) {
            document.getElementById("centralseeds").innerHTML += "<img src='Logos/" + standings.records[5].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("centralseeds").innerHTML += standings.records[5].teamRecords[i].team.name + " ";
            document.getElementById("centralseeds").innerHTML += standings.records[5].teamRecords[i].points + "<br>";           
        }

        for (var i = 0; i < 2; i++) {
            document.getElementById("westwildcard").innerHTML += "<img src='Logos/" + standings.records[1].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("westwildcard").innerHTML += standings.records[1].teamRecords[i].team.name + " ";
            document.getElementById("westwildcard").innerHTML += standings.records[1].teamRecords[i].points + "<br>";           
        }
        document.getElementById("westwildcard").innerHTML += "<hr style=width:300% color=black>";
        
        for (var i = 2; i < 10; i++) {
            document.getElementById("westwildcard").innerHTML += "<img src='Logos/" + standings.records[1].teamRecords[i].team.name + ".png' width=30>"
            document.getElementById("westwildcard").innerHTML += standings.records[1].teamRecords[i].team.name + " ";
            document.getElementById("westwildcard").innerHTML += standings.records[1].teamRecords[i].points + "<br>";           
        }
    });
}
//get information about a specific player
function getPlayer() {
    //get the player name in from the html doc
    var input = document.getElementById("playerin").value;
    var capitals = input.length - input.replace(/[A-Z]/g, '').length;
    var input_string;

    if (capitals <= 2) {
        // use regex to capatilize the first letter of the name and ensure all other letters are lower case
        input_string = input.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
    } else {
        input_string = input;
    }
    var playerIDNum = getPlayedID(input_string);
    
    document.getElementById("playerrecords").innerHTML = "";

    //check if the player ID does not exist
    if (playerIDNum == undefined) {
        document.getElementById("playernotfound").innerHTML = "Player not found - please try again";
        document.getElementById("personalinfo").innerHTML = "";
        document.getElementById("playerrecords").innerHTML = "";
        document.getElementById("careerrecords").innerHTML = "";
        return;
    } else {
        document.getElementById("playernotfound").innerHTML = "";
    }
    var playerURL = "https://statsapi.web.nhl.com/api/v1/people/" + playerIDNum + "?hydrate=stats(splits=statsSingleSeason)/";

    $.ajax({
        url: playerURL,
        method: "GET",
    }).done(function (playerData) {

        document.getElementById("personalinfo").innerHTML = playerData.people[0].fullName + " #" + playerData.people[0].primaryNumber  + "<br>";

        var age = playerData.people[0].currentAge;

        if (age === undefined) {
            document.getElementById("personalinfo").innerHTML += "Age: " + playerData.people[0].birthDate + "<br>";
        } else{
            document.getElementById("personalinfo").innerHTML += "Age: " + playerData.people[0].currentAge + "<br>";
        }
        var country = getCountry(playerData.people[0].birthCountry);

        document.getElementById("personalinfo").innerHTML += "Birthplace: " + playerData.people[0].birthCity + ", " +  country + " ";
        personalinfo.innerHTML += "<img src='Flags/" + country + ".png' width=30> <br>"; 

        document.getElementById("personalinfo").innerHTML += "Height: " + playerData.people[0].height + "<br>";
        document.getElementById("personalinfo").innerHTML += "Weight: " + playerData.people[0].weight + "lbs" + "<br>";

        // check if the player is still active in the nhl
        if (playerData.people[0].rosterStatus === 'Y' || playerData.people[0].rosterStatus === 'I') {
            document.getElementById("personalinfo").innerHTML += "Team: " + playerData.people[0].currentTeam.name;
            personalinfo.innerHTML += "<img src='Logos/" + playerData.people[0].currentTeam.name + ".png' width=30><br>";

            if (playerData.people[0].shootsCatches === 'L') {
                document.getElementById("personalinfo").innerHTML += "Shoots: Left" + "<br>";
            } else {
                document.getElementById("personalinfo").innerHTML += "Shoots: Right" + "<br>";
            }
            document.getElementById("personalinfo").innerHTML += "Position: " + playerData.people[0].primaryPosition.name + "<br>";
           
            document.getElementById("playerrecords").innerHTML = "Goals: " + playerData.people[0].stats[0].splits[0].stat.goals + "<br>";
    
            document.getElementById("playerrecords").innerHTML += "Power Play Goals: " + playerData.people[0].stats[0].splits[0].stat.powerPlayGoals + "<br>";
            
            document.getElementById("playerrecords").innerHTML += "Assists: " + playerData.people[0].stats[0].splits[0].stat.assists + "<br>";
           
            document.getElementById("playerrecords").innerHTML +="Penalty Minutes: " +playerData.people[0].stats[0].splits[0].stat.pim + "<br>";
            
            document.getElementById("playerrecords").innerHTML += "Games Played: " +  playerData.people[0].stats[0].splits[0].stat.games + "<br>";
            
            document.getElementById("playerrecords").innerHTML += "Plus/Minus: " + playerData.people[0].stats[0].splits[0].stat.plusMinus + "<br>";
            
            document.getElementById("playerrecords").innerHTML += "Hits: " + playerData.people[0].stats[0].splits[0].stat.hits + "<br>";
    
            document.getElementById("playerrecords").innerHTML += "Average Time on Ice: " + playerData.people[0].stats[0].splits[0].stat.timeOnIcePerGame + "<br>";
        } else {
            document.getElementById("personalinfo").innerHTML += "Team: Retired<br>";
        }
    });

    var careerPlayer ="https://statsapi.web.nhl.com/api/v1/people/" + playerIDNum + "/stats?stats=statsSingleSeason&season=20052006";

    var startYear = 1900;
    var endYear = 1901;

    var careerGoals = 0;
    var careerAssists = 0;

    var year = startYear + "" + endYear;

    var currentYear = new Date().getFullYear() - 1;

    $.ajax({
        url: careerPlayer,
        method: "GET",
    }).done(function (careerData) {
        if (careerData.stats[0].splits[0] != null) {
            careerGoals = careerData.stats[0].splits[0].stat.goals;
            careerAssists = careerData.stats[0].splits[0].stat.assists;
        }
        while (startYear != currentYear) {
            startYear++;
            endYear++;

            year = startYear + "" + endYear;

            careerPlayer = "https://statsapi.web.nhl.com/api/v1/people/" + playerIDNum + "/stats?stats=statsSingleSeason&season=" + year;

            $.ajax({
                url: careerPlayer,
                method: "GET",
            }).done(function (newCareerData) {
                if (newCareerData.stats[0].splits[0] != null) {
                    careerGoals += newCareerData.stats[0].splits[0].stat.goals;
                    careerAssists += newCareerData.stats[0].splits[0].stat.assists;
                }
               
                if (startYear == currentYear) {
                    document.getElementById("careerrecords").innerHTML = "<br>" + "Career Goals: " + careerGoals + "<br>";
                    document.getElementById("careerrecords").innerHTML += "Career Assists: " + careerAssists + "<br>";
                    document.getElementById("careerrecords").innerHTML += "Career Points: " + (careerGoals + careerAssists) + "<br>";
                }
            });
        }
    });
}
function getSeasonStats(link) {

}
function getCareerStats(link) {

}
// this function uses a map to convert a player name to their ID number
function getPlayedID(player_name) {

    //create a (very) long map to map player names to player id
    const PlayerMap = new Map([
        ["Wayne Gretzky", 8447400],
        ["Jonathan Bernier", 8473541],
        ["Brendan Smith", 8474090],
        ["Tomas Tatar", 8475193],
        ["Erik Haula", 8475287],
        ["Ondrej Palat", 8476292],
        ["Robbie Russo", 8476418],
        ["Tyler Wotherspoon", 8476452],
        ["Dougie Hamilton", 8476462],
        ["Damon Severson", 8476923],
        ["Brian Pinho", 8477314],
        ["Andreas Johnsson", 8477341],
        ["Mason Geertsen", 8477419],
        ["Miles Wood", 8477425],
        ["Ryan Graves", 8477435],
        ["Vitek Vanecek", 8477970],
        ["Jonas Siegenthaler", 8478399],
        ["Mackenzie Blackwood", 8478406],
        ["John Marino", 8478507],
        ["Jesper Bratt", 8479407],
        ["Nathan Bastian", 8479414],
        ["Michael McLeod", 8479415],
        ["Joseph Gambardella", 8479970],
        ["Nico Hischier", 8480002],
        ["Jesper Boqvist", 8480003],
        ["Reilly Walsh", 8480054],
        ["Fabian Zetterlund", 8480188],
        ["Jack Dugan", 8480225],
        ["Aarne Talvitie", 8480237],
        ["Kevin Bahl", 8480860],
        ["Akira Schmid", 8481033],
        ["Yegor Sharangovich", 8481068],
        ["Jeremy Groleau", 8481208],
        ["Nolan Foote", 8481518],
        ["Nikita Okhotiuk", 8481537],
        ["Jack Hughes", 8481559],
        ["Graeme Clarke", 8481578],
        ["Michael Vukojevic", 8481583],
        ["Tyce Thompson", 8481740],
        ["Nico Daws", 8482076],
        ["Dawson Mercer", 8482110],
        ["Alexander Holtz", 8482125],
        ["Chase Stillman", 8482714],
        ["Topias Vilen", 8482873],
        ["Simon Nemec", 8483495],
        ["Brian Halonen", 8483531],
        ["Zach Parise", 8470610],
        ["Cal Clutterbuck", 8473504],
        ["Semyon Varlamov", 8473575],
        ["Josh Bailey", 8474573],
        ["Matt Martin", 8474709],
        ["Kyle Palmieri", 8475151],
        ["Richard Panik", 8475209],
        ["Casey Cizikas", 8475231],
        ["Anders Lee", 8475314],
        ["Brock Nelson", 8475754],
        ["Andy Andreoff", 8476404],
        ["Jean-Gabriel Pageau", 8476419],
        ["Scott Mayfield", 8476429],
        ["Adam Pelech", 8476917],
        ["Paul LaDue", 8476983],
        ["Hudson Fasching", 8477392],
        ["Ryan Pulock", 8477506],
        ["Ross Johnston", 8477527],
        ["Ilya Sorokin", 8478009],
        ["Cole Bardreau", 8478367],
        ["Mathew Barzal", 8478445],
        ["Anthony Beauvillier", 8478463],
        ["Kenneth Appleby", 8478965],
        ["Kieffer Bellows", 8479356],
        ["Dennis Cholowski", 8479395],
        ["Otto Koivula", 8479526],
        ["Collin Adams", 8479551],
        ["Robin Salo", 8480071],
        ["Jeff Kubiak", 8480102],
        ["Sebastian Aho", 8480222],
        ["Arnaud Durandeau", 8480242],
        ["Grant Hutton", 8480306],
        ["Oliver Wahlstrom", 8480789],
        ["Blade Jenkins", 8480799],
        ["Jakub Skarek", 8480819],
        ["Bode Wilde", 8480826],
        ["Noah Dobson", 8480865],
        ["Jaroslav Halak", 8470860],
        ["Ryan Reaves", 8471817],
        ["Chris Kreider", 8475184],
        ["Jarred Tinordi", 8475797],
        ["Louis Domingue", 8475839],
        ["Vincent Trocheck", 8476389],
        ["Andy Welinski", 8476407],
        ["Mika Zibanejad", 8476459],
        ["Turner Elson", 8476505],
        ["Barclay Goodrow", 8476624],
        ["Jacob Trouba", 8476885],
        ["Jonny Brodzinski", 8477380],
        ["Ryan Carpenter", 8477846],
        ["Igor Shesterkin", 8478048],
        ["Sammy Blais", 8478104],
        ["Dryden Hunt", 8478211],
        ["Artemi Panarin", 8478550],
        ["Adam Fox", 8479323],
        ["Ryan Lindgren", 8479324],
        ["Julien Gauthier", 8479328],
        ["Libor Hajek", 8479333],
        ["Tim Gettinger", 8479364],
        ["Filip Chytil", 8480078],
        ["C.J. Smith", 8480083],
        ["K'Andre Miller", 8480817],
        ["Vitali Kravtsov", 8480833],
        ["Ty Emberson", 8480834],
        ["Nils Lundkvist", 8480878],
        ["Lauri Pajuniemi", 8480986],
        ["Olof Lindbom", 8481015],
        ["Matthew Robertson", 8481525],
        ["Karl Henriksson", 8481548],
        ["Kaapo Kakko", 8481554],
        ["Zac Jones", 8481708],
        ["Patrick Khodorenko", 8482054],
        ["Austin Rueschhoff", 8482065],
        ["Braden Schneider", 8482073],
        ["Alexis Lafrenière", 8482109],
        ["William Cuylle", 8482157],
        ["Dylan Garand", 8482193],
        ["Matt Rempe", 8482460],
        ["Ryder Korczak", 8482656],
        ["Brennan Othmann", 8482747],
        ["Brandon Scanlin", 8483407],
        ["Bobby Trivigno", 8483550],
        ["Gustav Rydahl", 8483607],
        ["Alexander Romanov", 8481014],
        ["Ruslan Iskhakov", 8481016],
        ["Samuel Bolduc", 8481541],
        ["Simon Holmstrom", 8481601],
        ["Reece Newkirk", 8481666],
        ["William Dufour", 8482207],
        ["Aatu Raty", 8482691],
        ["Calle Odelius", 8483498],
        ["Ryan Ellis", 8475176],
        ["Sean Couturier", 8476461],
        ["Justin Braun", 8474027],
        ["James van Riemsdyk", 8474037],
        ["Cam Atkinson", 8474715],
        ["Nicolas Deslauriers", 8475235],
        ["Kevin Connauton", 8475246],
        ["Kevin Hayes", 8475763],
        ["Nick Seeler", 8476372],
        ["Scott Laughton", 8476872],
        ["Troy Grosenick", 8477234],
        ["Rasmus Ristolainen", 8477499],
        ["Patrick Brown", 8477887],
        ["Travis Sanheim", 8477948],
        ["Tony DeAngelo", 8477950],
        ["Louie Belpedio", 8478011],
        ["Max Willman", 8478051],
        ["Felix Sandstrom", 8478433],
        ["Travis Konecny", 8478439],
        ["Cooper Marody", 8478442],
        ["Ivan Provorov", 8478500],
        ["Ivan Fedotov", 8478905],
        ["Adam Brooks", 8478996],
        ["Wade Allison", 8479322],
        ["Carter Hart", 8479394],
        ["Linus Hogberg", 8479534],
        ["Tanner Laczynski", 8479550],
        ["Zack MacEwen", 8479772],
        ["Owen Tippett", 8480015],
        ["Isaac Ratcliffe", 8480019],
        ["Morgan Frost", 8480028],
        ["Noah Cates", 8480220],
        ["Olle Lycksell", 8480245],
        ["Joel Farabee", 8480797],
        ["Adam Ginning", 8480874],
        ["Wyatte Wylie", 8480984],
        ["Samuel Ersson", 8481035],
        ["Egor Zamula", 8481178],
        ["Cooper Zech", 8481428],
        ["Ronnie Attard", 8481521],
        ["Cam York", 8481546],
        ["Bobby Brink", 8481553],
        ["Mason Millman", 8481658],
        ["Tyson Foerster", 8482159],
        ["Zayde Wisdom", 8482161],
        ["Linus Sandin", 8482243],
        ["Elliot Desnoyers", 8482452],
        ["Jackson Cates", 8482654],
        ["Samu Tuomaala", 8482727],
        ["Jon-Randall Avon", 8483010],
        ["Drake Caggiula", 8479465],
        ["Jeff Carter", 8470604],
        ["Evgeni Malkin", 8471215],
        ["Sidney Crosby", 8471675],
        ["Kris Letang", 8471724],
        ["Jeff Petry", 8473507],
        ["Dustin Tokarski", 8474682],
        ["Brian Dumoulin", 8475208],
        ["Jason Zucker", 8475722],
        ["Bryan Rust", 8475810],
        ["Xavier Ouellet", 8476443],
        ["Rickard Rakell", 8476483],
        ["Teddy Blueger", 8476927],
        ["Brock McGinn", 8476934],
        ["Chad Ruhwedel", 8477244],
        ["Jake Guentzel", 8477404],
        ["Tristan Jarry", 8477465],
        ["Kasperi Kapanen", 8477953],
        ["Marcus Pettersson", 8477969],
        ["Mark Friedman", 8478017],
        ["Danton Heinen", 8478046],
        ["Casey DeSmith", 8479193],
        ["Alex Nylander", 8479423],
        ["Ryan Poehling", 8480068],
        ["Jan Rutta", 8480172],
        ["Jonathan Gruden", 8480836],
        ["Ty Smith", 8480883],
        ["Jack St. Ivany", 8481030],
        ["Taylor Gauthier", 8481526],
        ["Sam Poulin", 8481591],
        ["Nathan Legare", 8481594],
        ["Filip Lindberg", 8481758],
        ["Drew O'Connor", 8482055],
        ["Radim Zohorna", 8482241],
        ["Lukas Svejkovsky", 8482449],
        ["Raivis Ansons", 8482456],
        ["Jordan Frasca", 8483000],
        ["Corey Andonovski", 8483394],
        ["Owen Pickering", 8483503],
        ["Colin Swoyer", 8483533],
        ["Ty Glover", 8483535],
        ["Jakub Zboril", 8478415],
        ["Patrice Bergeron", 8470638],
        ["David Krejci", 8471276],
        ["Brad Marchand", 8473419],
        ["Nick Foligno", 8473422],
        ["Craig Smith", 8475225],
        ["Charlie Coyle", 8475745],
        ["Derek Forbort", 8475762],
        ["Chris Wagner", 8475780],
        ["Taylor Hall", 8475791],
        ["Keith Kinkaid", 8476234],
        ["Mike Reilly", 8476422],
        ["Hampus Lindholm", 8476854],
        ["Matt Grzelcyk", 8476891],
        ["Connor Carrick", 8476941],
        ["Linus Ullmark", 8476999],
        ["Connor Clifton", 8477365],
        ["Tomas Nosek", 8477931],
        ["David Pastrnak", 8477956],
        ["Pavel Zacha", 8478401],
        ["A.J. Greer", 8478421],
        ["Brandon Carlo", 8478443],
        ["Jake DeBrusk", 8478498],
        ["Dan Renouf", 8479252],
        ["Charlie McAvoy", 8479325],
        ["Matt Filipe", 8479350],
        ["Trent Frederic", 8479365],
        ["Joona Koppanen", 8479533],
        ["Oskar Steen", 8479546],
        ["Vinni Lettieri", 8479968],
        ["Jack Studnicka", 8480021],
        ["Victor Berglund", 8480264],
        ["Jeremy Swayman", 8480280],
        ["Kyle Keyser", 8480356],
        ["Michael Callahan", 8480828],
        ["Curtis Hall", 8480838],
        ["Jakub Lauko", 8480880],
        ["Samuel Asselin", 8481157],
        ["John Beecher", 8481556],
        ["Nick Wolff", 8482059],
        ["Jack Ahcan", 8482072],
        ["Brett Harrison", 8482739],
        ["Fabian Lysell", 8482763],
        ["Ryan Mast", 8482893],
        ["Marc McLaughlin", 8483397],
        ["Brandon Bussi", 8483548],
        ["Georgii Merkulov", 8483567],
        ["Kai Wissmann", 8483634],
        ["Malcolm Subban", 8476876],
        ["Craig Anderson", 8467950],
        ["Kyle Okposo", 8473449],
        ["Riley Sheahan", 8475772],
        ["Jeff Skinner", 8475784],
        ["Zemgus Girgensons", 8476878],
        ["Vinnie Hinostroza", 8476994],
        ["Sean Malone", 8477391],
        ["Eric Comrie", 8477480],
        ["Alex Tuch", 8477949],
        ["Anders Bjork", 8478075],
        ["Victor Olofsson", 8478109],
        ["Rasmus Asplund", 8479335],
        ["Kale Clague", 8479348],
        ["Brett Murray", 8479419],
        ["Tage Thompson", 8479420],
        ["Casey Fitzgerald", 8479578],
        ["Chase Priskie", 8479597],
        ["Jeremy Davies", 8479602],
        ["Casey Mittelstadt", 8479999],
        ["Henri Jokiharju", 8480035],
        ["Oskari Laaksonen", 8480194],
        ["Jacob Bryson", 8480196],
        ["Linus Weissbach", 8480261],
        ["Mattias Samuelsson", 8480807],
        ["Rasmus Dahlin", 8480839],
        ["Matej Pekar", 8480881],
        ["Lawrence Pilut", 8480935],
        ["Ilya Lyubushkin", 8480950],
        ["Peyton Krebs", 8481522],
        ["Dylan Cozens", 8481528],
        ["Filip Cederqvist", 8481722],
        ["Lukas Rousek", 8481751],
        ["Brandon Biro", 8482061],
        ["Jack Quinn", 8482097],
        ["JJ Peterka", 8482175],
        ["Owen Power", 8482671],
        ["Aleksandr Kisakov", 8482697],
        ["Olivier Nadeau", 8482746],
        ["Josh Bloom", 8482865],
        ["Tyson Kozak", 8482896],
        ["Matthew Savoie", 8483512],
        ["Jonathan Drouin", 8477494],
        ["Sean Monahan", 8477497],
        ["Carey Price", 8471679],
        ["Paul Byron", 8474038],
        ["Evgenii Dadonov", 8474149],
        ["Jake Allen", 8474596],
        ["Mike Hoffman", 8474884],
        ["Chris Wideman", 8475227],
        ["David Savard", 8475233],
        ["Brendan Gallagher", 8475848],
        ["Alex Belzile", 8475968],
        ["Joel Edmundson", 8476441],
        ["Joel Armia", 8476469],
        ["Mike Matheson", 8476875],
        ["Josh Anderson", 8476981],
        ["Madison Bowey", 8477474],
        ["Christian Dvorak", 8477989],
        ["Jake Evans", 8478133],
        ["Sam Montembeault", 8478470],
        ["Rem Pitlick", 8479514],
        ["Michael Pezzetta", 8479543],
        ["Nick Suzuki", 8480018],
        ["Nate Schnarr", 8480026],
        ["Jordan Harris", 8480887],
        ["Jesse Ylonen", 8481058],
        ["Corey Schueneman", 8481461],
        ["Cole Caufield", 8481540],
        ["Justin Barron", 8482111],
        ["Emil Heineman", 8482476],
        ["Filip Mesar", 8483488],
        ["Juraj Slafkovsky", 8483515],
        ["Lucas Condotta", 8483549],
        ["Shane Pinto", 8481596],
        ["Claude Giroux", 8473512],
        ["Nick Holden", 8474207],
        ["Travis Hamonic", 8474612],
        ["Cam Talbot", 8475660],
        ["Austin Watson", 8475766],
        ["Anton Forsberg", 8476341],
        ["Antoine Bibeau", 8477312],
        ["Dillon Heatherington", 8477471],
        ["Jayce Hawryluk", 8477963],
        ["Rourke Chartier", 8478078],
        ["Thomas Chabot", 8478469],
        ["Mathieu Joseph", 8478472],
        ["Jacob Larsson", 8478491],
        ["Alex DeBrincat", 8479337],
        ["Nikita Zaitsev", 8479458],
        ["Dylan Gambrell", 8479580],
        ["Kristians Rubins", 8479729],
        ["Josh Norris", 8480064],
        ["Drake Batherson", 8480208],
        ["Parker Kelly", 8480448],
        ["Brady Tkachuk", 8480801],
        ["Kevin Mandolese", 8480867],
        ["Jacob Bernard-Docker", 8480879],
        ["Cole Reinhardt", 8481133],
        ["Jonathan Aspirot", 8481219],
        ["Jacob Lucchini", 8481422],
        ["Mads Sogaard", 8481544],
        ["Lassi Thomson", 8481575],
        ["Viktor Lodin", 8481657],
        ["Maxence Guenette", 8481679],
        ["Jake Sanderson", 8482105],
        ["Tim Stützle", 8482116],
        ["Roby Jarventie", 8482162],
        ["Artem Zub", 8482245],
        ["Philippe Daoust", 8482458],
        ["Tyler Boucher", 8482674],
        ["Zack Ostapchuk", 8482859],
        ["Tomas Hamara", 8483683],
        ["Matt Murray", 8476899],
        ["Rasmus Sandin", 8480873],
        ["Mark Giordano", 8470966],
        ["Jake Muzzin", 8474162],
        ["Wayne Simmonds", 8474190],
        ["TJ Brodie", 8474673],
        ["Jordie Benn", 8474818],
        ["Kyle Clifford", 8475160],
        ["John Tavares", 8475166],
        ["Calle Jarnkrok", 8475714],
        ["Justin Holl", 8475718],
        ["Morgan Rielly", 8476853],
        ["Alexander Kerfoot", 8477021],
        ["Carl Dahlstrom", 8477472],
        ["William Nylander", 8477939],
        ["Nicolas Aube-Kubel", 8477979],
        ["Michael Bunting", 8478047],
        ["Pierre Engvall", 8478115],
        ["Mitchell Marner", 8478483],
        ["Ilya Samsonov", 8478492],
        ["Denis Malgin", 8478843],
        ["Adam Gaudette", 8478874],
        ["Erik Kallgren", 8478902],
        ["Joey Anderson", 8479315],
        ["Auston Matthews", 8479318],
        ["Joseph Woll", 8479361],
        ["Victor Mete", 8479376],
        ["Timothy Liljegren", 8480043],
        ["David Kampf", 8480144],
        ["Mac Hollowell", 8480439],
        ["Filip Kral", 8480820],
        ["Curtis Douglas", 8480876],
        ["Pontus Holmberg", 8480995],
        ["Pavel Gogolev", 8481113],
        ["Nicholas Robertson", 8481582],
        ["Mikhail Abramov", 8481589],
        ["Mikko Kokkonen", 8481614],
        ["Nicholas Abruzzese", 8481720],
        ["Rodion Amirov", 8482099],
        ["William Villeneuve", 8482174],
        ["Bobby McMann", 8482259],
        ["Axel Rindell", 8482463],
        ["Alex Steeves", 8482634],
        ["Braeden Kressler", 8482741],
        ["Ty Voit", 8482880],
        ["Max Ellis", 8483566],
        ["Dennis Hildeby", 8483710],
        ["Brent Burns", 8470613],
        ["Paul Stastny", 8471669],
        ["Jordan Staal", 8473533],
        ["Max Pacioretty", 8474157],
        ["Jesper Fast", 8475855],
        ["Frederik Andersen", 8475883],
        ["Ryan Dzingel", 8476288],
        ["Stefan Noesen", 8476474],
        ["Brady Skjei", 8476869],
        ["Teuvo Teravainen", 8476882],
        ["Mackenzie MacEachern", 8476907],
        ["Jordan Martinook", 8476921],
        ["Jaccob Slavin", 8476958],
        ["Antti Raanta", 8477293],
        ["Brett Pesce", 8477488],
        ["William Lagesson", 8478021],
        ["Ondrej Kase", 8478131],
        ["Sebastian Aho", 8478427],
        ["Ethan Bear", 8478451],
        ["Lane Pederson", 8478967],
        ["Jalen Chatfield", 8478970],
        ["Cavan Fitzgerald", 8478981],
        ["Zach Sawchenko", 8479313],
        ["Maxime Lajoie", 8479320],
        ["Malte Stromwall", 8479440],
        ["Dylan Coghlan", 8479639],
        ["Stelio Mattheos", 8479989],
        ["Martin Necas", 8480039],
        ["Jesperi Kotkaniemi", 8480829],
        ["Andrei Svechnikov", 8480830],
        ["Jack Drury", 8480835],
        ["Ryan Suzuki", 8481576],
        ["Jamieson Rees", 8481579],
        ["Pyotr Kochetkov", 8481611],
        ["Anttoni Honka", 8481615],
        ["Blake Murray", 8481677],
        ["Tuukka Tieksola", 8481697],
        ["Noel Gunler", 8482080],
        ["Seth Jarvis", 8482093],
        ["Vasiliy Ponomarev", 8482102],
        ["Ronan Seeley", 8482187],
        ["Alexander Pashin", 8482212],
        ["Ville Koivunen", 8482758],
        ["Aleksi Heimosalmi", 8482860],
        ["Marc Staal", 8471686],
        ["Patric Hornqvist", 8471887],
        ["Michael Del Zotto", 8474584],
        ["Zac Dalpe", 8474610],
        ["Radko Gudas", 8475462],
        ["Sergei Bobrovsky", 8475683],
        ["Anthony Bitetto", 8475868],
        ["Nick Cousins", 8476393],
        ["Chris Tierney", 8476919],
        ["Anthony Duclair", 8477407],
        ["Carter Verhaeghe", 8477409],
        ["Aleksander Barkov", 8477493],
        ["Aaron Ekblad", 8477932],
        ["Sam Reinhart", 8477933],
        ["Sam Bennett", 8477935],
        ["Brandon Montour", 8477986],
        ["Gustav Forsling", 8478055],
        ["Colin White", 8478400],
        ["Rudolfs Balcers", 8478870],
        ["Ryan Lomberg", 8479066],
        ["Alex Lyon", 8479312],
        ["Matthew Tkachuk", 8479314],
        ["Connor Bunnaman", 8479382],
        ["Lucas Carlsson", 8479523],
        ["Gerry Mayhew", 8479933],
        ["Max Gildon", 8480059],
        ["Eetu Luostarinen", 8480185],
        ["Calle Sjalin", 8480228],
        ["Serron Noel", 8480856],
        ["Santtu Kinnunen", 8481009],
        ["Logan Hutsko", 8481025],
        ["John Ludvig", 8481206],
        ["Spencer Knight", 8481519],
        ["Nathan Staios", 8481795],
        ["Justin Sourdif", 8482088],
        ["Zachary Uens", 8482098],
        ["Anton Lundell", 8482113],
        ["Henry Bowlby", 8482438],
        ["Evan Nause", 8482734],
        ["Mack Guzda", 8483122],
        ["Anton Levtchi", 8483641],
        ["Carl Hagelin", 8474176],
        ["Nicklas Backstrom", 8473563],
        ["Alex Ovechkin", 8471214],
        ["T.J. Oshie", 8471698],
        ["Lars Eller", 8474189],
        ["John Carlson", 8474590],
        ["Marcus Johansson", 8475149],
        ["Dmitry Orlov", 8475200],
        ["Darcy Kuemper", 8475311],
        ["Nick Jensen", 8475324],
        ["Nic Dowd", 8475343],
        ["Matt Irwin", 8475625],
        ["Evgeny Kuznetsov", 8475744],
        ["Tom Wilson", 8476880],
        ["Erik Gustafsson", 8476979],
        ["Connor Brown", 8477015],
        ["Anthony Mantha", 8477511],
        ["Conor Sheary", 8477839],
        ["Trevor van Riemsdyk", 8477845],
        ["Garnet Hathaway", 8477903],
        ["Dylan Strome", 8478440],
        ["Gabriel Carlsson", 8478506],
        ["Charlie Lindgren", 8479292],
        ["Henrik Borgstrom", 8479404],
        ["Axel Jonsson-Fjallby", 8479536],
        ["Martin Fehervary", 8480796],
        ["Joe Snively", 8481441],
        ["Connor McMichael", 8481580],
        ["Andrew Cogliano", 8471699],
        ["Darren Helm", 8471794],
        ["Erik Johnson", 8473446],
        ["Lukas Sedlak", 8476310],
        ["Josh Manson", 8476312],
        ["Gabriel Landeskog", 8476455],
        ["Brad Hunt", 8476779],
        ["Charles Hudon", 8476948],
        ["Kurtis MacDermid", 8477073],
        ["Anton Blidh", 8477320],
        ["J.T. Compher", 8477456],
        ["Artturi Lehkonen", 8477476],
        ["Nathan MacKinnon", 8477492],
        ["Valeri Nichushkin", 8477501],
        ["Andreas Englund", 8477971],
        ["Josh Jacobs", 8477972],
        ["Jonas Johansson", 8477992],
        ["Devon Toews", 8478038],
        ["Mikko Rantanen", 8478420],
        ["Spencer Smallman", 8478867],
        ["Samuel Girard", 8479398],
        ["Cale Makar", 8480069],
        ["Alexandar Georgiev", 8480382],
        ["Pavel Francouz", 8480925],
        ["Logan O'Connor", 8481186],
        ["Bowen Byram", 8481524],
        ["Alex Newhook", 8481618],
        ["Callahan Burke", 8482250],
        ["Wyatt Aamodt", 8483569],
        ["Ryan McLeod", 8480802],
        ["Mike Smith", 8469608],
        ["Brad Malone", 8474089],
        ["Evander Kane", 8475169],
        ["Tyson Barrie", 8475197],
        ["Calvin Pickard", 8475717],
        ["Greg McKegg", 8475735],
        ["Zach Hyman", 8475786],
        ["Jack Campbell", 8475789],
        ["Ryan Nugent-Hopkins", 8476454],
        ["Seth Griffith", 8476495],
        ["Cody Ceci", 8476879],
        ["Devin Shore", 8476913],
        ["Brett Kulak", 8476967],
        ["Mattias Janmark", 8477406],
        ["Darnell Nurse", 8477498],
        ["Leon Draisaitl", 8477934],
        ["Warren Foegele", 8477998],
        ["Connor McDavid", 8478402],
        ["connor mcdavid", 8478402],
        ["Derek Ryan", 8478585],
        ["Markus Niemelainen", 8479338],
        ["Jesse Puljujarvi", 8479344],
        ["Tyler Benson", 8479347],
        ["Vincent Desharnais", 8479576],
        ["Stuart Skinner", 8479973],
        ["Kailer Yamamoto", 8479977],
        ["Dmitri Samorukov", 8480041],
        ["Evan Bouchard", 8480803],
        ["Philip Broberg", 8481598],
        ["Dylan Holloway", 8482077],
        ["Tucker Poolman", 8477359],
        ["Nils Hoglander", 8481535],
        ["Luke Schenn", 8474568],
        ["Tyler Myers", 8474574],
        ["Oliver Ekman-Larsson", 8475171],
        ["Justin Dowling", 8475413],
        ["J.T. Miller", 8476468],
        ["Phillip Di Giuseppe", 8476858],
        ["Tanner Pearson", 8476871],
        ["Kyle Burroughs", 8477335],
        ["Jason Dickinson", 8477450],
        ["Spencer Martin", 8477484],
        ["Bo Horvat", 8477500],
        ["Curtis Lazar", 8477508],
        ["Thatcher Demko", 8477967],
        ["Dakota Joshua", 8478057],
        ["Travis Dermott", 8478408],
        ["Brock Boeser", 8478444],
        ["Noah Juulsen", 8478454],
        ["Guillaume Brisebois", 8478465],
        ["Christian Wolanin", 8478846],
        ["Conor Garland", 8478856],
        ["William Lockwood", 8479367],
        ["John Stevens", 8479962],
        ["Elias Pettersson", 8480012],
        ["Jack Rathbone", 8480056],
        ["Wyatt Kalynuk", 8480293],
        ["Sheldon Dries", 8480326],
        ["Collin Delia", 8480420],
        ["Quinn Hughes", 8480800],
        ["Jett Woo", 8480808],
        ["Linus Karlsson", 8481024],
        ["Carson Focht", 8481192],
        ["Vasily Podkolzin", 8481617],
        ["Ilya Mikheyev", 8481624],
        ["Arturs Silovs", 8481668],
        ["Karel Plasek", 8481728],
        ["Nils Aman", 8482496],
        ["Danila Klimovich", 8482918],
        ["Arshdeep Bains", 8483395],
        ["Andrei Kuzmenko", 8483808],
        ["Jakob Silfverberg", 8475164],
        ["Kevin Shattenkirk", 8474031],
        ["Adam Henrique", 8474641],
        ["Drew Doughty", 8474563],
        ["Sean Walker", 8480336],
        ["Mikey Anderson", 8479998],
        ["Sean Durzi", 8480434],
        ["Alexander Edler", 8471303],
        ["Anze Kopitar", 8471685],
        ["Jonathan Quick", 8471734],
        ["Phillip Danault", 8476479],
        ["Cal Petersen", 8477361],
        ["Pheonix Copley", 8477831],
        ["Kevin Fiala", 8477942],
        ["Adrian Kempe", 8477960],
        ["Brendan Lemieux", 8477962],
        ["Viktor Arvidsson", 8478042],
        ["Matt Roy", 8478911],
        ["Frederic Allard", 8479329],
        ["Carl Grundstrom", 8479336],
        ["Jacob Moverare", 8479421],
        ["Trevor Moore", 8479675],
        ["Jaret Anderson-Dolan", 8479994],
        ["Gabriel Vilardi", 8480014],
        ["Lias Andersson", 8480072],
        ["Alex Iafallo", 8480113],
        ["Rasmus Kupari", 8480845],
        ["Jacob Ingham", 8480857],
        ["David Hrenak", 8481069],
        ["Tobie Paquette-Bisson", 8481110],
        ["Blake Lizotte", 8481481],
        ["Arthur Kaliyev", 8481560],
        ["Tobias Bjornfot", 8481600],
        ["Jordan Spence", 8481606],
        ["Kim Nousiainen", 8481696],
        ["Andre Lee", 8481732],
        ["Quinton Byfield", 8482124],
        ["Martin Chromiak", 8482160],
        ["Brandt Clarke", 8482730],
        ["Francesco Pinelli", 8482748],
        ["Taylor Ward", 8483406],
        ["Kevin Labanc", 8478099],
        ["Markus Nutivaara", 8478906],
        ["Marc-Edouard Vlasic", 8471709],
        ["James Reimer", 8473503],
        ["Nick Bonino", 8474009],
        ["Logan Couture", 8474053],
        ["Erik Karlsson", 8474578],
        ["Andrew Agozzino", 8475461],
        ["Matt Nieto", 8476442],
        ["Tomas Hertl", 8476881],
        ["Matt Benning", 8476988],
        ["Jaycob Megna", 8477034],
        ["Aaron Dell", 8477180],
        ["Kaapo Kahkonen", 8478039],
        ["CJ Suess", 8478058],
        ["Oskar Lindblom", 8478067],
        ["Timo Meier", 8478414],
        ["Adin Hill", 8478499],
        ["Steven Lorentz", 8478904],
        ["Luke Kunin", 8479316],
        ["Noah Gregor", 8479393],
        ["Jeffrey Viel", 8479705],
        ["Mario Ferraro", 8479983],
        ["Scott Reedy", 8480060],
        ["Radim Simek", 8480160],
        ["Eetu Makiniemi", 8480199],
        ["Max Veronneau", 8480314],
        ["Ryan Merkley", 8480847],
        ["Zachary Emond", 8481002],
        ["Jasper Weatherby", 8481061],
        ["Nico Sturm", 8481477],
        ["Dillon Hamaliuk", 8481549],
        ["Artemi Kniazev", 8481552],
        ["Boone Jenner", 8476432],
        ["Daniil Tarasov", 8480193],
        ["Jakub Voracek", 8474161],
        ["Gustav Nyquist", 8474679],
        ["Erik Gudbranson", 8475790],
        ["Johnny Gaudreau", 8476346],
        ["Sean Kuraly", 8476374],
        ["Brendan Gaunce", 8476867],
        ["Joonas Korpisalo", 8476914],
        ["Elvis Merzlikins", 8478007],
        ["Jack Roslovic", 8478458],
        ["Zach Werenski", 8478460],
        ["Vladislav Gavrikov", 8478882],
        ["Patrik Laine", 8479339],
        ["Andrew Peeke", 8479369],
        ["Jake Bean", 8479402],
        ["Mathieu Olivier", 8479671],
        ["Justin Danforth", 8479941],
        ["Gavin Bayreuther", 8479945],
        ["Emil Bemstrom", 8480205],
        ["Carson Meyer", 8480292],
        ["Trey Fix-Wolansky", 8480441],
        ["Eric Robinson", 8480762],
        ["Liam Foudy", 8480853],
        ["Adam Boqvist", 8480871],
        ["Kirill Marchenko", 8480893],
        ["Tim Berni", 8481072],
        ["Jake Christiansen", 8481161],
        ["Joona Luoto", 8481649],
        ["Tyler Angle", 8481690],
        ["Billy Sweezey", 8482399],
        ["Samuel Knazko", 8482448],
        ["Ole Julian Bjorgvik-Holm", 8482453],
        ["Yegor Chinakhov", 8482475],
        ["Marc-Andre Fleury", 8470594],
        ["Alex Goligoski", 8471274],
        ["Jared Spurgeon", 8474716],
        ["Dmitry Kulikov", 8475179],
        ["Marcus Foligno", 8475220],
        ["Mats Zuccarello", 8475692],
        ["Jon Merrill", 8475750],
        ["Jonas Brodin", 8476463],
        ["Matt Dumba", 8476856],
        ["Ryan Hartman", 8477451],
        ["Frederick Gaudreau", 8477919],
        ["Jacob Middleton", 8478136],
        ["Jordan Greenway", 8478413],
        ["Joel Eriksson Ek", 8478493],
        ["Kirill Kaprizov", 8478864],
        ["Tyson Jost", 8479370],
        ["Filip Gustavsson", 8479406],
        ["Brandon Duhaime", 8479520],
        ["Samuel Walker", 8480267],
        ["Connor Dewar", 8480980],
        ["Matt Boldy", 8481557],
        ["Cole Perfetti", 8482149],
        ["Kristian Vesalainen", 8480005],
        ["Blake Wheeler", 8471218],
        ["Brenden Dillon", 8475455],
        ["Dylan DeMelo", 8476331],
        ["Adam Lowry", 8476392],
        ["Mark Scheifele", 8476460],
        ["Connor Hellebuyck", 8476945],
        ["Dominic Toninato", 8476952],
        ["Ashton Sautner", 8477085],
        ["Nate Schmidt", 8477220],
        ["Saku Maenalanen", 8477357],
        ["Josh Morrissey", 8477504],
        ["Nikolaj Ehlers", 8477940],
        ["Kyle Connor", 8478398],
        ["Jansen Harkins", 8478424],
        ["Kyle Capobianco", 8478476],
        ["Kevin Stenlund", 8478831],
        ["Mason Appleton", 8478891],
        ["Logan Stanley", 8479378],
        ["Pierre-Luc Dubois", 8479400],
        ["David Rittich", 8479496],
        ["Mikhail Berdin", 8479574],
        ["Michael Eyssimont", 8479591],
        ["Dylan Samberg", 8480049],
        ["Neal Pionk", 8480145],
        ["Morgan Barron", 8480289],
        ["Kristian Reichel", 8480443],
        ["Declan Chisholm", 8480990],
        ["David Gustafsson", 8481019],
        ["Simon Lundmark", 8481547],
        ["Brandon Tanev", 8479293],
        ["Jordan Eberle", 8474586],
        ["Justin Schultz", 8474602],
        ["Martin Jones", 8474889],
        ["Jaden Schwartz", 8475768],
        ["Joonas Donskoi", 8475820],
        ["Philipp Grubauer", 8475831],
        ["Max McCormick", 8476323],
        ["Magnus Hellberg", 8476433],
        ["Adam Larsson", 8476457],
        ["Jamie Oleksiak", 8476467],
        ["Yanni Gourde", 8476826],
        ["Chris Driedger", 8476904],
        ["Carson Soucy", 8477369],
        ["John Hayden", 8477401],
        ["Oliver Bjorkstrand", 8477416],
        ["Andre Burakovsky", 8477444],
        ["Gustav Olofsson", 8477467],
        ["Alex Wennberg", 8477505],
        ["Jared McCann", 8477955],
        ["Ryan Donato", 8477987],
        ["Austin Poganski", 8478040],
        ["Vince Dunn", 8478407],
        ["Will Borgen", 8478840],
        ["Cameron Hughes", 8478888],
        ["Joey Daccord", 8478916],
        ["Andrew Poturalski", 8479249],
        ["Carsen Twarynski", 8479358],
        ["Michal Kempny", 8479482],
        ["Kole Lind", 8479986],
        ["Morgan Geekie", 8479987],
        ["Alexander True", 8480384],
        ["Luke Henman", 8480869],
        ["Karson Kuhlman", 8480901],
        ["Brogan Rafferty", 8481479],
        ["Tye Kartye", 8481789],
        ["Matty Beniers", 8482665],
        ["Ryan Winterton", 8482751],
        ["Jesper Froden", 8482834],
        ["Ryker Evans", 8482858],
        ["Jacob Melanson", 8482874],
        ["Shane Wright", 8483524],
        ["Peetro Seppala", 8483599],
        ["Ville Petman", 8483635],
        ["Ville Heinola", 8481572],
        ["Reilly Smith", 8475191],
        ["Laurent Brossoit", 8476316],
        ["Brett Howden", 8479353],
        ["Nolan Patrick", 8479974],
        ["Nicolas Hague", 8479980],
        ["Phil Kessel", 8473548],
        ["Alec Martinez", 8474166],
        ["Alex Pietrangelo", 8474565],
        ["Michael Hutchinson", 8474636],
        ["Brayden McNabb", 8475188],
        ["Robin Lehner", 8475215],
        ["Byron Froese", 8475278],
        ["Mark Stone", 8475913],
        ["William Karlsson", 8476448],
        ["Jonathan Marchessault", 8476539],
        ["Chandler Stephenson", 8476905],
        ["Ben Hutton", 8477018],
        ["Shea Theodore", 8477447],
        ["William Carrier", 8477478],
        ["Michael Amadio", 8478020],
        ["Jack Eichel", 8478403],
        ["Keegan Kolesar", 8478434],
        ["Nicolas Roy", 8478462],
        ["Jake Leschyshyn", 8479991],
        ["Jonas Rondbjerg", 8480007],
        ["Jiri Patera", 8480238],
        ["Logan Thompson", 8480313],
        ["Spencer Foo", 8480330],
        ["Zach Whitecloud", 8480727],
        ["Sheldon Rempal", 8480776],
        ["Ivan Morozov", 8480894],
        ["Connor Corcoran", 8480993],
        ["Paul Cotter", 8481032],
        ["Peter Diliberatore", 8481075],
        ["Isaiah Saville", 8481520],
        ["Pavel Dorofeyev", 8481604],
        ["Layton Ahac", 8481613],
        ["Mason Primeau", 8481664],
        ["Lukas Cormier", 8482141],
        ["Brendan Brisson", 8482153],
        ["Maxim Marushev", 8482473],
        ["Daniil Miromanov", 8482624],
        ["Daniil Chayka", 8482688],
        ["Zach Dean", 8482784],
        ["Sakari Manninen", 8483813],
        ["Henri Nikkanen", 8481695],
        ["Daniel Torgersson", 8482139],
        ["Jeff Malott", 8482408],
        ["Tyrel Bauer", 8482459],
        ["Alex Limoges", 8482639],
        ["Chaz Lucius", 8482780],
        ["Dmitry Kuzmin", 8482920],
        ["Elias Salomonsson", 8483510],
        ["Wyatt Bongiovanni", 8483579],
        ["Oskari Salminen", 8483598],
        ["Josh Dunne", 8482623],
        ["Kent Johnson", 8482660],
        ["Cole Sillinger", 8482705],
        ["Stanislav Svozil", 8482711],
        ["Jet Greaves", 8482982],
        ["David Jiricek", 8483460],
        ["Denton Mateychuk", 8483485],
        ["Nick Blankenburg", 8483565],
        ["Marcus Bjork", 8483620],
        ["Timur Ibragimov", 8481669],
        ["Santeri Hatakka", 8481701],
        ["Brandon Coe", 8482086],
        ["Danil Gushchin", 8482101],
        ["Ozzy Wiesblatt", 8482103],
        ["Thomas Bordeleau", 8482133],
        ["Tristen Robins", 8482181],
        ["Adam Raska", 8482197],
        ["Alexander Barabanov", 8482222],
        ["William Eklund", 8482667],
        ["Nick Cicek", 8482824],
        ["Gannon Laroque", 8482927],
        ["Strauss Mann", 8483582],
        ["Mitchell Russell", 8483618],
        ["Ryan Suter", 8470600],
        ["Joe Pavelski", 8470794],
        ["Anton Khudobin", 8471418],
        ["Jamie Benn", 8473994],
        ["Alexander Petrovic", 8475755],
        ["Tyler Seguin", 8475794],
        ["Scott Wedgewood", 8475809],
        ["Jani Hakanpaa", 8475825],
        ["Colin Miller", 8476525],
        ["Luke Glendening", 8476822],
        ["Radek Faksa", 8476889],
        ["Esa Lindell", 8476902],
        ["Riley Barber", 8477003],
        ["Will Butcher", 8477355],
        ["Joel Hanley", 8477810],
        ["Frederik Olofsson", 8478028],
        ["Roope Hintz", 8478449],
        ["Denis Gurianov", 8478495],
        ["Tanner Kero", 8478528],
        ["Ryan Shea", 8478854],
        ["Joseph Cecconi", 8478863],
        ["Mason Marchment", 8478975],
        ["Riley Tufte", 8479362],
        ["Nick Caamano", 8479381],
        ["Ben Gleason", 8479416],
        ["Fredrik Karlstrom", 8479518],
        ["Rhett Gardner", 8479587],
        ["Miro Heiskanen", 8480036],
        ["Jacob Peterson", 8480216],
        ["Marian Studenic", 8480226],
        ["Oskar Back", 8480840],
        ["Ty Dellandrea", 8480848],
        ["Riley Damiani", 8480988],
        ["Dawson Barteaux", 8480999],
        ["Thomas Harley", 8481581],
        ["Joel Kiviranta", 8481641],
        ["Matej Blumel", 8481712],
        ["Jerad Rosburg", 8482051],
        ["Antonio Stranges", 8482120],
        ["Mavrik Bourque", 8482145],
        ["Remi Poirier", 8482465],
        ["Adam Scheel", 8482642],
        ["Artem Grushnikov", 8482695],
        ["Logan Stankoven", 8482702],
        ["Wyatt Johnston", 8482740],
        ["Francesco Arcuri", 8482891],
        ["Derek Grant", 8474683],
        ["John Moore", 8475186],
        ["Cam Fowler", 8475764],
        ["Sam Carrick", 8475842],
        ["John Klingberg", 8475906],
        ["John Gibson", 8476434],
        ["Ryan Strome", 8476458],
        ["Anthony Stolarz", 8476932],
        ["Danny O'Regan", 8476982],
        ["Justin Kirkland", 8477993],
        ["Chase De Leo", 8478029],
        ["Frank Vatrano", 8478366],
        ["Glenn Gawdin", 8478446],
        ["Colton White", 8478841],
        ["Troy Terry", 8478873],
        ["Olli Juolevi", 8479355],
        ["Max Jones", 8479368],
        ["Josh Mahura", 8479372],
        ["Urho Vaakanainen", 8480001],
        ["Max Comtois", 8480031],
        ["Olle Eriksson Ek", 8480042],
        ["Austin Strand", 8480467],
        ["Isac Lundestrom", 8480806],
        ["Blake McLaughlin", 8480816],
        ["Lukas Dostal", 8480843],
        ["Benoit-Olivier Groulx", 8480870],
        ["Hunter Drew", 8481003],
        ["Axel Andersson", 8481018],
        ["Simon Benoit", 8481122],
        ["Brayden Tracey", 8481530],
        ["Trevor Zegras", 8481533],
        ["Drew Helleson", 8481563],
        ["Bryce Kindopp", 8481815],
        ["Jamie Drysdale", 8482142],
        ["Jacob Perreault", 8482150],
        ["Sasha Pastujov", 8482682],
        ["Olen Zellweger", 8482803],
        ["Josh Lopina", 8482925],
        ["Nathan Gaucher", 8483444],
        ["Pavel Mintyukov", 8483490],
        ["Pavol Regenda", 8483630],
        ["Henrik Rybinski", 8481662],
        ["Hendrix Lapierre", 8482148],
        ["Garin Bjorklund", 8482188],
        ["Alexander Suzdalev", 8483518],
        ["Corey Perry", 8470621],
        ["Brian Elliott", 8470880],
        ["Alex Killorn", 8473986],
        ["Ian Cole", 8474013],
        ["Pat Maroon", 8474034],
        ["Steven Stamkos", 8474564],
        ["Zach Bogosian", 8474567],
        ["Victor Hedman", 8475167],
        ["Nikita Kucherov", 8476453],
        ["Vladislav Namestnikov", 8476480],
        ["Andrei Vasilevskiy", 8476883],
        ["Trevor Carrick", 8476953],
        ["Nicholas Paul", 8477426],
        ["Pierre-Edouard Bellemare", 8477930],
        ["Haydn Fleury", 8477938],
        ["Brayden Point", 8478010],
        ["Erik Cernak", 8478416],
        ["Anthony Cirelli", 8478519],
        ["Philippe Myers", 8479026],
        ["Mikhail Sergachev", 8479410],
        ["Sean Day", 8479413],
        ["Ross Colton", 8479525],
        ["Brandon Hagel", 8479542],
        ["Alex Barré-Boulet", 8479718],
        ["Cal Foote", 8479984],
        ["Grant Mismash", 8480061],
        ["Nick Perbix", 8480246],
        ["Gabriel Fortier", 8480863],
        ["Dmitry Semykin", 8481060],
        ["Maxim Cajkovic", 8481738],
        ["Jack Finley", 8482090],
        ["Jack Thompson", 8482144],
        ["Gage Goncalves", 8482201],
        ["Felix Robert", 8482440],
        ["Jaydon Dureau", 8482454],
        ["Roman Schmidt", 8482693],
        ["Simon Ryfors", 8482818],
        ["Bennett MacArthur", 8483102],
        ["Declan Carlile", 8483398],
        ["Ilya Usau", 8483408],
        ["Lucas Edmonds", 8483437],
        ["Connor Murphy", 8476473],
        ["Jujhar Khaira", 8476915],
        ["Jack Johnson", 8471677],
        ["Alex Stalock", 8471774],
        ["Jonathan Toews", 8473604],
        ["Patrick Kane", 8474141],
        ["Tyler Johnson", 8474870],
        ["Petr Mrazek", 8475852],
        ["Colin Blackwell", 8476278],
        ["Jake McCabe", 8476931],
        ["Andreas Athanasiou", 8476960],
        ["Buddy Robinson", 8477210],
        ["Seth Jones", 8477495],
        ["Max Domi", 8477503],
        ["Sam Lafferty", 8478043],
        ["Luke Philp", 8478224],
        ["Caleb Jones", 8478452],
        ["Brett Seney", 8478881],
        ["Boris Katchouk", 8479383],
        ["Riley Stillman", 8479388],
        ["Taylor Raddysh", 8479390],
        ["MacKenzie Entwistle", 8480025],
        ["Evan Barratt", 8480066],
        ["Ian Mitchell", 8480070],
        ["Jakub Galvas", 8480231],
        ["Cole Guttman", 8480252],
        ["Philipp Kurashev", 8480798],
        ["Nicolas Beaudin", 8480814],
        ["Alec Regula", 8480831],
        ["Josiah Slavin", 8481004],
        ["Reese Johnson", 8481147],
        ["Alex Vlasic", 8481568],
        ["Michal Teply", 8481616],
        ["Louis Crevier", 8481806],
        ["Lukas Reichel", 8482117],
        ["Isaak Phillips", 8482192],
        ["Mike Hardman", 8482635],
        ["Nolan Allan", 8482700],
        ["Colton Dach", 8482703],
        ["Ethan Del Mastro", 8482807],
        ["Arvid Soderblom", 8482821],
        ["Jakub Pour", 8482835],
        ["Jalen Luypen", 8482903],
        ["Kevin Korchinski", 8483466],
        ["Jaxson Stauber", 8483530],
        ["Filip Roos", 8483619],
        ["Robby Fabbri", 8477952],
        ["Steven Kampfer", 8474000],
        ["David Perron", 8474102],
        ["Ben Chiarot", 8475279],
        ["Mark Pysyk", 8475796],
        ["Olli Maatta", 8476874],
        ["Oskar Sundqvist", 8476897],
        ["Jussi Olkinuora", 8477236],
        ["Dominik Kubalik", 8477330],
        ["Andrew Copp", 8477429],
        ["Adam Erne", 8477454],
        ["Robert Hagg", 8477462],
        ["Tyler Bertuzzi", 8477479],
        ["Jordan Oesterle", 8477851],
        ["Jakub Vrana", 8477944],
        ["Dylan Larkin", 8477946],
        ["Alex Nedeljkovic", 8477968],
        ["Jake Walman", 8478013],
        ["Ville Husso", 8478024],
        ["Austin Czarnik", 8478512],
        ["Givani Smith", 8479379],
        ["Filip Hronek", 8479425],
        ["Matt Luff", 8479644],
        ["Michael Rasmussen", 8479992],
        ["Gustav Lindstrom", 8480184],
        ["Pius Suter", 8480459],
        ["Filip Zadina", 8480821],
        ["Moritz Seider", 8481542],
        ["Albert Johansson", 8481607],
        ["Elmer Soderblom", 8481725],
        ["Lucas Raymond", 8482078],
        ["Ryan McDonagh", 8474151],
        ["Roman Josi", 8474600],
        ["Mark Borowiecki", 8474697],
        ["Thomas Greiss", 8471306],
        ["Robert Bortuzzo", 8474145],
        ["Marco Scandella", 8474618],
        ["Luke Witkowski", 8474722],
        ["Ryan O'Reilly", 8475158],
        ["Brayden Schenn", 8475170],
        ["Nick Leddy", 8475181],
        ["Justin Faulk", 8475753],
        ["Vladimir Tarasenko", 8475765],
        ["Josh Leivo", 8476410],
        ["Jordan Binnington", 8476412],
        ["Brandon Saad", 8476438],
        ["Torey Krug", 8476792],
        ["Colton Parayko", 8476892],
        ["Martin Frk", 8476924],
        ["Pavel Buchnevich", 8477402],
        ["Nathan Walker", 8477573],
        ["Ivan Barbashev", 8477964],
        ["Anthony Angello", 8478074],
        ["Noel Acciari", 8478569],
        ["Niko Mikkola", 8478859],
        ["Logan Brown", 8479366],
        ["William Bitten", 8479375],
        ["Jordan Kyrou", 8479385],
        ["Robert Thomas", 8480023],
        ["Alexey Toropchenko", 8480281],
        ["Brady Lyle", 8480404],
        ["Scott Perunovich", 8481059],
        ["Dylan McLaughlin", 8481429],
        ["Vadim Zherenko", 8481689],
        ["Matthew Kessel", 8482516],
        ["Adam Ruzicka", 8480008],
        ["Trevor Lewis", 8473453],
        ["Milan Lucic", 8473473],
        ["Mikael Backlund", 8474150],
        ["Jacob Markstrom", 8474593],
        ["Nazem Kadri", 8475172],
        ["Christopher Tanev", 8475690],
        ["Tyler Toffoli", 8475726],
        ["Blake Coleman", 8476399],
        ["Jonathan Huberdeau", 8476456],
        ["Oscar Dansk", 8476861],
        ["MacKenzie Weegar", 8477346],
        ["Elias Lindholm", 8477496],
        ["Nikita Zadorov", 8477507],
        ["Clark Bishop", 8478056],
        ["Andrew Mangiapane", 8478233],
        ["Noah Hanifin", 8478396],
        ["Rasmus Andersson", 8478397],
        ["Oliver Kylington", 8478430],
        ["Dan Vladar", 8478435],
        ["Nicolas Meloche", 8478467],
        ["Dennis Gilbert", 8478502],
        ["Kevin Rooney", 8479291],
        ["Dillon Dube", 8479346],
        ["Matthew Phillips", 8479547],
        ["Juuso Valimaki", 8479976],
        ["Nick DeSimone", 8480084],
        ["Ben Jones", 8480259],
        ["Martin Pospisil", 8481028],
        ["Mathias Emilio Pettersen", 8481041],
        ["Ilya Nikolaev", 8481590],
        ["Cole Schwindt", 8481655],
        ["Colton Poolman", 8482066],
        ["Connor Mackey", 8482067],
        ["Yan Kuznetsov", 8482165],
        ["Jeremie Poirier", 8482173],
        ["Rory Kerins", 8482209],
        ["Ilya Solovyov", 8482470],
        ["Adam Klapka", 8483609],
        ["Matt Duchene", 8475168],
        ["Mattias Ekholm", 8475218],
        ["Ryan Johansen", 8475793],
        ["Mikael Granlund", 8475798],
        ["Nino Niederreiter", 8475799],
        ["Kevin Gravel", 8475857],
        ["Mark Jankowski", 8476873],
        ["Filip Forsberg", 8476887],
        ["Colton Sissons", 8476925],
        ["Juuse Saros", 8477424],
        ["Michael McCarron", 8477446],
        ["Zach Sanford", 8477482],
        ["Roland McKeown", 8477981],
        ["Thomas Novak", 8478438],
        ["Jeremy Lauzon", 8478468],
        ["Yakov Trenin", 8478508],
        ["Alexandre Carrier", 8478851],
        ["Connor Ingram", 8478971],
        ["Dante Fabbro", 8479371],
        ["Markus Nurmi", 8479544],
        ["Tanner Jeannot", 8479661],
        ["Cody Glass", 8479996],
        ["Eeli Tolvanen", 8480009],
        ["Tomas Vomacka", 8480233],
        ["Kiefer Sherwood", 8480748],
        ["Jordan Gross", 8480913],
        ["Kevin Lankinen", 8480947],
        ["Jachym Kondelik", 8481029],
        ["Spencer Stastney", 8481056],
        ["John Leonard", 8481077],
        ["Jimmy Huntington", 8481228],
        ["Philip Tomasino", 8481577],
        ["Egor Afanasyev", 8481585],
        ["Juuso Parssinen", 8481704],
        ["Marc Del Gaizo", 8481743],
        ["Navrin Mutter", 8481817],
        ["Cole Smith", 8482062],
        ["Luke Prokop", 8482091],
        ["Yaroslav Askarov", 8482137],
        ["Luke Evangelista", 8482146],
        ["Devin Cooley", 8482445],
        ["Adam Wilsby", 8482482],
        ["Zachary L'Heureux", 8482742],
        ["Jack Matier", 8482808],
        ["Eemil Viro", 8482163],
        ["Simon Edvinsson", 8482762],
        ["Pontus Andreasson", 8483608],
    ]);

    var id = PlayerMap.get(player_name);
    return id;
}
// this function converts a country code (e.g. DEU)
// to the full country name (e.g. Germany)
function getCountry(country_code) {

    const countries_names = new Map([
        ["CAN", "Canada"],
        ["FIN", "Finland"],
        ["SWE", "Sweden"],
        ["USA", "United States of America"],
        ["CZE", "Czechia"],
        ["DEU", "Germany"],
        ["SVK", "Slovakia"],
        ["CHE", "Switzerland"],
        ["AUT", "Austria"],
        ["RUS", "Russia"],
        ["LVA", "Latvia"]
    ]);

    var country_name = countries_names.get(country_code);

    var countries = ["Canada", "Sweden", "Finland", "United States of America", "Czechia", 
    "Germany", "Slovakia", "Switzerland", "Austria", "Latvia", "Russia"];

    if (countries.includes(country_name)) {
        return country_name;
    } else {
        return "EARTH";
    }
}