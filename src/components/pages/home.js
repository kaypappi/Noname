import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from '../../Assets/noname.png'
import "./home.css";



export default class Home extends Component {
  state={
    star:''
  }
  componentDidMount() {
    
  }

createStar=()=>{
  let star=''
  for (var i = 0; i < 100; i++) {
    star =star +
      '<div class="star m-0" style="animation: twinkle ' +
      (Math.random() * 5 + 5) +
      's linear ' +
      (Math.random() * 1 + 1) +
      's infinite; top: ' +
      Math.random() * window.innerHeight +
      'px; left: ' +
      Math.random() * window.innerWidth +
      'px;"></div>';
  
  }
  return {__html: star};
}
  
  render() {
    return (
      <section  id='homescreen'  className="homescreen m-0 flex flex-col w-screen justify-center bg-gray-800 h-screen text-gray-100 ">
        
        <div dangerouslySetInnerHTML={this.createStar()}></div>
        <nav>
          <ul className="flex justify-between text-xl py-8 px-8 md:px-48 ">
            <li><img style={{width:'50px', height:'50px'}} src={Logo} alt=""/></li>
            <li className='text-xs my-auto'>
              <a
                href="https://github.com/Icesofty"
                target="_blank"
                rel="noopener noreferrer"
              >
                Made with 💚 by Wesley
              </a>
            </li>
          </ul>
        </nav>
        <div className="content-center w-full my-auto  justify-center">
          <h1 className="text-4xl text-center w-2/4 mx-auto">An App Has No Name</h1>
          <p className='text-teal-400 text-center mx-auto w-2/4'>
            Yeah you read right. Just have fun with it sign up and publish your
            link to friends to chat with you anonymously, or you can visit
            someones link and chat with them anonymously without having to
            signup
          </p>
          <div className=" mx-auto mt-4 buttons-holder">
            <Link to='/signup'><div className="bg-teal-400  signup-btn">Sign Up</div></Link>
            <Link to='/signin'><div className="bg-teal-400 signup-btn">LogIn</div></Link>
          </div>
        </div>
        {/* <h1 className="text-6xl  my-auto mx-auto  md:mx-48 ">
          Delightful <br />
          <span className="text-teal-400">Web Templates.</span>
        </h1> */}
      </section>
    );
  }
}
