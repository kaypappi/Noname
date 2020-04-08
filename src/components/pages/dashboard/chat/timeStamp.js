import React from 'react';
import './timeStamp.css'
import moment from 'moment'

const timeStamp = (props) => {
    
    return (
        <div key={Math.random()} className='timestamp-holder text-xs lg:text-base'>
           {moment(props.TimeStamp.toDate()).calendar()} 
        </div>
    );
};

export default timeStamp;