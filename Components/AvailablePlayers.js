import React, { Component } from 'react';
import './play.css';
import 'bootstrap/dist/css/bootstrap.css';


class AvailablePlayers extends Component {

    constructor() {
        super();
        this.state = {
            tooltip: "success"
        }

    }

    handleButtonClick(id) {

        var playerAdded = false;
        this.props.playersChosen.forEach(function (row) {
            if (row.key === id) {
                playerAdded = true;
            }
        })
        if (playerAdded !== true) {
            var that;
            if (this.props.availableSalary > this.props.salary) {
                if (this.props.availablePositions.indexOf(this.props.pos) !== -1) {
                    this.props.salaryCallback("add", this.props.salary);
                    this.props.updatePlayersCallback(this.props.pos, id, this.props.name, this.props.salary, this.props.profile, this.props.scoreproj);
                } else {
                    that = this;
                    this.setState({ pos: "flashRed" });
                    setTimeout(function () {
                        that.setState({ pos: "position" + that.props.pos })
                    }, 750)
                }
            } else {
                this.props.salaryFlashCallback();
            }
        } else {
            that = this;
            this.setState({ name: "flashRed" });
            setTimeout(function () {
                that.setState({ name: that.props.name })
            }, 750)
        }
    }

    componentWillMount() {
        this.setState({ pos: this.props.pos });
        this.setState({ name: this.props.name });
    }

    render() {
        return (
            <tr className="tbackground">
                <td className={this.state.name}>{this.props.name} </td>
                <td className={this.state.pos}>{this.props.pos} </td>
                <td className="scoreProjection">{this.props.scoreproj} </td>
                <td className="salary">{this.props.salary} </td>
                <td>                        
                    <div>                        
                    <button className="addPlayer" onClick={(e) => this.handleButtonClick(this.props.id)}>Add</button>                        
                    </div>    
                </td>
            </tr>
        );
    }
}

export default AvailablePlayers;