import React, { Component } from 'react';
import StatSkater from './StatSkater';
import StatGoalie from './StatGoalie';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import AvailablePlayers from './AvailablePlayers';
import salariesData from './data/salaries.json';
import players from './data/allPlayers.json';

//1: Get all players by team id https://statsapi.web.nhl.com/api/v1/teams/15/roster (store their links)
//2.1: Grab their gameLog https://statsapi.web.nhl.com/{playerlink}/stats?stats=gameLog&season=20172018 and check if they play that day (2018-04-07). if they do play, store info in array
//2.2: Note that this is because we cannot check the players' "next" games since the season is over. Implementation for getting players available next day will be slightly different (checking teams' next game dates)
//3: Get their 2016-2017 stats by using https://statsapi.web.nhl.com/{playerlink}/stats?stats=statsSingleSeason&season=20162017. calculate salary based on fantasy points total/games played
//4: Display all players by category (code: G,D,L,R,C, newplayer)

//Step 1: Tables display available player selection. Displays players playing that day by category and can be sorted by salary, stat efficiency, fantasy points (salary is based on fantasy points/game last season)
//Step 2: Add button for each row that allows for slection of player. -> creates team at top table. (js event that adds row -> re-render subcomponent (move table to subcomponent) add row, subtract salary)
//Step 3: Top table updates real-time with stats

//Step 4: Interface for creating a contract
//Step 5: Save data for players - personal account

//players: {name, salary, link, score, position}

//Salaries: store on-file

//MetaMask: check if metamask installed/supported browser
//Set defaulta account. Pass in contract ABI and contract address
//Call directly from contract variable.

class DisplayStats extends Component {

    constructor() {
        super();
        this.state = {
            salary: 9000,            
            stats: [],

            allPlayers: [],

            availablePositions: ['C','C','D','D','L','L','R','R','G','G'],
            skatersChosen: [],
            goaliesChosen: [],

            centers: [],
            defensemen: [],
            rightwings: [],
            leftwings: [],
            goalies: [],
            newplayers: [],
            players: players,
            //Schema:
            // { 
            //   ID : name
            // }
            salaries: salariesData,
            //Schema:
            // {
            //   ID : [name, position, score projection, salary]
            // }
            playersList: []
        }
    }

    //Callback function, available salary, salary callback, passed in to AvailablePlayers
    //When button is clicked, check if valid add based on salary. If not, notify not enough salary.
    //if valid add, call the callback with player info,callback salary change, remove the button/row

    //when updating skaterschosen/goalieschosen with removals, also pass in salary to update 

    //update the players stats realtime via timer?

    //Remove callback -> add row/button back
    //Add callback -> render the rows
    //check if players are already in list
    //check if positions are valid
    
    updatePlayers = (position, playerLink, name, salary) => {
        var newArray = [];
        var removed = false;
        this.state.availablePositions.forEach(function (pos) {
            if (pos === position && removed === false) {
                removed = true;
            } else {
                newArray.push(pos)
            }
        })
        this.setState({availablePositions: newArray})

        var playerURL = 'https://statsapi.web.nhl.com' + playerLink + '/stats?stats=gameLog';
          $.ajax({
              url: playerURL,
              dataType: 'json',
              cache: false,
              success: function (stats) {
                  var statLine = stats['stats'][0]['splits'][0]['stat'];
                  //console.log(position) check positions valid                  
                  if (position === 'G') {
                      //console.log(stats)
                      this.state.goaliesChosen.push(
                          <StatGoalie
                              key={playerLink}
                              name={name}
                              sav={statLine['saves']}
                              ga={statLine['goalsAgainst']}
                              so={statLine['shutouts']}
                              salary={salary}
                              id={playerLink}
                              pos={position}
                              salaryCallback={this.updateSalary}
                              removePlayersCallback={this.removePlayers}
                          />);   
                      var goalies = this.state.goaliesChosen;
                      this.setState({goaliesChosen:goalies})

                  }
                  else {
                     // console.log('added');
                      var goals = statLine['goals'];
                      var ppgs = statLine['powerPlayGoals'];
                      var shgs = statLine['shortHandedGoals'];
                      this.state.skatersChosen.push(
                          <StatSkater
                              key={playerLink}
                              name={name}
                              assist={parseInt(statLine['assists'], 10)}
                              evg={goals - ppgs - shgs}
                              ppg={ppgs}
                              shg={shgs}
                              sog={parseInt(statLine['shots'], 10)}
                              hits={parseInt(statLine['hits'], 10)}
                              blk={parseInt(statLine['blocked'], 10)}
                              salary={salary}
                              id={playerLink}
                              pos={position}
                              salaryCallback={this.updateSalary}
                              removePlayersCallback={this.removePlayers}
                          />); 
                      var skaters = this.state.skatersChosen;
                      this.setState({skatersChosen:skaters})
                  }                                   
              }.bind(this),
              error: function (xhr, status, error) {
                  console.log(error);
              }
          })
    }

