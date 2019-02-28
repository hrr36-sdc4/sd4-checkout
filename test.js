import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './client/components/form-top.jsx';
import FormBot from './client/components/form-bot.jsx';
import renderer from 'react-test-renderer';
import ListDesc from './client/desc.jsx';
import Checkout from './client/index.jsx';
import $ from 'jquery';
import moment from 'moment';

jest.mock('jquery');

Enzyme.configure({ adapter: new Adapter() });

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

describe('testing Stars component', () => {
  var state = {
    stars: 4,
    reviews: 400,
    nightlyPrice: 50
  }

  test('should have 4 full (.fas) stars and 1 empty (.far) star', () => {
    const wrapper = mount(<Header info={state} />);
    expect(wrapper.find('.fas.fa-star')).toHaveLength(4);
    expect(wrapper.find('.far.fa-star')).toHaveLength(1);
  });
  test('should have render a half star if star has a decimal between .25 and .75', () => {
    state.stars = 3.25;
    const wrapper = mount(<Header info={state} />);
    expect(wrapper.find('.fas.fa-star')).toHaveLength(3);
    expect(wrapper.find('.fas.fa-star-half-alt')).toHaveLength(1);
    expect(wrapper.find('.far.fa-star')).toHaveLength(1);

    state.stars = 3.75;
    const wrap = mount(<Header info={state} />);
    expect(wrap.find('.fas.fa-star')).toHaveLength(3);
    expect(wrap.find('.fas.fa-star-half-alt')).toHaveLength(1);
    expect(wrap.find('.far.fa-star')).toHaveLength(1);
  });
  test('should render a full star for decimal above .75', () => {
    state.stars = 3.8;
    const wrapper = mount(<Header info={state} />);
    expect(wrapper.find('.fas.fa-star')).toHaveLength(4);
    expect(wrapper.find('.fas.fa-star-half-alt')).toHaveLength(0);
    expect(wrapper.find('.far.fa-star')).toHaveLength(1);
  });
  test('should render a full star for decimal below .25', () => {
    state.stars = 3.24;
    const wrapper = mount(<Header info={state} />);
    expect(wrapper.find('.fas.fa-star')).toHaveLength(3);
    expect(wrapper.find('.fas.fa-star-half-alt')).toHaveLength(0);
    expect(wrapper.find('.far.fa-star')).toHaveLength(2);
  });
});

describe('Testing of props in Header component', () => {
  var state = {
    stars: 4,
    reviews: 400,
    nightlyPrice: 50
  }
  const wrapper = shallow(<Header info={state} />);

  test('should have stars component and number of reviewed inside one div', () => {
    expect(wrapper.find('.reviews').children).toHaveLength(1);
    expect(wrapper.find('.reviews').text()).toEqual('<Stars /> 400');
  });
  test('should render price per night in first child div', () => {
    expect(wrapper.childAt(0).text()).toEqual('$50 per night');
  });
  test('should take price from passed props', () => {
    state.nightlyPrice = 100;
    const wrapper = shallow(<Header info={state} />);
    expect(wrapper.childAt(0).text()).toEqual('$100 per night');
  });
});

describe('increasing and decreasing guests in FormBot', () => {
  var state = {
    showPayment: true,
    numNights: 3,
    nightlyPrice: 50,
    cleaningFee: 100,
    serviceFee: 20,
    maxGuests: 4,
  }

  const wrapper = mount(<FormBot details={state} />);

  test('should increase this.state.guests when "+" button is clicked', () => {
    wrapper.find('.plus').simulate('click');
    expect(wrapper.state('guests')).toBe(2);
  });
  test('should not exceed mexGuests', () => {
    wrapper.find('.plus').simulate('click');
    expect(wrapper.state('guests')).toBe(3);
    wrapper.find('.plus').simulate('click');
    expect(wrapper.state('guests')).toBe(4);
    wrapper.find('.plus').simulate('click');
    expect(wrapper.state('guests')).toBe(4);
  });
  
  test('should decrease this.state.guests when "+" button is clicked', () => {
    wrapper.setState({guests: 2});
    wrapper.find('.minus').simulate('click');
    expect(wrapper.state('guests')).toBe(1);
  });
  test('should not go below 1 guest', () => {
    wrapper.setState({guests: 2});
    wrapper.find('.minus').simulate('click');
    expect(wrapper.state('guests')).toBe(1);
    wrapper.find('.minus').simulate('click');
    expect(wrapper.state('guests')).toBe(1);
  });
});

