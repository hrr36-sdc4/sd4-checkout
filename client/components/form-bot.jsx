import React from 'react';
// Component for the bottom portion of the checkout module. Displays the number of numbers booked,
// various fees associated with the listing, and the total price of the reservation
class FormBot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            total: 0,
        }
    }
    // Methods to increase or decrease the number of guests. Has logic that cap the guests
    decrease() {
        if (this.state.guests - 1 > 0) {
            this.setState({
                guests: this.state.guests - 1
            });
        }
    }
    increase() {
        if (this.state.guests + 1 <= this.props.details.maxGuests) {
            this.setState({
                guests: this.state.guests + 1
            });
        }
    }

    // Conditional rendering, checking if startDate and endDate are both not null
    render() {
        if (this.props.details.showPayment) {
            return(
            <div className="form-form">
                <div className="form-line">
                    <div>Guests: </div>
                    <div className="line-value">
                    <button onClick={this.decrease.bind(this)} className="minus"> - </button>
                    {this.state.guests}
                    <button onClick={this.increase.bind(this)} className="plus"> + </button>
                    </div>
                </div>
                <div className="form-line">
                    <div>{this.props.details.numNights} night(s) x ${this.props.details.nightlyPrice}</div>
                    <div>${this.props.details.numNights * this.props.details.nightlyPrice}</div>
                </div>
                <div className="form-line">
                    <div>Service Fee:</div>
                    <div>${this.props.details.serviceFee}</div>
                </div>
                <div className="form-line">
                    <div>Cleaning Fee: </div> 
                    <div>${this.props.details.cleaningFee}</div>
                </div>
                <div className="form-total">
                    <div>Total: </div> 
                    <div>${this.props.details.numNights * this.props.details.nightlyPrice + this.props.details.serviceFee + this.props.details.cleaningFee}</div>
                </div>
    
                 <form onSubmit={(event) => {
                     event.persist();
                     this.setState(
                        {total: this.props.details.numNights * this.props.details.nightlyPrice + this.props.details.serviceFee + this.props.details.cleaningFee},
                        () => this.props.checkOpenings(event, this.state)
                     )}}>
                   <input type="submit" className="sub-but" value="Book" />
                 </form>
            </div>
            )
        } else {
            return (
                <div>
                    <form onSubmit={(event) => {
                        event.persist();
                        this.setState(
                            {total: this.props.details.numNights * this.props.details.nightlyPrice + this.props.details.serviceFee + this.props.details.cleaningFee},
                            () => this.props.checkOpenings(event, this.state)
                        )}}>
        
                        <input type="submit" className="sub-but" value="Book" />
                    </form>
                </div>
            )
        }
    }
}

export default FormBot;