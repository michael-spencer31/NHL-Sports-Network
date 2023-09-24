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

console.warn = () => {};
console.clear();

// jquery method to wait for a click
$("#rosterdata").click(function(event) {
    var text;
    text = $(event.target).text();
    getPlayerData(text);
})

function getPlayerData(player) {

    var id = getPlayedID(player.toUpperCase());

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

        document.getElementById("playerinfo").innerHTML = "";

        var number = player_data.people[0].primaryNumber;

        if (number !== undefined) {
            document.getElementById("playerinfo").innerHTML = "#" + number + " ";
        }
        document.getElementById("playerinfo").innerHTML += player + " | ";
        document.getElementById("playerinfo").innerHTML += "Birthplace: " + player_data.people[0].birthCity + ", "
        var country = getCountry(player_data.people[0].birthCountry);
        document.getElementById("playerinfo").innerHTML += country + " ";
        document.getElementById("playerinfo").innerHTML += "<img src='Flags/" + country + ".png' width=30><br>"; 
        document.getElementById("playerinfo").innerHTML += "GP: " + player_data.people[0].stats[0].splits[0].stat.games + " ";

        var goals = player_data.people[0].stats[0].splits[0].stat.goals;
        var assists = player_data.people[0].stats[0].splits[0].stat.assists;

        if (goals !== undefined || assists !== undefined) {

            document.getElementById("playerinfo").innerHTML += "Goals: " + goals + " ";
            document.getElementById("playerinfo").innerHTML += "Assists: " + assists + " ";
        } 
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
        ["Ottawa Senators", 9],
        ["Toronto Maple Leafs", 10],
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

    var result = "";
    for (var i = 0; i < player_ids.length; i++) {
        result = result + "<label>" + player_names[i] + "</label> | ";
    }
    document.getElementById("rosterdata").innerHTML = result;
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
 * games can be in one of three states - final, live or preview
 * 
 * toronto
 * tampa 
 * florida
 * ottawa
 * boston
 * detriot
 * buffalo
 * montreal
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
            return;
        }
        //start to loop through all the games on the given day
        for (var i = 0; i < games; i++) {
            //set up variables for the winning team and number of goals
            var winningTeam = "";
            var winningGoals = "";
            var loosingGoals = "";
            var gameStatus = scheduleData.dates[0].games[i].status.abstractGameState;

            let awayot = 0;
            let homeot = 0;

            // fixes games (mostly playoff) that showed overtime records as 'undefined'
            if (scheduleData.dates[0].games[i].teams.away.leagueRecord.ot != undefined) {
                awayot = scheduleData.dates[0].games[i].teams.away.leagueRecord.ot;
            } 
            
            if (scheduleData.dates[0].games[i].teams.home.leagueRecord.ot != undefined) {
                homeot = scheduleData.dates[0].games[i].teams.home.leagueRecord.ot
            }

            if (gameStatus == "Final") {

                //determine which team won the game (i.e. score more goals)
                if (
                    scheduleData.dates[0].games[i].teams.away.score >
                    scheduleData.dates[0].games[i].teams.home.score
                ) {
                    winningTeam = scheduleData.dates[0].games[i].teams.away.team.name;
                    winningGoals = scheduleData.dates[0].games[i].teams.away.score;
                    loosingGoals = scheduleData.dates[0].games[i].teams.home.score;
                } else {
                    winningTeam = scheduleData.dates[0].games[i].teams.home.team.name;
                    winningGoals = scheduleData.dates[0].games[i].teams.home.score;
                    loosingGoals = scheduleData.dates[0].games[i].teams.away.score;
                }
                
                // this block bolds the score of the team that won the game
                if (scheduleData.dates[0].games[i].teams.away.score > scheduleData.dates[0].games[i].teams.home.score) {
                    datedisplay.innerHTML += `<b> ${scheduleData.dates[0].games[i].teams.away.score} </b>`;
                } else {
                    datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.score;
                }

                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.away.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.team.name + "(" + scheduleData.dates[0].games[i].teams.away.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.away.leagueRecord.losses + "," + awayot + ")" + "<br>";

                if (scheduleData.dates[0].games[i].teams.home.score > scheduleData.dates[0].games[i].teams.away.score) {
                    datedisplay.innerHTML += `<b> ${scheduleData.dates[0].games[i].teams.home.score} </b>`;
                } else {
                    datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.score;
                }

                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.home.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.team.name + "(" + scheduleData.dates[0].games[i].teams.home.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.home.leagueRecord.losses + "," + homeot + ")" + "<br>";

                var recap_link = getRecap(scheduleData.dates[0].games[i].gamePk);

                datedisplay.innerHTML += winningGoals + "-" + loosingGoals + " " + winningTeam + " (Final) " + '<a href="' + recap_link + '"target=_blank">Video Recap</a><br><br>';
            } else if (gameStatus == "Live") {

                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.score;
                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.away.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.team.name + "<br>";

                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.score;
                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.home.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.team.name + "<br>";

                document.getElementById("datedisplay").innerHTML += "(Live)" + "<br><br>";

            } else if (gameStatus == "Preview") {

                console.log(scheduleData);

                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.away.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.away.team.name + "(" + scheduleData.dates[0].games[i].teams.away.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.away.leagueRecord.losses + "," + awayot + ")" + "<br>";

                datedisplay.innerHTML += "<img src='Logos/" + scheduleData.dates[0].games[i].teams.home.team.name + ".png' width=30>";
                datedisplay.innerHTML += scheduleData.dates[0].games[i].teams.home.team.name + "(" + scheduleData.dates[0].games[i].teams.home.leagueRecord.wins + "," + scheduleData.dates[0].games[i].teams.home.leagueRecord.losses + "," + homeot + ")" + "<br>";

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
                document.getElementById("datedisplay").innerHTML += " " + timeString12hr + " (Preview)" + "<br><br>";
            } else {
                //if the game has already started, just print out a blank line
                document.getElementById("datedisplay").innerHTML += "<br>";
            }
        }
    });
}

