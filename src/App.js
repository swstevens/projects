import React, { Component } from "react";
import ReactGA from "react-ga";
import "./App.css";
import ProjectsPage from './Components/projects'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {}
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <ProjectsPage />
    );
  }
}

export default App;
