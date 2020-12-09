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
import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import Timer from "./Timer";
import Example from "./Example"



class Header extends React.Component {

  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <Example title={"Reports"}
                             icon_name={"icon icon-shape bg-purple text-white rounded-circle shadow"}
                             icon={"fas fa-chart-bar"}
                    />
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <Example title={"events"}
                             icon_name={"icon icon-shape bg-red text-white rounded-circle shadow"}
                             icon={"fas fa-car-crash"}
                    />
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <Example title={"Users"}
                             icon_name={"icon icon-shape bg-yellow text-white rounded-circle shadow"}
                             icon={"fas fa-users"}
                    />
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <Example title={"Medical care"}
                             icon_name={"icon icon-shape bg-blue text-white rounded-circle shadow"}
                             icon={"fas fa-ambulance"}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default Header;
