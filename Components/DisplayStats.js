import React, { Component } from 'react';
import StatSkater from './StatSkater';
import StatGoalie from './StatGoalie';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import AvailablePlayers from './AvailablePlayers';
import salariesData from './data/salaries.json';
import players from './data/allPlayers.json';
import rink from './images/rinkImage.png';
import './play.css';
import placeholder from './images/placeholder.png';

//Program Fles\PostgreSQL\10\bin> psql -U postgres
//TODO: Store salaries.json into DB 
//TODO: Store/Get pictures from DB - overlay on rink image
//TODO: notifs if team positions full/no salary

//TODO: login page/schema -My Team Page 
//TODO: save team data/pull from db 

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
        this.mounted = true;
        this.state = {
            salary: 9000,
            stats: [],

            allPlayers: [],

            availablePositions: ['C', 'C', 'D', 'D', 'L', 'L', 'R', 'R', 'G', 'G'],
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
            newSalaries: [],
            //Schema:
            // {
            //   ID : [name, position, score projection, salary]
            // }
            playersList: [], // chosen players
            rinkPlayers: { leftG: [0, placeholder], leftD: [0, placeholder], leftL: [0, placeholder], leftR: [0, placeholder], leftC: [0, placeholder], rightG: [0, placeholder], rightD: [0, placeholder], rightL: [0, placeholder], rightR: [0, placeholder], rightC: [0, placeholder] }
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

    updatePlayers = (position, playerLink, name, salary, profile) => {
        var newArray = [];
        var removed = false;
        this.state.availablePositions.forEach(function (pos) {
            if (pos === position && removed === false) {
                removed = true;
            } else {
                newArray.push(pos)
            }
        })
        this.setState({ availablePositions: newArray })

        var currentPics = this.state.rinkPlayers;
        if (position === "G") {
            if (currentPics.leftG[0] === 0) {
                currentPics.leftG[0] = playerLink;
                currentPics.leftG[1] = profile.src;
            } else {
                currentPics.rightG[0] = playerLink;
                currentPics.rightG[1] = profile.src;
            }
        } else if (position === "D") {
            if (currentPics.leftD[0] === 0) {
                currentPics.leftD[0] = playerLink;
                currentPics.leftD[1] = profile.src;
            } else {
                currentPics.rightD[0] = playerLink;
                currentPics.rightD[1] = profile.src;
            }
        } else if (position === "L") {
            if (currentPics.leftL[0] === 0) {
                currentPics.leftL[0] = playerLink;
                currentPics.leftL[1] = profile.src;
            } else {
                currentPics.rightL[0] = playerLink;
                currentPics.rightL[1] = profile.src;
            }
        } else if (position === "R") {
            if (currentPics.leftR[0] === 0) {
                currentPics.leftR[0] = playerLink;
                currentPics.leftR[1] = profile.src;
            } else {
                currentPics.rightR[0] = playerLink;
                currentPics.rightR[1] = profile.src;
            }
        } else if (position === "C") {
            if (currentPics.leftC[0] === 0) {
                currentPics.leftC[0] = playerLink;
                currentPics.leftC[1] = profile.src;
            } else {
                currentPics.rightC[0] = playerLink;
                currentPics.rightC[1] = profile.src;
            }
        }

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
                    this.setState({ goaliesChosen: goalies })

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
                    this.setState({ skatersChosen: skaters })
                }
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(error);
            }
        })
    }

    removePlayers = (id, position) => {
        var newArray = [];
        var newPosAvailableArray = this.state.availablePositions;
        newPosAvailableArray.push(position);

        this.setState({ availablePositions: newPosAvailableArray })

        if (position === 'G') {
            this.state.goaliesChosen.forEach(function (row) {
                if (row.key !== id) {
                    newArray.push(row);
                }
            })
            this.setState({ goaliesChosen: newArray })
        } else {
            this.state.skatersChosen.forEach(function (row) {
                if (row.key !== id) {
                    newArray.push(row)
                }
            })
            this.setState({ skatersChosen: newArray })
        }

        var currentPics = this.state.rinkPlayers;
        if (position === "G") {
            if (currentPics.leftG[0] === id) {
                currentPics.leftG[0] = 0;
                currentPics.leftG[1] = placeholder;
            } else {
                currentPics.rightG[0] = 0;
                currentPics.rightG[1] = placeholder;
            }
        } else if (position === "D") {
            if (currentPics.leftD[0] === id) {
                currentPics.leftD[0] = 0;
                currentPics.leftD[1] = placeholder;
            } else {
                currentPics.rightD[0] = 0;
                currentPics.rightD[1] = placeholder;
            }
        } else if (position === "L") {
            if (currentPics.leftL[0] === id) {
                currentPics.leftL[0] = 0;
                currentPics.leftL[1] = placeholder;
            } else {
                currentPics.rightL[0] = 0;
                currentPics.rightL[1] = placeholder;
            }
        } else if (position === "R") {
            if (currentPics.leftR[0] === id) {
                currentPics.leftR[0] = 0;
                currentPics.leftR[1] = placeholder;
            } else {
                currentPics.rightR[0] = 0;
                currentPics.rightR[1] = placeholder;
            }
        } else if (position === "C") {
            if (currentPics.leftC[0] === id) {
                currentPics.leftC[0] = 0;
                currentPics.leftC[1] = placeholder;
            } else {
                currentPics.rightC[0] = 0;
                currentPics.rightC[1] = placeholder;
            }
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

    componentWillMount() {
        //console.log(this.state.salaries)
        //var teamIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 52, 53, 54];                    
        //teamIDs.forEach(function (teamID) {
        //var rosterURL = 'https://statsapi.web.nhl.com/api/v1/teams/' + teamID + '/roster';            
        //$.ajax({
        //  url: rosterURL,
        //  dataType: 'json',
        // cache: false,
        // success: function (data) {
        this.mounted = true;

        if (this.mounted === true) {
            var salariesArray;
            fetch('/get_players')
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJSON) {
                    var salariesArray = myJSON['data'];                  
                    //var allIDs = Object.keys(this.state.salaries)
                    salariesArray.forEach(function (playerobject) {
                        var playerlink = "/api/v1/people/" + playerobject['id']
                        //Get player link, position, name for all teams
                        //var playerlink = player['person']['link'];
                        //var position = player['position']['code'];
                        var playerlogURL = 'https://statsapi.web.nhl.com' + playerlink + '/stats?stats=gameLog&season=20172018'
                        //var playerName = player['person']['fullName'];
                        //var listp = this.state.playersList;
                        //listp.push({name:playerlink})
                        //this.setState({ playersList: listp })

                        // console.log(this.state.playersList)

                        $.ajax({
                            url: playerlogURL,
                            dataType: 'json',
                            cache: false,
                            success: function (logData) {
                                //For each player, obtain their player logs (most recent game/date) - need to change to another logic to check if they play that day
                                if (logData['stats'][0]['splits'].length !== 0) {
                                    if (logData['stats'][0]['splits'][0]['date'] === "2018-04-08") {
                                        var name;
                                        var position;
                                        var scoreProject;
                                        var salary;
                                        var profilePic = new Image();
                                        salariesArray.forEach(function (salaryobject) {
                                            if (salaryobject['id'] + "" === playerlink.substring(15)) {
                                                name = salaryobject['firstname'] + " " + salaryobject['lastname'];
                                                position = salaryobject['position'];                                                
                                                scoreProject = salaryobject['projectedscore'];
                                                profilePic.src = 'data:image/png;base64,' + salaryobject['image'];
                                                if (scoreProject === 0) {
                                                    scoreProject = 'N/A'
                                                }
                                                salary = salaryobject['salary']
                                            }
                                        })

                                        if (position === "C" && this.mounted) {
                                            var centers = this.state.centers
                                            centers.push({ 'playerName': name, 'salary': salary, link: playerlink, score: scoreProject, position: position, profile: profilePic });
                                            this.setState({ centers: centers }, function () {
                                            })
                                        } else if (position === "L" && this.mounted) {
                                            var lefts = this.state.leftwings
                                            lefts.push({ 'playerName': name, 'salary': salary, link: playerlink, score: scoreProject, position: position, profile: profilePic });
                                            this.setState({ leftwings: lefts }, function () {
                                            })
                                        } else if (position === "R" && this.mounted) {
                                            var rights = this.state.rightwings
                                            rights.push({ 'playerName': name, 'salary': salary, link: playerlink, score: scoreProject, position: position, profile: profilePic });
                                            this.setState({ rightwings: rights }, function () {
                                            })
                                        } else if (position === "D" && this.mounted) {
                                            var def = this.state.defensemen
                                            def.push({ 'playerName': name, 'salary': salary, link: playerlink, score: scoreProject, position: position, profile: profilePic });
                                            this.setState({ defensemen: def }, function () {
                                            })
                                        } else if (this.mounted) {
                                            var goalies = this.state.goalies
                                            goalies.push({ 'playerName': name, 'salary': salary, link: playerlink, score: scoreProject, position: position, profile: profilePic });
                                            this.setState({ goalies: goalies }, function () {
                                            })

                                        }
                                        //  var gameStats = logData['stats'][0]['splits'][0]['stat'];                                        
                                        //var season16url = 'https://statsapi.web.nhl.com' + playerlink + '/stats?stats=statsSingleSeason&season=20162017';                                       

                                        //$.ajax({
                                        //    url: season16url,
                                        //    dataType: 'json',
                                        //    cache: false,
                                        //    success: function (data16) {
                                        //        //For each player, check their season 16 stats to calculate salary
                                        //        if (data16['stats'][0]['splits'].length !== 0) {
                                        //            var stats16 = data16['stats'][0]['splits'][0]['stat'];   
                                        //            var fantasyScore16;
                                        //            var salary;
                                        //            var evg;
                                        //            //Total salary 9,000
                                        //            //Minimum salary 400
                                        //            if (position === "C") {                                                        
                                        //                evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                        //                fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                        //                salary = Math.max(400, Math.round(100 * fantasyScore16));  
                                        //                var centers = this.state.centers
                                        //                centers.push({ 'playerName': playerName, 'salary': salary, link : playerlink, score: fantasyScore16, position: position});
                                        //                this.setState({ centers: centers}, function () {
                                        //                })
                                        //            } else if (position === "L") {
                                        //                evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                        //                fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                        //                salary = Math.max(400, Math.round(100 * fantasyScore16));
                                        //                var lefts = this.state.leftwings
                                        //                lefts.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                        //                this.setState({ leftwings: lefts }, function () {
                                        //                })
                                        //            } else if (position === "R") {
                                        //                evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                        //                fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                        //                salary = Math.max(400, Math.round(100 * fantasyScore16));
                                        //                var rights = this.state.rightwings
                                        //                rights.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                        //                this.setState({ rightwings: rights }, function () {
                                        //                })
                                        //            } else if (position === "D") {
                                        //                evg = stats16['goals'] - stats16['powerPlayGoals'] - stats16['shortHandedGoals'];
                                        //                fantasyScore16 = ((stats16['assists'] * 5 + evg * 7 + stats16['powerPlayGoals'] * 8 + stats16['shortHandedGoals'] * 10 + stats16['shots'] + stats16['hits'] + stats16['blocked']) / stats16['games']).toFixed(2);
                                        //                salary = Math.max(400, Math.round(100 * fantasyScore16));
                                        //                var def = this.state.defensemen
                                        //                def.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                        //                this.setState({ defensemen: def }, function () {
                                        //                })
                                        //            } else {                                                      
                                        //                fantasyScore16 = ((stats16['saves'] - stats16['goalsAgainst'] * 5 + stats16['shutouts'] * 10) / stats16['games']).toFixed(2)
                                        //                salary = Math.max(400, Math.round(100 * fantasyScore16));
                                        //                var goalies = this.state.goalies
                                        //                goalies.push({ 'playerName': playerName, 'salary': salary, link: playerlink, score: fantasyScore16, position: position });
                                        //                this.setState({ goalies: goalies }, function () {
                                        //                })
                                        //            } 
                                        //        }
                                        //        else {
                                        //            //new player salary                                                
                                        //            if (position === "C") {
                                        //                centers = this.state.centers
                                        //                centers.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                        //                this.setState({ centers: centers }, function () {
                                        //                })
                                        //            } else if (position === "L") {
                                        //                lefts = this.state.leftwings
                                        //                lefts.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                        //                this.setState({ leftwings: lefts }, function () {
                                        //                })
                                        //            } else if (position === "R") {
                                        //                rights = this.state.rightwings
                                        //                rights.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                        //                this.setState({ rightwings: rights }, function () {
                                        //                })
                                        //            } else if (position === "D") {
                                        //                def = this.state.defensemen
                                        //                def.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                        //                this.setState({ defensemen: def }, function () {
                                        //                })
                                        //            } else {
                                        //                goalies = this.state.goalies
                                        //                goalies.push({ 'playerName': playerName, 'salary': 600, link: playerlink, score: 'N/A', position: position });
                                        //                this.setState({ goalies: goalies }, function () {
                                        //                })
                                        //            }
                                        //        }
                                        //    }.bind(this),
                                        //    error: function (xhr, status, error) {
                                        //        console.log(error);
                                        //    }
                                        //})                                                                                 
                                    }

                                }
                            }.bind(this),
                            error: function (xhr, status, error) {
                                console.log(error);
                            }
                        })
                    }.bind(this))
        //  }.bind(this),
        //error: function (xhr, status, error) {
        //    console.log(error);
        // }
        // })        
        //}.bind(this))
                }.bind(this))
            this.setState({ newSalaries: salariesArray })                        
        }        

        //if (this.mounted === true) {
            //var salariesPost = this.state.salaries;
            //var url = '/set_players';
            //var data = [{ id: 7, firstname: "A", lastname: "B", position: 'C', projectedScore: 'D', salary: 1, image: "text" }];
            //var datas = JSON.stringify(data)
            //fetch(url, {
                //headers: { 'content-type': "application/json" },
                //method: 'POST', // or 'PUT'
                //body: datas, // data can be `string` or {object}!                
            //}).then(res => res.json())
                //.catch(error => console.error('Error:', error))
                //.then(response => console.log('Success:', response));
        //}

        
    }

    componentDidMount() {
        //this.getNHLStats();
    }

    componentWillUnmount() {
        this.mounted = false;
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
                    profile= {player.profile}
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
        this.processPlayers(this.state.centers, allPlayers);
        this.processPlayers(this.state.rightwings, allPlayers);
        this.processPlayers(this.state.leftwings, allPlayers);
        this.processPlayers(this.state.defensemen, allPlayers);
        this.processPlayers(this.state.goalies, allPlayers);
        this.processPlayers(this.state.newplayers, allPlayers);

        return (
            <div className="DisplayStats">

                <div className= "imagesDisplay">
                    <img className="rinkImage" src={rink} />
                    <img className="leftG" src={this.state.rinkPlayers.leftG[1]} />
                    <img className="leftD" src={this.state.rinkPlayers.leftD[1]} />
                    <img className="leftL" src={this.state.rinkPlayers.leftL[1]} />
                    <img className="leftC" src={this.state.rinkPlayers.leftC[1]} />
                    <img className="leftR" src={this.state.rinkPlayers.leftR[1]} />
                    <img className="rightL" src={this.state.rinkPlayers.rightL[1]} />
                    <img className="rightC" src={this.state.rinkPlayers.rightC[1]} />
                    <img className="rightR" src={this.state.rinkPlayers.rightR[1]} />
                    <img className="rightD" src={this.state.rinkPlayers.rightD[1]} />
                    <img className="rightG" src={this.state.rinkPlayers.rightG[1]} />
                </div>

                <div>
                    Salary Remaining: {this.state.salary}
                </div>

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