    removePlayers = (id, pos) => {
        var newArray = [];
        var newPosAvailableArray = this.state.availablePositions;
        newPosAvailableArray.push(pos);

        this.setState({availablePositions: newPosAvailableArray })

        if (pos === 'G') {
            this.state.goaliesChosen.forEach(function (row) {                
                if (row.key !== id) {
                    newArray.push(row);
                }
            })
            this.setState({goaliesChosen: newArray})
        } else {
            this.state.skatersChosen.forEach(function (row) {
                if (row.key !== id) {
                    newArray.push(row)
                }
            })
            this.setState({ skatersChosen: newArray })
        }
    }

    updateSalary = (operation, salary) => {
        if (operation === "add") {
            //console.log(this)
            //console.log(salary, operation)
            this.setState({ salary: this.state.salary - salary });
        }
        else {
            //console.log(this)
            this.setState({ salary: this.state.salary + salary });
        }
    }

    getNHLStats(gameURL) {
        $.ajax({
            url: gameURL,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ stats: $.extend({}, this.state.stats, data['liveData']['boxscore']['teams']['away']['players']) }, function () {
                })
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(error);
            }
        })
    }

    //TODO: grab all players/links and store in allplayers.json
    //TODO: grab all salaries and store in salaries.json

    //TODO: now start function with ajax call to the date (on all links) to get players who play that day (otherwise would check each team's next game and add those players to an array)
    //TODO: for each player that plays that day, grab data from array and setState 
    componentWillMount() {
        console.log(this.state.salaries)
        var teamIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 52, 53, 54];                    
        teamIDs.forEach(function (teamID) {
            var rosterURL = 'https://statsapi.web.nhl.com/api/v1/teams/' + teamID + '/roster';            
            $.ajax({
                url: rosterURL,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    data.roster.forEach(function (player) {
                        //Get player link, position, name for all teams
                        var playerlink = player['person']['link'];
                        var position = player['position']['code'];
                        var playerlogURL = 'https://statsapi.web.nhl.com' + playerlink + '/stats?stats=gameLog&season=20172018'
                        var playerName = player['person']['fullName'];
                        
                        $.ajax({
                            url:playerlogURL,
                            dataType: 'json',
                            cache: false,
                            success: function (logData) {
                                //For each player, obtain their player logs (most recent game/date) - need to change to another logic to check if they play that day
                                if (logData['stats'][0]['splits'].length !== 0) {
                                    if (logData['stats'][0]['splits'][0]['date'] === "2018-04-08") {
                                      //  var gameStats = logData['stats'][0]['splits'][0]['stat'];                                        
                                        var season16url = 'https://statsapi.web.nhl.com' + playerlink + '/stats?stats=statsSingleSeason&season=20162017';                                       

                                        $.ajax({
                                            url: season16url,
                                            dataType: 'json',
                                            cache: false,
                                            success: function (data16) {
                                                //For each player, check their season 16 stats to calculate salary
                                                if (data16['stats'][0]['splits'].length !== 0) {
                                                    var stats16 = data16['stats'][0]['splits'][0]['stat'];   
                                                    var fantasyScore16;
                                                    var salary;
                                                    var evg;
                                                    //Total salary 9,000
                                                    //Minimum salary 400
                                                    if (position === "C") {                                                        
                                                        evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                                        fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                                        salary = Math.max(400, Math.round(100 * fantasyScore16));  
                                                        var centers = this.state.centers
                                                        centers.push({ 'playerName': playerName, 'salary': salary, link : playerlink, score: fantasyScore16, position: position});
                                                        this.setState({ centers: centers}, function () {
                                                        })
                                                    } else if (position === "L") {
                                                        evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                                        fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                                        salary = Math.max(400, Math.round(100 * fantasyScore16));
                                                        var lefts = this.state.leftwings
                                                        lefts.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                                        this.setState({ leftwings: lefts }, function () {
                                                        })
                                                    } else if (position === "R") {
                                                        evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                                        fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                                        salary = Math.max(400, Math.round(100 * fantasyScore16));
                                                        var rights = this.state.rightwings
                                                        rights.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                                        this.setState({ rightwings: rights }, function () {
                                                        })
                                                    } else if (position === "D") {
                                                        evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                                        fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                                        salary = Math.max(400, Math.round(100 * fantasyScore16));
                                                        var def = this.state.defensemen
                                                        def.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                                        this.setState({ defensemen: def }, function () {
                                                        })
                                                    } else {                                                      
                                                        fantasyScore16 = ((stats16['saves'] - stats16['goalsAgainst'] * 5 + stats16['shutouts'] * 10) / stats16['games']).toFixed(2)
                                                        salary = Math.max(400, Math.round(100 * fantasyScore16));
                                                        var goalies = this.state.goalies
                                                        goalies.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                                        this.setState({ goalies: goalies }, function () {
                                                        })
                                                    } 
                                                }
                                                else {
                                                    //new player salary                                                
                                                    if (position === "C") {
                                                        centers = this.state.centers
                                                        centers.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                                        this.setState({ centers: centers }, function () {
                                                        })
                                                    } else if (position === "L") {
                                                        lefts = this.state.leftwings
                                                        lefts.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                                        this.setState({ leftwings: lefts }, function () {
                                                        })
                                                    } else if (position === "R") {
                                                        rights = this.state.rightwings
                                                        rights.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                                        this.setState({ rightwings: rights }, function () {
                                                        })
                                                    } else if (position === "D") {
                                                        def = this.state.defensemen
                                                        def.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                                        this.setState({ defensemen: def }, function () {
                                                        })
                                                    } else {
                                                        goalies = this.state.goalies
                                                        goalies.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                                        this.setState({ goalies: goalies }, function () {
                                                        })
                                                    }
                                                }
                                            }.bind(this),
                                            error: function (xhr, status, error) {
                                                console.log(error);
                                            }
                                        })                                                                                 
                                    }

                                }
                            }.bind(this),
                            error: function (xhr, status, error) {
                                console.log(error);
                            }
                        })                                                                       
                    }.bind(this))                   
                }.bind(this),
                error: function (xhr, status, error) {
                    console.log(error);
                }
            })        
        }.bind(this))
    }


    componentDidMount() {
        //this.getNHLStats();
    }

    processPlayers(playersList, allPlayers) {
        playersList.forEach(function (player) {
            //console.log("push")
            allPlayers.push(
                <AvailablePlayers
                    key={player.link}
                    name={player.playerName}
                    pos={player.position}
                    scoreproj={player.score}
                    salary={player.salary}
                    id={player.link}
                    salaryCallback={this.updateSalary}
                    updatePlayersCallback={this.updatePlayers}
                    availableSalary={this.state.salary}
                    availablePositions={this.state.availablePositions}
                    skatersChosen={this.state.skatersChosen}
                    goaliesChosen={this.state.goaliesChosen}                  
                />
            )
        }.bind(this))
    }

    render() {        
        

        var allPlayers = [];
        this.processPlayers(this.state.centers,allPlayers);
        this.processPlayers(this.state.rightwings,allPlayers);
        this.processPlayers(this.state.leftwings, allPlayers);
        this.processPlayers(this.state.defensemen, allPlayers);
        this.processPlayers(this.state.goalies, allPlayers);
        this.processPlayers(this.state.newplayers, allPlayers);       

        return (            
            <div className="DisplayStats">
                Salary Remaining: {this.state.salary}

                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                            <th>AST</th>
                            <th>EVG</th>
                            <th>PPG</th>
                            <th>SHG</th>
                            <th>SOG</th>
                            <th>HITS</th>
                            <th>BLKS</th>
                            <th>Salary</th>
                            <th>Fantasy Points</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.skatersChosen}
                    </tbody>
                </Table>

                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                            <th>Saves</th>
                            <th>Shots Allowed</th>
                            <th>Shutout</th>
                            <th>Salary</th>
                            <th>Fantasy Points</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.goaliesChosen}
                    </tbody>
                </Table> 

                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Name</th>      
                            <th>Position</th>
                            <th>Score projection</th>
                            <th>Salary</th>
                            <th>Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPlayers}
                    </tbody>
                </Table>
                          
            </div>
        );
    }
}

