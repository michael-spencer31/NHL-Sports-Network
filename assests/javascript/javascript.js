var teamListElement = $("#team-list");
var teamElement = $("#team");
var playerListElement = $("#player-list");
var playerElement = $("#player");

// create a list of all team IDs for later
var teamIDList = [];
var playerIDList = [];

// link to the NHL API
var queryURL = "https://statsapi.web.nhl.com/api/v1/teams/";

// use jQuery ajax to get and return the data
$.ajax({
    url: queryURL,
    method: "GET"
}).done(function(data){

    // for each team in the data, get the name and id
    for (i = 0; i < data.teams.length; i++) {
        var teamName = data.teams[i].name;
        var teamID = data.teams[i].id;

        var team = $("<li><button id='btn-" + teamID + "'>" + teamName + "</button></li>");
        teamListElement.append(team);
        teamIDList.push(teamID);
    };
    // when button is clicked pull up team JSON data
    for (i = 0; i < teamIDList.length; i++) {
        $("#btn-" + teamIDList[i]).on("click", function () {

            teamElement.html("");
            playerListElement.html("");
            playerElement.html("");
            playerIDList = [];
           
            // access target team api
            var teamID = $(this).attr("id");
            teamID = teamID.replace("btn-", "");
            var queryURL = "https://statsapi.web.nhl.com/api/v1/teams/" + teamID + "?hydrate=stats(splits=statsSingleSeason)/";

            // get and return the data with ajax
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(data) {

                // get stats about team name, win/losses, etc.
                var abbrName = data.teams[0].abbreviation;
                var teamName = data.teams[0].name;
                var venue = data.teams[0].venue.name;
                var city = data.teams[0].venue.city;
                var site = data.teams[0].officialSiteUrl;
                var gamesPlayed = data.teams[0].teamStats[0].splits[0].stat.gamesPlayed;
                var wins = data.teams[0].teamStats[0].splits[0].stat.wins;
                var losses = data.teams[0].teamStats[0].splits[0].stat.losses;
                var points = data.teams[0].teamStats[0].splits[0].stat.pts;
                var rank = data.teams[0].teamStats[0].splits[1].stat.pts;

                // create stat elements
                var teamNameElement = $("<li>" + abbrName + " - " + teamName + "</li>");
                var venueElement = $("<li>" + venue + ", " + city + "</li>");
                var websiteElement = $("<a href='" + site + "'><li>" + site + "</li></a>");
                var gamesPlayedElement = $("<li>Games Played: " + gamesPlayed + "</li>");
                var winsElement = $("<li>Wins: " + wins + "</li>");
                var lossesElement = $("<li>Losses: " + losses + "</li>");
                var pointsElement = $("<li>Points: " + points + "</li>");
                var rankElement = $("<li>Rank: " + rank + "</li>");

                // append stat elements to the team element
                teamElement.append(teamNameElement);
                teamElement.append(venueElement);
                teamElement.append(websiteElement);
                teamElement.append(gamesPlayedElement);
                teamElement.append(winsElement);
                teamElement.append(lossesElement);
                teamElement.append(pointsElement);
                teamElement.append(rankElement);
            });
            // access the roster api
            var teamID = $(this).attr("id");
            teamID = teamID.replace("btn-", "");
            var queryURL = "https://statsapi.web.nhl.com/api/v1/teams/" + teamID + "/roster?hydrate=stats(splits=statsSingleSeason)/";
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(data) {

                // for each player in the data get their name and id
                for (i = 0; i < data.roster.length; i++) {
                    var playerName = data.roster[i].person.fullName;
                    var playerID = data.roster[i].person.id;
                    var jerseyNumber = data.roster[i].jerseyNumber;

                    var player = $("<li><button id='btn-" + playerID + "'>" + playerName + " (" + jerseyNumber + ")" + "</button></li>");
                    playerListElement.append(player);
                    playerIDList.push(playerID);
                };
               
         
                for (i = 0; i < playerIDList.length; i++) {
                    $("#btn-" + playerIDList[i]).on("click", function () {
                        playerElement.html("");

                        var playerID = $(this).attr("id");
                        playerID = playerID.replace("btn-", "");
                        var queryURL = "https://statsapi.web.nhl.com/api/v1/people/" + playerID + "?hydrate=stats(splits=statsSingleSeason)/";
                        console.log(queryURL);
                        var newQuery = "https://statsapi.web.nhl.com/api/v1/people/" + playerID + "/stats?stats=gameLog&season=20202021";

                        $.ajax({
                            url: queryURL,
                            method: "GET"
                        }).done(function(data) {
                            var playerName = data.people[0].fullName;
                            var number = data.people[0].primaryNumber;
                            var age = data.people[0].currentAge;
                            var height = data.people[0].height;
                            var weight = data.people[0].weight;
                            var position = data.people[0].primaryPosition.name;

                            var nationality = data.people[0].nationality;
                            var goals = data.people[0].stats[0].splits[0].stat.goals;
                            var assists = data.people[0].stats[0].splits[0].stat.assists;
                            var plusMinus = data.people[0].stats[0].splits[0].stat.plusMinus;

                            // goals, assists and +/- are all 'undefined' for goalies so just set them to 0
                            if(goals == null){
                                goals = 0;
                            }
                            if(assists == null){
                                assists = 0;
                            }
                            if(plusMinus == null){
                                plusMinus = 0;
                            }
                            // create stat elements
                            var playerNameElement = $("<li>" + playerName + "</li>");
                            var numberElement = $("<li>(" + number + ")</li>");
                            var ageElement = $("<li>Age: " + age + "</li>");
                            var heightElement = $("<li>Height: " + height + "</li>");
                            var weightElement = $("<li>Weight: " + weight + "</li>");
                            var positionElement = $("<li>Position: " + position + "</li>");
                            var nationElement = $("<li>Nationality: " + nationality + "</li>");

                            var goalsElement = $("<li>Goals: " + goals + "</li>");
                            var assistsElement = $("<li>Assists: " + assists + "</li>");
                            var plusMinusElement = $("<li>Plus/Minus: " + plusMinus + "</li>");

                            // append stat elements to the team element
                            playerElement.append(playerNameElement);
                            playerElement.append(numberElement);
                            playerElement.append(ageElement);
                            playerElement.append(heightElement);
                            playerElement.append(weightElement);
                            playerElement.append(positionElement);
                            playerElement.append(nationElement);

                            playerElement.append(goalsElement);
                            playerElement.append(assistsElement);
                            playerElement.append(plusMinusElement);
                        }); //end assemble player html
                    });     //end player button click
                };   //end player json
            });     // end assemble team hmtl
        }); // end team button click
    };      // end team json
});
function getDraft(){

    var input = document.getElementById('draftin').value;
    var round = document.getElementById('roundin').value;
    round--;

    var draftURL = "https://statsapi.web.nhl.com/api/v1/draft/" + input;

    $.ajax({
        url: draftURL,
        method: "GET"
    }).done(function(draftData){

        for(var i = 0; i < 32; i++){
            document.getElementById('draftrecords').innerHTML +=  draftData.drafts[0].rounds[round].picks[i].team.name;
            document.getElementById('draftrecords').innerHTML += " " + draftData.drafts[0].rounds[round].picks[i].prospect.fullName + "<br />";
        }  
    });
}
function getResults(){

    //create a map with team name -> team id
    const teamNames = new Map([
        ["New Jersery Devils", 1],
        ["New York Islanders", 2],
        ["New York Rangers", 3],
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
        ["St. Louis Blues", 19],
        ["Calgary Flames", 20],
        ["Colorado Avalanche", 21],
        ["Edmonton Oilers", 22],
        ["Vancouver Canucks", 23],
        ["Anaheim Ducks", 24],
        ["Dallas Stars", 25],
        ["Los Angeles Kings", 26],
        ["Phoenix Coyotes", 27],
        ["San Jose Sharks", 28],
        ["Columbus Blue Jackets", 29],
        ["Minnesota Wild", 30],
        ["Winnipeg Jets", 52],
        ["Vegas Golden Knights", 54],
        ["Seattle Kraken", 55]
    ]);
    //get the team name from input
    var teamName = document.getElementById('teamin').value;
    //use the map to get the teams id
    var teamID = teamNames.get(teamName);
    //then call the api using the id number
    var resultURL = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=" + teamID + "&startDate=2018-10-01&endDate=2019-05-02";

    $.ajax({
        url: resultURL,
        method: "GET"
    }).done(function(results){

        for(var i = 0; i < 82; i++){
            document.getElementById('resultrecords').innerHTML += results.dates[i].games[0].teams.home.team.name + " ";    
            document.getElementById('resultrecords').innerHTML += results.dates[i].games[0].teams.home.score + " vs. ";
            document.getElementById('resultrecords').innerHTML += results.dates[i].games[0].teams.away.score + " ";
            document.getElementById('resultrecords').innerHTML += results.dates[i].games[0].teams.away.team.name + "<br>";    
        }
    });
    document.getElementById('resultrecords').innerHTML = " ";
}
function openTabs(evt, tabName){

    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");

    for(i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");

    for(i = 0; i < tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
function resetDraft(){
    document.getElementById('draftrecords').innerHTML = " ";
}

