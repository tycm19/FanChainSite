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

const tooltip = (
    <Tooltip id="tooltip">
        <strong>Holy guacamole!</strong> Check this info.
    </Tooltip>
)


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
        if (this.props.availableSalary > this.props.salary) {        
            var playerAdded = false;
            if (this.props.availablePositions.indexOf(this.props.pos) !== -1) {
                this.props.playersChosen.forEach(function (row) {
                    if (row.key === id) {
                        playerAdded = true;
                    }
                })
                if (playerAdded !== true) {
                    this.props.salaryCallback("add", this.props.salary);
                    this.props.updatePlayersCallback(this.props.pos, id, this.props.name, this.props.salary, this.props.profile, this.props.scoreproj );
                    this.setState({ tooltip: "Success!" })
                } else {
                    this.setState({ tooltip: "Player already added" })
                }
            } else {
                this.setState({ tooltip: "Position: " + this.props.pos+ " not available" })
            }                   
        } else {
            //TODO: popup windows/notifs- less intrusive if possible
            this.setState({ tooltip: "Not enough salary: " + this.props.availableSalary })
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

    render() {
       
        return (
            <tr className="AvailablePlayer">
                <td className="name">{this.props.name} </td>
                <td className="position">{this.props.pos} </td>
                <td className="scoreProjection">{this.props.scoreproj} </td>
                <td className="salary">{this.props.salary} </td>
                <td>                        
                    <div>                        
                        <OverlayTrigger trigger='click' placement="right" overlay={tooltip}>
                            <button className="addPlayer" onClick={(e) => this.handleButtonClick(this.props.id)}>Add</button>                        
                        </OverlayTrigger>
                    </div>    
                </td>
            </tr>
        );
    }
}

export default AvailablePlayers;