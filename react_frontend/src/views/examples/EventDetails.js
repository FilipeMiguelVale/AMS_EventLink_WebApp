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
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
  Button,
  UncontrolledCollapse,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Badge
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";
import Maps from "./Maps_Component.js";
import {Redirect} from "react-router-dom";

const PREFIX_URL = 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/';
const MEDIA_URL='/media/'

function fix_date(st) {
  let date = st.split('T');
  let year = date[0];
  let time  = date[1].split('.')[0];
  return year + " " + time;
}

class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;

    this.toggle = this.toggle.bind(this);
    this.changeValue = this.changeValue.bind(this);

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
      video_total:0,
      photos_total:0,
      event_data: {
        car: [],
        location: {
          address: " ",
          coords: {lat: 40, lng: 30 },
        },
        damage: 0.0,
        date: " ",
        n_cars_involved: 0,
        n_people_involved: 0,
        n_people_injured: 0, 
      },
      dropDownValue: 0,
      dropDownOpen: false,
    };
    this.numImg=0
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
            media : '(max-width: 1280px)',
          },
          {
            srcSet: `${PREFIX_URL}image_set_default.jpg`,
            media : '(min-width: 1280px)',
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


  get_data = async (id) => {
    const response = await fetch(
      `/event/${id}`);
    const result = await response.json();
    this.setState(prevState => (
      {
        event_data:  {
          car: result['cars'],
          location: 
          {
            address: result['location']['address'],
            coords: {lat: result['location']['lat'],lng: result['location']['lng']}
          },
          damage: result['damage'],
          date: fix_date(result['date']),
          n_cars_involved: result['n_cars_involved'],
          n_people_involved: result['n_people'],
          n_people_injured: parseInt(result['n_people_injured']),
          status: result['status']
        },
        video_total:parseInt(result['video_total']),
        dropDownValue: this.init_text_dropdown(parseInt(result['status']))
      }
    ));
    const resp =await fetch(
      `/Nmedia/${id}/photos`);
    const res = await resp.json();
    this.numImg = parseInt(res)
    const media=[]
    if (this.state.video_total >0){
      for (let i = 1; i < this.state.video_total+1; i++) {
        media.push({
        thumbnail: `/media/${id}/video/${i}T.jpg`,
        original: `/media/${id}/video/${i}T.jpg`,
        source: `/media/${id}/video/${i}.mp4`,
        renderItem: this._renderVideo.bind(this)
      })
    }
    }else{
      media.push({
        thumbnail: `/media/novideo.png`,
        original: `/media/novideo.png`
      })
    }
    for (let i = 0; i < this.numImg; i++) {
      media.push({
        thumbnail: `/media/${id}/photos/${i}.jpeg`,
        original: `/media/${id}/photos/${i}.jpeg`
      })
    }

    this.setState(prevState => (
        this.images= media
    ));


  }

  componentDidMount() {
    let id = this.props.match.params['id']
    this.get_data(id)
    this.timer = setInterval(() => this.get_data(id),5000)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval ||
        this.state.slideDuration !== prevState.slideDuration) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    };
  }

  componentWillUnmount(){
    clearInterval(this.timer)
    this.timer = null
  }

  renderCars = (value,index) => {
    return(
      <CardBody className="border rounded">
        <CardTitle
          tag="h4"
          className="text-uppercase text-muted mb-0"
        >
          Car {index + 1}
        </CardTitle>
        <CardBody className="align-content-center">
          <Row>
            <span className="font-weight-bold">Activated ABS</span>
            <span>: {String(value['ABS'])}</span>
          </Row>
          <Row>
            <span className="font-weight-bold">Fired Airbag</span>
            <span>: {String(value['airbag'])}</span>
          </Row>
          <Row>
            <span className="font-weight-bold">Passengers</span>
            <span>: {value['n_people']} </span>
          </Row>
          <Row>
            <span className="font-weight-bold">Overturned</span>
            <span>: {String(value['overturned'])}</span>
          </Row>
          <Row>
            <span className="font-weight-bold">Temperature</span>
            <span>: {value['temperature']}</span>
          </Row>
          <Row>
            <span className="font-weight-bold">Collision velocity</span>
            <span>: {value['velocity']}</span>
          </Row>
        </CardBody>
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
              <img className='image-gallery-image' src={item.original} />
              {
                item.description &&
                  <span
                    className='image-gallery-description'
                    style={{right: '0', left: 'initial', height:'100%'}}
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

  getBarColor(damage){
      if(damage<30){return"h2 font-weight-bold mb-0 text-success"
      }else if(damage < 45){return"h2 font-weight-bold mb-0 text-teal"
      }else if(damage < 75){return "h2 font-weight-bold mb-0 text-orange"
      }else{return "h2 font-weight-bold mb-0 text-red"}
  }

  setStatusColor() {
    if(this.state.dropDownValue === "event resolved"){
      return(
        <Badge color="" className="badge-dot badge-lg">
          <i className="bg-lime" />
        </Badge>
      )
    }
    if(this.state.dropDownValue === "Emergency services are on their way"){
      return(
        <Badge color="" className="badge-dot badge-lg">
          <i className="bg-yellow" />
        </Badge>
      )
    }
    else {
       return(
        <Badge color="" className="badge-dot badge-lg">
          <i className="bg-red" />
        </Badge>
      )
    }
  }

  init_text_dropdown(id) {
    if(id === 2 ){
      return("event resolved")
    }else if(id ===1){
      return("Emergency services are on their way")
    }else{return("event still not answered")}
  }

  updateDBToSelectedStatus(value) {
    if(value === "event resolved"){
      fetch(`/set_event_status/${this.props.match.params['id']}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "status": 2
        })
      })
    }
    if(value === "Emergency services are on their way"){
      fetch(`/set_event_status/${this.props.match.params['id']}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "status": 1
        })
      })
    }
    else {
      fetch(`/set_event_status/${this.props.match.params['id']}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "status": 0
        })
      })
    }
  }
  handleClick = (e,id,value) => {
    e.preventDefault();
    let new_injured = this.state.event_data.n_people_injured+value
    if (new_injured >=0) {
      this.setState(() => (this.state.event_data.n_people_injured = new_injured))
      this.set_injured(id, new_injured);
    }
  };

  set_injured(id,value){
      fetch(`/set_event_injured/${id}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "injured": `${value}`
        })
      })
       }

  render() {
    return (
      <>
        <Header />
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
                          onClick= {this.onGoBack()}
                        >
                          <i className="fas fa-angle-left"/>
                        </Button>
                        <h2 className=" mt-2 ml-4 ">Event Details</h2>
                      </div>
                    </Col>
                    <Col>
                      <div className="row justify-content-end">
                        <div className="mr-2">
                          {this.setStatusColor()}
                        </div>
                        <div className="mr-2 ">
                          <ButtonDropdown className="dropdown-width" isOpen={this.state.dropDownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                              {this.state.dropDownValue}
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem onClick={this.changeValue}>event still not answered</DropdownItem>
                              <DropdownItem onClick={this.changeValue}>Emergency services are on their way</DropdownItem>
                              <DropdownItem onClick={this.changeValue}>event resolved</DropdownItem>
                            </DropdownMenu>
                          </ButtonDropdown>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="h-75 ">
                    <Col>
                      <Row >
                        <div className="col">
                          <img src={require("../../assets/img/brand/event.png")} style={{height:"100%",width:"100%"}} />
                        </div>
                      </Row>
                      <Row>
                        <div className="col">
                          <p><strong>Address:</strong> {this.state.event_data.location.address}</p>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-sm">
                          <p><strong>Lat:</strong> {this.state.event_data.location.coords.lat}</p>
                        </div>
                        <div className="col-sm">
                          <p><strong>Lng:</strong> {this.state.event_data.location.coords.lng}</p>
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
                  <Maps
                        markers = {[{id: this.props.match.params['id'],
                                    lat: this.state.event_data.location.coords.lat,
                                    lng: this.state.event_data.location.coords.lng,
                                    status: this.state.event_data.status}]}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4aWR3SBGaa1oB0CuDf2vptnJfSMSguZU"
                        loadingElement={<div style={{ height: `100%` }} />}
                        center = {this.state.event_data.location.coords}
                        zoom = {17}

                        containerElement={
                          <div
                            className="map-canvas"
                            id="map-canvas"
                          />
                        }
                        mapElement={
                          <div style={{ height: `100%`, borderRadius: "inherit" }} />
                        }

                      />
                  <CardHeader>
                    <h3> MORE DETAILS... </h3>
                  </CardHeader>
					<Row>
                     <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody className="border rounded border-info">
                              <Row>
                                <div className="col">
                                  <CardTitle
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                  >
                                    Number of cars involved
                                  </CardTitle>
                                  <span className="h2 font-weight-bold mb-0">{this.state.event_data.n_cars_involved}</span>
                                </div>
                                  <Col className="col-auto">
                                    <Button className="icon icon-shape bg-success text-dark rounded-circle shadow" id="toggler">
                                      <i className="fas fa-car"/>
                                    </Button>
                                  </Col>
                              </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody className="border rounded border-info">

                              <Row>
                                <div className="col">
                                  <CardTitle
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                  >
                                    Number of persons involved
                                  </CardTitle>
                                  <span className="h2 font-weight-bold mb-0">
                                    {this.state.event_data.n_people_involved}
                                  </span>
                                </div>
                                <Col className="col-auto">
                                  <div className="icon icon-shape bg-info text-dark rounded-circle shadow">
                                    <i className="fas fa-users"/>
                                  </div>
                                </Col>
                              </Row>

                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody className="border rounded border-info">
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Number of persons injured
                                </CardTitle>

                                <span className="h2 font-weight-bold mb-0">
                                  <Button className=" icon-sm icon-shapesm bg-warning text-dark shadow" onClick={(e)=>this.handleClick(e,this.props.match.params['id'],-1)}>
                                      <i className="fas fa-minus"/>
                                </Button>
                                  {this.state.event_data.n_people_injured}
                                  <Button className=" icon-sm icon-shapesm bg-success text-dark shadow"onClick={(e)=>this.handleClick(e,this.props.match.params['id'],1)}>
                                      <i className="fas fa-plus"/>
                                </Button>
                                </span>

                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-danger text-dark rounded-circle shadow">
                                  <i className="fas fa-user-injured"/>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody className="border rounded border-info">
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Severity of the event
                                </CardTitle>
                                <span className={this.getBarColor(this.state.event_data.damage)}>
                                  {this.state.event_data.damage}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-yellow text-dark rounded-circle shadow">
                                  <i className="fas fa-exclamation-triangle"/>
                                </div>
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
                            {this.state.event_data["car"].map(this.renderCars)}
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
