import React from 'react';
import ReactDOM from 'react-dom';
import Media from 'react-media';
import Modal from 'react-modal';
import path from 'path';
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';
import './styles/input.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import FormBot from './components/form-bot.jsx';
import Header from './components/form-top.jsx';

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nightlyPrice: 0,
      reviews: 0,
      stars: 0,
      cleaningFee: 0,
      serviceFee: 0,
      minNights: 0,
      maxGuests: 0,
      numGuests: 1,
      numNights: 0,
      showPayment: false,
      startDate: null,
      endDate: null,
      focusedInput: null,
      reservedDays: [],
      modalOpen: false,
      listingId: (Math.floor(Math.random()*2000000) + 8000000).toString()
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalOpen: true});
  }
  closeModal() {
    this.setState({modalOpen: false});
  }

  componentDidMount() {
    this.fetchRoom();
    this.fetchBookings();
  }

// Get request for listing information
  fetchRoom() {
    axios.get(path.join('rooms', this.state.listingId))
      .then((results) => {
        this.setState({
          nightlyPrice: results.data[0].price,
          reviews: results.data[0].reviews,
          stars: results.data[0].stars,
          cleaningFee: results.data[0].cleaningFee,
          maxGuests: results.data[0].guests,
          serviceFee: results.data[0].serviceFee,
          minNights: results.data[0].minNights,
        });
      })
      .catch(err => console.log(err));
  }

