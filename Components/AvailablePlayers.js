import React, { Component } from 'react';
import './play.css';
import Modal from 'react-modal';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class AvailablePlayers extends Component {

    constructor() {
        super();
        this.state = {
            //modalIsOpen: false,
            tooltip: "success"
        }

        //this.openModal = this.openModal.bind(this);
        //this.afterOpenModal = this.afterOpenModal.bind(this);
        //this.closeModal = this.closeModal.bind(this);
    }

    //openModal() {
    //    this.setState({ modalIsOpen: true });
    //}

    //afterOpenModal() {
    //    this.text.style.color = '#000000';
    //}

    //closeModal() {
    //    this.setState({ modalIsOpen: false });
    //}

    handleButtonClick(id) {

        var playerAdded = false;
        this.props.playersChosen.forEach(function (row) {
            if (row.key === id) {
                playerAdded = true;
            }
        })
        if (playerAdded !== true) {
            if (this.props.availableSalary > this.props.salary) {
                if (this.props.availablePositions.indexOf(this.props.pos) !== -1) {
                    this.props.salaryCallback("add", this.props.salary);
                    this.props.updatePlayersCallback(this.props.pos, id, this.props.name, this.props.salary, this.props.profile, this.props.scoreproj);
                } else {
                    var that = this;
                    this.setState({ pos: "flashRed" });
                    setTimeout(function () {
                        that.setState({ pos: "position" + that.props.pos })
                    }, 750)
                }
            } else {
                this.props.salaryFlashCallback();
            }
        } else {
            var that = this;
            this.setState({ name: "flashRed" });
            setTimeout(function () {
                that.setState({ name: that.props.name })
            }, 750)
        }

        

        //this.openModal()
        //<Modal
        //isOpen = { this.state.modalIsOpen }
        //onAfterOpen = { this.afterOpenModal }
        //onRequestClose = { this.closeModal }
        //style = { customStyles }
        //contentLabel = "notificationModal"
        //ariaHideApp = { false}
        //className = "modalStyles" >

            //<div ref={text => this.text = text} className="modaltext" >{this.state.tooltip}</div>
            //<button className="modalButton" onClick={this.closeModal}>Close</button>
                        //</Modal >
    }

    componentWillMount() {
        this.state.pos = this.props.pos
        this.state.name = this.props.name
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