import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import AvailablePlayers from './AvailablePlayers';
import salariesData from './data/salaries.json';
import players from './data/allPlayers.json';
import rink from './images/rinkImage.png';
import './play.css';
import placeholder from './images/placeholder.png';
import SelectedPlayers from './SelectedPlayers';
import { auth } from '../firebase';

//1: Get all players by team id https://statsapi.web.nhl.com/api/v1/teams/15/roster (store their links)
//2.1: Grab their gameLog https://statsapi.web.nhl.com/{playerlink}/stats?stats=gameLog&season=20172018 and check if they play that day (2018-04-07). if they do play, store info in array
//2.2: Note that this is because we cannot check the players' "next" games since the season is over. Implementation for getting players available next day will be slightly different (checking teams' next game dates)
//3: Get their 2016-2017 stats by using https://statsapi.web.nhl.com/{playerlink}/stats?stats=statsSingleSeason&season=20162017. calculate salary based on fantasy points total/games played
//4: Display all players by category (code: G,D,L,R,C, newplayer)

class DisplayStats extends Component {

    constructor() {
        super();
        this.mounted = true;
        this.state = {
            salary: 9000,
            stats: [],
            added: false,

            allPlayers: [],

            availablePositions: ['C', 'C', 'D', 'D', 'L', 'L', 'R', 'R', 'G', 'G'],
            playersChosen: [],

            centers: [],
            defensemen: [],
            rightwings: [],
            leftwings: [],
            goalies: [],
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
            rinkPlayers: { leftG: [0, placeholder], leftD: [0, placeholder], leftL: [0, placeholder], leftR: [0, placeholder], leftC: [0, placeholder], rightG: [0, placeholder], rightD: [0, placeholder], rightL: [0, placeholder], rightR: [0, placeholder], rightC: [0, placeholder] },
            salaryControls: "salaryControls"
        }
    }

    updatePlayers = (position, playerLink, name, salary, profile, scoreprojection) => {
        this.state.playersChosen.push(
            <SelectedPlayers
                key={playerLink}
                name={name}
                salary={salary}
                pos={position}
                id={playerLink}
                scoreproj={scoreprojection}
                salaryCallback={this.updateSalary}
                removePlayersCallback={this.removePlayers}
                removePicturesCallback={this.removePicture}
            />);
        var playersChosen = this.state.playersChosen;
        this.setState({ playersChosen: playersChosen })

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


    }

    removePlayers = (id, position, addPosition) => {

        if (addPosition === true) {
            var newPosAvailableArray = this.state.availablePositions;
            newPosAvailableArray.push(position);

            this.setState({ availablePositions: newPosAvailableArray })
        }

        var newPlayersChosen = [];
        this.state.playersChosen.forEach(function (row) {
            if (row.key !== id) {

                newPlayersChosen.push(row)
            }

        })
        this.setState({ playersChosen: newPlayersChosen })


    }

