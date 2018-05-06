import React, { Component } from 'react';

class AvailablePlayers extends Component {
    handleButtonClick(id) {
        if (this.props.availableSalary > this.props.salary) {        
            var playerAdded = false;
            
            if (this.props.availablePositions.indexOf(this.props.pos) !== -1) {
                if (this.props.pos === 'G') {
                    this.props.goaliesChosen.forEach(function (row) {
                        if (row.key === id) {
                            playerAdded = true;
                        }
                    })    
                    if (playerAdded !== true) {
                        this.props.salaryCallback("add", this.props.salary);
                        this.props.updatePlayersCallback(this.props.pos, id, this.props.name, this.props.salary, this.props.profile);
                    } else {
                        console.log("player already added");
                    }
                }
                else {
                    this.props.skatersChosen.forEach(function (row) {
                        if (row.key === id) {
                            playerAdded = true;
                        }
                    })
                    if (playerAdded !== true) {
                        this.props.salaryCallback("add", this.props.salary);
                        this.props.updatePlayersCallback(this.props.pos, id, this.props.name, this.props.salary, this.props.profile);
                    } else {
                        console.log("player already added");
                    }
                }
            }                        
        } else {
            //TODO: popup windows/notifs- less intrusive if possible
            console.log("not enough salary")
        }
    }

    render() {
       
        return (
            <tr className="AvailablePlayer">
                <td className="name">{this.props.name} </td>
                <td className="position">{this.props.pos} </td>
                <td className="scoreProjection">{this.props.scoreproj} </td>
                <td className="salary">{this.props.salary} </td>
                <td className="addPlayer"> <button onClick={(e) => this.handleButtonClick(this.props.id)}>Add</button></td>
            </tr>
        );
    }
}

export default AvailablePlayers;