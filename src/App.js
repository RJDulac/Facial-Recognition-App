import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";

import Logo from "./components/Logo/Logo";

import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const particleParams = {
  particles: {
    number: {
      value: 10,
      density: {
        enable: true,
        value_area: 500
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "red",
        blur: 2
      }
    }
  }
};
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signIn",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "cookies",
    entries: 0,
    joined: ""
  }
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;

    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
    this.displayFaceBox = this.displayFaceBox.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  loadUser(data) {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    });
  }
  calculateFaceLocation(data) {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  }

  displayFaceBox(box) {
    this.setState({ box });
  }
  onInputChange(e) {
    this.setState({ input: e.target.value });
  }
  onButtonSubmit() {
    this.setState({ imageUrl: this.state.input });

    fetch("http://localhost:3000/imageUrl", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              this.setState({ user: { ...this.state.user, entries: count } });
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(res));
      })
      .catch(err => console.log(err));
  }
  onRouteChange(route) {
    if (route === "signOut") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleParams} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onButtonSubmit={this.onButtonSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : this.state.route === "signIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