describe('other functionality for FormBot', () => {
  var state = {
    showPayment: false,
    numNights: 3,
    nightlyPrice: 50,
    cleaningFee: 100,
    serviceFee: 20,
    maxGuests: 4,
  }

  const wrapper = mount(<FormBot details={state} />);

  test('should not render the bottom form info if showPayment is false', () => {
    expect(wrapper.find('.form-form')).toHaveLength(0);
  });

  test('should have a submit button that will trigger a total to upddate', () => {
    const checkOpenings = jest.fn();
    const wrapper = mount(<FormBot details={state} checkOpenings={checkOpenings} />);
    expect(wrapper.state('total')).toBe(0);
    wrapper.find('.sub-but').simulate('submit');
    expect(wrapper.state('total')).not.toBe(0);
  });

  test('should render the bottom form if showPayment is true', () => {
    state.showPayment = true;
    const wrapper = mount(<FormBot details={state} />);
    expect(wrapper.find('.form-form')).toHaveLength(1);
  });

  test('should update this.state.total when form is submitted', () => {
    const checkOpenings = jest.fn();
    const wrapper = mount(<FormBot details={state} checkOpenings={checkOpenings} />);
    expect(wrapper.state('total')).toBe(0);
    wrapper.find('.sub-but').simulate('submit');
    expect(wrapper.state('total')).not.toBe(0);
  });
});

describe("testing desc.jsx", () => {
  var wrapper = mount(<ListDesc />);

  test('should state.open when button is clicked', () => {
    expect(wrapper.state('open')).toBe(false);
    wrapper.find('.more-info').simulate('click')
    expect(wrapper.state('open')).toBe(true);
  });

  test('should make ajax request with correct params', () => {
    wrapper.instance().fetchRoom();
    expect($.ajax).toBeCalledWith({
      success: expect.any(Function),
      error: expect.any(Function),
      type: 'GET',
      url: '/rooms/1'
    });
  });

  //NOT WORKING <------------------------------------------------------------------
  test('should change state on successful ajax request',  () => {
    wrapper.instance().fetchRoom();
    $.ajax.mock.calls[0][0].success([{
      maxGuests: 4,
      title: `Michael's Testing Suite`,
      address: '888 Testing Drive',
      highlights: `Listing's highlights`,
      introDesc: `Listing's introduction description`,
      spaceDesc: `Listing's space description`,
      guestDesc: `Listing's guest interaction description`,
      otherDesc: `Listing's other descriptions`,
      open: true
    }]);

    expect(wrapper.state('maxGuests')).toBe(4);
  });
});