function getRecap (gameid) {

    var url = "https://statsapi.web.nhl.com/api/v1/game/" + gameid + "/content";

    var link;
    $.ajax({
        url: url,
        method: "GET",
        async: false
    }).done(function(game_data) {

        // console.log(game_data);
        link = game_data.editorial.recap.items[0].media.playbacks[0].url;

    });
    return link;

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

    // A2 A3 M2 M3 max(A1, M1) WC2 min(A1, M1) WC1

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
    input = input.toUpperCase();
    
    var playerIDNum = getPlayedID(input);
    
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
        } else {
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

    var currentYear = new Date().getFullYear();
    console.log(currentYear);

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
//Temp123!
// this function uses a map to convert a player name to their ID number
function getPlayedID(player_name) {

    //create a (very) long map to map player names to player id
    //this map mostly includes active NHL players and may not have ids for very new retired players
    //this is a limitation with the api itself. looking for a workaroud.
    const PlayerMap = new Map([
        ["WAYNE GRETZKY", 8447400],
        ["JONATHAN BERNIER", 8473541],
        ["BRENDAN SMITH", 8474090],
        ["TOMAS TATAR", 8475193],
        ["ERIK HAULA", 8475287],
        ["ONDREJ PALAT", 8476292],
        ["ROBBIE RUSSO", 8476418],
        ["TYLER WOTHERSPOON", 8476452],
        ["DOUGIE HAMILTON", 8476462],
        ["DAMON SEVERSON", 8476923],
        ["BRIAN PINHO", 8477314],
        ["ANDREAS JOHNSSON", 8477341],
        ["MASON GEERTSEN", 8477419],
        ["MILES WOOD", 8477425],
        ["RYAN GRAVES", 8477435],
        ["VITEK VANECEK", 8477970],
        ["JONAS SIEGENTHALER", 8478399],
        ["MACKENZIE BLACKWOOD", 8478406],
        ["JOHN MARINO", 8478507],
        ["JESPER BRATT", 8479407],
        ["NATHAN BASTIAN", 8479414],
        ["MICHAEL MCLEOD", 8479415],
        ["JOSEPH GAMBARDELLA", 8479970],
        ["NICO HISCHIER", 8480002],
        ["JESPER BOQVIST", 8480003],
        ["REILLY WALSH", 8480054],
        ["FABIAN ZETTERLUND", 8480188],
        ["JACK DUGAN", 8480225],
        ["AARNE TALVITIE", 8480237],
        ["KEVIN BAHL", 8480860],
        ["AKIRA SCHMID", 8481033],
        ["YEGOR SHARANGOVICH", 8481068],
        ["JEREMY GROLEAU", 8481208],
        ["NOLAN FOOTE", 8481518],
        ["NIKITA OKHOTIUK", 8481537],
        ["JACK HUGHES", 8481559],
        ["GRAEME CLARKE", 8481578],
        ["MICHAEL VUKOJEVIC", 8481583],
        ["TYCE THOMPSON", 8481740],
        ["NICO DAWS", 8482076],
        ["DAWSON MERCER", 8482110],
        ["ALEXANDER HOLTZ", 8482125],
        ["CHASE STILLMAN", 8482714],
        ["TOPIAS VILEN", 8482873],
        ["SIMON NEMEC", 8483495],
        ["BRIAN HALONEN", 8483531],
        ["ZACH PARISE", 8470610],
        ["CAL CLUTTERBUCK", 8473504],
        ["SEMYON VARLAMOV", 8473575],
        ["JOSH BAILEY", 8474573],
        ["MATT MARTIN", 8474709],
        ["KYLE PALMIERI", 8475151],
        ["RICHARD PANIK", 8475209],
        ["CASEY CIZIKAS", 8475231],
        ["ANDERS LEE", 8475314],
        ["BROCK NELSON", 8475754],
        ["ANDY ANDREOFF", 8476404],
        ["JEAN-GABRIEL PAGEAU", 8476419],
        ["SCOTT MAYFIELD", 8476429],
        ["ADAM PELECH", 8476917],
        ["PAUL LADUE", 8476983],
        ["HUDSON FASCHING", 8477392],
        ["RYAN PULOCK", 8477506],
        ["ROSS JOHNSTON", 8477527],
        ["ILYA SOROKIN", 8478009],
        ["COLE BARDREAU", 8478367],
        ["MATHEW BARZAL", 8478445],
        ["ANTHONY BEAUVILLIER", 8478463],
        ["KENNETH APPLEBY", 8478965],
        ["KIEFFER BELLOWS", 8479356],
        ["DENNIS CHOLOWSKI", 8479395],
        ["OTTO KOIVULA", 8479526],
        ["COLLIN ADAMS", 8479551],
        ["ROBIN SALO", 8480071],
        ["JEFF KUBIAK", 8480102],
        ["SEBASTIAN AHO", 8480222],
        ["ARNAUD DURANDEAU", 8480242],
        ["GRANT HUTTON", 8480306],
        ["OLIVER WAHLSTROM", 8480789],
        ["BLADE JENKINS", 8480799],
        ["JAKUB SKAREK", 8480819],
        ["BODE WILDE", 8480826],
        ["NOAH DOBSON", 8480865],
        ["JAROSLAV HALAK", 8470860],
        ["RYAN REAVES", 8471817],
        ["CHRIS KREIDER", 8475184],
        ["JARRED TINORDI", 8475797],
        ["LOUIS DOMINGUE", 8475839],
        ["VINCENT TROCHECK", 8476389],
        ["ANDY WELINSKI", 8476407],
        ["MIKA ZIBANEJAD", 8476459],
        ["TURNER ELSON", 8476505],
        ["BARCLAY GOODROW", 8476624],
        ["JACOB TROUBA", 8476885],
        ["JONNY BRODZINSKI", 8477380],
        ["RYAN CARPENTER", 8477846],
        ["IGOR SHESTERKIN", 8478048],
        ["SAMMY BLAIS", 8478104],
        ["DRYDEN HUNT", 8478211],
        ["ARTEMI PANARIN", 8478550],
        ["ADAM FOX", 8479323],
        ["RYAN LINDGREN", 8479324],
        ["JULIEN GAUTHIER", 8479328],
        ["LIBOR HAJEK", 8479333],
        ["TIM GETTINGER", 8479364],
        ["FILIP CHYTIL", 8480078],
        ["C.J. SMITH", 8480083],
        ["K'ANDRE MILLER", 8480817],
        ["VITALI KRAVTSOV", 8480833],
        ["TY EMBERSON", 8480834],
        ["NILS LUNDKVIST", 8480878],
        ["LAURI PAJUNIEMI", 8480986],
        ["OLOF LINDBOM", 8481015],
        ["MATTHEW ROBERTSON", 8481525],
        ["KARL HENRIKSSON", 8481548],
        ["KAAPO KAKKO", 8481554],
        ["ZAC JONES", 8481708],
        ["PATRICK KHODORENKO", 8482054],
        ["AUSTIN RUESCHHOFF", 8482065],
        ["BRADEN SCHNEIDER", 8482073],
        ["ALEXIS LAFRENIÈRE", 8482109],
        ["WILLIAM CUYLLE", 8482157],
        ["DYLAN GARAND", 8482193],
        ["MATT REMPE", 8482460],
        ["RYDER KORCZAK", 8482656],
        ["BRENNAN OTHMANN", 8482747],
        ["BRANDON SCANLIN", 8483407],
        ["BOBBY TRIVIGNO", 8483550],
        ["GUSTAV RYDAHL", 8483607],
        ["ALEXANDER ROMANOV", 8481014],
        ["RUSLAN ISKHAKOV", 8481016],
        ["SAMUEL BOLDUC", 8481541],
        ["SIMON HOLMSTROM", 8481601],
        ["REECE NEWKIRK", 8481666],
        ["WILLIAM DUFOUR", 8482207],
        ["AATU RATY", 8482691],
        ["CALLE ODELIUS", 8483498],
        ["RYAN ELLIS", 8475176],
        ["SEAN COUTURIER", 8476461],
        ["JUSTIN BRAUN", 8474027],
        ["JAMES VAN RIEMSDYK", 8474037],
        ["CAM ATKINSON", 8474715],
        ["NICOLAS DESLAURIERS", 8475235],
        ["KEVIN CONNAUTON", 8475246],
        ["KEVIN HAYES", 8475763],
        ["NICK SEELER", 8476372],
        ["SCOTT LAUGHTON", 8476872],
        ["TROY GROSENICK", 8477234],
        ["RASMUS RISTOLAINEN", 8477499],
        ["PATRICK BROWN", 8477887],
        ["TRAVIS SANHEIM", 8477948],
        ["TONY DEANGELO", 8477950],
        ["LOUIE BELPEDIO", 8478011],
        ["MAX WILLMAN", 8478051],
        ["FELIX SANDSTROM", 8478433],
        ["TRAVIS KONECNY", 8478439],
        ["COOPER MARODY", 8478442],
        ["IVAN PROVOROV", 8478500],
        ["IVAN FEDOTOV", 8478905],
        ["ADAM BROOKS", 8478996],
        ["WADE ALLISON", 8479322],
        ["CARTER HART", 8479394],
        ["LINUS HOGBERG", 8479534],
        ["TANNER LACZYNSKI", 8479550],
        ["ZACK MACEWEN", 8479772],
        ["OWEN TIPPETT", 8480015],
        ["ISAAC RATCLIFFE", 8480019],
        ["MORGAN FROST", 8480028],
        ["NOAH CATES", 8480220],
        ["OLLE LYCKSELL", 8480245],
        ["JOEL FARABEE", 8480797],
        ["ADAM GINNING", 8480874],
        ["WYATTE WYLIE", 8480984],
        ["SAMUEL ERSSON", 8481035],
        ["EGOR ZAMULA", 8481178],
        ["COOPER ZECH", 8481428],
        ["RONNIE ATTARD", 8481521],
        ["CAM YORK", 8481546],
        ["BOBBY BRINK", 8481553],
        ["MASON MILLMAN", 8481658],
        ["TYSON FOERSTER", 8482159],
        ["ZAYDE WISDOM", 8482161],
        ["LINUS SANDIN", 8482243],
        ["ELLIOT DESNOYERS", 8482452],
        ["JACKSON CATES", 8482654],
        ["SAMU TUOMAALA", 8482727],
        ["JON-RANDALL AVON", 8483010],
        ["DRAKE CAGGIULA", 8479465],
        ["JEFF CARTER", 8470604],
        ["EVGENI MALKIN", 8471215],
        ["SIDNEY CROSBY", 8471675],
        ["KRIS LETANG", 8471724],
        ["JEFF PETRY", 8473507],
        ["DUSTIN TOKARSKI", 8474682],
        ["BRIAN DUMOULIN", 8475208],
        ["JASON ZUCKER", 8475722],
        ["BRYAN RUST", 8475810],
        ["XAVIER OUELLET", 8476443],
        ["RICKARD RAKELL", 8476483],
        ["TEDDY BLUEGER", 8476927],
        ["BROCK MCGINN", 8476934],
        ["CHAD RUHWEDEL", 8477244],
        ["JAKE GUENTZEL", 8477404],
        ["TRISTAN JARRY", 8477465],
        ["KASPERI KAPANEN", 8477953],
        ["MARCUS PETTERSSON", 8477969],
        ["MARK FRIEDMAN", 8478017],
        ["DANTON HEINEN", 8478046],
        ["CASEY DESMITH", 8479193],
        ["ALEX NYLANDER", 8479423],
        ["RYAN POEHLING", 8480068],
        ["JAN RUTTA", 8480172],
        ["JONATHAN GRUDEN", 8480836],
        ["TY SMITH", 8480883],
        ["JACK ST. IVANY", 8481030],
        ["TAYLOR GAUTHIER", 8481526],
        ["SAM POULIN", 8481591],
        ["NATHAN LEGARE", 8481594],
        ["FILIP LINDBERG", 8481758],
        ["DREW O'CONNOR", 8482055],
        ["RADIM ZOHORNA", 8482241],
        ["LUKAS SVEJKOVSKY", 8482449],
        ["RAIVIS ANSONS", 8482456],
        ["JORDAN FRASCA", 8483000],
        ["COREY ANDONOVSKI", 8483394],
        ["OWEN PICKERING", 8483503],
        ["COLIN SWOYER", 8483533],
        ["TY GLOVER", 8483535],
        ["JAKUB ZBORIL", 8478415],
        ["PATRICE BERGERON", 8470638],
        ["DAVID KREJCI", 8471276],
        ["BRAD MARCHAND", 8473419],
        ["NICK FOLIGNO", 8473422],
        ["CRAIG SMITH", 8475225],
        ["CHARLIE COYLE", 8475745],
        ["DEREK FORBORT", 8475762],
        ["CHRIS WAGNER", 8475780],
        ["TAYLOR HALL", 8475791],
        ["KEITH KINKAID", 8476234],
        ["MIKE REILLY", 8476422],
        ["HAMPUS LINDHOLM", 8476854],
        ["MATT GRZELCYK", 8476891],
        ["CONNOR CARRICK", 8476941],
        ["LINUS ULLMARK", 8476999],
        ["CONNOR CLIFTON", 8477365],
        ["TOMAS NOSEK", 8477931],
        ["DAVID PASTRNAK", 8477956],
        ["PAVEL ZACHA", 8478401],
        ["A.J. GREER", 8478421],
        ["BRANDON CARLO", 8478443],
        ["JAKE DEBRUSK", 8478498],
        ["DAN RENOUF", 8479252],
        ["CHARLIE MCAVOY", 8479325],
        ["MATT FILIPE", 8479350],
        ["TRENT FREDERIC", 8479365],
        ["JOONA KOPPANEN", 8479533],
        ["OSKAR STEEN", 8479546],
        ["VINNI LETTIERI", 8479968],
        ["JACK STUDNICKA", 8480021],
        ["VICTOR BERGLUND", 8480264],
        ["JEREMY SWAYMAN", 8480280],
        ["KYLE KEYSER", 8480356],
        ["MICHAEL CALLAHAN", 8480828],
        ["CURTIS HALL", 8480838],
        ["JAKUB LAUKO", 8480880],
        ["SAMUEL ASSELIN", 8481157],
        ["JOHN BEECHER", 8481556],
        ["NICK WOLFF", 8482059],
        ["JACK AHCAN", 8482072],
        ["BRETT HARRISON", 8482739],
        ["FABIAN LYSELL", 8482763],
        ["RYAN MAST", 8482893],
        ["MARC MCLAUGHLIN", 8483397],
        ["BRANDON BUSSI", 8483548],
        ["GEORGII MERKULOV", 8483567],
        ["KAI WISSMANN", 8483634],
        ["MALCOLM SUBBAN", 8476876],
        ["CRAIG ANDERSON", 8467950],
        ["KYLE OKPOSO", 8473449],
        ["RILEY SHEAHAN", 8475772],
        ["JEFF SKINNER", 8475784],
        ["ZEMGUS GIRGENSONS", 8476878],
        ["VINNIE HINOSTROZA", 8476994],
        ["SEAN MALONE", 8477391],
        ["ERIC COMRIE", 8477480],
        ["ALEX TUCH", 8477949],
        ["ANDERS BJORK", 8478075],
        ["VICTOR OLOFSSON", 8478109],
        ["RASMUS ASPLUND", 8479335],
        ["KALE CLAGUE", 8479348],
        ["BRETT MURRAY", 8479419],
        ["TAGE THOMPSON", 8479420],
        ["CASEY FITZGERALD", 8479578],
        ["CHASE PRISKIE", 8479597],
        ["JEREMY DAVIES", 8479602],
        ["CASEY MITTELSTADT", 8479999],
        ["HENRI JOKIHARJU", 8480035],
        ["OSKARI LAAKSONEN", 8480194],
        ["JACOB BRYSON", 8480196],
        ["LINUS WEISSBACH", 8480261],
        ["MATTIAS SAMUELSSON", 8480807],
        ["RASMUS DAHLIN", 8480839],
        ["MATEJ PEKAR", 8480881],
        ["LAWRENCE PILUT", 8480935],
        ["ILYA LYUBUSHKIN", 8480950],
        ["PEYTON KREBS", 8481522],
        ["DYLAN COZENS", 8481528],
        ["FILIP CEDERQVIST", 8481722],
        ["LUKAS ROUSEK", 8481751],
        ["BRANDON BIRO", 8482061],
        ["JACK QUINN", 8482097],
        ["JJ PETERKA", 8482175],
        ["OWEN POWER", 8482671],
        ["ALEKSANDR KISAKOV", 8482697],
        ["OLIVIER NADEAU", 8482746],
        ["JOSH BLOOM", 8482865],
        ["TYSON KOZAK", 8482896],
        ["MATTHEW SAVOIE", 8483512],
        ["JONATHAN DROUIN", 8477494],
        ["SEAN MONAHAN", 8477497],
        ["CAREY PRICE", 8471679],
        ["PAUL BYRON", 8474038],
        ["EVGENII DADONOV", 8474149],
        ["JAKE ALLEN", 8474596],
        ["MIKE HOFFMAN", 8474884],
        ["CHRIS WIDEMAN", 8475227],
        ["DAVID SAVARD", 8475233],
        ["BRENDAN GALLAGHER", 8475848],
        ["ALEX BELZILE", 8475968],
        ["JOEL EDMUNDSON", 8476441],
        ["JOEL ARMIA", 8476469],
        ["MIKE MATHESON", 8476875],
        ["JOSH ANDERSON", 8476981],
        ["MADISON BOWEY", 8477474],
        ["CHRISTIAN DVORAK", 8477989],
        ["JAKE EVANS", 8478133],
        ["SAM MONTEMBEAULT", 8478470],
        ["REM PITLICK", 8479514],
        ["MICHAEL PEZZETTA", 8479543],
        ["NICK SUZUKI", 8480018],
        ["NATE SCHNARR", 8480026],
        ["JORDAN HARRIS", 8480887],
        ["JESSE YLONEN", 8481058],
        ["COREY SCHUENEMAN", 8481461],
        ["COLE CAUFIELD", 8481540],
        ["JUSTIN BARRON", 8482111],
        ["EMIL HEINEMAN", 8482476],
        ["FILIP MESAR", 8483488],
        ["JURAJ SLAFKOVSKY", 8483515],
        ["LUCAS CONDOTTA", 8483549],
        ["SHANE PINTO", 8481596],
        ["CLAUDE GIROUX", 8473512],
        ["NICK HOLDEN", 8474207],
        ["TRAVIS HAMONIC", 8474612],
        ["CAM TALBOT", 8475660],
        ["AUSTIN WATSON", 8475766],
        ["ANTON FORSBERG", 8476341],
        ["ANTOINE BIBEAU", 8477312],
        ["DILLON HEATHERINGTON", 8477471],
        ["JAYCE HAWRYLUK", 8477963],
        ["ROURKE CHARTIER", 8478078],
        ["THOMAS CHABOT", 8478469],
        ["MATHIEU JOSEPH", 8478472],
        ["JACOB LARSSON", 8478491],
        ["ALEX DEBRINCAT", 8479337],
        ["NIKITA ZAITSEV", 8479458],
        ["DYLAN GAMBRELL", 8479580],
        ["KRISTIANS RUBINS", 8479729],
        ["JOSH NORRIS", 8480064],
        ["DRAKE BATHERSON", 8480208],
        ["PARKER KELLY", 8480448],
        ["BRADY TKACHUK", 8480801],
        ["KEVIN MANDOLESE", 8480867],
        ["JACOB BERNARD-DOCKER", 8480879],
        ["COLE REINHARDT", 8481133],
        ["JONATHAN ASPIROT", 8481219],
        ["JACOB LUCCHINI", 8481422],
        ["MADS SOGAARD", 8481544],
        ["LASSI THOMSON", 8481575],
        ["VIKTOR LODIN", 8481657],
        ["MAXENCE GUENETTE", 8481679],
        ["JAKE SANDERSON", 8482105],
        ["TIM STÜTZLE", 8482116],
        ["ROBY JARVENTIE", 8482162],
        ["ARTEM ZUB", 8482245],
        ["PHILIPPE DAOUST", 8482458],
        ["TYLER BOUCHER", 8482674],
        ["ZACK OSTAPCHUK", 8482859],
        ["TOMAS HAMARA", 8483683],
        ["MATT MURRAY", 8476899],
        ["RASMUS SANDIN", 8480873],
        ["MARK GIORDANO", 8470966],
        ["JAKE MUZZIN", 8474162],
        ["WAYNE SIMMONDS", 8474190],
        ["TJ BRODIE", 8474673],
        ["JORDIE BENN", 8474818],
        ["KYLE CLIFFORD", 8475160],
        ["JOHN TAVARES", 8475166],
        ["CALLE JARNKROK", 8475714],
        ["JUSTIN HOLL", 8475718],
        ["MORGAN RIELLY", 8476853],
        ["ALEXANDER KERFOOT", 8477021],
        ["CARL DAHLSTROM", 8477472],
        ["WILLIAM NYLANDER", 8477939],
        ["NICOLAS AUBE-KUBEL", 8477979],
        ["MICHAEL BUNTING", 8478047],
        ["PIERRE ENGVALL", 8478115],
        ["MITCHELL MARNER", 8478483],
        ["ILYA SAMSONOV", 8478492],
        ["DENIS MALGIN", 8478843],
        ["ADAM GAUDETTE", 8478874],
        ["ERIK KALLGREN", 8478902],
        ["JOEY ANDERSON", 8479315],
        ["AUSTON MATTHEWS", 8479318],
        ["JOSEPH WOLL", 8479361],
        ["VICTOR METE", 8479376],
        ["TIMOTHY LILJEGREN", 8480043],
        ["DAVID KAMPF", 8480144],
        ["MAC HOLLOWELL", 8480439],
        ["FILIP KRAL", 8480820],
        ["CURTIS DOUGLAS", 8480876],
        ["PONTUS HOLMBERG", 8480995],
        ["PAVEL GOGOLEV", 8481113],
        ["NICHOLAS ROBERTSON", 8481582],
        ["MIKHAIL ABRAMOV", 8481589],
        ["MIKKO KOKKONEN", 8481614],
        ["NICHOLAS ABRUZZESE", 8481720],
        ["RODION AMIROV", 8482099],
        ["WILLIAM VILLENEUVE", 8482174],
        ["BOBBY MCMANN", 8482259],
        ["AXEL RINDELL", 8482463],
        ["ALEX STEEVES", 8482634],
        ["BRAEDEN KRESSLER", 8482741],
        ["TY VOIT", 8482880],
        ["MAX ELLIS", 8483566],
        ["DENNIS HILDEBY", 8483710],
        ["BRENT BURNS", 8470613],
        ["PAUL STASTNY", 8471669],
        ["JORDAN STAAL", 8473533],
        ["MAX PACIORETTY", 8474157],
        ["JESPER FAST", 8475855],
        ["FREDERIK ANDERSEN", 8475883],
        ["RYAN DZINGEL", 8476288],
        ["STEFAN NOESEN", 8476474],
        ["BRADY SKJEI", 8476869],
        ["TEUVO TERAVAINEN", 8476882],
        ["MACKENZIE MACEACHERN", 8476907],
        ["JORDAN MARTINOOK", 8476921],
        ["JACCOB SLAVIN", 8476958],
        ["ANTTI RAANTA", 8477293],
        ["BRETT PESCE", 8477488],
        ["WILLIAM LAGESSON", 8478021],
        ["ONDREJ KASE", 8478131],
        ["SEBASTIAN AHO", 8478427],
        ["ETHAN BEAR", 8478451],
        ["LANE PEDERSON", 8478967],
        ["JALEN CHATFIELD", 8478970],
        ["CAVAN FITZGERALD", 8478981],
        ["ZACH SAWCHENKO", 8479313],
        ["MAXIME LAJOIE", 8479320],
        ["MALTE STROMWALL", 8479440],
        ["DYLAN COGHLAN", 8479639],
        ["STELIO MATTHEOS", 8479989],
        ["MARTIN NECAS", 8480039],
        ["JESPERI KOTKANIEMI", 8480829],
        ["ANDREI SVECHNIKOV", 8480830],
        ["JACK DRURY", 8480835],
        ["RYAN SUZUKI", 8481576],
        ["JAMIESON REES", 8481579],
        ["PYOTR KOCHETKOV", 8481611],
        ["ANTTONI HONKA", 8481615],
        ["BLAKE MURRAY", 8481677],
        ["TUUKKA TIEKSOLA", 8481697],
        ["NOEL GUNLER", 8482080],
        ["SETH JARVIS", 8482093],
        ["VASILIY PONOMAREV", 8482102],
        ["RONAN SEELEY", 8482187],
        ["ALEXANDER PASHIN", 8482212],
        ["VILLE KOIVUNEN", 8482758],
        ["ALEKSI HEIMOSALMI", 8482860],
        ["MARC STAAL", 8471686],
        ["PATRIC HORNQVIST", 8471887],
        ["MICHAEL DEL ZOTTO", 8474584],
        ["ZAC DALPE", 8474610],
        ["RADKO GUDAS", 8475462],
        ["SERGEI BOBROVSKY", 8475683],
        ["ANTHONY BITETTO", 8475868],
        ["NICK COUSINS", 8476393],
        ["CHRIS TIERNEY", 8476919],
        ["ANTHONY DUCLAIR", 8477407],
        ["CARTER VERHAEGHE", 8477409],
        ["ALEKSANDER BARKOV", 8477493],
        ["AARON EKBLAD", 8477932],
        ["SAM REINHART", 8477933],
        ["SAM BENNETT", 8477935],
        ["BRANDON MONTOUR", 8477986],
        ["GUSTAV FORSLING", 8478055],
        ["COLIN WHITE", 8478400],
        ["RUDOLFS BALCERS", 8478870],
        ["RYAN LOMBERG", 8479066],
        ["ALEX LYON", 8479312],
        ["CONNOR BEDARD", 8484144],
        ["MATTHEW TKACHUK", 8479314],
        ["CONNOR BUNNAMAN", 8479382],
        ["LUCAS CARLSSON", 8479523],
        ["GERRY MAYHEW", 8479933],
        ["MAX GILDON", 8480059],
        ["EETU LUOSTARINEN", 8480185],
        ["CALLE SJALIN", 8480228],
        ["SERRON NOEL", 8480856],
        ["SANTTU KINNUNEN", 8481009],
        ["LOGAN HUTSKO", 8481025],
        ["JOHN LUDVIG", 8481206],
        ["SPENCER KNIGHT", 8481519],
        ["NATHAN STAIOS", 8481795],
        ["JUSTIN SOURDIF", 8482088],
        ["ZACHARY UENS", 8482098],
        ["ANTON LUNDELL", 8482113],
        ["HENRY BOWLBY", 8482438],
        ["EVAN NAUSE", 8482734],
        ["MACK GUZDA", 8483122],
        ["ANTON LEVTCHI", 8483641],
        ["CARL HAGELIN", 8474176],
        ["NICKLAS BACKSTROM", 8473563],
        ["ALEX OVECHKIN", 8471214],
        ["T.J. OSHIE", 8471698],
        ["LARS ELLER", 8474189],
        ["JOHN CARLSON", 8474590],
        ["MARCUS JOHANSSON", 8475149],
        ["DMITRY ORLOV", 8475200],
        ["DARCY KUEMPER", 8475311],
        ["NICK JENSEN", 8475324],
        ["NIC DOWD", 8475343],
        ["MATT IRWIN", 8475625],
        ["EVGENY KUZNETSOV", 8475744],
        ["TOM WILSON", 8476880],
        ["ERIK GUSTAFSSON", 8476979],
        ["CONNOR BROWN", 8477015],
        ["ANTHONY MANTHA", 8477511],
        ["CONOR SHEARY", 8477839],
        ["TREVOR VAN RIEMSDYK", 8477845],
        ["GARNET HATHAWAY", 8477903],
        ["DYLAN STROME", 8478440],
        ["GABRIEL CARLSSON", 8478506],
        ["CHARLIE LINDGREN", 8479292],
        ["HENRIK BORGSTROM", 8479404],
        ["AXEL JONSSON-FJALLBY", 8479536],
        ["MARTIN FEHERVARY", 8480796],
        ["JOE SNIVELY", 8481441],
        ["CONNOR MCMICHAEL", 8481580],
        ["ANDREW COGLIANO", 8471699],
        ["DARREN HELM", 8471794],
        ["ERIK JOHNSON", 8473446],
        ["LUKAS SEDLAK", 8476310],
        ["JOSH MANSON", 8476312],
        ["GABRIEL LANDESKOG", 8476455],
        ["BRAD HUNT", 8476779],
        ["CHARLES HUDON", 8476948],
        ["KURTIS MACDERMID", 8477073],
        ["ANTON BLIDH", 8477320],
        ["J.T. COMPHER", 8477456],
        ["ARTTURI LEHKONEN", 8477476],
        ["NATHAN MACKINNON", 8477492],
        ["VALERI NICHUSHKIN", 8477501],
        ["ANDREAS ENGLUND", 8477971],
        ["JOSH JACOBS", 8477972],
        ["JONAS JOHANSSON", 8477992],
        ["DEVON TOEWS", 8478038],
        ["MIKKO RANTANEN", 8478420],
        ["SPENCER SMALLMAN", 8478867],
        ["SAMUEL GIRARD", 8479398],
        ["CALE MAKAR", 8480069],
        ["ALEXANDAR GEORGIEV", 8480382],
        ["PAVEL FRANCOUZ", 8480925],
        ["LOGAN O'CONNOR", 8481186],
        ["BOWEN BYRAM", 8481524],
        ["ALEX NEWHOOK", 8481618],
        ["CALLAHAN BURKE", 8482250],
        ["WYATT AAMODT", 8483569],
        ["RYAN MCLEOD", 8480802],
        ["MIKE SMITH", 8469608],
        ["BRAD MALONE", 8474089],
        ["EVANDER KANE", 8475169],
        ["TYSON BARRIE", 8475197],
        ["CALVIN PICKARD", 8475717],
        ["GREG MCKEGG", 8475735],
        ["ZACH HYMAN", 8475786],
        ["JACK CAMPBELL", 8475789],
        ["RYAN NUGENT-HOPKINS", 8476454],
        ["JURAJ SLAFKOVSKY", 8483515],
        ["SETH GRIFFITH", 8476495],
        ["CODY CECI", 8476879],
        ["DEVIN SHORE", 8476913],
        ["BRETT KULAK", 8476967],
        ["MATTIAS JANMARK", 8477406],
        ["DARNELL NURSE", 8477498],
        ["LEON DRAISAITL", 8477934],
        ["WARREN FOEGELE", 8477998],
        ["CONNOR MCDAVID", 8478402],
        ["CONNOR MCDAVID", 8478402],
        ["DEREK RYAN", 8478585],
        ["MARKUS NIEMELAINEN", 8479338],
        ["JESSE PULJUJARVI", 8479344],
        ["TYLER BENSON", 8479347],
        ["VINCENT DESHARNAIS", 8479576],
        ["STUART SKINNER", 8479973],
        ["KAILER YAMAMOTO", 8479977],
        ["DMITRI SAMORUKOV", 8480041],
        ["EVAN BOUCHARD", 8480803],
        ["PHILIP BROBERG", 8481598],
        ["DYLAN HOLLOWAY", 8482077],
        ["TUCKER POOLMAN", 8477359],
        ["NILS HOGLANDER", 8481535],
        ["LUKE SCHENN", 8474568],
        ["TYLER MYERS", 8474574],
        ["OLIVER EKMAN-LARSSON", 8475171],
        ["JUSTIN DOWLING", 8475413],
        ["J.T. MILLER", 8476468],
        ["PHILLIP DI GIUSEPPE", 8476858],
        ["TANNER PEARSON", 8476871],
        ["KYLE BURROUGHS", 8477335],
        ["JASON DICKINSON", 8477450],
        ["SPENCER MARTIN", 8477484],
        ["BO HORVAT", 8477500],
        ["CURTIS LAZAR", 8477508],
        ["THATCHER DEMKO", 8477967],
        ["DAKOTA JOSHUA", 8478057],
        ["TRAVIS DERMOTT", 8478408],
        ["BROCK BOESER", 8478444],
        ["NOAH JUULSEN", 8478454],
        ["GUILLAUME BRISEBOIS", 8478465],
        ["CHRISTIAN WOLANIN", 8478846],
        ["CONOR GARLAND", 8478856],
        ["WILLIAM LOCKWOOD", 8479367],
        ["JOHN STEVENS", 8479962],
        ["ELIAS PETTERSSON", 8480012],
        ["JACK RATHBONE", 8480056],
        ["WYATT KALYNUK", 8480293],
        ["SHELDON DRIES", 8480326],
        ["COLLIN DELIA", 8480420],
        ["QUINN HUGHES", 8480800],
        ["JETT WOO", 8480808],
        ["LINUS KARLSSON", 8481024],
        ["CARSON FOCHT", 8481192],
        ["VASILY PODKOLZIN", 8481617],
        ["ILYA MIKHEYEV", 8481624],
        ["ARTURS SILOVS", 8481668],
        ["KAREL PLASEK", 8481728],
        ["NILS AMAN", 8482496],
        ["DANILA KLIMOVICH", 8482918],
        ["ARSHDEEP BAINS", 8483395],
        ["ANDREI KUZMENKO", 8483808],
        ["JAKOB SILFVERBERG", 8475164],
        ["KEVIN SHATTENKIRK", 8474031],
        ["ADAM HENRIQUE", 8474641],
        ["DREW DOUGHTY", 8474563],
        ["SEAN WALKER", 8480336],
        ["MIKEY ANDERSON", 8479998],
        ["SEAN DURZI", 8480434],
        ["ALEXANDER EDLER", 8471303],
        ["ANZE KOPITAR", 8471685],
        ["JONATHAN QUICK", 8471734],
        ["PHILLIP DANAULT", 8476479],
        ["CAL PETERSEN", 8477361],
        ["PHEONIX COPLEY", 8477831],
        ["KEVIN FIALA", 8477942],
        ["ADRIAN KEMPE", 8477960],
        ["BRENDAN LEMIEUX", 8477962],
        ["VIKTOR ARVIDSSON", 8478042],
        ["MATT ROY", 8478911],
        ["FREDERIC ALLARD", 8479329],
        ["CARL GRUNDSTROM", 8479336],
        ["JACOB MOVERARE", 8479421],
        ["TREVOR MOORE", 8479675],
        ["JARET ANDERSON-DOLAN", 8479994],
        ["GABRIEL VILARDI", 8480014],
        ["LIAS ANDERSSON", 8480072],
        ["ALEX IAFALLO", 8480113],
        ["RASMUS KUPARI", 8480845],
        ["JACOB INGHAM", 8480857],
        ["DAVID HRENAK", 8481069],
        ["TOBIE PAQUETTE-BISSON", 8481110],
        ["BLAKE LIZOTTE", 8481481],
        ["ARTHUR KALIYEV", 8481560],
        ["TOBIAS BJORNFOT", 8481600],
        ["JORDAN SPENCE", 8481606],
        ["KIM NOUSIAINEN", 8481696],
        ["ANDRE LEE", 8481732],
        ["QUINTON BYFIELD", 8482124],
        ["MARTIN CHROMIAK", 8482160],
        ["BRANDT CLARKE", 8482730],
        ["FRANCESCO PINELLI", 8482748],
        ["TAYLOR WARD", 8483406],
        ["KEVIN LABANC", 8478099],
        ["MARKUS NUTIVAARA", 8478906],
        ["MARC-EDOUARD VLASIC", 8471709],
        ["JAMES REIMER", 8473503],
        ["NICK BONINO", 8474009],
        ["LOGAN COUTURE", 8474053],
        ["ERIK KARLSSON", 8474578],
        ["ANDREW AGOZZINO", 8475461],
        ["MATT NIETO", 8476442],
        ["TOMAS HERTL", 8476881],
        ["MATT BENNING", 8476988],
        ["JAYCOB MEGNA", 8477034],
        ["AARON DELL", 8477180],
        ["KAAPO KAHKONEN", 8478039],
        ["CJ SUESS", 8478058],
        ["OSKAR LINDBLOM", 8478067],
        ["TIMO MEIER", 8478414],
        ["ADIN HILL", 8478499],
        ["STEVEN LORENTZ", 8478904],
        ["LUKE KUNIN", 8479316],
        ["NOAH GREGOR", 8479393],
        ["JEFFREY VIEL", 8479705],
        ["MARIO FERRARO", 8479983],
        ["SCOTT REEDY", 8480060],
        ["RADIM SIMEK", 8480160],
        ["EETU MAKINIEMI", 8480199],
        ["MAX VERONNEAU", 8480314],
        ["RYAN MERKLEY", 8480847],
        ["ZACHARY EMOND", 8481002],
        ["JASPER WEATHERBY", 8481061],
        ["NICO STURM", 8481477],
        ["DILLON HAMALIUK", 8481549],
        ["ARTEMI KNIAZEV", 8481552],
        ["BOONE JENNER", 8476432],
        ["DANIIL TARASOV", 8480193],
        ["JAKUB VORACEK", 8474161],
        ["GUSTAV NYQUIST", 8474679],
        ["ERIK GUDBRANSON", 8475790],
        ["JOHNNY GAUDREAU", 8476346],
        ["SEAN KURALY", 8476374],
        ["BRENDAN GAUNCE", 8476867],
        ["JOONAS KORPISALO", 8476914],
        ["ELVIS MERZLIKINS", 8478007],
        ["JACK ROSLOVIC", 8478458],
        ["ZACH WERENSKI", 8478460],
        ["VLADISLAV GAVRIKOV", 8478882],
        ["PATRIK LAINE", 8479339],
        ["ANDREW PEEKE", 8479369],
        ["JAKE BEAN", 8479402],
        ["MATHIEU OLIVIER", 8479671],
        ["JUSTIN DANFORTH", 8479941],
        ["GAVIN BAYREUTHER", 8479945],
        ["EMIL BEMSTROM", 8480205],
        ["CARSON MEYER", 8480292],
        ["TREY FIX-WOLANSKY", 8480441],
        ["ERIC ROBINSON", 8480762],
        ["LIAM FOUDY", 8480853],
        ["ADAM BOQVIST", 8480871],
        ["KIRILL MARCHENKO", 8480893],
        ["TIM BERNI", 8481072],
        ["JAKE CHRISTIANSEN", 8481161],
        ["JOONA LUOTO", 8481649],
        ["TYLER ANGLE", 8481690],
        ["BILLY SWEEZEY", 8482399],
        ["SAMUEL KNAZKO", 8482448],
        ["OLE JULIAN BJORGVIK-HOLM", 8482453],
        ["YEGOR CHINAKHOV", 8482475],
        ["MARC-ANDRE FLEURY", 8470594],
        ["ALEX GOLIGOSKI", 8471274],
        ["JARED SPURGEON", 8474716],
        ["DMITRY KULIKOV", 8475179],
        ["MARCUS FOLIGNO", 8475220],
        ["MATS ZUCCARELLO", 8475692],
        ["JON MERRILL", 8475750],
        ["JONAS BRODIN", 8476463],
        ["MATT DUMBA", 8476856],
        ["RYAN HARTMAN", 8477451],
        ["FREDERICK GAUDREAU", 8477919],
        ["JACOB MIDDLETON", 8478136],
        ["JORDAN GREENWAY", 8478413],
        ["JOEL ERIKSSON EK", 8478493],
        ["KIRILL KAPRIZOV", 8478864],
        ["TYSON JOST", 8479370],
        ["FILIP GUSTAVSSON", 8479406],
        ["BRANDON DUHAIME", 8479520],
        ["SAMUEL WALKER", 8480267],
        ["CONNOR DEWAR", 8480980],
        ["MATT BOLDY", 8481557],
        ["COLE PERFETTI", 8482149],
        ["KRISTIAN VESALAINEN", 8480005],
        ["BLAKE WHEELER", 8471218],
        ["BRENDEN DILLON", 8475455],
        ["DYLAN DEMELO", 8476331],
        ["ADAM LOWRY", 8476392],
        ["MARK SCHEIFELE", 8476460],
        ["CONNOR HELLEBUYCK", 8476945],
        ["DOMINIC TONINATO", 8476952],
        ["ASHTON SAUTNER", 8477085],
        ["NATE SCHMIDT", 8477220],
        ["SAKU MAENALANEN", 8477357],
        ["JOSH MORRISSEY", 8477504],
        ["NIKOLAJ EHLERS", 8477940],
        ["KYLE CONNOR", 8478398],
        ["JANSEN HARKINS", 8478424],
        ["KYLE CAPOBIANCO", 8478476],
        ["KEVIN STENLUND", 8478831],
        ["MASON APPLETON", 8478891],
        ["LOGAN STANLEY", 8479378],
        ["PIERRE-LUC DUBOIS", 8479400],
        ["DAVID RITTICH", 8479496],
        ["MIKHAIL BERDIN", 8479574],
        ["MICHAEL EYSSIMONT", 8479591],
        ["DYLAN SAMBERG", 8480049],
        ["NEAL PIONK", 8480145],
        ["MORGAN BARRON", 8480289],
        ["KRISTIAN REICHEL", 8480443],
        ["DECLAN CHISHOLM", 8480990],
        ["DAVID GUSTAFSSON", 8481019],
        ["SIMON LUNDMARK", 8481547],
        ["BRANDON TANEV", 8479293],
        ["JORDAN EBERLE", 8474586],
        ["JUSTIN SCHULTZ", 8474602],
        ["MARTIN JONES", 8474889],
        ["JADEN SCHWARTZ", 8475768],
        ["JOONAS DONSKOI", 8475820],
        ["PHILIPP GRUBAUER", 8475831],
        ["MAX MCCORMICK", 8476323],
        ["MAGNUS HELLBERG", 8476433],
        ["ADAM LARSSON", 8476457],
        ["JAMIE OLEKSIAK", 8476467],
        ["YANNI GOURDE", 8476826],
        ["CHRIS DRIEDGER", 8476904],
        ["CARSON SOUCY", 8477369],
        ["JOHN HAYDEN", 8477401],
        ["OLIVER BJORKSTRAND", 8477416],
        ["ANDRE BURAKOVSKY", 8477444],
        ["GUSTAV OLOFSSON", 8477467],
        ["ALEX WENNBERG", 8477505],
        ["JARED MCCANN", 8477955],
        ["RYAN DONATO", 8477987],
        ["AUSTIN POGANSKI", 8478040],
        ["VINCE DUNN", 8478407],
        ["WILL BORGEN", 8478840],
        ["CAMERON HUGHES", 8478888],
        ["JOEY DACCORD", 8478916],
        ["ANDREW POTURALSKI", 8479249],
        ["CARSEN TWARYNSKI", 8479358],
        ["MICHAL KEMPNY", 8479482],
        ["KOLE LIND", 8479986],
        ["MORGAN GEEKIE", 8479987],
        ["ALEXANDER TRUE", 8480384],
        ["LUKE HENMAN", 8480869],
        ["KARSON KUHLMAN", 8480901],
        ["BROGAN RAFFERTY", 8481479],
        ["TYE KARTYE", 8481789],
        ["MATTY BENIERS", 8482665],
        ["RYAN WINTERTON", 8482751],
        ["JESPER FRODEN", 8482834],
        ["RYKER EVANS", 8482858],
        ["JACOB MELANSON", 8482874],
        ["SHANE WRIGHT", 8483524],
        ["PEETRO SEPPALA", 8483599],
        ["VILLE PETMAN", 8483635],
        ["VILLE HEINOLA", 8481572],
        ["REILLY SMITH", 8475191],
        ["LAURENT BROSSOIT", 8476316],
        ["BRETT HOWDEN", 8479353],
        ["NOLAN PATRICK", 8479974],
        ["NICOLAS HAGUE", 8479980],
        ["PHIL KESSEL", 8473548],
        ["ALEC MARTINEZ", 8474166],
        ["ALEX PIETRANGELO", 8474565],
        ["MICHAEL HUTCHINSON", 8474636],
        ["BRAYDEN MCNABB", 8475188],
        ["ROBIN LEHNER", 8475215],
        ["BYRON FROESE", 8475278],
        ["MARK STONE", 8475913],
        ["WILLIAM KARLSSON", 8476448],
        ["JONATHAN MARCHESSAULT", 8476539],
        ["CHANDLER STEPHENSON", 8476905],
        ["BEN HUTTON", 8477018],
        ["SHEA THEODORE", 8477447],
        ["WILLIAM CARRIER", 8477478],
        ["MICHAEL AMADIO", 8478020],
        ["JACK EICHEL", 8478403],
        ["KEEGAN KOLESAR", 8478434],
        ["NICOLAS ROY", 8478462],
        ["JAKE LESCHYSHYN", 8479991],
        ["JONAS RONDBJERG", 8480007],
        ["JIRI PATERA", 8480238],
        ["LOGAN THOMPSON", 8480313],
        ["SPENCER FOO", 8480330],
        ["ZACH WHITECLOUD", 8480727],
        ["SHELDON REMPAL", 8480776],
        ["IVAN MOROZOV", 8480894],
        ["CONNOR CORCORAN", 8480993],
        ["PAUL COTTER", 8481032],
        ["PETER DILIBERATORE", 8481075],
        ["ISAIAH SAVILLE", 8481520],
        ["PAVEL DOROFEYEV", 8481604],
        ["LAYTON AHAC", 8481613],
        ["MASON PRIMEAU", 8481664],
        ["LUKAS CORMIER", 8482141],
        ["BRENDAN BRISSON", 8482153],
        ["MAXIM MARUSHEV", 8482473],
        ["DANIIL MIROMANOV", 8482624],
        ["DANIIL CHAYKA", 8482688],
        ["ZACH DEAN", 8482784],
        ["SAKARI MANNINEN", 8483813],
        ["HENRI NIKKANEN", 8481695],
        ["DANIEL TORGERSSON", 8482139],
        ["JEFF MALOTT", 8482408],
        ["TYREL BAUER", 8482459],
        ["ALEX LIMOGES", 8482639],
        ["CHAZ LUCIUS", 8482780],
        ["DMITRY KUZMIN", 8482920],
        ["ELIAS SALOMONSSON", 8483510],
        ["WYATT BONGIOVANNI", 8483579],
        ["OSKARI SALMINEN", 8483598],
        ["JOSH DUNNE", 8482623],
        ["KENT JOHNSON", 8482660],
        ["COLE SILLINGER", 8482705],
        ["STANISLAV SVOZIL", 8482711],
        ["JET GREAVES", 8482982],
        ["DAVID JIRICEK", 8483460],
        ["DENTON MATEYCHUK", 8483485],
        ["NICK BLANKENBURG", 8483565],
        ["MARCUS BJORK", 8483620],
        ["TIMUR IBRAGIMOV", 8481669],
        ["SANTERI HATAKKA", 8481701],
        ["BRANDON COE", 8482086],
        ["DANIL GUSHCHIN", 8482101],
        ["OZZY WIESBLATT", 8482103],
        ["THOMAS BORDELEAU", 8482133],
        ["TRISTEN ROBINS", 8482181],
        ["ADAM RASKA", 8482197],
        ["ALEXANDER BARABANOV", 8482222],
        ["WILLIAM EKLUND", 8482667],
        ["NICK CICEK", 8482824],
        ["GANNON LAROQUE", 8482927],
        ["STRAUSS MANN", 8483582],
        ["MITCHELL RUSSELL", 8483618],
        ["RYAN SUTER", 8470600],
        ["JOE PAVELSKI", 8470794],
        ["ANTON KHUDOBIN", 8471418],
        ["JAMIE BENN", 8473994],
        ["ALEXANDER PETROVIC", 8475755],
        ["TYLER SEGUIN", 8475794],
        ["SCOTT WEDGEWOOD", 8475809],
        ["JANI HAKANPAA", 8475825],
        ["COLIN MILLER", 8476525],
        ["LUKE GLENDENING", 8476822],
        ["RADEK FAKSA", 8476889],
        ["ESA LINDELL", 8476902],
        ["RILEY BARBER", 8477003],
        ["WILL BUTCHER", 8477355],
        ["JOEL HANLEY", 8477810],
        ["FREDERIK OLOFSSON", 8478028],
        ["ROOPE HINTZ", 8478449],
        ["DENIS GURIANOV", 8478495],
        ["TANNER KERO", 8478528],
        ["RYAN SHEA", 8478854],
        ["JOSEPH CECCONI", 8478863],
        ["MASON MARCHMENT", 8478975],
        ["RILEY TUFTE", 8479362],
        ["NICK CAAMANO", 8479381],
        ["BEN GLEASON", 8479416],
        ["FREDRIK KARLSTROM", 8479518],
        ["RHETT GARDNER", 8479587],
        ["MIRO HEISKANEN", 8480036],
        ["JACOB PETERSON", 8480216],
        ["MARIAN STUDENIC", 8480226],
        ["OSKAR BACK", 8480840],
        ["TY DELLANDREA", 8480848],
        ["RILEY DAMIANI", 8480988],
        ["DAWSON BARTEAUX", 8480999],
        ["THOMAS HARLEY", 8481581],
        ["JOEL KIVIRANTA", 8481641],
        ["MATEJ BLUMEL", 8481712],
        ["JERAD ROSBURG", 8482051],
        ["ANTONIO STRANGES", 8482120],
        ["MAVRIK BOURQUE", 8482145],
        ["REMI POIRIER", 8482465],
        ["ADAM SCHEEL", 8482642],
        ["ARTEM GRUSHNIKOV", 8482695],
        ["LOGAN STANKOVEN", 8482702],
        ["WYATT JOHNSTON", 8482740],
        ["FRANCESCO ARCURI", 8482891],
        ["DEREK GRANT", 8474683],
        ["JOHN MOORE", 8475186],
        ["CAM FOWLER", 8475764],
        ["SAM CARRICK", 8475842],
        ["JOHN KLINGBERG", 8475906],
        ["JOHN GIBSON", 8476434],
        ["RYAN STROME", 8476458],
        ["ANTHONY STOLARZ", 8476932],
        ["DANNY O'REGAN", 8476982],
        ["JUSTIN KIRKLAND", 8477993],
        ["CHASE DE LEO", 8478029],
        ["FRANK VATRANO", 8478366],
        ["GLENN GAWDIN", 8478446],
        ["COLTON WHITE", 8478841],
        ["TROY TERRY", 8478873],
        ["OLLI JUOLEVI", 8479355],
        ["MAX JONES", 8479368],
        ["JOSH MAHURA", 8479372],
        ["URHO VAAKANAINEN", 8480001],
        ["MAX COMTOIS", 8480031],
        ["OLLE ERIKSSON EK", 8480042],
        ["AUSTIN STRAND", 8480467],
        ["ISAC LUNDESTROM", 8480806],
        ["BLAKE MCLAUGHLIN", 8480816],
        ["LUKAS DOSTAL", 8480843],
        ["BENOIT-OLIVIER GROULX", 8480870],
        ["HUNTER DREW", 8481003],
        ["AXEL ANDERSSON", 8481018],
        ["SIMON BENOIT", 8481122],
        ["BRAYDEN TRACEY", 8481530],
        ["TREVOR ZEGRAS", 8481533],
        ["DREW HELLESON", 8481563],
        ["BRYCE KINDOPP", 8481815],
        ["JAMIE DRYSDALE", 8482142],
        ["JACOB PERREAULT", 8482150],
        ["SASHA PASTUJOV", 8482682],
        ["OLEN ZELLWEGER", 8482803],
        ["JOSH LOPINA", 8482925],
        ["NATHAN GAUCHER", 8483444],
        ["PAVEL MINTYUKOV", 8483490],
        ["PAVOL REGENDA", 8483630],
        ["HENRIK RYBINSKI", 8481662],
        ["HENDRIX LAPIERRE", 8482148],
        ["GARIN BJORKLUND", 8482188],
        ["ALEXANDER SUZDALEV", 8483518],
        ["COREY PERRY", 8470621],
        ["BRIAN ELLIOTT", 8470880],
        ["ALEX KILLORN", 8473986],
        ["IAN COLE", 8474013],
        ["PAT MAROON", 8474034],
        ["STEVEN STAMKOS", 8474564],
        ["ZACH BOGOSIAN", 8474567],
        ["VICTOR HEDMAN", 8475167],
        ["NIKITA KUCHEROV", 8476453],
        ["VLADISLAV NAMESTNIKOV", 8476480],
        ["ANDREI VASILEVSKIY", 8476883],
        ["TREVOR CARRICK", 8476953],
        ["NICHOLAS PAUL", 8477426],
        ["PIERRE-EDOUARD BELLEMARE", 8477930],
        ["HAYDN FLEURY", 8477938],
        ["BRAYDEN POINT", 8478010],
        ["ERIK CERNAK", 8478416],
        ["ANTHONY CIRELLI", 8478519],
        ["PHILIPPE MYERS", 8479026],
        ["MIKHAIL SERGACHEV", 8479410],
        ["SEAN DAY", 8479413],
        ["ROSS COLTON", 8479525],
        ["BRANDON HAGEL", 8479542],
        ["ALEX BARRÉ-BOULET", 8479718],
        ["CAL FOOTE", 8479984],
        ["GRANT MISMASH", 8480061],
        ["NICK PERBIX", 8480246],
        ["GABRIEL FORTIER", 8480863],
        ["DMITRY SEMYKIN", 8481060],
        ["MAXIM CAJKOVIC", 8481738],
        ["JACK FINLEY", 8482090],
        ["JACK THOMPSON", 8482144],
        ["GAGE GONCALVES", 8482201],
        ["FELIX ROBERT", 8482440],
        ["JAYDON DUREAU", 8482454],
        ["ROMAN SCHMIDT", 8482693],
        ["SIMON RYFORS", 8482818],
        ["BENNETT MACARTHUR", 8483102],
        ["DECLAN CARLILE", 8483398],
        ["ILYA USAU", 8483408],
        ["LUCAS EDMONDS", 8483437],
        ["CONNOR MURPHY", 8476473],
        ["JUJHAR KHAIRA", 8476915],
        ["JACK JOHNSON", 8471677],
        ["ALEX STALOCK", 8471774],
        ["JONATHAN TOEWS", 8473604],
        ["PATRICK KANE", 8474141],
        ["TYLER JOHNSON", 8474870],
        ["PETR MRAZEK", 8475852],
        ["COLIN BLACKWELL", 8476278],
        ["JAKE MCCABE", 8476931],
        ["ANDREAS ATHANASIOU", 8476960],
        ["BUDDY ROBINSON", 8477210],
        ["SETH JONES", 8477495],
        ["MAX DOMI", 8477503],
        ["SAM LAFFERTY", 8478043],
        ["LUKE PHILP", 8478224],
        ["CALEB JONES", 8478452],
        ["BRETT SENEY", 8478881],
        ["BORIS KATCHOUK", 8479383],
        ["RILEY STILLMAN", 8479388],
        ["TAYLOR RADDYSH", 8479390],
        ["MACKENZIE ENTWISTLE", 8480025],
        ["EVAN BARRATT", 8480066],
        ["IAN MITCHELL", 8480070],
        ["JAKUB GALVAS", 8480231],
        ["COLE GUTTMAN", 8480252],
        ["PHILIPP KURASHEV", 8480798],
        ["NICOLAS BEAUDIN", 8480814],
        ["ALEC REGULA", 8480831],
        ["JOSIAH SLAVIN", 8481004],
        ["REESE JOHNSON", 8481147],
        ["ALEX VLASIC", 8481568],
        ["MICHAL TEPLY", 8481616],
        ["LOUIS CREVIER", 8481806],
        ["LUKAS REICHEL", 8482117],
        ["ISAAK PHILLIPS", 8482192],
        ["MIKE HARDMAN", 8482635],
        ["NOLAN ALLAN", 8482700],
        ["COLTON DACH", 8482703],
        ["ETHAN DEL MASTRO", 8482807],
        ["ARVID SODERBLOM", 8482821],
        ["JAKUB POUR", 8482835],
        ["JALEN LUYPEN", 8482903],
        ["KEVIN KORCHINSKI", 8483466],
        ["JAXSON STAUBER", 8483530],
        ["FILIP ROOS", 8483619],
        ["ROBBY FABBRI", 8477952],
        ["STEVEN KAMPFER", 8474000],
        ["DAVID PERRON", 8474102],
        ["BEN CHIAROT", 8475279],
        ["MARK PYSYK", 8475796],
        ["OLLI MAATTA", 8476874],
        ["OSKAR SUNDQVIST", 8476897],
        ["JUSSI OLKINUORA", 8477236],
        ["DOMINIK KUBALIK", 8477330],
        ["ANDREW COPP", 8477429],
        ["ADAM ERNE", 8477454],
        ["ROBERT HAGG", 8477462],
        ["TYLER BERTUZZI", 8477479],
        ["JORDAN OESTERLE", 8477851],
        ["JAKUB VRANA", 8477944],
        ["DYLAN LARKIN", 8477946],
        ["ALEX NEDELJKOVIC", 8477968],
        ["JAKE WALMAN", 8478013],
        ["VILLE HUSSO", 8478024],
        ["AUSTIN CZARNIK", 8478512],
        ["GIVANI SMITH", 8479379],
        ["FILIP HRONEK", 8479425],
        ["MATT LUFF", 8479644],
        ["MICHAEL RASMUSSEN", 8479992],
        ["GUSTAV LINDSTROM", 8480184],
        ["PIUS SUTER", 8480459],
        ["FILIP ZADINA", 8480821],
        ["MORITZ SEIDER", 8481542],
        ["ALBERT JOHANSSON", 8481607],
        ["ELMER SODERBLOM", 8481725],
        ["LUCAS RAYMOND", 8482078],
        ["RYAN MCDONAGH", 8474151],
        ["ROMAN JOSI", 8474600],
        ["MARK BOROWIECKI", 8474697],
        ["THOMAS GREISS", 8471306],
        ["ROBERT BORTUZZO", 8474145],
        ["MARCO SCANDELLA", 8474618],
        ["LUKE WITKOWSKI", 8474722],
        ["RYAN O'REILLY", 8475158],
        ["BRAYDEN SCHENN", 8475170],
        ["NICK LEDDY", 8475181],
        ["JUSTIN FAULK", 8475753],
        ["VLADIMIR TARASENKO", 8475765],
        ["JOSH LEIVO", 8476410],
        ["JORDAN BINNINGTON", 8476412],
        ["BRANDON SAAD", 8476438],
        ["TOREY KRUG", 8476792],
        ["COLTON PARAYKO", 8476892],
        ["MARTIN FRK", 8476924],
        ["PAVEL BUCHNEVICH", 8477402],
        ["NATHAN WALKER", 8477573],
        ["IVAN BARBASHEV", 8477964],
        ["ANTHONY ANGELLO", 8478074],
        ["NOEL ACCIARI", 8478569],
        ["NIKO MIKKOLA", 8478859],
        ["LOGAN BROWN", 8479366],
        ["WILLIAM BITTEN", 8479375],
        ["JORDAN KYROU", 8479385],
        ["ROBERT THOMAS", 8480023],
        ["ALEXEY TOROPCHENKO", 8480281],
        ["BRADY LYLE", 8480404],
        ["SCOTT PERUNOVICH", 8481059],
        ["DYLAN MCLAUGHLIN", 8481429],
        ["VADIM ZHERENKO", 8481689],
        ["MATTHEW KESSEL", 8482516],
        ["ADAM RUZICKA", 8480008],
        ["TREVOR LEWIS", 8473453],
        ["MILAN LUCIC", 8473473],
        ["MIKAEL BACKLUND", 8474150],
        ["JACOB MARKSTROM", 8474593],
        ["NAZEM KADRI", 8475172],
        ["CHRISTOPHER TANEV", 8475690],
        ["TYLER TOFFOLI", 8475726],
        ["BLAKE COLEMAN", 8476399],
        ["JONATHAN HUBERDEAU", 8476456],
        ["OSCAR DANSK", 8476861],
        ["MACKENZIE WEEGAR", 8477346],
        ["ELIAS LINDHOLM", 8477496],
        ["NIKITA ZADOROV", 8477507],
        ["CLARK BISHOP", 8478056],
        ["ANDREW MANGIAPANE", 8478233],
        ["NOAH HANIFIN", 8478396],
        ["RASMUS ANDERSSON", 8478397],
        ["OLIVER KYLINGTON", 8478430],
        ["DAN VLADAR", 8478435],
        ["NICOLAS MELOCHE", 8478467],
        ["DENNIS GILBERT", 8478502],
        ["KEVIN ROONEY", 8479291],
        ["DILLON DUBE", 8479346],
        ["MATTHEW PHILLIPS", 8479547],
        ["JUUSO VALIMAKI", 8479976],
        ["NICK DESIMONE", 8480084],
        ["BEN JONES", 8480259],
        ["MARTIN POSPISIL", 8481028],
        ["MATHIAS EMILIO PETTERSEN", 8481041],
        ["ILYA NIKOLAEV", 8481590],
        ["COLE SCHWINDT", 8481655],
        ["COLTON POOLMAN", 8482066],
        ["CONNOR MACKEY", 8482067],
        ["YAN KUZNETSOV", 8482165],
        ["JEREMIE POIRIER", 8482173],
        ["RORY KERINS", 8482209],
        ["ILYA SOLOVYOV", 8482470],
        ["ADAM KLAPKA", 8483609],
        ["MATT DUCHENE", 8475168],
        ["MATTIAS EKHOLM", 8475218],
        ["RYAN JOHANSEN", 8475793],
        ["MIKAEL GRANLUND", 8475798],
        ["NINO NIEDERREITER", 8475799],
        ["KEVIN GRAVEL", 8475857],
        ["MARK JANKOWSKI", 8476873],
        ["FILIP FORSBERG", 8476887],
        ["COLTON SISSONS", 8476925],
        ["JUUSE SAROS", 8477424],
        ["MICHAEL MCCARRON", 8477446],
        ["ZACH SANFORD", 8477482],
        ["ROLAND MCKEOWN", 8477981],
        ["THOMAS NOVAK", 8478438],
        ["JEREMY LAUZON", 8478468],
        ["YAKOV TRENIN", 8478508],
        ["ALEXANDRE CARRIER", 8478851],
        ["CONNOR INGRAM", 8478971],
        ["DANTE FABBRO", 8479371],
        ["MARKUS NURMI", 8479544],
        ["TANNER JEANNOT", 8479661],
        ["CODY GLASS", 8479996],
        ["EELI TOLVANEN", 8480009],
        ["TOMAS VOMACKA", 8480233],
        ["KIEFER SHERWOOD", 8480748],
        ["JORDAN GROSS", 8480913],
        ["KEVIN LANKINEN", 8480947],
        ["JACHYM KONDELIK", 8481029],
        ["SPENCER STASTNEY", 8481056],
        ["JOHN LEONARD", 8481077],
        ["JIMMY HUNTINGTON", 8481228],
        ["PHILIP TOMASINO", 8481577],
        ["EGOR AFANASYEV", 8481585],
        ["JUUSO PARSSINEN", 8481704],
        ["MARC DEL GAIZO", 8481743],
        ["NAVRIN MUTTER", 8481817],
        ["COLE SMITH", 8482062],
        ["LUKE PROKOP", 8482091],
        ["YAROSLAV ASKAROV", 8482137],
        ["LUKE EVANGELISTA", 8482146],
        ["DEVIN COOLEY", 8482445],
        ["ADAM WILSBY", 8482482],
        ["ZACHARY L'HEUREUX", 8482742],
        ["JACK MATIER", 8482808],
        ["EEMIL VIRO", 8482163],
        ["SIMON EDVINSSON", 8482762],
        ["PONTUS ANDREASSON", 8483608],
    ]);

    var id = PlayerMap.get(player_name);
    return id;
}
// this function converts a country code (e.g. DEU)
// to the full country name (e.g. Germany)
function getCountry(country_code) {

    // this list includes all countries that have active players. 
    // it will need to be updated if a player from a different country makes the NHL
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
        ["LVA", "Latvia"],
        ["GBR", "United Kingdom"],
        ["BEL", "Belgium"],
        ["NOR", "Norway"],
        ["SVN", "Slovenia"],
        ["DNK", "Denmark"],
        ["FRA", "France"],
        ["NLD", "Netherlands"],
        ["AUS", "Australia"]
    ]);

    var country_name = countries_names.get(country_code);

    var countries = ["Canada", "Sweden", "Finland", "United States of America", "Czechia", 
    "Germany", "Slovakia", "Switzerland", "Austria", "Latvia", "Russia", "United Kingdom", "Belgium",
    "Norway", "Slovenia", "Denmark", "France", "Netherlands", "Australia"];

    if (countries.includes(country_name)) {
        return country_name;
    } else {
        return "EARTH";
    }
}

