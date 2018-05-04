import React, { Component } from 'react';

class AddressInput extends Component {

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div className="AddressInput">
                <form onSubmit={this.handleSubmit.bind(this)}> 
                    <div>
                        Username: <input type="text" ref="username" />
                        Password:  <input type="password" ref="pass" />
                    </div>
                    <div>
                        <input type="submit" value="Submit" />
                    </div> 
                </form> 
            </div>
        );
    }
}

export default AddressInput;