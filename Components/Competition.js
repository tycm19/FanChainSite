import React, { Component } from 'react';
import StatSkater from './StatSkater';
import StatGoalie from './StatGoalie';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

class Competition extends Component {

    constructor() {
        super();
        this.state = {
            skatersChosen: [],
            goaliesChosen: []
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        //var playerURL = 'https://statsapi.web.nhl.com' + playerLink + '/stats?stats=gameLog';

        //if (position === 'G') {
            //console.log(stats)
        //    this.state.goaliesChosen.push(
        //        <StatGoalie
        //            key={playerLink}
        //            name={name}
        //            sav={0}
        //            ga={0}
        //            so={0}
        //            salary={salary}
        //            id={playerLink}
        //            pos={position}
        //            salaryCallback={this.updateSalary}
        //            removePlayersCallback={this.removePlayers}
        //            removePicturesCallback={this.removePicture}
        //        />);
        //    var goalies = this.state.goaliesChosen;
        //    this.setState({ goaliesChosen: goalies })

        //}
        //else {
            //this.state.skatersChosen.push(
                //<StatSkater
                    //key={playerLink}
                    //name={name}
                    //assist={0}
                    //evg={0}
                    //ppg={0}
                    //shg={0}
                    //sog={0}
                    //hits={0}
                    //blk={0}
                    ////salary={salary}
                    //id={playerLink}
                    //pos={position}
                    //salaryCallback={this.updateSalary}
                    //removePlayersCallback={this.removePlayers}
                    //removePicturesCallback={this.removePicture}
                ///>);
            //var skaters = this.state.skatersChosen;
            //this.setState({ skatersChosen: skaters })
        //}

        //$.ajax({
            //url: playerURL,
            //dataType: 'json',
            //cache: false,
            //success: function (stats) {
                //var playerRemoved = true;
                    //if (position === 'G') {
                        //this.state.goaliesChosen.forEach(function (row) {
                            //if (row.key === playerLink) {
                                //playerRemoved = false;
                            //}
                        //})
                    //}
                    //else {
                        //this.state.skatersChosen.forEach(function (row) {
                            //if (row.key === playerLink) {
                                //playerRemoved = false;
                            //}
                        //})
                    //}

                //if (playerRemoved === false) {
                    //this.removePlayers(playerLink, position,false)
                    //var statLine = stats['stats'][0]['splits'][0]['stat'];
                    //console.log(position) check positions valid                  
                    //if (position === 'G') {
                        //console.log(stats)
                        //this.state.goaliesChosen.push(
                            //<StatGoalie
                                //key={playerLink}
                                //name={name}
                                //sav={statLine['saves']}
                                //ga={statLine['goalsAgainst']}
                                //so={statLine['shutouts']}
                                //salary={salary}
                                //id={playerLink}
                                //pos={position}
                                //salaryCallback={this.updateSalary}
                                //removePlayersCallback={this.removePlayers}
                                //removePicturesCallback={this.removePicture}
                            ///>);
                        //var goalies = this.state.goaliesChosen;
                        //this.setState({ goaliesChosen: goalies })

                    //}
                    //else {
                        // console.log('added');
//                        var goals = statLine['goals'];
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
                                //salary={salary}
                                //id={playerLink}
                                //pos={position}
                                //salaryCallback={this.updateSalary}
                                //removePlayersCallback={this.removePlayers}
                                //removePicturesCallback={this.removePicture}
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