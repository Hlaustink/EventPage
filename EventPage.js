import React, {useState, useEffect }from'react';
import'./EventPage.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const carouselSettings ={
    infinite: true,
    draggable: true,
    swipeable: true,
    showDots: true,
    autoPlay: true,
    responsive: {
        superLargeDesktop: {breakpoint:{max:4000, min:1024},items:3},
        desktop: {breakpoint:{max:1024, min:768},items:2},
        tablet: {breakpoint:{max:768, min:464},items:1},
        mobile: {breakpoint:{max:464, min:0},items:1},
    },
};
 const CountdownTimer=({targetDate})=>{
    const[timeLeft, setTimeLeft]=useState(calculateTimeLeft(targetDate));

    useEffect(()=> {
        const timer= setInterval(()=>{
            setTimeLeft(calculateTimeLeft(targetDate));
        },1000);
        return()=>clearInterval(timer);
    },[targetDate]);

    function calculateTimeLeft(target) {
        const difference=+new Date(target)-+new Date();
        let timeLeft={};

        if(difference> 0) {
            timeLeft={
                days: Math.floor(difference/(1000*60*60*24)),
                hours: Math.floor((difference/(1000*60*60))%24),
                minutes: Math.floor((difference/1000/60)%60),
                seconds: Math.floor((difference/1000)%60),
            };
        }
        return timeLeft;
    }

    return(
        <div className="countdown">
            {Object.keys(timeLeft).map((interval)=> (
                <span key={interval}>
                    {timeLeft[interval]} {interval}{''}
                </span>
            ))}
        </div>
    );
};

 const EventPage=()=> {
    const[events, setEvents]=useState([]);
    const[newEvent, setNewEvent]=useState({images:[],date:",category:"});
    const[filters,setFilters]=useState({time:'all', category:'all'});

    const addEvent=()=>{
        if(newEvent.date && newEvent.category && newEvent.images,length){
            setEvents([...events, newEvent]);
            setNewEvent({images:[],date:",category:"});
        }
    };

    const handleImageUpload=(e)=>{
        const files=Array.from(e.target.files);
        const imageUrls=files.map(file=>URL.createObjectURL(file));
        setNewEvent({...newEvent, images:imageUrls});
    };

    const filteredEvents=events.filter(event=>{
        const eventDate=new Date(event.date);
        const now=new Date();
        const timeFilter={
            '24hrs': eventDate <=new Date(now.getTime()+24*60*60*1000),
            '1week': eventDate <=new Date(now.getTime()+7*24*60*60*1000),
            '1month': eventDate <=new Date(now.getTime()+30*24*60*60*1000),
            'all':true,
        };
        const timeMatch=timeFilter[filters.time];

        //*Filtering by category*//
        const categoryMatch=filters.category==='all'||event.category===filters.category;
        return timeMatch && categoryMatch;
    });
    return(
        <div className="event-page">
            <h1>Discover Events</h1>

            <div className="filter-section">
                <select onChange={(e)=> setFilters({...filters, time:e.target.value})}>
                    <option value="all">Any Time</option>
                    <option value="24hrs">In 24 Hours</option>
                    <option value="1week">In 1 Week</option>
                    <option value="1month">In 1 Month</option>
                </select>
                <select onChange={(e)=>setFilters({...filters, category:e.target.value})}>
                    <option value="all">All Categories</option>
                    <option value="educational">Educational</option>
                    <option value="social">Social</option>
                </select>
            </div>

            {/*Add Event Form*/}
            <div className="event-form">
                <Input
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={(e)=>setNewEvent({...newEvent, date: e.target.value})}></Input>
                        <select onChange={(e)=>setNewEvent({...newEvent, category: e.target.value})}>
                            <option value="">Select Category</option>
                            <option value="educational">Educational</option>
                            <option value="social">Social</option>
                        </select>
                        <Input type="file" multiple onChange={handleImageUpload}></Input>
                        <button onClick={addEvent}>Add Event</button>
            </div>

            {/*Event List*/}
            <div className="event-list">
                {filteredEvents.map((event, index)=>(
                    <div key={index}className="event-item">
                        <Carousel {...carouselSettings}>
                        <img key={imgIndex}src={image}alt={'Event poster ${imgIndex + 1}'}></img>
                </Carousel>
                <h3>{event.category}Event</h3>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <CountdownTimer targetDate={event.date}></CountdownTimer>
            </div>
    ))}
         </div>
        </div>
    );
 };

 export default EventPage