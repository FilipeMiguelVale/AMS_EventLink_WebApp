/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
import "../../assets/css/custom.css"
// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left text-muted">
                  2020{" "}
                  <a
                    className="font-weight-bold ml-1"
                    href="http://www.feelevents.pt/AMS-EventLink/"
                    target="_blank"
                  >
                    EventLink
                  </a>
                </div>
              </Col>
              <Col xl="2" >
                <div className="copyright text-center  text-muted">
                  <a href="https://www.feelevents.pt" target="_blank">
                  <img
                    alt="..."
                    className="grayscale"
                    height={45}
                    width={125}
                    src={require("../../assets/img/brand/feel_stroke.png")}
                  />
                  </a>
                </div>
              </Col>
              <Col xl="2">
                <div className="copyright text-center  text-muted">
                  <a href="https://www.ua.pt" target="_blank">
                  <img
                    alt="..."
                    className=""
                    height={45}
                    width={125}
                    src={require("../../assets/img/brand/UA.png")}
                  />
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
