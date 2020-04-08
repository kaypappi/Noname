import React, { Component } from 'react'
import {connect} from 'react-redux'

class Navbar2 extends Component {
    componentDidMount() {
        
    }
    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

const mapStateToprops=(state)=>{
   
    return{
        auth:state.auth,
        firestore:state.firestore
    }
}

export default connect(mapStateToprops)(Navbar2)
