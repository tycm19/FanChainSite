import React, { Component } from 'react';
import placeholder from './images/placeholder.png';

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
                <td className="tableProfile"> <img className="tablepic" src={this.props.profile.src} alt={placeholder} /> </td>
                <td className="position">{this.props.pos} </td>
                <td className="scoreProjection">{this.props.scoreproj} </td>
                <td className="salary">{this.props.salary} </td>
                <td className="buttoncolumn"> <button className="remove" onClick={(e) => this.handleButtonClick(this.props.id)}>Remove </button></td>
            </tr>
        );
    }
}

export default SelectedPlayers;