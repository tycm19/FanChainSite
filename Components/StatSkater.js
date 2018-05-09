import React, { Component } from 'react';
import './play.css';

class StatSkater extends Component {

    handleButtonClick(id) {
        this.props.salaryCallback("remove", this.props.salary);
        this.props.removePlayersCallback(id,this.props.pos,true);
        this.props.removePicturesCallback(id, this.props.pos);
    }

    render() {
        //salary, button
        let points = this.props.assist * 5 + this.props.evg * 7 + this.props.ppg * 8 + this.props.shg * 10 + this.props.sog + this.props.hits + this.props.blk ;
        return (
            <tr className="StatSkater">
                <td className="playername">{this.props.name} </td>
                <td className="position"> {this.props.pos} </td>
                <td className="AST">{this.props.assist} </td>
                <td className="EVG">{this.props.evg} </td>
                <td className="PPG">{this.props.ppg} </td>
                <td className="SHG">{this.props.shg} </td>
                <td className="SOG">{this.props.sog} </td>
                <td className="Hits">{this.props.hits} </td>
                <td className="BLK">{this.props.blk} </td>
                <td className="Salary">{this.props.salary} </td>
                <td className="FantasyPoints">{points} </td>
                <td > <button className="remove" onClick={(e) => this.handleButtonClick(this.props.id)}>Remove </button></td>
            </tr>
        );
    }
}

export default StatSkater;