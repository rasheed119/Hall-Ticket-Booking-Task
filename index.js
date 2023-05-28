const express = require("express")
const app = express();
app.use(express.json());

const dotenv = require("dotenv")
dotenv.config();
const PORT = process.env.PORT;

let Rooms = [
    {
        roomName: "Hall A",
        roomID : 1,
        seatsAvailable: 100,
        amenities: ["Projector", "Wi-Fi"],
        pricePerHour: 50
      },{
        roomName: "Hall B",
        roomID : 2,
        seatsAvailable: 56,
        amenities: ["Projector", "Wi-Fi","Kitchen"],
        pricePerHour: 65
      }      
]
let bookings = [
    {
        customerName: "Vishu",
        date: "2023-05-30",
        roomName : "Hall A",
        startTime: "14:00",
        endTime: "16:00",
        bookingId: 1
    },{
        customerName: "Dinesh",
        date: "2023-05-28",
        roomName : "Hall B",
        startTime: "14:00",
        endTime: "16:00",
        bookingId: 2 
    }
]

// 1. Creating a Room with seatsavailable, amenities in room, price for  one hour  
app.post("/room",(req,res)=>{
    const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;
    const room = {
        roomID : Rooms.length + 1,
        roomName,
        seatsAvailable,
        amenities,
        pricePerHour
    };
    Rooms.push(room);
    res.send(Rooms);
})

// 2. Booking a Room customerName, date, startTime, endTime
app.post("/booking",(req,res)=>{
    const { customerName, date, roomName, startTime, endTime } = req.body;

    //To check wheather the room name and date is already booked
    const booked_date = bookings.map((obj)=>obj.date);
    const booked_room_name = bookings.map((obj)=>obj.roomName);

    if(!(booked_date.includes(date) || booked_room_name.includes(roomName))){
        const booking = {
            customerName,
            date,
            roomName,
            startTime,
            endTime,
            bookingId : bookings.length + 1
        }
    bookings.push(booking);
    res.status(200).send(bookings);
    }else{
        return res.status(400).send("Room Already Booked on provided date,Please Try on another date,Thank You!")
    }
})

// 3. List all Rooms with Booked Data
app.get("/booked",(req,res)=>{
    const roombookings = Rooms.map((room)=>{
        const booking = bookings.find(obj=>obj.bookingId === room.roomID)
        return{
            roomName : room.roomName,
            bookedstatus : !!booking,
            customerName : booking ? booking.customerName : null,
            date : booking ? booking.date : null,
            startTime : booking ? booking.startTime : null,
            endTime : booking ? booking.endTime : null
        }
    });
    res.status(200).send(roombookings);
})

//4. List all customers with booked Data
app.get("/customers/booked",(req,res)=>{
    const customerBookings = bookings.map((booking)=>{
        const room = Rooms.find(obj=>obj.roomID == booking.bookingId);
        return {
            customerName : booking.customerName,
            roomName : room ? room.roomName : null,
            date : booking.date,
            startTime : booking.startTime,
            endTime : booking.endTime
        };
    });
    res.status(200).send(customerBookings);
})

// 5. List customer's bookings
app.get("/customers/booked/:id",(req,res)=>{
    const {id} = req.params;
    const customer_bookings = bookings.filter((obj)=>obj.bookingId == id)
    const customerbooking = customer_bookings.map((booking)=>{
        const room = Rooms.find(x => x.roomID === booking.bookingId);
        return {
            customerName : booking.customerName,
            roomName : room.roomName,
            date : booking.date,
            startTime : booking.startTime,
            endTime : booking.endTime,
            bookingId : booking.bookingId
        }
    })
    res.send(customerbooking);
})
app.listen(PORT,()=>console.log(`Server started successfully at localhost:${PORT}`));