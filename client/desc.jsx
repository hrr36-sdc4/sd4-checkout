import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './styles/desc.scss';

class ListDesc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxGuests: 0,
            title: '',
            address: '',
            highlights: '',
            introDesc: '',
            spaceDesc: '',
            guestDesc: '',
            otherDesc: '',
            open: false
        }
    }
    componentDidMount() {
        this.fetchRoom();
    }

    fetchRoom() {
        $.ajax({
          url: '/rooms/1',
          type: 'GET',
          success: (results) => {
            console.log('results returned');
            // sets the state to include properties of the retrieved room
            this.setState({
                maxGuests: results[0].guests,
                title: results[0].title,
                address: results[0].address,
                highlights: results[0].highlights,
                introDesc: results[0].introDesc,
                spaceDesc: results[0].spaceDesc,
                guestDesc: results[0].guestDesc,
                otherDesc: results[0].otherDesc
            });
          },
          error: () => {
            console.log('err');
          }
        });
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        return(
            <div className="container">
                <div className="title">{this.state.title}</div>
                <div className="address">{this.state.address}</div>
                <div className="headers">
                    <div><i class="fas fa-paw"></i> {this.state.maxGuests} guests</div>
                    <div><i class="fas fa-tree"></i> {Math.ceil(this.state.maxGuests / 2)} bedrooms</div>
                    <div><i class="fas fa-bed"></i> {this.state.maxGuests} beds</div>
                    <div><i class="fas fa-water"></i> {Math.ceil(this.state.maxGuests / 2)} baths</div>
                </div>
                <div className="highlights">
                    <div className="section-header">HOME HIGHLIGHTS</div>
                    {this.state.highlights}
                </div>
                <div className="introDesc">{this.state.introDesc}</div>


                <div className={"extras" + (this.state.open ? ' open': ' close')}>
                    <div className="section-header">The Space</div>
                    <div className="spaceDesc">{this.state.spaceDesc}</div>
                    <div className="section-header">Interaction with guests</div>
                    <div className="guestDesc">{this.state.guestDesc}</div>
                    <div className="section-header">Other things to note</div>
                    <div className="otherDesc">{this.state.otherDesc}</div>
                </div>

                <button className="more-info" onClick={this.toggle.bind(this)}> 
                    {this.state.open ? 
                    <React.Fragment>{'Hide '}<i class="fas fa-angle-up"></i></React.Fragment>
                    : 
                    <React.Fragment>{'Read more about the space '}<i class="fas fa-angle-down"></i></React.Fragment>                    
                    }
                </button>
            </div>
        )
    }
}

ReactDOM.render(<ListDesc />, document.getElementById('desc'));