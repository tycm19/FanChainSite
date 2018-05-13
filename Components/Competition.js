import React, { Component } from 'react';
import StatSkater from './StatSkater';
import StatGoalie from './StatGoalie';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { auth } from '../firebase';

class Competition extends Component {
    
    constructor() {
        super();
        this.mounted = true;
        this.state = {
            skatersChosen: [],
            goaliesChosen: [],
            uid: undefined
        }
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

                    //TODO: POST idtoken and date. Rreceive JSON of ids used in call for displayStats();
                }
            )
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleSubmit(e) {
        e.preventDefault();
        //Loop through all the player links/IDs
        //first ajax call to get name, code (position), 

        //var playerURL = 'https://statsapi.web.nhl.com' + playerLink + '/stats?stats=gameLog';
       
        //$.ajax({
            //url: playerURL,
            //dataType: 'json',
            //cache: false,
            //success: function (stats) {
                    //var statLine = stats['stats'][0]['splits'][0]['stat'];      
                    //if (position === 'G') {
                        //this.state.goaliesChosen.push(
                            //<StatGoalie
                                //key={playerLink}
                                //name={name}
                                //sav={statLine['saves']}
                                //ga={statLine['goalsAgainst']}
                                //so={statLine['shutouts']} 
                                //id={playerLink}
                                //pos={position}
                            ///>);
                        //var goalies = this.state.goaliesChosen;
                        //this.setState({ goaliesChosen: goalies })

                    //}
                    //else {
                        //var goals = statLine['goals'];
                        //var ppgs = statLine['powerPlayGoals'];
                        //var shgs = statLine['shortHandedGoals'];
                        //this.state.skatersChosen.push(
                            //<StatSkater
                                //key={playerLink}
                                //name={name}
                                //assist={parseInt(statLine['assists'], 10)}
                                //evg={goals - ppgs - shgs}
                                //ppg={ppgs}
                                //shg={shgs}
                                //sog={parseInt(statLine['shots'], 10)}
                                //hits={parseInt(statLine['hits'], 10)}
                                //blk={parseInt(statLine['blocked'], 10)} 
                                //id={playerLink}
                                //pos={position}
                            ///>);
                        //var skaters = this.state.skatersChosen;
                        //this.setState({ skatersChosen: skaters })
                    //}
                //}
            //}.bind(this),
            //error: function (xhr, status, error) {
                //console.log(error);
            //}
        //})
    }

    render() {
        return (
            <div className="Competition">               

                <Table striped bordered condensed hover>
                    <thead className="tbackground">
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
                    <thead className="tbackground">
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

            </div>
        );
    }
}

export default Competition;