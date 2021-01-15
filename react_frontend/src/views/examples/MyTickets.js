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
import "../../assets/css/custom.css"

// reactstrap components
import {Card, CardBody, CardHeader, CardTitle, Col, Container, Row} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";


function fix_date(st) {
    let date = st.split('T');
    let year = date[0];
    let time = date[1].split('.')[0];
    return year + " " + time;
}

class MyTickets extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            showIndex: false,
            showBullets: true,
            infinite: true,
            showThumbnails: true,
            showFullscreenButton: true,
            showGalleryFullscreenButton: true,
            showPlayButton: false,
            showGalleryPlayButton: false,
            showNav: true,
            isRTL: false,
            slideDuration: 5,
            slideInterval: 2000,
            slideOnThumbnailOver: false,
            thumbnailPosition: 'left',
            showVideo: {},
            video_total: 0,
            photos_total: 0,
            table_data: [],
            dropDownValue: 0,
            dropDownOpen: false,
            user_role: 2,
            edit_mode: false,
            open_ticketline: true
        };
        this.numImg = 0

    }

    renderArray = (value, index) => {
        return (
            <Col md="1" lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody className="border rounded border-danger">
                        <Row>
                            <div className="col">
                                <CardTitle
                                    tag="h2"
                                    className="text-uppercase text-muted mb-0"
                                >
                                    {value["name"]}
                                </CardTitle>
                                <Col>
                                    <Row>
                                        <div className="col-sm">
                                            <p><strong>Promotor Name: </strong>{value["promotor_name"]}</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col">
                                            <p><strong>Date: </strong>{value["event_date"]}</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col">
                                            <p><strong>Price: </strong> {value["price"]}€</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col">
                                            <p><strong>Buy date: </strong>{value["buy_date"]}</p>
                                        </div>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        )
    }


    get_data = async (id) => {
        const response = await fetch(
            `/my_tickets`);
        const result = await response.json();
        this.setState(prevState => (
            {
                table_data: result
            }
        ));

        const req = await fetch(
            '/home'
        );
        const respo = await req.json()
        this.setState(
            prevState => (
                {
                    user_role: respo["role"]
                }
            )
        );
    }

    componentDidMount() {
        let id = this.props.match.params['id']
        this.get_data(id)
        // this.timer = setInterval(() => this.get_data(id),5000)
    }


    render() {
        return (
            <>
                <Header/>
                <Container className=" mt--7" fluid>
                    <Row>
                        <Col className=" col">
                            <Card className=" shadow">
                                <CardHeader className=" bg-transparent">
                                    <Row>
                                        <Col>
                                            <div className="d-flex">
                                                <h2 className=" mt-2 ml-4 ">My Tickets</h2>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        {this.state["table_data"].length > 0 && this.state["table_data"].map(this.renderArray)}
                                        {this.state["table_data"].length == 0 &&
                                        <div className="col-sm"/>}
                                        {this.state["table_data"].length == 0 && <div className="col-sm">
                                            <h1 className="text-danger mb-0" style={{textAlign: "center"}}> No
                                                Tickets </h1>
                                        </div>}
                                        {this.state["table_data"].length == 0 && <div className="col-sm"/>
                                        }
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default MyTickets;
