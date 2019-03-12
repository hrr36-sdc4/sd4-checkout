import React from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import axios from 'axios';
import '../styles/desc.scss';
import Media from 'react-media';

export default class ListDesc extends React.Component {
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
            open: false,
            listingId: (Math.floor(Math.random()*2000000) + 8000000).toString()
        }
    }
    componentDidMount() {
        this.fetchRoom();
    }

    fetchRoom() {
        axios.get(path.join('rooms', this.state.listingId))
        .then((results) => {
            this.setState({
            maxGuests: results.data[0].guests,
            title: results.data[0].title,
            address: results.data[0].address,
            highlights: results.data[0].highlights,
            introDesc: results.data[0].introDesc,
            spaceDesc: results.data[0].spaceDesc,
            guestDesc: results.data[0].guestDesc,
            otherDesc: results.data[0].otherDesc
            });
        })
        .catch(err => console.log(err));
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
                <div>
                    <Media query="(max-width: 576px)">
                        {matches =>
                            matches ? (
                                <div>
                                    <div className="headers">
                                        <div><i className="fas fa-paw"></i> {this.state.maxGuests} guests</div>
                                        <div><i className="fas fa-tree"></i> {Math.ceil(this.state.maxGuests / 2)} bedrooms</div>
                                    </div>
                                    <div className="headers">
                                        <div><i className="fas fa-bed"></i> {this.state.maxGuests} beds</div>
                                        <div><i className="fas fa-water"></i> {Math.ceil(this.state.maxGuests / 2)} baths</div>
                                    </div>

                                </div>
                            ) : (
                                <div>
                                    <div className="headers">
                                        <div><i className="fas fa-paw"></i> {this.state.maxGuests} guests</div>
                                        <div><i className="fas fa-tree"></i> {Math.ceil(this.state.maxGuests / 2)} bedrooms</div>
                                        <div><i className="fas fa-bed"></i> {this.state.maxGuests} beds</div>
                                        <div><i className="fas fa-water"></i> {Math.ceil(this.state.maxGuests / 2)} baths</div>
                                    </div>

                                </div>
                            )
                        }
                    </Media>
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
                    <React.Fragment>{'Hide '}<i className="fas fa-angle-up"></i></React.Fragment> : 
                    <React.Fragment>{'Read more about the space '}<i className="fas fa-angle-down"></i></React.Fragment>}
                </button>
            </div>
        )
    }
}
