import React, { Component } from 'react';
import './play.css';

class StatGoalie extends Component {

    handleButtonClick(id) {
        this.props.salaryCallback("remove", this.props.salary);
        this.props.removePlayersCallback(id,this.props.pos,true);
        this.props.removePicturesCallback(id, this.props.pos);
    }

    render() {
        //salary, button
        let points = this.props.sav * 1 - this.props.ga * 5 + this.props.so*10;
        return (
            <tr className="StatGoalie">
                <td className="playername">{this.props.name} </td>
                <td className="position"> {this.props.pos} </td>
                <td className="SAV">{this.props.sav} </td>
                <td className="GA">{this.props.ga} </td>
                <td className="SO">{this.props.so} </td>
                <td className="Salary"> {this.props.salary} </td>
                <td className="FantasyPoints">{points} </td>
                <td > <button className="remove" onClick={(e) => this.handleButtonClick(this.props.id)}>Remove</button></td>
            </tr>
        );
    }
}

export default StatGoalie;