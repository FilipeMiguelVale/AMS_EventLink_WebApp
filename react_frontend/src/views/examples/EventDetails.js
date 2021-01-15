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
import ImageGallery from './ImageGallery';
import "../../assets/css/custom.css"

// reactstrap components
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Input,
    Progress,
    Row,
    UncontrolledCollapse
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";
import {Redirect} from "react-router-dom";

const PREFIX_URL = 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/';
const MEDIA_URL = '/media/'

function fix_date(st) {
    let date = st.split('T');
    let year = date[0];
    let time = date[1].split('.')[0];
    return year + " " + time;
}

class EventDetails extends React.Component {
    constructor(props) {
        super(props);

        this.timer = null;

        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEditMode = this.setEditMode.bind(this)
        this.openTicketline = this.openTicketline.bind(this)

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
            event_data: {"services": [], "ticket_sold": "0", 'ticket_lotation': '1'},
            dropDownValue: 0,
            dropDownOpen: false,
            user_role: 2,
            edit_mode: false,
            open_ticketline: true
        };
        this.numImg = 0
        this.images = [
            {
                thumbnail: ``,
                original: ``,
                source: '',
                renderItem: this._renderVideo.bind(this)
            },
            {
                original: ``,
                thumbnail: ``,
                imageSet: [
                    {
                        srcSet: `${PREFIX_URL}image_set_cropped.jpg`,
                        media: '(max-width: 1280px)',
                    },
                    {
                        srcSet: `${PREFIX_URL}image_set_default.jpg`,
                        media: '(min-width: 1280px)',
                    }
                ]
            },
            {
                original: `${PREFIX_URL}1.jpg`,
                thumbnail: `${PREFIX_URL}1t.jpg`,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
            }
        ]
    }

    handleChange2(event, id) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.state.event_data[id] = value
        this.setState({
            //table_data[0]=value
        });
    }

    get_data = async (id) => {
        console.log(this.state.event_data["ticket_sold"])
        console.log(this.state.event_data["ticket_lotation"])
        console.log(parseInt(this.state.event_data["ticket_lotation"]))
        console.log(Math.floor(this.state.event_data["ticket_sold"] / parseInt(this.state.event_data["ticket_lotation"]) * 100))

        const response = await fetch(
            `/event/${id}`);
        const result = await response.json();
        this.setState(prevState => (
            {
                event_data: result
            }
        ));
        const resp = await fetch(
            `/Nmedia/${id}/photos`);
        const res = await resp.json();
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
        this.numImg = parseInt(res)
        const media = []
        if (this.state.video_total > 0) {
            for (let i = 1; i < this.state.video_total + 1; i++) {
                media.push({
                    thumbnail: `/media/${id}/video/${i}T.jpg`,
                    original: `/media/${id}/video/${i}T.jpg`,
                    source: `/media/${id}/video/${i}.mp4`,
                    renderItem: this._renderVideo.bind(this)
                })
            }
        } else {
            media.push({
                thumbnail: `/media/novideo.png`,
                original: `/media/novideo.png`
            })
        }
        // for (let i = 0; i < this.numImg; i++) {
        //   media.push({
        //     thumbnail: `/media/${id}/photos/${i}.jpeg`,
        //     original: `/media/${id}/photos/${i}.jpeg`
        //   })
        // }

        this.setState(prevState => (
            this.images = media
        ));
        console.log(this.state.event_data["ticket_sold"])
        console.log(this.state.event_data["ticket_lotation"])
        console.log(parseInt(this.state.event_data["ticket_lotation"]))
        console.log(Math.floor(this.state.event_data["ticket_sold"] / parseInt(this.state.event_data["ticket_lotation"]) * 100))


    }

    componentDidMount() {
        let id = this.props.match.params['id']
        this.get_data(id)
        // this.timer = setInterval(() => this.get_data(id),5000)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.slideInterval !== prevState.slideInterval ||
            this.state.slideDuration !== prevState.slideDuration) {
            // refresh setInterval
            this._imageGallery.pause();
            this._imageGallery.play();
        }
        ;
    }

    handleSubmit(event, id) {
        event.preventDefault();
        fetch('/set_budget/' + id, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                budget: this.state.event_data["budget"]
            }),
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result['response'])
                    if (result['response'] == "Done") {
                        this.setState({
                            edit_mode: false
                        });
                        this.getData(id)
                    } else {
                        this.setState({error: result['error']});
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: "error"
                    });
                }
            )
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        this.timer = null
    }

    renderTicketline = () => {
        return (
            <CardBody className="border rounded">
                <CardTitle
                    tag="h4"
                    className="text-uppercase text-muted mb-0"
                >
                    Ticketline
                </CardTitle>
                <CardBody style={{textAlign: "center"}}>
                    <div className="row">
                        <div className="col">
                            <CardBody className="border rounded">
                                <CardTitle
                                    tag="h4"
                                    className="text-uppercase text-muted mb-0"
                                >Sold Tickets</CardTitle>
                                <CardBody style={{textAlign: "center"}}>
                                    {this.state.event_data["ticket_sold"]}
                                </CardBody>
                            </CardBody>
                        </div>
                        <div className="col">
                            <CardBody className="border rounded">
                                <CardTitle
                                    tag="h4"
                                    className="text-uppercase text-muted mb-0"
                                >Remaining Tickets</CardTitle>
                                <CardBody style={{textAlign: "center"}}>
                                    {this.state.event_data["ticket_lotation"]-this.state.event_data["ticket_sold"]}
                                </CardBody>
                            </CardBody>
                        </div>
                        <div className="col">
                            <CardBody className="border rounded">
                                <CardTitle
                                    tag="h4"
                                    className="text-uppercase text-muted mb-0"
                                >Lotation</CardTitle>
                                <CardBody style={{textAlign: "center"}}>
                                    {this.state.event_data["ticket_lotation"]}
                                </CardBody>
                            </CardBody>
                        </div>
                        <div className="col">
                            <CardBody className="border rounded">
                                <CardTitle
                                    tag="h4"
                                    className="text-uppercase text-muted mb-0"
                                >Ticket Price</CardTitle>
                                <CardBody style={{textAlign: "center"}}>
                                    {this.state.event_data["ticket_price"]}€
                                </CardBody>
                            </CardBody>
                        </div>
                        <div className="col">
                            <CardBody className="border rounded">
                                <CardTitle
                                    tag="h4"
                                    className="text-uppercase text-muted mb-0"
                                >Earnings</CardTitle>
                                <CardBody style={{textAlign: "center"}}>
                                    {this.state.event_data["ticket_price"]*this.state.event_data["ticket_sold"]}€
                                </CardBody>
                            </CardBody>
                        </div>
                    </div>
                </CardBody>
                <div style={{textAlign: "center"}}>
                    <strong>{Math.floor(this.state.event_data["ticket_sold"] / this.state.event_data["ticket_lotation"] * 100)}%<br/></strong>
                    <Progress
                        max="100"
                        value={Math.floor(this.state.event_data["ticket_sold"] / this.state.event_data["ticket_lotation"] * 100)}
                        barClassName={this.getBarColor(Math.floor(this.state.event_data["ticket_sold"] / this.state.event_data["ticket_lotation"] * 100))}
                    />
                </div>
            </CardBody>
        )
    }

    _onImageClick(event) {
        console.debug('clicked on image', event.target, 'at index', this._imageGallery.getCurrentIndex());
    }

    _onImageLoad(event) {
        console.debug('loaded image', event.target.src);
    }

    _onSlide(index) {
        this._resetVideo();
        console.debug('slid to index', index);
    }

    _onPause(index) {
        console.debug('paused on index', index);
    }

    _onScreenChange(fullScreenElement) {
        console.debug('isFullScreen?', !!fullScreenElement);
    }

    _onPlay(index) {
        console.debug('playing from index', index);
    }

    _resetVideo() {
        this.setState({showVideo: {}});

        if (this.state.showPlayButton) {
            this.setState({showGalleryPlayButton: true});
        }

        if (this.state.showFullscreenButton) {
            this.setState({showGalleryFullscreenButton: true});
        }
    }

    _toggleShowVideo(url) {
        this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
        this.setState({
            showVideo: this.state.showVideo
        });

        if (this.state.showVideo[url]) {
            if (this.state.showPlayButton) {
                this.setState({showGalleryPlayButton: false});
            }

            if (this.state.showFullscreenButton) {
                this.setState({showGalleryFullscreenButton: false});
            }
        }
    }

    _renderVideo(item) {
        return (
            <div>
                {
                    this.state.showVideo[item.source] ?
                        <div className='video-wrapper'>
                            <a
                                className='close-video'
                                onClick={this._toggleShowVideo.bind(this, item.source)}
                            >
                            </a>
                            <video autoPlay controls>
                                // width='100%'
                                // height='100%'
                                <source
                                    src={item.source}
                                    type="video/mp4">

                                </source>
                                // frameBorder='0'
                                // allowFullScreen
                                >
                            </video>
                        </div>
                        :
                        <a onClick={this._toggleShowVideo.bind(this, item.source)}>
                            <div className='play-button'/>
                            <img className='image-gallery-image' src={item.original}/>
                            {
                                item.description &&
                                <span
                                    className='image-gallery-description'
                                    style={{right: '0', left: 'initial', height: '100%'}}
                                >
                    {item.description}
                  </span>
                            }
                        </a>
                }
            </div>
        );
    }

    onGoBack = () => {
        return <Redirect to="/admin/events"/>
    }

    /* Status dropdown functions */
    toggle() {
        this.setState({dropDownOpen: !this.state.dropDownOpen});
    }

    changeValue(e) {
        this.updateDBToSelectedStatus(e.currentTarget.textContent)
        this.setState({dropDownValue: e.currentTarget.textContent})

    }

    getBarColor(damage) {
        if (damage < 30) {
            return "h2 font-weight-bold mb-0 text-success"
        } else if (damage < 45) {
            return "h2 font-weight-bold mb-0 text-teal"
        } else if (damage < 75) {
            return "h2 font-weight-bold mb-0 text-orange"
        } else {
            return "h2 font-weight-bold mb-0 text-red"
        }
    }

    setStatusColor() {
        if (this.state.dropDownValue === "event resolved") {
            return (
                <Badge color="" className="badge-dot badge-lg">
                    <i className="bg-lime"/>
                </Badge>
            )
        }
        if (this.state.dropDownValue === "Emergency services are on their way") {
            return (
                <Badge color="" className="badge-dot badge-lg">
                    <i className="bg-yellow"/>
                </Badge>
            )
        } else {
            return (
                <Badge color="" className="badge-dot badge-lg">
                    <i className="bg-red"/>
                </Badge>
            )
        }
    }

    init_text_dropdown(id) {
        if (id === 2) {
            return ("event resolved")
        } else if (id === 1) {
            return ("Emergency services are on their way")
        } else {
            return ("event still not answered")
        }
    }

    updateDBToSelectedStatus(value) {
        if (value === "event resolved") {
            fetch(`/set_event_status/${this.props.match.params['id']}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "status": 2
                })
            })
        }
        if (value === "Emergency services are on their way") {
            fetch(`/set_event_status/${this.props.match.params['id']}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "status": 1
                })
            })
        } else {
            fetch(`/set_event_status/${this.props.match.params['id']}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "status": 0
                })
            })
        }
    }

    handleClick = (e, id, value) => {
        e.preventDefault();
        let new_injured = this.state.event_data.n_people_injured + value
        if (new_injured >= 0) {
            this.setState(() => (this.state.event_data.n_people_injured = new_injured))
            this.set_injured(id, new_injured);
        }
    };

    setEditMode() {
        this.state.edit_mode = !this.state.edit_mode
        this.setState(prevState => ({}));
    }

    openTicketline() {
        this.state.open_ticketline = !this.state.open_ticketline
        this.setState(prevState => ({}));
    }

    set_injured(id, value) {
        fetch(`/set_event_injured/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "injured": `${value}`
            })
        })
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
                                                <Button
                                                    className="icon icon-shape bg-info text-white rounded-circle shadow"
                                                    href="/#admin/events"
                                                    onClick={this.onGoBack()}
                                                >
                                                    <i className="fas fa-angle-left"/>
                                                </Button>
                                                <h2 className=" mt-2 ml-4 ">{this.state.event_data["name"]}</h2>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="row justify-content-end">
                                                <div className="mr-2">
                                                    {this.setStatusColor()}
                                                </div>
                                                {/*<div className="mr-2 ">*/}
                                                {/*  <ButtonDropdown className="dropdown-width" isOpen={this.state.dropDownOpen} toggle={this.toggle}>*/}
                                                {/*    <DropdownToggle caret>*/}
                                                {/*      {this.state.dropDownValue}*/}
                                                {/*    </DropdownToggle>*/}
                                                {/*    <DropdownMenu right>*/}
                                                {/*      <DropdownItem onClick={this.changeValue}>event still not answered</DropdownItem>*/}
                                                {/*      <DropdownItem onClick={this.changeValue}>Emergency services are on their way</DropdownItem>*/}
                                                {/*      <DropdownItem onClick={this.changeValue}>event resolved</DropdownItem>*/}
                                                {/*    </DropdownMenu>*/}
                                                {/*  </ButtonDropdown>*/}
                                                {/*</div>*/}
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row className="h-75 ">
                                        <Col>
                                            <Row>
                                                <div className="col-sm">
                                                    <p><strong>Promotor
                                                        Name: </strong> {this.state.event_data.promotor_name}</p>
                                                </div>
                                                <div className="col-sm">
                                                    <p><strong>Contact: </strong> {this.state.event_data.telephone}</p>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col">
                                                    <p><strong>Address: </strong> {this.state.event_data.address}</p>
                                                </div>
                                                <div className="col-sm">
                                                    <p><strong>City: </strong> {this.state.event_data.city}</p>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col">
                                                    <p>
                                                        <strong>Start: </strong> {this.state.event_data.start_time + " " + this.state.event_data.start_date}
                                                    </p>
                                                </div>
                                                <div className="col-sm">
                                                    <p>
                                                        <strong>End: </strong> {this.state.event_data.end_time + " " + this.state.event_data.end_date}
                                                    </p>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col">
                                                    <p>
                                                        <strong>About: </strong> {this.state.event_data.about}
                                                    </p>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <CardBody>
                                                <ImageGallery
                                                    ref={i => this._imageGallery = i}
                                                    items={this.images}
                                                    lazyLoad={false}
                                                    onClick={this._onImageClick.bind(this)}
                                                    onImageLoad={this._onImageLoad}
                                                    onSlide={this._onSlide.bind(this)}
                                                    onPause={this._onPause.bind(this)}
                                                    onScreenChange={this._onScreenChange.bind(this)}
                                                    onPlay={this._onPlay.bind(this)}
                                                    infinite={this.state.infinite}
                                                    showBullets={this.state.showBullets}
                                                    showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
                                                    showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
                                                    showThumbnails={this.state.showThumbnails}
                                                    showIndex={this.state.showIndex}
                                                    showNav={this.state.showNav}
                                                    isRTL={this.state.isRTL}
                                                    thumbnailPosition={this.state.thumbnailPosition}
                                                    slideDuration={parseInt(this.state.slideDuration)}
                                                    slideInterval={parseInt(this.state.slideInterval)}
                                                    slideOnThumbnailOver={this.state.slideOnThumbnailOver}
                                                    additionalClass="app-image-gallery"
                                                />
                                            </CardBody>
                                        </Col>
                                    </Row>
                                    {/*<Maps*/}
                                    {/*      // markers = {[{id: this.props.match.params['id'],*/}
                                    {/*      //             lat: this.state.event_data.location.coords.lat,*/}
                                    {/*      //             lng: this.state.event_data.location.coords.lng,*/}
                                    {/*      //             status: this.state.event_data.status}]}*/}
                                    {/*      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4aWR3SBGaa1oB0CuDf2vptnJfSMSguZU"*/}
                                    {/*      loadingElement={<div style={{ height: `100%` }} />}*/}
                                    {/*      // center = {this.state.event_data.location.coords}*/}
                                    {/*      zoom = {17}*/}

                                    {/*      containerElement={*/}
                                    {/*        <div*/}
                                    {/*          className="map-canvas"*/}
                                    {/*          id="map-canvas"*/}
                                    {/*        />*/}
                                    {/*      }*/}
                                    {/*      mapElement={*/}
                                    {/*        <div style={{ height: `100%`, borderRadius: "inherit" }} />*/}
                                    {/*      }*/}
                                    {/*    />*/}
                                    <CardHeader>
                                        <h3> MORE DETAILS... </h3>
                                    </CardHeader>
                                    <Row>
                                        <Col md="1" lg="6" xl="3">
                                            <Card className="card-stats mb-4 mb-xl-0">
                                                <CardBody className="border rounded border-info">
                                                    <Row>
                                                        <div className="col">
                                                            <CardTitle
                                                                tag="h5"
                                                                className="text-uppercase text-muted mb-0"
                                                            >
                                                                Services
                                                            </CardTitle>
                                                            <span
                                                                className="h2 font-weight-bold mb-0">{this.state.event_data["services"].length}</span>
                                                        </div>
                                                        <Col className="col-auto">
                                                            <Button
                                                                className="icon icon-shape bg-success text-dark rounded-circle shadow">
                                                                <i className="fas fa-users-cog"/>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md="3" lg="6" xl="3">
                                            <Card className="card-stats mb-4 mb-xl-0">
                                                <CardBody className="border rounded border-info">

                                                    <Row>
                                                        <div className="col">
                                                            <CardTitle
                                                                tag="h5"
                                                                className="text-uppercase text-muted mb-0"
                                                            >
                                                                STAFF
                                                            </CardTitle>
                                                            <span className="h2 font-weight-bold mb-0">
                                    {this.state.event_data["staff"]}
                                  </span>
                                                        </div>
                                                        <Col className="col-auto">
                                                            <div
                                                                className="icon icon-shape bg-info text-dark rounded-circle shadow">
                                                                <i className="fas fa-users"/>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md="5" lg="6" xl="3">
                                            <Card className="card-stats mb-4 mb-xl-0">
                                                <CardBody className="border rounded border-info">
                                                    <Row>
                                                        <div className="col">
                                                            <CardTitle
                                                                tag="h5"
                                                                className="text-uppercase text-muted mb-0"
                                                            >
                                                                Budget
                                                            </CardTitle>
                                                            {this.state.user_role == 0 && this.state.edit_mode && (
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    id="input-budget"
                                                                    placeholder={this.state.event_data["budget"]}
                                                                    type="number"
                                                                    name="budget"
                                                                    value={this.state.event_data["budget"]}
                                                                    onChange={(e) => this.handleChange2(e, "budget")}
                                                                />
                                                            )}
                                                            {this.state.user_role == 0 && this.state.edit_mode && (
                                                                <Button
                                                                    className="icon icon-shape bg-success text-white rounded-circle"
                                                                    type="button"
                                                                    onClick={(e) => this.handleSubmit(e, this.state.event_data["id"])}
                                                                >
                                                                    <i className="fas fa-check"></i>
                                                                </Button>
                                                            )}
                                                            {(this.state.user_role != 0 || this.state.edit_mode == false) && (
                                                                <span className="h2 font-weight-bold mb-0">
                                    {this.state.event_data["budget"]}€
                                  </span>
                                                            )}
                                                        </div>
                                                        <Col className="col-auto">
                                                            {this.state.user_role == 0 && (
                                                                <Button
                                                                    className="icon icon-shape bg-danger text-dark rounded-circle shadow"
                                                                    type="button"
                                                                    onClick={(e) => this.setEditMode()}
                                                                >
                                                                    <i className="fas fa-file-invoice-dollar"/>
                                                                </Button>
                                                            )}
                                                            {this.state.user_role != 0 && (
                                                                <div
                                                                    className="icon icon-shape bg-danger text-dark rounded-circle shadow">
                                                                    <i className="fas fa-file-invoice-dollar"/>
                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md="1" lg="6" xl="3">
                                            <Card className="card-stats mb-4 mb-xl-0">
                                                <CardBody className="border rounded border-info">
                                                    <Row>
                                                        <div className="col">
                                                            <CardTitle
                                                                tag="h5"
                                                                className="text-uppercase text-muted mb-0"
                                                            >
                                                                Ticketline
                                                            </CardTitle>
                                                            {this.state.event_data["ticketline"] != "None" && (
                                                                <span
                                                                    className={this.getBarColor(Math.floor(this.state.event_data["ticket_sold"] / this.state.event_data["ticket_lotation"]) * 100)}>
                                  {this.state.event_data["ticket_sold"]}
                                </span>)}
                                                            {this.state.event_data["ticketline"] != "None" && (
                                                                <span>/</span>
                                                            )}
                                                            {this.state.event_data["ticketline"] != "None" && (
                                                                <span className={this.getBarColor(100)}>
                                  {this.state.event_data["ticket_lotation"]}
                                </span>)}
                                                            {this.state.event_data["ticketline"] == "None" && (
                                                                <span className="h2 font-weight-bold mb-0">
                                    No Ticketline
                                  </span>
                                                            )}
                                                        </div>
                                                        <Col className="col-auto">
                                                            <Button
                                                                className="icon icon-shape bg-yellow text-dark rounded-circle shadow"
                                                                id="toggler">
                                                                <i className="fas fa-ticket-alt"/>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <UncontrolledCollapse toggler="#toggler">
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    {this.renderTicketline()}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </UncontrolledCollapse>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default EventDetails;