    removePicture = (id, position) => {
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
            this.setState({ salary: this.state.salary - salary });
        }
        else {
            this.setState({ salary: this.state.salary + salary });
        }
    }

    flashSalary = () => {
        var that = this;
        this.setState({salaryControls: "salaryFlash"})        
        setTimeout(function () {
            that.setState({ salaryControls: "salaryControls" })
        },750)
    }

    handleCreateContract() {
        console.log("create")
        //TODO: use abi to create smart contract. Listener to alert success
        //TODO: also send team to back-end via post for storage and competition withdrwa
    }

    componentWillMount() {
        this.mounted = true;

        if (auth.getUser() !== null) {
            auth.getUser().getIdToken().then(
                idToken => {
                    if (this.mounted === true) {
                        console.log(idToken)
                        this.setState({ uid: idToken })
                    }
                }
            )
        }

        if (this.mounted === true) {
            var salariesArray;
            fetch('/get_players')
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJSON) {
                    var salariesArray = myJSON['data'];                  

                    salariesArray.forEach(function (playerobject) {
                        var playerlink = "/api/v1/people/" + playerobject['id']

                        var playerlogURL = 'https://statsapi.web.nhl.com' + playerlink + '/stats?stats=gameLog&season=20172018'
 

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
                                    }

                                }
                            }.bind(this),
                            error: function (xhr, status, error) {
                                console.log(error);
                            }
                        })
                    }.bind(this))
                }.bind(this))
            this.setState({ newSalaries: salariesArray })                        
        }                
    }

    componentWillUnmount() {
        this.mounted = false;
        this.added = false;
    }

    processPlayers(playersList, allPlayers) {
        playersList.forEach(function (player) {             
            allPlayers.push(
                <AvailablePlayers
                    key={player.link}
                    name={player.playerName}
                    pos={player.position}
                    scoreproj={player.score}
                    salary={player.salary}
                    id={player.link}
                    profile={player.profile}
                    salaryCallback={this.updateSalary}
                    updatePlayersCallback={this.updatePlayers}
                    availableSalary={this.state.salary}
                    availablePositions={this.state.availablePositions}
                    playersChosen={this.state.playersChosen}
                    salaryFlashCallback={this.flashSalary}
                />
            )
        }.bind(this))
        this.state.added = false;
    }

    render() {
        var allPlayers = [];
        this.processPlayers(this.state.centers, allPlayers);
        this.processPlayers(this.state.rightwings, allPlayers);
        this.processPlayers(this.state.leftwings, allPlayers);
        this.processPlayers(this.state.defensemen, allPlayers);
        this.processPlayers(this.state.goalies, allPlayers);
        if (this.state.added === false) {
            this.state.added = true;
            this.state.allPlayers = allPlayers;
        }

        return (
            <div className="DisplayStats">

                <div className="imagesDisplay">                   
                    <img className="rinkImage" src={rink} alt={placeholder}/>
                    <img className="leftG" src={this.state.rinkPlayers.leftG[1]} alt={placeholder} />
                    <img className="leftD" src={this.state.rinkPlayers.leftD[1]} alt={placeholder}/>
                    <img className="leftL" src={this.state.rinkPlayers.leftL[1]} alt={placeholder}/>
                    <img className="leftC" src={this.state.rinkPlayers.leftC[1]} alt={placeholder}/>
                    <img className="leftR" src={this.state.rinkPlayers.leftR[1]} alt={placeholder}/>
                    <img className="rightL" src={this.state.rinkPlayers.rightL[1]} alt={placeholder}/>
                    <img className="rightC" src={this.state.rinkPlayers.rightC[1]} alt={placeholder}/>
                    <img className="rightR" src={this.state.rinkPlayers.rightR[1]} alt={placeholder}/>
                    <img className="rightD" src={this.state.rinkPlayers.rightD[1]} alt={placeholder}/>
                    <img className="rightG" src={this.state.rinkPlayers.rightG[1]} alt={placeholder}/>
                </div>

                <div className="AddPlayers">

                <div className = "headerControls">
                        <h3> Player Selection </h3>
                        <div className={this.state.salaryControls}>
                            Salary Remaining: {this.state.salary}
                        </div>         
                        <button className="submitContract" onClick={(e) => this.handleCreateContract()}> Create Contract </button> 
                </div> 
                
                <div className = "tables">                                                
                        <h3 className = "tableHeaders"> Your Team </h3>
                        <Table striped bordered condensed hover className="tbackground">
                            <thead className="thead">
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Score projection</th>
                            <th>Salary</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.playersChosen}
                    </tbody>
                </Table>

                <h3 className = "tableHeaders"> Available Players </h3>
                <Table striped bordered condensed hover>
                            <thead className="thead">
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Score projection</th>
                            <th>Salary</th>
                            <th>Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allPlayers}
                    </tbody>
                        </Table>
                </div>

                </div>
            </div>
        );
    }
}

export default DisplayStats;