export default DisplayStats;

//var statsListSkaters = [];
//var statsListGoalies = [];
//let stats;
////console.log(this.state);
//if (this.state.stats.length !== 0) {
//    stats = this.state.stats;
//    for (var key in stats) {
//        if (Object.keys(stats[key]['stats']).length !== 0) {
//            if (Object.keys(stats[key]['stats'])[0] === "skaterStats") {
//                var goals = parseInt(stats[key]['stats']['skaterStats']['goals'], 10);
//                var ppgs = parseInt(stats[key]['stats']['skaterStats']['powerPlayGoals'], 10);
//                var shgs = parseInt(stats[key]['stats']['skaterStats']['shortHandedGoals'], 10);

//                statsListSkaters.push(
//                    <StatSkater
//                        name={stats[key]['person']['fullName']}
//                        assist={parseInt(stats[key]['stats']['skaterStats']['assists'], 10)}
//                        evg={goals - ppgs - shgs}
//                        ppg={ppgs}
//                        shg={shgs}
//                        sog={parseInt(stats[key]['stats']['skaterStats']['shots'], 10)}
//                        hits={parseInt(stats[key]['stats']['skaterStats']['hits'], 10)}
//                        blk={parseInt(stats[key]['stats']['skaterStats']['blocked'], 10)}
//                    />
//                )
//            } else {
//                var shots = parseInt(stats[key]['stats']['goalieStats']['shots'], 10);
//                var saves = parseInt(stats[key]['stats']['goalieStats']['saves'], 10);
//                var shutout = 0;
//                if (parseInt(stats[key]['stats']['goalieStats']['savePercentage'], 10) === 100) {
//                    shutout = 1;
//                }
//                statsListGoalies.push(
//                    <StatGoalie
//                        name={stats[key]['person']['fullName']}
//                        sav={saves}
//                        ga={shots - saves}
//                        so={shutout}
//                    />
//                )
//            }
//        }

//    }
//}