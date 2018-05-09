import React, { Component } from 'react';

class SelectedPlayers extends Component {

    handleButtonClick(id) {
        this.props.salaryCallback("remove", this.props.salary);
        this.props.removePlayersCallback(id, this.props.pos, true);
        this.props.removePicturesCallback(id, this.props.pos);
    }

    render() {

        return (
            <tr className="tbackground">
                <td className="name">{this.props.name} </td>
                <td className="position">{this.props.pos} </td>
                <td className="scoreProjection">{this.props.scoreproj} </td>
                <td className="salary">{this.props.salary} </td>
                <td > <button className="remove" onClick={(e) => this.handleButtonClick(this.props.id)}>Remove </button></td>
            </tr>
        );
    }
}

export default SelectedPlayers;