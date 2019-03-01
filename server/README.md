
# API Endpoints

# Room Listing Reservation Checkout

| HTTP | API Endpoint |
|------|------|
| `GET` | /rooms/:listingId |
| `POST` | /rooms |
| `PUT` | /rooms/:listingId |
| `DELETE` | /rooms/:listingId |

# Bookings

| HTTP | API Endpoint |
|------|------|
| `GET` | /rooms/bookings/:listingId |
| `POST` | /rooms/bookings |
| `PUT` | /rooms/bookings/:bookingId |
| `DELETE` | /rooms/bookings/:bookingId |

# Parameters

| Name | Type | Description |
|------|------|-------------|
| Listing Id | number | Id of room listing |
| Booking Id | number | Id of booking |