describe('testing Checkout component from index.jsx', () => { 
  const wrapper = mount(<Checkout />);

  describe('testing modalOpen methods', () => {
    test('should cause modalOpen value to become true when modalOpen executes', () => {
      expect(wrapper.state('modalOpen')).toBe(false);
      wrapper.instance().openModal();
      expect(wrapper.state('modalOpen')).toBe(true);
    });
  
    test('should cause modalOpen value to become false when closeModal executes', () => {
      wrapper.setState({openModal: true});
      expect(wrapper.state('modalOpen')).toBe(true);
      wrapper.instance().closeModal();
      expect(wrapper.state('modalOpen')).toBe(false);
    });

    test('should execute modalOpen when corresponding button is pressed', () => {
      wrapper.find('.footer .sub-but').simulate('click');
      expect(wrapper.state('modalOpen')).toBe(true);
    });

    test('should execute closeModal when corresponding button is pressed', () => {
      wrapper.find('.close-but').simulate('click');
      expect(wrapper.state('modalOpen')).toBe(false);
    });
  })

  
  
  describe('testing checkOpenings method', () => {
    const event = {
      preventDefault() {},
    };
    const data = {};
    const checkSpy = jest.spyOn(Checkout.prototype, 'makeReservation');
    
    test('should not call makeReservations if either start/endDate is null', () => {
      wrapper.setState({
        startDate: null,
        endDate: moment('05-23-2019', 'MM-DD-YYYY'),
        modalOpen: 'testing'
      });
      wrapper.instance().checkOpenings(event, data);
      expect(checkSpy).not.toHaveBeenCalled();

    });
    
    test('should not call makeReservations if reservedDays falls between startDate and endDate', () => {
      wrapper.setState({
        startDate: moment('05-23-2019', 'MM-DD-YYYY'),
        endDate: moment('05-26-2019', 'MM-DD-YYYY'),
        reservedDays: [['05-24-2019', '05-25-2019']],
        modalOpen: 'testing'
      });
      wrapper.instance().checkOpenings(event, data);
      expect(checkSpy).not.toHaveBeenCalled();
      
    });

    test('should call makeReservations if no checks fail', () => {
      wrapper.setState({
        startDate: moment('05-23-2019', 'MM-DD-YYYY'),
        endDate: moment('05-26-2019', 'MM-DD-YYYY'),
        reservedDays: [],
        modalOpen: 'testing'
      });
      wrapper.instance().checkOpenings(event, data);
      expect(checkSpy).toHaveBeenCalled();
    });
  });
  
  describe('testing calculateDays method', () => {
    test('should not change showPayment state or calculate nights if either start/end are null', () => {
      wrapper.setState({
        startDate: null,
        endDate: moment('05-23-2019', 'MM-DD-YYYY'),
      });
      wrapper.instance().calculateDays();
      expect(wrapper.state('showPayment')).toBe(false);
      expect(wrapper.state('numNights')).toBe(0);
    });

    test('should calculate numNights when no checks fail and showPayment = true', () => {
      wrapper.setState({
        startDate: moment('05-20-2019', 'MM-DD-YYYY'),
        endDate: moment('05-23-2019', 'MM-DD-YYYY'),
      });
      wrapper.instance().calculateDays();
      expect(wrapper.state('showPayment')).toBe(true);
      expect(wrapper.state('numNights')).toBe(3);
    });
  });

  describe('testing isDayBlocked method', () => {
    const day = moment('05-01-2019', 'MM-DD-YYYY');

    test('should return false if day is not between reserved dates', () => {
      wrapper.setState({
        reservedDays: [['05-20-2019', '05-23-2019']],
      });
      expect(wrapper.instance().isDayBlocked(day)).toBe(false);
    });
    test('should return true if day is between reserved dates', () => {
      wrapper.setState({
        reservedDays: [['04-29-2019', '05-02-2019']],
      });
      expect(wrapper.instance().isDayBlocked(day)).toBe(true);
    });
  });

  jest.resetModules();
  jest.mock('jquery');
// INCOMPLETE <-------------------------------------------------------------------
  describe('testing makeReservation method', () => {
    const reservationInfo = {
      guests: 3,
      total: 888
    };
    const makeSpy = jest.spyOn($, 'ajax');

    test('should ', () => {
      const $ = require('jquery');
      const wrapper = shallow(<Checkout />);
      wrapper.setState({
        startDate: moment('05-20-2019', 'MM-DD-YYYY'),
        endDate: moment('05-23-2019', 'MM-DD-YYYY'),
      })

      wrapper.instance().makeReservation(reservationInfo);
      expect(makeSpy).toBeCalledTimes(1);
    });
  });

  describe('testing rendering of the component based on screen width', () => {
    const wrapper = shallow(<Checkout />);

    test('should render as with footer class when screen width is less than 1150px', () => {
      global.window.resizeTo(500, 500);
      expect(wrapper.find('.footer')).toHaveLength(1);
    });
    
    test('should not render as with footer class when screen width is greater than 1150px', () => {
      global.window.resizeTo(1200, 1200);
      console.log(global.window.innerWidth);
      expect(wrapper.find('.close-but')).toHaveLength(0);
    });
  });
});