// Get request to server. Populates blockedDays with ranges
// Clears the reservedDays to prevent duplicate entries and reduce memory
  fetchBookings() {
    this.setState({
      reservedDays: []
    });
    axios.get(path.join('rooms', 'bookings', this.state.listingId))
      .then((results) => {
        for (var i = 0; i < results.length; i++) {
          var newState = this.state.reservedDays.concat([[results[i].checkin, results[i].checkout]]);
          this.setState({
            reservedDays: newState
          });
        }
      })
      .catch(err => console.log(err));
  }

  // Checks to see if any dates between start and end have already been booked
  checkOpenings(event, data) {
    event.preventDefault();
    var conflict = false;
    var resDates = this.state.reservedDays;

    if (this.state.startDate === null || this.state.endDate === null) {
      conflict = true;
    } else {

      for (var j = 0; j < resDates.length; j++) {
        if (moment(resDates[j][0], "MM-DD-YYYY").isBetween(this.state.startDate, this.state.endDate)) {
          conflict = true;
          break;
        }
      }
    }

    // If conflict in dates, resets startDate and endDate to null
    // Else, calls makeReservation and does POST request to the server
    if (conflict) {
      this.setState({
        startDate: null,
        endDate: null,
        showPayment: false
      });
      
      if (this.state.modalOpen === true) {
        $("<div class='warning'>Please select a valid range of dates</div>").prependTo('.checkout-modal').fadeOut(1500);
      } else if (this.state.modalOpen === false) {
        $("<div class='warning'>Please select a valid range of dates</div>").prependTo('#app').fadeOut(1500);
      }
      conflict = false;
    } else {   
      this.makeReservation(data);
    }
  }

  // Makes post request to server to add reservation to bookings table
  makeReservation(reservationInfo) {
    // Takes the date from the moment and replaces the / with - for entry into the database
    var checkin = this.state.startDate.format('L').replace(/[/]/g, '-');
    var checkout = this.state.endDate.format('L').replace(/[/]/g, '-');
    const data = {
      checkIn: checkin,
      checkOut: checkout,
      numGuests: reservationInfo.guests,
      total: reservationInfo.total
    };
    axios.post(path.join('rooms', 'bookings', this.state.listingId), data)
      .then(() => {
        this.fetchBookings();
        this.setState({
          startDate: null,
          endDate: null,
          numNights: 0,
          numGuests: 1,
          showPayment: false
        });
        if (this.state.modalOpen === true) {
          $("<div class='warning'>Successfully booked</div>").prependTo('.checkout-modal').fadeOut(2000);

        } else if (this.state.modalOpen === false) {
          $("<div class='warning'>Successfully booked</div>").prependTo('#app').fadeOut(2000);
        }
      })
      .catch(err => console.log(err));
  }

  // Calculates the number of nights the reservation is
  // Only calculates if both startDate and endDate have non-null values
  calculateDays() {
    var resDates = this.state.reservedDays;
    var conflict = false;

    if (this.state.startDate !== null && this.state.endDate !== null) {
      for (var j = 0; j < resDates.length; j++) {
        if (moment(resDates[j][0], "MM-DD-YYYY").isBetween(this.state.startDate, this.state.endDate)) {
          conflict = true;
          break;
        }
      }

      if (conflict) {
        this.setState({
          startDate: null,
          endDate: null,
          showPayment: false
        });
        
        if (this.state.modalOpen === true) {
          $("<div class='warning'>Please select a valid range of dates</div>").prependTo('.checkout-modal').fadeOut(1500);
        } else if (this.state.modalOpen === false) {
          $("<div class='warning'>Please select a valid range of dates</div>").prependTo('#app').fadeOut(1500);
        }
      } else {
        this.setState({
          numNights: (this.state.endDate).diff(this.state.startDate, 'days'),
          showPayment: true
        })
      }
    } else {
      console.log('null');
      this.setState({
        numNights: 0,
        showPayment: false
      })
    }
  }

  // Checks each date in the calendar against the ranges for blockedDates
  // If the range contains the date, returns true and blocks the date
  isDayBlocked(day) {
    var resDates = this.state.reservedDays;
    for (var i = 0; i < resDates.length; i++) {
      if (day.isBetween(moment(resDates[i][0], "MM-DD-YYYY"), moment(resDates[i][1], "MM-DD-YYYY"), 'days', '[]')) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
        <div>
          <Media query="(min-width: 1200px)">
            {matches =>
              matches ? (
              <div>
                <div>
                  <Header info={this.state}/>
                </div>
                <div className="text-header">Dates</div>
                <div>
                  <DateRangePicker
                    startDateId="startDate"
                    endDateId="endDate"
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onDatesChange={({ startDate, endDate }) => { 
                      this.setState({ startDate, endDate }, () => {this.calculateDays()})
                    }}
                    focusedInput={this.state.focusedInput}
                    showClearDates={true}
                    numberOfMonths={1}
                    calendarInfoPosition={"bottom"}
                    renderCalendarInfo={() => {
                      return <div className="info"> 
                        <div>{this.state.minNights + ' night(s) minimum'}</div>
                        <div>{this.state.maxGuests + ' guests allowed'}</div>
                      </div>
                      }}
                    hideKeyboardShortcutsPanel={true}
                    minimumNights={this.state.minNights}
                    isDayBlocked={this.isDayBlocked.bind(this)}
                    onFocusChange={(focusedInput) => { 
                      this.setState({ focusedInput })
                    }}
                  />
                </div>
                <div>
                  <FormBot checkOpenings={this.checkOpenings.bind(this)} details={this.state}/>
                </div>
              </div>
              ) : (
                <div>
                  <div>
                    <div className="footer">
                      <Header info={this.state} />
                      <button className="sub-but" onClick={this.openModal}>BOOK</button>
                    </div>

                    {/* Popup checkout module */}
                    <Modal
                      isOpen={this.state.modalOpen}
                      onRequestClose={this.closeModal}
                      className="checkout-modal"
                      overlayClassName="checkout-overlay"
                    >
                      <button className="close-but" onClick={this.closeModal}>X</button>

                      <div>
                        <Header info={this.state}/>
                      </div>
                      <div className="text-header">Dates</div>
                      <div>
                        <DateRangePicker
                          startDateId="startDate"
                          endDateId="endDate"
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          onDatesChange={({ startDate, endDate }) => { 
                            this.setState({ startDate, endDate }, () => {this.calculateDays()})
                          }}
                          focusedInput={this.state.focusedInput}
                          showClearDates={true}
                          numberOfMonths={1}
                          calendarInfoPosition={"bottom"}
                          renderCalendarInfo={() => {
                            return <div className="info"> 
                              <div>{this.state.minNights + ' night(s) minimum'}</div>
                              <div>{this.state.maxGuests + ' guests allowed'}</div>
                            </div>
                            }}
                          hideKeyboardShortcutsPanel={true}
                          minimumNights={this.state.minNights}
                          isDayBlocked={this.isDayBlocked.bind(this)}
                          onFocusChange={(focusedInput) => { 
                            this.setState({ focusedInput })
                          }}
                        />
                      </div>
                      <div>
                        <FormBot checkOpenings={this.checkOpenings.bind(this)} details={this.state}/>
                      </div>
                    </Modal>
                  </div>
                </div>
              )
            }
          </Media>
        </div>
    )
  }
}

export default Checkout;
ReactDOM.render(<Checkout />, document.getElementById('app') || document.createElement('div'));